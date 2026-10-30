---
okf: "0.2"
type: "policy"
title: "Framework for Merchant Discount Rate (MDR) on UPI Person-to-Merchant (P2M) Transactions"
short_name: "RBI UPI MDR 2026 Regulation"
description: "Authoritative regulatory cap and waiver schedule for UPI P2M merchant transactions above ₹2,000"
category: "MDR_POLICY"

# OKF v0.2 Trust Signal 1: Provenance
sources:
  - uri: "rbi://dpss/circular/2026/84/DPSS.CO.PD.No.145"
    title: "RBI Gazette Notification on UPI P2M Interchange & Merchant Caps"
    authority: "Reserve Bank of India & National Payments Corporation of India (NPCI)"
  - uri: "https://npci.org.in/circulars/2026/upi-p2m-mdr-framework"
    title: "NPCI UPI Operating Guidelines v2.4"

# OKF v0.2 Trust Signal 2: Trust Tiers
trust:
  generated:
    by: "human"
    identity: "RBI DPSS Policy Committee & NPCI Steering Council"
  verified:
    by: "human"
    identity: "Paytm General Counsel & Regulatory Affairs Cell"
    tier: "tier-1-verified"

# OKF v0.2 Trust Signal 3: Freshness
freshness:
  effective_date: "2026-10-15"
  last_reviewed: "2026-10-28"
  stale_after: "2027-04-15"

# OKF v0.2 Trust Signal 4: Lifecycle Status
status: "stable"

# OKF v0.2 Trust Signal 5: Attested Computation & Cryptographic Hash
attestation:
  method: "sha256-gazette-hash"
  upstream_sha256: "9a7f3c1b82d40e6e7193b2a0c8419fec502476b7e614bb5333f2187b5a8d7904"
  attested_computation_id: "COMP-MDR-040-VAL"
  reproducible_engine: "PiMunshi-DeterministicBody-v1"

# Domain-specific rule parameters
rules:
  mdr_rate_percent: 0.40
  min_threshold_inr: 2000
  max_fee_cap_inr: 300
  waiver_allowed: true
  waiver_max_cap_inr: 15
  waiver_daily_limit_per_merchant: 1
  subsidized_categories:
    - "pharmacy"
    - "medical"
    - "kirana_sub2000"
    - "milk_cooperative"
  grievance_tat_hours: 48
---

# RBI Framework for Merchant Discount Rate (MDR) on UPI P2M (October 2026)

## 1. Statutory Authority & Legal Provenance
In exercise of powers conferred under Section 10(2) read with Section 18 of the Payment and Settlement Systems Act, 2007 (Act 51 of 2007), the Reserve Bank of India, in consultation with NPCI, enacts the revised MDR fee architecture for all UPI Person-to-Merchant payments.

## 2. Attested Rate Schedule & Caps
1. **Transactions up to and including ₹2,000:**
   - MDR shall remain strictly **0.00% (Nil)** across all acquiring banks and payment aggregators. No hidden switching or network fees may be levied on the merchant.
2. **Transactions above ₹2,000:**
   - Ad-valorem MDR is capped at **0.40%** of the transaction value.
   - The absolute fee is capped at **₹300.00** per transaction regardless of transaction size.
   - Formula: $\text{MDR} = \min(300, \; \text{Amount} \times 0.004)$.

## 3. Discretionary Retention Fee Waivers & Caps
- Acquiring partners (including One97 Communications / Paytm) are permitted to issue retention waivers not exceeding **₹15.00** per merchant per 24-hour cycle.
- Any waiver request exceeding ₹15.00 requires Level 2 multi-signature human approval.
- High-trust categories (Essential Medical / Pharmacy, Co-ops) are prioritized for automatic policy relief.

## 4. Merchant Protection & Real-time Voice Disclosure
- The acquiring platform must clearly disclaim any fee deduction via Soundbox audio or verified SMS receipt within **10 seconds** of transaction settlement.
