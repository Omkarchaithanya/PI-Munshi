---
policy_id: "RBI/2026-27/84/DPSS.CO.PD.No.145"
title: "Framework for Merchant Discount Rate (MDR) on UPI Person-to-Merchant (P2M) Transactions"
short_name: "RBI UPI MDR 2026 Regulation"
regulator: "Reserve Bank of India & NPCI"
effective_date: "2026-10-15"
last_updated_date: "2026-10-28"
category: "MDR_POLICY"
status: "ACTIVE"
git_commit_sha: "9a7f3c1b82d40e6e7193b2a0c"
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

## 1. Statutory Authority & Applicability
In exercise of powers conferred under Section 10(2) read with Section 18 of the Payment and Settlement Systems Act, 2007 (Act 51 of 2007), the Reserve Bank of India, in consultation with the National Payments Corporation of India (NPCI), prescribes the revised MDR structure for UPI Person-to-Merchant (P2M) transactions effective **October 15, 2026**.

## 2. Rate Schedule & Caps
1. **Transactions up to and including ₹2,000:**
   - MDR shall remain strictly **0.00% (Nil)** across all acquiring banks and payment aggregators. No hidden switching or network fees may be levied on the merchant.
2. **Transactions above ₹2,000:**
   - Ad-valorem MDR is capped at **0.40%** of the transaction value.
   - The absolute fee is capped at **₹300.00** per transaction regardless of transaction size.
   - Example: On a transaction of ₹2,400.00, MDR = ₹2,400 × 0.004 = ₹9.60.

## 3. Discretionary Retention Fee Waivers & Caps
- Acquiring partners (including Paytm Payments Bank / One97 Communications) are permitted to issue retention waivers not exceeding **₹15.00** per merchant per 24-hour cycle.
- Any waiver request exceeding ₹15.00 requires Level 2 multi-signature human approval.
- High-trust categories (Essential Medical / Pharmacy, Co-ops) are prioritized for automatic policy relief.

## 4. Merchant Protection & Real-time Disclosure
- The acquiring platform must clearly disclaim any fee deduction via Soundbox audio or verified SMS receipt within **10 seconds** of transaction settlement.
