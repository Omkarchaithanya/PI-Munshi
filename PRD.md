# 📄 Pi Munshi (पाई-मुंशी): Product Requirements Document (PRD)

**Project Code:** `PI-MUNSHI-PRD-2026-V1`  
**Product Name:** Pi Munshi (पाई-मुंशी) — Bilingual Autonomous Merchant Operations & Growth Teammate  
**Hackathon Target:** [Paytm Build for India AI Hackathon – Bengaluru](https://luma.com/6afp5q46)  
**Track:** Track 3 — Autonomous AI Teammates (Agentic Systems That Own Outcomes End-to-End)  
**Host Organization:** Paytm (One97 Communications Ltd.) & Devsemble  
**Knowledge Standard:** [Google Cloud Open Knowledge Format (OKF) v0.2](https://openknowledgeformat.com/)  
**Target Beneficiaries:** 40 Million+ Indian Kirana Merchants, Paytm Field Sales Executives (FSEs), Merchant Helpdesk  

---

## 1. Executive Problem Statement & Market Opportunity

India leads the world in real-time digital payments with over **13 Billion monthly UPI transactions**. However, at the retail frontline—India’s 40M+ mom-and-pop Kirana stores, pharmacies, and street vendors—a major trust and operational barrier persists:

1. **The Non-Reader / Language Barrier:**  
   Most frontline merchants speak localized Indic languages (Hindi, Kannada, Tamil, etc.) and cannot read complex, text-heavy financial statements or English banking apps. When deductions occur, they feel anxious and powerless.
2. **The "Kyu Kata?" (Why Was Fee Deducted?) Friction:**  
   When a ₹3,500 payment arrives, and the merchant receives ₹3,486 due to the RBI 0.4% tiered MDR rule, merchants often assume Paytm has hidden charges and turn off their QR codes or switch to cash.
3. **The Unresolved Dispute Trap:**  
   When a customer's bank debits money but the merchant's soundbox does not chime, tension erupts at the counter. The merchant loses either the customer or the goods, while manual support tickets take 48 to 72 hours.
4. **FSE Productivity Drain:**  
   Paytm Field Sales Executives (FSEs) spend up to **55 minutes every day** answering basic dispute inquiries, manual beat routing, and filling CRM reports instead of onboarding new high-value merchants.

---

## 2. Product Vision & Value Proposition

**Pi Munshi (पाई-मुंशी)** is an autonomous, voice-first, bilingual AI teammate that:
- **Speaks the Merchant's Tongue:** Communicates fluently through the **Paytm Soundbox 4.0** and companion app in Hindi (`hi-IN`), Kannada (`kn-IN`), and English (`en-IN`).
- **Demystifies Deductions Instantly:** Explains MDR deductions in plain colloquial terms (*"₹3,500 पर ₹14 सरकारी नियम अनुसार कटा, ₹3,486 सीधे बैंक खाते में जमा हुआ"*).
- **Resolves Counter Disputes in Seconds:** Leverages Google Cloud OKF v0.2 verified policy rules and automated provisional credits (T+1 SLA) within RBI & NPCI UDIR guidelines.
- **Protects Against Fake Fraud SMS:** Uses 18.5 kHz ultrasonic Swar-Mudra APOD acoustic verification between Soundbox and phone.
- **Grows Merchant Credit (Vriddhi):** Uses Amazon Flo Pro / VCG game theory to offer dominant-strategy credit contracts without asking merchants to disclose private cash-book margins.

---

## 3. User Personas & Target Audiences

| Persona Profile | Archetype Description | Primary Pain Points | Pi Munshi Value Proposition |
| :--- | :--- | :--- | :--- |
| **Ramesh Kumar** *(48 yrs)* | Kirana Shop Owner, Bangalore (Speaks Kannada & Hindi, minimal English literacy) | Terrified of hidden charges; cannot read digital bank statements; disputes stall shop counter. | **1-Tap Soundbox Voice Readout:** Big green rupee card, ultrasonic sound confirmation, audio in mother tongue. |
| **Arun Kumar** *(26 yrs)* | Paytm Field Sales Executive (FSE) managing 65 merchant beats in Bellandur | Overwhelmed by repetitive merchant dispute calls; manual CRM logging burns 1+ hour/day. | **Automated Beat Brief:** 9:00 AM async summary, pre-computed dispute approvals, auto-RCA filing. |
| **Neha Sharma** *(31 yrs)* | Paytm Merchant Operations & Compliance Judge | Balancing dispute speed with fraud risk; audit trail compliance with RBI FREE-AI directives. | **Judge View Engine:** Live Google Cloud OKF v0.2 store, 5 trust signals, Outlines FSM shield audit, Netflix 3σ canary. |

---

## 4. Functional Requirements & Core Feature Specifications

### 4.1 Feature 1: The Bilingual Dukaan View (Shopkeeper Frontline)
- **FR-1.1:** Ultra-legible visual design featuring large Rupee typography (`₹4,280.00`) and the official **Paytm Soundbox 4.0 IoT hardware card**.
- **FR-1.2:** Single-click **"बोलकर सुनें (Listen on Soundbox)"** audio playback in Hindi (`hi-IN`), Kannada (`kn-IN`), and English (`en-IN`) using Indic Bulbul TTS.
- **FR-1.3:** Instant 4-Card Colloquial Breakdown:
  1. *Customer Paid (ग्राहक से मिला)*
  2. *MDR Fee (पेटीएम शुल्क)*
  3. *Waiver / Cashback (छूट)*
  4. *Net Bank Credit (शुद्ध बैंक जमा)*
- **FR-1.4:** Real Value Customizer allowing the shopkeeper or judge to enter any transaction amount (₹500 to ₹150,000) and watch real, non-fake calculations recalculate in real time.

### 4.2 Feature 2: Google Cloud OKF v0.2 Knowledge Base & Policy Engine
- **FR-2.1:** Every settlement rule, dispute SLA, and autonomy threshold must be backed by an **Open Knowledge Format (OKF) v0.2 document** under `okf-knowledge-base/`.
- **FR-2.2:** Each policy must expose the **Five Opt-In Trust Signals**:
  1. *Provenance:* Traceable central bank / enterprise authority (e.g. `RBI/2026/CO/DPSS/114`).
  2. *Trust Tier:* Regulatory floor (`AUTHORITATIVE_REGULATORY`, `ENTERPRISE_CORE_SLA`, `OPERATIONAL_CANARY`).
  3. *Freshness:* Explicit validity window (`valid_from` to `valid_until`) with max staleness constraints.
  4. *Lifecycle:* `ACTIVE`, `DRAFT`, or `DEPRECATED`.
  5. *Attestation:* Cryptographic HMAC-SHA256 content signature.
- **FR-2.3:** Corrective RAG (CRAG) evaluating confidence score (`0.0` to `1.0`), flagging ambiguous queries for human FSE escalation.

### 4.3 Feature 3: Amazon Flo Pro / VCG Menu-of-Contracts (Vriddhi Credit)
- **FR-3.1:** Kirana merchants must never be forced to upload private accounting books or disclose margin percentages.
- **FR-3.2:** System must synthesize a 3-choice **Vickrey-Clarke-Groves (VCG)** contract menu where truthful selection is mathematically dominant:
  - *Contract A:* Split QR + UPI AutoPay Mandate (7–14 days).
  - *Contract B:* Supplier Inventory Voucher + 6% Margin Bonus.
  - *Contract C:* Instant Settlement Reversal / Refund.

### 4.4 Feature 4: Outlines Lexical FSM Shield & Threat Defense
- **FR-4.1:** Pushdown grammar automaton intercepting prompt-injection attacks (`SYSTEM OVERRIDE`, `TRANSFER ALL FUNDS`).
- **FR-4.2:** 10-Second Root Cause Analysis (RCA) escalation card presenting human-in-the-loop approval before any flagged payout occurs.

### 4.5 Feature 5: Ultrasonic Swar-Mudra APOD Audio Telemetry
- **FR-5.1:** Synthesizes an 18.5 kHz inaudible/high-frequency acoustic token using WebAudio API for device-to-device proximity proof.
- **FR-5.2:** Real-time interactive spectrogram visualizer displaying live audio FFT frequencies.

---

## 5. Non-Functional Requirements & Performance SLOs

| Attribute | Target Service Level Objective (SLO) | Verification Metric |
| :--- | :--- | :--- |
| **Rung 1 Reflex Latency** | `< 250 ms` P99 | 0 LLM tokens; in-memory UTR lookup + edge audio |
| **Rung 2 Policy RAG Latency** | `< 800 ms` P95 | OKF v0.2 policy evaluation + CRAG trust score |
| **Rung 3 Deep Loop Latency** | `< 2.4 s` P90 | Full O-P-E-V cycle + V8 Code Mode MCP sandbox |
| **Token Budget Optimization** | `~980 Tokens` fixed MCP footprint | Cloudflare Code Mode vs. 150k raw schema tokens |
| **Blended Cost per Query** | `< ₹0.035 ($0.0004)` per resolution | Blended across Rung 1 (65%), Rung 2 (20%), Rung 3 (15%) |
| **Canary Circuit Breaker** | Trip when Z-Score `> 3.0σ` | Aborts automated payouts within 150 seconds |
| **Regulatory Compliance** | 100% RBI FREE-AI & NPCI UDIR | Zero un-audited ledger writes |

---

## 6. Success Metrics & Key Results (OKRs)

- **KR-1:** Reduce merchant QR switch-off rate caused by unexplained MDR deductions by **> 70%**.
- **KR-2:** Reduce FSE routine dispute handling time from 55 min/day to **< 5 min/day**.
- **KR-3:** Achieve **0% fake / hallucinated financial math** by enforcing deterministic backend execution.
- **KR-4:** Eliminate credential exfiltration vulnerabilities by maintaining strict **Brain/Hands/Keys isolation**.
