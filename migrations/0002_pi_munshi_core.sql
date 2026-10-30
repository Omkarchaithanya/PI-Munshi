-- Migration 0002: Pi Munshi Core Schema & Isolated Demo Dataset
-- Enforces strict separation between 'LIVE' and 'DEMO' modes via check constraints.

CREATE TABLE IF NOT EXISTS merchants (
  merchant_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  name VARCHAR(128) NOT NULL,
  store_name VARCHAR(256) NOT NULL,
  upi_id VARCHAR(128) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'hi',
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'VERIFIED',
  soundbox_id VARCHAR(64),
  daily_volume NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fses (
  fse_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  territory VARCHAR(256) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchant_fse_assignments (
  assignment_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  fse_id VARCHAR(64) NOT NULL REFERENCES fses(fse_id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS transactions (
  txn_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency VARCHAR(5) NOT NULL DEFAULT 'INR',
  status VARCHAR(20) NOT NULL, -- SUCCESS, PENDING, FAILED
  payer_vpa VARCHAR(128),
  rrn VARCHAR(64),
  settlement_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, SETTLED
  settlement_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settlements (
  settlement_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  mdr_fee NUMERIC NOT NULL,
  net_payout NUMERIC NOT NULL,
  utr VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- INITIATED, SUCCESS, FAILED
  cycle_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
  dispute_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  txn_id VARCHAR(64) NOT NULL REFERENCES transactions(txn_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, WON, LOST, REFUNDED
  evidence_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS soundbox_devices (
  device_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) REFERENCES merchants(merchant_id) ON DELETE SET NULL,
  imei VARCHAR(32) NOT NULL,
  sim_number VARCHAR(32),
  battery_level INTEGER NOT NULL DEFAULT 100,
  firmware_version VARCHAR(32) NOT NULL DEFAULT 'v4.2.1-prod',
  status VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- ONLINE, OFFLINE, LOW_BATTERY
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS soundbox_events (
  event_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  device_id VARCHAR(64) NOT NULL REFERENCES soundbox_devices(device_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- HEARTBEAT, CHIME_PLAYED, BATTERY_DROP, NETWORK_SWITCH
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_requests (
  request_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  action_type VARCHAR(64) NOT NULL,
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  params_hash VARCHAR(64) NOT NULL,
  policy_version VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, EXPIRED
  approver_id VARCHAR(64),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchant_memory_events (
  memory_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  topic VARCHAR(128) NOT NULL,
  summary TEXT NOT NULL,
  sentiment VARCHAR(20) NOT NULL DEFAULT 'NEUTRAL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fse_handoff_records (
  handoff_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  from_fse_id VARCHAR(64) NOT NULL REFERENCES fses(fse_id) ON DELETE CASCADE,
  to_fse_id VARCHAR(64) NOT NULL REFERENCES fses(fse_id) ON DELETE CASCADE,
  context_summary TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idempotency_records (
  key VARCHAR(128) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  audit_id VARCHAR(64) PRIMARY KEY,
  mode VARCHAR(10) NOT NULL DEFAULT 'DEMO' CHECK (mode IN ('LIVE', 'DEMO')),
  actor VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64) NOT NULL,
  policy_sha256 VARCHAR(64),
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed isolated DEMO dataset
INSERT INTO merchants (merchant_id, mode, name, store_name, upi_id, phone, language, kyc_status, soundbox_id, daily_volume)
VALUES ('DEMO_MERCHANT_RAMESH', 'DEMO', 'Ramesh Kumar', 'Ramesh Kirana Store', 'ramesh.kirana@paytm', '9876543210', 'hi', 'VERIFIED', 'DEMO_SB_RAMESH', 4500.00)
ON CONFLICT (merchant_id) DO NOTHING;

INSERT INTO fses (fse_id, mode, name, phone, territory, active)
VALUES 
  ('DEMO_FSE_ARUN', 'DEMO', 'Arun Sharma', '9123456780', 'Koramangala, Bangalore', TRUE),
  ('DEMO_FSE_PRIYA', 'DEMO', 'Priya Nair', '9123456789', 'Indiranagar, Bangalore', TRUE)
ON CONFLICT (fse_id) DO NOTHING;

INSERT INTO merchant_fse_assignments (assignment_id, mode, merchant_id, fse_id, status)
VALUES ('DEMO_ASSIGN_1', 'DEMO', 'DEMO_MERCHANT_RAMESH', 'DEMO_FSE_ARUN', 'ACTIVE')
ON CONFLICT (assignment_id) DO NOTHING;

INSERT INTO soundbox_devices (device_id, mode, merchant_id, imei, sim_number, battery_level, firmware_version, status)
VALUES ('DEMO_SB_RAMESH', 'DEMO', 'DEMO_MERCHANT_RAMESH', '860123456789012', '8991001234567890', 88, 'v4.2.1-prod', 'ONLINE')
ON CONFLICT (device_id) DO NOTHING;

INSERT INTO transactions (txn_id, mode, merchant_id, amount, currency, status, payer_vpa, rrn, settlement_status, settlement_id)
VALUES 
  ('DEMO_TXN_001', 'DEMO', 'DEMO_MERCHANT_RAMESH', 450.00, 'INR', 'SUCCESS', 'customer1@paytm', 'DEMO_RRN_1001', 'SETTLED', 'DEMO_SETTLE_001'),
  ('DEMO_TXN_002', 'DEMO', 'DEMO_MERCHANT_RAMESH', 1200.00, 'INR', 'SUCCESS', 'customer2@okhdfcbank', 'DEMO_RRN_1002', 'SETTLED', 'DEMO_SETTLE_001'),
  ('DEMO_TXN_003', 'DEMO', 'DEMO_MERCHANT_RAMESH', 500.00, 'INR', 'SUCCESS', 'customer3@paytm', 'DEMO_RRN_1003', 'PENDING', NULL)
ON CONFLICT (txn_id) DO NOTHING;

INSERT INTO settlements (settlement_id, mode, merchant_id, total_amount, mdr_fee, net_payout, utr, status, cycle_date)
VALUES ('DEMO_SETTLE_001', 'DEMO', 'DEMO_MERCHANT_RAMESH', 1650.00, 16.50, 1633.50, 'DEMO_UTR_2026103001', 'SUCCESS', CURRENT_DATE)
ON CONFLICT (settlement_id) DO NOTHING;

INSERT INTO disputes (dispute_id, mode, merchant_id, txn_id, amount, reason, status, evidence_submitted, resolution_notes)
VALUES ('DEMO_DISP_001', 'DEMO', 'DEMO_MERCHANT_RAMESH', 'DEMO_TXN_002', 1200.00, 'Customer bank reported debit without credit', 'UNDER_REVIEW', FALSE, 'Awaiting customer bank reversal confirmation')
ON CONFLICT (dispute_id) DO NOTHING;
