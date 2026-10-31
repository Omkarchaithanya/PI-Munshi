// @ts-nocheck
import { readFileSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Unified Database Layer for Pi Munshi.
 * Supports Neon / standard PostgreSQL when DATABASE_URL is configured,
 * or embedded PGlite (WASM Postgres) with automatic schema migration.
 */
let dbClient = null;
let dbClientUrl = "";
let activePgPool: any = null;

export async function closeDb() {
  if (activePgPool) {
    try {
      await activePgPool.end();
    } catch {}
    activePgPool = null;
  }
  dbClient = null;
}

/** Prefer the .env file so a running dev server sees a URL pasted after startup. */
export function configuredDatabaseUrl() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
    const line = raw.split(/\r?\n/).find((row) => row.startsWith("DATABASE_URL="));
    if (line) {
      let value = line.slice("DATABASE_URL=".length).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (value) return value;
    }
  } catch {
    // Fall through to the process environment.
  }
  return (process.env.DATABASE_URL || "").trim();
}

export async function getDb() {
  const databaseUrl = configuredDatabaseUrl();
  if (dbClient && dbClientUrl === databaseUrl) return dbClient;
  dbClient = null;
  dbClientUrl = databaseUrl;

  if (databaseUrl && databaseUrl.trim()) {
    // Live PostgreSQL / Neon connection
    const pgMod = await import("pg");
    const PG = pgMod.default || pgMod;
    const tlsMod = await import("node:tls");
    if (!globalThis.__piMunshiPgSslPatched) {
      globalThis.__piMunshiPgSslPatched = true;
      // Node 24 writes the startup packet before TLS is ready and Render drops the socket.
      PG.Connection.prototype.upgradeToSSL = function (host, reportStreamError) {
        const self = this;
        self.stream = tlsMod.connect({
          socket: self.stream,
          host,
          servername: host,
          rejectUnauthorized: false,
        });
        if (typeof reportStreamError === "function") {
          self.stream.on("error", reportStreamError);
        }
        self.stream.once("secureConnect", () => {
          self.attachListeners(self.stream);
          self.emit("sslconnect");
        });
      };
    }
    const useSsl = /render\.com|sslmode=require/i.test(databaseUrl);
    let pool: any = null;
    let connected = false;

    try {
      pool = new PG.Pool({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      });
      activePgPool = pool;

      pool.on("error", (err: any) => {
        console.warn("[PG Pool Warning - Idle connection drop]:", err.message);
      });

      await pool.query("select 1");
      connected = true;

      let fallbackPglite: any = null;
      const getFallback = async () => {
        if (!fallbackPglite) {
          const { PGlite } = await import("@electric-sql/pglite");
          const pl = new PGlite();
          await pl.waitReady;
          const plClient = {
            query: async (t: string, p: any[] = []) => (await pl.query(t, p)).rows,
            exec: async (t: string) => { await pl.exec(t); },
            type: "pglite",
          };
          await applyMigrations(plClient);
          fallbackPglite = plClient;
        }
        return fallbackPglite;
      };

      dbClient = {
        query: async (text, params = []) => {
          try {
            const res = await pool.query(text, params);
            return res.rows;
          } catch (err: any) {
            console.warn("[PostgreSQL Query Failover to Local Storage]:", err?.message);
            const fb = await getFallback();
            return await fb.query(text, params);
          }
        },
        exec: async (text) => {
          try {
            await pool.query(text);
          } catch (err: any) {
            console.warn("[PostgreSQL Exec Failover to Local Storage]:", err?.message);
            const fb = await getFallback();
            await fb.exec(text);
          }
        },
        type: "postgres",
      };
    } catch (err: any) {
      console.warn("[PostgreSQL Remote Timeout/Error, activating high-speed PGlite fallback]:", err.message);
      pool = null;
      connected = false;
    }

    if (!connected) {
      const { PGlite } = await import("@electric-sql/pglite");
      const pglite = new PGlite();
      await pglite.waitReady;

      dbClient = {
        query: async (text, params = []) => {
          const res = await pglite.query(text, params);
          return res.rows;
        },
        exec: async (text) => {
          await pglite.exec(text);
        },
        type: "pglite",
      };
    }
  } else {
    // Embedded PGlite fallback
    const { PGlite } = await import("@electric-sql/pglite");
    // Store in-memory or persisted in .pglite directory
    const pglite = new PGlite();
    await pglite.waitReady;

    dbClient = {
      query: async (text, params = []) => {
        const res = await pglite.query(text, params);
        return res.rows;
      },
      exec: async (text) => {
        await pglite.exec(text);
      },
      type: "pglite",
    };
  }

  // Ensure migrations are applied
  await applyMigrations(dbClient);
  return dbClient;
}

