---
okf: "0.2"
type: "policy"
title: "Paytm Auto-Dispute Resolution & Counter Proof SLA"
short_name: "Paytm Dispute & Reversal Policy"
description: "Standard operating SLA for automated chargeback defense via Swar-Mudra ultrasonic APOD and instant refunds"
category: "DISPUTE_RESOLUTION"

# OKF v0.2 Trust Signal 1: Provenance
sources:
  - uri: "paytm://legal/policy/disp-09"
    title: "One97 Communications Merchant Dispute Manual 2026"
  - uri: "npci://disputes/upi-procedural-guidelines-sec4"
    title: "NPCI Section 4.3 Chargeback Defense Rules"

# OKF v0.2 Trust Signal 2: Trust Tiers
trust:
  generated:
    by: "human"
    identity: "Paytm Head of Disputes & Chargebacks"
  verified:
    by: "human"
    identity: "Paytm Merchant Risk Committee"
    tier: "tier-1-verified"

# OKF v0.2 Trust Signal 3: Freshness
freshness:
  effective_date: "2026-08-01"
  last_reviewed: "2026-10-25"
  stale_after: "2027-02-01"

# OKF v0.2 Trust Signal 4: Lifecycle Status
status: "stable"

# OKF v0.2 Trust Signal 5: Attestation
attestation:
  method: "git-commit-audit"
  upstream_sha256: "e481b0a5f7823d91ca8e901f28b49201947a1ec098231"
  attested_computation_id: "COMP-DISP-DEF-01"

rules:
  reversal_tat_hours: 48
  auto_refund_max_inr: 500
  gated_refund_min_inr: 501
  acoustic_pod_required_above_inr: 1000
  dispute_action_endpoint: "POST /v1/dispute/action"
  allowed_actions:
    - "DEFEND"
    - "ACCEPT"
    - "HOLD"
  instant_hundi_eligible_trust_min: 0.85
  soundbox_announcement_required: true
---

# Paytm Auto-Dispute Resolution & Counter Proof SLA

## 1. Scope & Provenance
This operating procedure governs countertop UPI customer disputes, stuck T+1 merchant settlements, and automated chargeback defenses across Paytm QR and Soundbox network.

## 2. Graduated Defense & Reversal Thresholds
1. **Low-Value Immediate Auto-Reversal (≤ ₹500):**
   - For duplicate UPI debits verified by NPCI `ReqChkTxn` or gateway timeout, autonomous Level 1 refund executes without waiting for human intervention.
2. **High-Value Counter Disputes (> ₹500 to ₹50,000):**
   - Cannot be automatically refunded without Merchant / FSE confirmation ("Haan" vocal/touch multi-sig).
   - If the merchant has handed over goods, Pi Munshi must automatically invoke `POST /v1/dispute/action` with `action: "DEFEND"` and `orderStatus: "ORDER_DELIVERED"`.

## 3. Cryptographic Acoustic Proof-of-Delivery (APOD)
- For disputes above ₹1,000, physical delivery is proved by combining:
  1. **Swar-Mudra 18.5 kHz Acoustic Handshake:** Ultrasonic HMAC chirp exchanged between Soundbox speaker and customer smartphone within 1.5 meters of the counter.
  2. **Sarvam Vision 2.1 Kacha-Bill OCR:** Digitized handwritten merchant slip matching the order total and date.
- Submitting this bundle defends disputes within **11 seconds**, eliminating manual 48-hour paperwork delays.
