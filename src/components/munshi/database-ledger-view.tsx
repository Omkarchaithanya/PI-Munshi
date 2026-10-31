import React, { useState, useEffect } from "react";
import {
  Database,
  Server,
  Layers,
  Clock,
  RefreshCw,
  CheckCircle2,
  Table as TableIcon,
  ShieldCheck,
  Building2,
  CreditCard,
  Volume2,
  Users,
  AlertTriangle,
  Brain,
  FileCode,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { munshiApi } from "@/lib/api-client";
import { inrFormat } from "@/lib/munshi/backend";

interface DatabaseLedgerViewProps {
  lang: string;
}

export function DatabaseLedgerView({ lang }: DatabaseLedgerViewProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTable, setActiveTable] = useState<string>("transactions");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "schema">("table");

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await munshiApi.getDatabaseOverview();
      setData(res);
    } catch (err) {
      console.error("Failed to load database overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const tablesMeta = [
    { id: "transactions", label: "transactions", count: data?.counts?.transactions || 0, icon: CreditCard, color: "text-blue-600 bg-blue-50" },
    { id: "settlements", label: "settlements", count: data?.counts?.settlements || 0, icon: Building2, color: "text-emerald-600 bg-emerald-50" },
    { id: "merchants", label: "merchants", count: data?.counts?.merchants || 0, icon: Database, color: "text-purple-600 bg-purple-50" },
    { id: "soundbox_devices", label: "soundbox_devices", count: data?.counts?.devices || 0, icon: Volume2, color: "text-amber-600 bg-amber-50" },
    { id: "fses", label: "fses", count: data?.counts?.fses || 0, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { id: "disputes", label: "disputes", count: data?.counts?.disputes || 0, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { id: "memories", label: "merchant_memory_events", count: data?.counts?.memoryEvents || 0, icon: Brain, color: "text-cyan-600 bg-cyan-50" },
    { id: "audits", label: "audit_events (WAL)", count: data?.counts?.auditEvents || 0, icon: FileCode, color: "text-gray-700 bg-gray-100" },
  ];

  const currentRows: any[] = data?.tables?.[activeTable] || [];
  const filteredRows = currentRows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-150">
      {/* 1. TOP HEADER & CONNECTION OVERVIEW */}
      <section className="rounded-3xl bg-white border border-[#e6e8ec] p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Render PostgreSQL (Connected)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              <Clock className="size-3 text-blue-600" />
              Tiger Cloud TimescaleDB (Timeline Active)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
              Schema: 0002_pi_munshi_core.sql
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#002970]">
            {lang === "kn-IN" ? "ಡೇಟಾಬೇಸ್ ಲೆಡ್ಜರ್ & ಟೈಮ್‌ಲೈನ್ ಕನ್ಸೋಲ್" : lang === "hi-IN" ? "डेटाबेस लेज़र एवं टाइमलाइन कंसोल" : "Live Database Ledger & Timeline Console"}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            {lang === "kn-IN"
              ? "ರೆಂಡರ್ ಒರೆಗಾನ್ ಪೋಸ್ಟ್‌ಗ್ರೆಸ್ ಮತ್ತು ಟೈಗರ್ ಕ್ಲೌಡ್ ಟೈಮ್‌ಸ್ಕೇಲ್‌ಡಿಬಿಯೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿರುವ ಲೈವ್ ವ್ಯಾಪಾರಿ ಲೆಡ್ಜರ್ ಕೋಷ್ಟಕಗಳು ಮತ್ತು ವಹಿವಾಟಿನ ಇತಿಹಾಸ."
              : lang === "hi-IN"
              ? "Render Oregon PostgreSQL और Tiger Cloud TimescaleDB से जुड़े लाइव मर्चेंट लेज़र टेबल्स और लेन-देन का टाइमलाइन प्रवाह।"
              : "Direct view into the live Render Oregon PostgreSQL database and Tiger Cloud TimescaleDB timeline powering Ramesh Kirana Store's ledger."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#002970] shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "timeline" ? "bg-white text-[#002970] shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Timeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode("schema")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "schema" ? "bg-white text-[#002970] shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Schema Info
            </button>
          </div>

          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
            title="Refresh Database Ledger"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin text-[#00BAF2]" : ""}`} />
          </button>
        </div>
      </section>

      {/* 2. CONNECTION SPECS TELEMETRY STRIP */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Primary Storage</span>
          <span className="text-sm font-black text-[#002970] block truncate">Render Oregon PostgreSQL</span>
          <span className="text-[11px] font-mono text-gray-500 block truncate">dpg-dbin98nb9u1s73c02uk0-a...</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Timescale DB Timeline</span>
          <span className="text-sm font-black text-[#002970] block truncate">Tiger Cloud (Oregon)</span>
          <span className="text-[11px] font-mono text-gray-500 block truncate">d3yo06ihv7afhe0983p7...:38298</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Active Ledger Key</span>
          <span className="text-sm font-black text-emerald-700 block truncate">DEMO_MERCHANT_RAMESH</span>
          <span className="text-[11px] text-gray-500 block">Ramesh Kirana Store (Koramangala)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Security & Isolation</span>
          <span className="text-sm font-black text-purple-700 block flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-purple-600" />
            TLS 1.3 + PGlite Failover
          </span>
          <span className="text-[11px] text-gray-500 block">Zero-Downtime High-Speed Driver</span>
        </div>
      </section>

      {/* 3. TABLE SELECTION TABS */}
      <section className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex flex-wrap gap-2">
            {tablesMeta.map((t) => {
              const isSelected = activeTable === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveTable(t.id);
                    setSearchTerm("");
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#002970] text-white shadow-xs"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60"
                  }`}
                >
                  <Icon className={`size-3.5 ${isSelected ? "text-[#00BAF2]" : t.color.split(" ")[0]}`} />
                  <span>{t.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[200px] sm:w-64">
            <Search className="size-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table rows..."
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[#00BAF2] focus:outline-hidden"
            />
          </div>
        </div>

        {/* 4. CONTENT ACCORDING TO VIEW MODE */}
        {viewMode === "table" && (
          <div className="overflow-x-auto max-h-[500px]">
            {filteredRows.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No matching records found in table `{activeTable}`.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-gray-200 text-[11px] text-[#002970] uppercase tracking-wider">
                    {Object.keys(filteredRows[0] || {}).map((col) => (
                      <th key={col} className="p-3 font-extrabold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      {Object.entries(row).map(([k, val]: any, colIdx) => {
                        const isAmount = k.includes("amount") || k.includes("fee") || k.includes("payout");
                        const isStatus = k.includes("status");
                        const isTime = k.includes("created_at") || k.includes("cycle_date");
                        const displayVal = typeof val === "object" ? JSON.stringify(val) : String(val);

                        return (
                          <td key={colIdx} className="p-3 whitespace-nowrap text-gray-800">
                            {isAmount && !isNaN(Number(val)) ? (
                              <span className="font-bold text-[#002970]">₹{inrFormat(Number(val))}</span>
                            ) : isStatus ? (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  val === "SUCCESS" || val === "SETTLED" || val === "ONLINE" || val === "VERIFIED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : val === "PENDING" || val === "UNDER_REVIEW"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {displayVal}
                              </span>
                            ) : isTime ? (
                              <span className="text-gray-500 text-[11px]">
                                {new Date(val).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            ) : (
                              <span className="truncate max-w-xs block" title={displayVal}>
                                {displayVal}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TIMELINE VIEW (CHRONOLOGICAL STREAM) */}
        {viewMode === "timeline" && (
          <div className="space-y-3 py-2 max-h-[500px] overflow-y-auto">
            <div className="text-xs text-gray-500 mb-2 font-medium">
              Chronological ledger event stream aggregated from PostgreSQL and Tiger Cloud TimescaleDB:
            </div>
            {(data?.tables?.transactions || []).slice(0, 15).map((txn: any, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50/50 border border-gray-200/80 transition-all font-mono text-xs"
              >
                <div className="size-8 rounded-xl bg-blue-100 text-[#002970] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#002970] text-sm">
                      +₹{inrFormat(Number(txn.amount))}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {new Date(txn.created_at).toLocaleTimeString("en-IN")} · {new Date(txn.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                    <span>Payer: <strong className="text-gray-800">{txn.payer_vpa}</strong></span>
                    <span>•</span>
                    <span>RRN: <strong className="text-gray-800">{txn.rrn}</strong></span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        txn.settlement_status === "SETTLED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {txn.settlement_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCHEMA INFO VIEW */}
        {viewMode === "schema" && (
          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#001738] text-blue-100 space-y-2">
              <span className="text-[#00BAF2] font-black uppercase text-xs block">
                Database Schema Contract (migrations/0002_pi_munshi_core.sql)
              </span>
              <p className="text-[11px] text-gray-300">
                The database connection is configured in <code className="text-emerald-400">.env</code> via <code className="text-emerald-400">DATABASE_URL</code> (Render Oregon PostgreSQL) and <code className="text-emerald-400">TIMESCALE_DATABASE_URL</code> (Tiger Cloud TimescaleDB).
              </p>
              <div className="p-3 bg-black/40 rounded-xl text-[11px] text-gray-300 space-y-1">
                <p>• <strong>merchants:</strong> Primary merchant profile with phone, KYC, UPI, daily GMV volume.</p>
                <p>• <strong>transactions:</strong> Atomic payment ledger with status, RRN, settlement linkage.</p>
                <p>• <strong>settlements:</strong> Daily payout batches with UTR reference, MDR deductions, net amount.</p>
                <p>• <strong>soundbox_devices:</strong> 4G IoT hardware telemetry, battery, IMEI, firmware version.</p>
                <p>• <strong>fses:</strong> Field Service Executive roster with assigned Koramangala beat.</p>
                <p>• <strong>disputes:</strong> NPCI UDIR dispute records with evidence status and reversal tracking.</p>
                <p>• <strong>merchant_memory_events:</strong> Coinbase CEEcil 8-line Gists & Handoff notes.</p>
                <p>• <strong>audit_events:</strong> Cryptographic Write-Ahead Log (WAL) audit events.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