async function applyMigrations(client) {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const migrationsDir = join(__dirname, "..", "..", "migrations");
  let files = [];
  try {
    const entries = await readdir(migrationsDir);
    files = entries.filter((f) => f.endsWith(".sql")).sort();
  } catch (err) {
    console.warn("[db] No migrations directory found or failed to read:", err.message);
    return;
  }

  const appliedRows = await client.query("SELECT name FROM _migrations");
  const applied = new Set(appliedRows.map((r) => r.name));

  for (const file of files) {
    if (!applied.has(file)) {
      const sql = await readFile(join(migrationsDir, file), "utf8");
      await client.exec(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      console.log(`[db] Applied migration: ${file}`);
    }
  }
}

/**
 * Repository Methods strictly separating 'LIVE' and 'DEMO' modes
 */
export const dbRepo = {
  // --- MERCHANTS ---
  async getMerchant(merchantId, mode = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      "SELECT * FROM merchants WHERE merchant_id = $1 AND mode = $2",
      [merchantId, mode]
    );
    return rows[0] || null;
  },

  async listMerchants(mode = "DEMO") {
    const db = await getDb();
    return db.query("SELECT * FROM merchants WHERE mode = $1 ORDER BY name ASC", [mode]);
  },

  // --- TRANSACTIONS ---
  async createTransaction(txn) {
    const db = await getDb();
    const {
      txn_id,
      mode = "DEMO",
      merchant_id,
      amount,
      currency = "INR",
      status = "SUCCESS",
      payer_vpa = null,
      rrn = null,
      settlement_status = "PENDING",
      settlement_id = null,
    } = txn;

    await db.query(
      `INSERT INTO transactions (txn_id, mode, merchant_id, amount, currency, status, payer_vpa, rrn, settlement_status, settlement_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (txn_id) DO UPDATE SET status = EXCLUDED.status, settlement_status = EXCLUDED.settlement_status, settlement_id = EXCLUDED.settlement_id`,
      [txn_id, mode, merchant_id, amount, currency, status, payer_vpa, rrn, settlement_status, settlement_id]
    );
    return txn;
  },

  async getTransaction(txnId, mode = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      "SELECT * FROM transactions WHERE txn_id = $1 AND mode = $2",
      [txnId, mode]
    );
    return rows[0] || null;
  },

  async listTransactions(merchantId, mode = "DEMO") {
    const db = await getDb();
    return db.query(
      "SELECT * FROM transactions WHERE merchant_id = $1 AND mode = $2 ORDER BY created_at DESC",
      [merchantId, mode]
    );
  },

  // --- SETTLEMENTS ---
  async createSettlement(settlement) {
    const db = await getDb();
    const {
      settlement_id,
      mode = "DEMO",
      merchant_id,
      total_amount,
      mdr_fee,
      net_payout,
      utr,
      status = "SUCCESS",
      cycle_date = new Date().toISOString().split("T")[0],
    } = settlement;

    await db.query(
      `INSERT INTO settlements (settlement_id, mode, merchant_id, total_amount, mdr_fee, net_payout, utr, status, cycle_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (settlement_id) DO NOTHING`,
      [settlement_id, mode, merchant_id, total_amount, mdr_fee, net_payout, utr, status, cycle_date]
    );
    return settlement;
  },

  async listSettlements(merchantId, mode = "DEMO") {
    const db = await getDb();
    return db.query(
      "SELECT * FROM settlements WHERE merchant_id = $1 AND mode = $2 ORDER BY created_at DESC",
      [merchantId, mode]
    );
  },

  // --- DISPUTES ---
  async createDispute(dispute) {
    const db = await getDb();
    const {
      dispute_id,
      mode = "DEMO",
      merchant_id,
      txn_id,
      amount,
      reason,
      status = "OPEN",
      evidence_submitted = false,
      resolution_notes = null,
    } = dispute;

    await db.query(
      `INSERT INTO disputes (dispute_id, mode, merchant_id, txn_id, amount, reason, status, evidence_submitted, resolution_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (dispute_id) DO UPDATE SET status = EXCLUDED.status, evidence_submitted = EXCLUDED.evidence_submitted, resolution_notes = EXCLUDED.resolution_notes`,
      [dispute_id, mode, merchant_id, txn_id, amount, reason, status, evidence_submitted, resolution_notes]
    );
    return dispute;
  },

  async listDisputes(merchantId, mode = "DEMO") {
    const db = await getDb();
    return db.query(
      "SELECT * FROM disputes WHERE merchant_id = $1 AND mode = $2 ORDER BY created_at DESC",
      [merchantId, mode]
    );
  },

  async updateDispute(disputeId, updates, mode = "DEMO") {
    const db = await getDb();
    const { status, evidence_submitted, resolution_notes } = updates;
    await db.query(
      `UPDATE disputes
       SET status = COALESCE($1, status),
           evidence_submitted = COALESCE($2, evidence_submitted),
           resolution_notes = COALESCE($3, resolution_notes)
       WHERE dispute_id = $4 AND mode = $5`,
      [status, evidence_submitted, resolution_notes, disputeId, mode]
    );
  },

  // --- SOUNDBOX ---
  async getDevice(deviceId, mode = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      "SELECT * FROM soundbox_devices WHERE device_id = $1 AND mode = $2",
      [deviceId, mode]
    );
    return rows[0] || null;
  },

  async listDevices(mode = "DEMO") {
    const db = await getDb();
    return db.query("SELECT * FROM soundbox_devices WHERE mode = $1", [mode]);
  },

  async listSoundboxDevices(merchantId: any, mode = "DEMO") {
    const db = await getDb();
    if (merchantId) {
      return db.query("SELECT * FROM soundbox_devices WHERE merchant_id = $1 AND mode = $2", [merchantId, mode]);
    }
    return db.query("SELECT * FROM soundbox_devices WHERE mode = $1", [mode]);
  },

  async recordHeartbeat(deviceId, batteryLevel, mode = "DEMO") {
    const db = await getDb();
    await db.query(
      `UPDATE soundbox_devices
       SET battery_level = $1, last_heartbeat = NOW()
       WHERE device_id = $2 AND mode = $3`,
      [batteryLevel, deviceId, mode]
    );
  },

  // --- APPROVALS ---
  async createApprovalRequest(req) {
    const db = await getDb();
    const {
      request_id,
      mode = "DEMO",
      action_type,
      merchant_id,
      amount = 0,
      params_hash,
      policy_version,
      status = "PENDING",
      expires_at,
    } = req;

    await db.query(
      `INSERT INTO approval_requests (request_id, mode, action_type, merchant_id, amount, params_hash, policy_version, status, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [request_id, mode, action_type, merchant_id, amount, params_hash, policy_version, status, expires_at]
    );
    return req;
  },

  async getApprovalRequest(requestId, mode = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      "SELECT * FROM approval_requests WHERE request_id = $1 AND mode = $2",
      [requestId, mode]
    );
    return rows[0] || null;
  },

  async updateApprovalStatus(requestId: any, status: any, approverId: any = null, mode: any = "DEMO") {
    const db = await getDb();
    await db.query(
      `UPDATE approval_requests
       SET status = $1, approver_id = $2
       WHERE request_id = $3 AND mode = $4`,
      [status, approverId, requestId, mode]
    );
  },

  // --- AUDIT EVENTS ---
  async recordAuditEvent(event) {
    const db = await getDb();
    const {
      audit_id = `AUD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      mode = "DEMO",
      actor,
      action,
      resource_id,
      policy_sha256 = null,
      details = {},
    } = event;

    await db.query(
      `INSERT INTO audit_events (audit_id, mode, actor, action, resource_id, policy_sha256, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [audit_id, mode, actor, action, resource_id, policy_sha256, JSON.stringify(details)]
    );
    return event;
  },

  // --- IDEMPOTENCY ---
  async checkIdempotency(key, mode = "DEMO") {
    const db = await getDb();
    const rows = await db.query(
      "SELECT response FROM idempotency_records WHERE key = $1 AND mode = $2",
      [key, mode]
    );
    return rows[0] ? rows[0].response : null;
  },

  async saveIdempotency(key, response, mode = "DEMO") {
    const db = await getDb();
    await db.query(
      `INSERT INTO idempotency_records (key, mode, response)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO NOTHING`,
      [key, mode, JSON.stringify(response)]
    );
  },
};
