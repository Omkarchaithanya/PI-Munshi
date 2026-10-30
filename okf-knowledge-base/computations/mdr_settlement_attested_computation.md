---
okf: "0.2"
type: "attested_computation"
title: "UPI MDR Fee & Net Settlement Attested Computation"
short_name: "MDR Settlement Computation"
description: "Sanctioned deterministic mathematical specification for calculating UPI MDR fee deductions, discretionary waivers, and net merchant payouts"
category: "ATTESTED_COMPUTATION"

# OKF v0.2 Trust Signal 1: Provenance
sources:
  - uri: "okf://policies/rbi_mdr_waiver_cap_2026.md"
    title: "RBI UPI MDR 2026 Regulation"
  - uri: "git://commit/8094a55/src/lib/munshi/backend.ts"
    title: "Pi Munshi Deterministic Computation Body"

# OKF v0.2 Trust Signal 2: Trust Tiers
trust:
  generated:
    by: "pipeline"
    identity: "Paytm Settlement Core Architecture Engine"
  verified:
    by: "human"
    identity: "Paytm Principal Financial Systems Architect"
    tier: "tier-1-verified"

# OKF v0.2 Trust Signal 3: Freshness
freshness:
  effective_date: "2026-10-15"
  last_reviewed: "2026-10-30"
  stale_after: "2027-04-15"

# OKF v0.2 Trust Signal 4: Lifecycle Status
status: "stable"

# OKF v0.2 Trust Signal 5: Attestation & Execution Receipt
attestation:
  method: "deterministic-runtime-proof"
  runtime_digest_sha256: "b49e2101cd6f8741a3821090f7ca3901b8e4e9a1"
  reproducible_environment: "Node22 / V8 Isolated Micro-Sandbox"
  idempotent: true

computation:
  input_schema:
    amount: "number (INR)"
    threshold: "number (default 2000)"
    rate: "number (default 0.004)"
    max_cap: "number (default 300)"
    waiver_cap: "number (default 15)"
  mathematical_definition: |
    raw_mdr = (amount > threshold) ? min(max_cap, round(amount * rate, 2)) : 0.00
    waiver = (apply_waiver && raw_mdr > 0) ? min(waiver_cap, raw_mdr) : 0.00
    final_fee = raw_mdr - waiver
    net_settlement = amount - final_fee
---

# Attested Computation: UPI MDR & Net Settlement

## 1. Objective
Guarantees that no LLM or agent improvises fee deductions or payout values on the fly. All calculations must conform strictly to this attested mathematical formula.

## 2. Attested Test Vectors (Verified Baseline)
| Order Amount | Applicable Threshold | Raw MDR Fee | Applied Waiver | Final Fee Deducted | Net Payout to Bank |
|:---|:---|:---|:---|:---|:---|
| ₹500.00 | ₹2,000 | ₹0.00 | ₹0.00 | ₹0.00 | ₹500.00 |
| ₹1,850.00 | ₹2,000 | ₹0.00 | ₹0.00 | ₹0.00 | ₹1,850.00 |
| ₹2,400.00 | ₹2,000 | ₹9.60 | ₹9.60 | ₹0.00 | ₹2,400.00 |
| ₹4,280.00 | ₹2,000 | ₹17.12 | ₹15.00 | ₹2.12 | ₹4,277.88 |
| ₹25,000.00 | ₹2,000 | ₹100.00 | ₹15.00 | ₹85.00 | ₹24,915.00 |
| ₹100,000.00 | ₹2,000 | ₹300.00 (Cap) | ₹15.00 | ₹285.00 | ₹99,715.00 |
