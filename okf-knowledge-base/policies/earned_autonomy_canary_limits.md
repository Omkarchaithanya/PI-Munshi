---
policy_id: "PTM-GOV-2026-AUTO-03"
title: "Graduated Earned Autonomy & Netflix Data Canary Governance"
short_name: "Autonomy Ladder & Canary Policy"
regulator: "Paytm Model Governance & Compliance Committee"
effective_date: "2026-10-01"
last_updated_date: "2026-10-29"
category: "AUTONOMY_GOVERNANCE"
status: "ACTIVE"
git_commit_sha: "71c08ff94361ba89201de472c"
rules:
  level_0: "Prepare (8-line gist, shop dossier, offline cache)"
  level_1: "Reversible Auto-Act (Settlement check, hardware ticket, receipt SMS)"
  level_2: "Irreversible Gated (Refund >₹500, fee waivers, loan disbursals require 'Haan')"
  level_3: "Earned Autonomy (Requires 5 consecutive clean executions in same cohort)"
  promotion_clean_count_required: 5
  canary_z_score_threshold: 3.00
  canary_rollback_seconds: 150
  outlines_fsm_strict: true
---

# Graduated Earned Autonomy & Netflix Data Canary Governance

## 1. Core Principles
Autonomy is a ledger, not a switch. An AI teammate can never be granted broad autonomy without an auditable track record in each specific action class and merchant cohort.

## 2. Four Levels of Autonomy
- **Level 0 (Prepare):** Pi Munshi synthesizes 90 days of transaction history into an 8-line OKF Markdown gist. Zero external API mutation.
- **Level 1 (Reversible Autonomous):** Munshi acts immediately because any failure can be undone without financial damage (e.g. retrying a T+1 settlement or logging Soundbox ticket #1842).
- **Level 2 (Irreversible Gated):** Any action that creates credit liability, waives fees, or moves money requires explicit human co-signature (Vocal or Touch "Haan").
- **Level 3 (Earned Autonomy):** Unlocked on an action class after 5 consecutive clean human-approved executions.
  - Revocation: A single customer dispute anomaly, policy violation, or canary trigger immediately revokes the action class back to Level 2.

## 3. Netflix 3σ Behavioral Data Canary
- The system continuously calculates the rolling Z-score of waiver velocity and dispute reversals.
- If $Z = \frac{|x - \mu|}{\sigma} > 3.00$, the canary automatically triggers an emergency circuit-breaker within 150 seconds, revoking Level 3 autonomy across the territory.
