---
okf: "0.2"
type: "policy"
title: "Graduated Earned Autonomy & Netflix Data Canary Governance"
short_name: "Autonomy Ladder & Canary Policy"
description: "Governance matrix defining autonomy progression from Level 0 to Level 3 and automated Netflix 3-sigma canary circuit breakers"
category: "AUTONOMY_GOVERNANCE"

# OKF v0.2 Trust Signal 1: Provenance
sources:
  - uri: "paytm://ai-governance/autonomous-agents/charter-2026"
    title: "Paytm Model Risk & Autonomous Agent Charter"
  - uri: "netflix://techblog/data-canary-catalog-validation"
    title: "Netflix 3-Sigma Behavioral Data Canary Pattern"

# OKF v0.2 Trust Signal 2: Trust Tiers
trust:
  generated:
    by: "human"
    identity: "Paytm Model Governance Committee"
  verified:
    by: "human"
    identity: "Chief Risk Officer, One97 Communications"
    tier: "tier-1-verified"

# OKF v0.2 Trust Signal 3: Freshness
freshness:
  effective_date: "2026-10-01"
  last_reviewed: "2026-10-29"
  stale_after: "2027-01-01"

# OKF v0.2 Trust Signal 4: Lifecycle Status
status: "stable"

# OKF v0.2 Trust Signal 5: Attestation
attestation:
  method: "git-commit-audit"
  upstream_sha256: "71c08ff94361ba89201de472c91823ab0928120c"
  attested_computation_id: "COMP-CANARY-Z-03"

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
- The system continuously calculates rolling Z-scores of waiver velocity and dispute reversals.
- If $Z = \frac{|x - \mu|}{\sigma} > 3.00$, the canary automatically triggers an emergency circuit-breaker within 150 seconds, revoking Level 3 autonomy across the territory.
