---
policy_id: "PTM-OPS-2026-DISP-09"
title: "Paytm Auto-Dispute Resolution & Counter Proof SLA"
short_name: "Paytm Dispute & Reversal Policy"
regulator: "One97 Communications / NPCI Dispute Framework"
effective_date: "2026-08-01"
last_updated_date: "2026-10-25"
category: "DISPUTE_RESOLUTION"
status: "ACTIVE"
git_commit_sha: "e481b0a5f7823d91ca8e901f2"
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

## 1. Scope & Objective
This operating procedure governs the handling of countertop UPI customer disputes, stuck T+1 merchant settlements, and chargeback defenses across Paytm QR and Soundbox network.

## 2. Graduated Defense & Reversal Thresholds
1. **Low-Value Immediate Auto-Reversal (≤ ₹500):**
   - For duplicate UPI debits verified by NPCI `ReqChkTxn` or gateway timeout, autonomous Level 1 refund may execute without waiting for human intervention.
2. **High-Value Counter Disputes (> ₹500 to ₹50,000):**
   - Cannot be automatically refunded without Merchant / FSE confirmation ("Haan" vocal/touch multi-sig).
   - If the merchant has handed over goods, Pi Munshi must automatically invoke `POST /v1/dispute/action` with `action: "DEFEND"` and `orderStatus: "ORDER_DELIVERED"`.

## 3. Cryptographic Acoustic Proof-of-Delivery (APOD)
- For disputes above ₹1,000, physical delivery is proved by combining:
  1. **Swar-Mudra 18.5 kHz Acoustic Handshake:** Ultrasonic HMAC chirp exchanged between Soundbox speaker and customer smartphone within 1.5 meters of the counter.
  2. **Sarvam Vision 2.1 Kacha-Bill OCR:** Digitized handwritten merchant slip matching the order total and date.
- Submission of this bundle satisfies NPCI Section 4.3 chargeback defense criteria within **11 seconds**, eliminating manual 48-hour paperwork delays.
