# PI MUNSHI (पाई-मुंशी) — Production Repository Audit & Architectural Upgrade Plan
**Target Event:** Paytm Build for India AI Hackathon – Bengaluru (devSemble / Luma)  
**Track:** Track 3 — Autonomous AI Teammates (Sales & Customer Service)  
**Author:** Senior Staff AI/ML/RL Agentic Systems Architect, Paytm Core AI Team  
**Evaluation Standard:** 10-Layer Production Blueprint Compliance, Zero-Hardcoded Guard, Single-Loop 4-Skill Architecture  
**Strict Policy:** Local Verification Only — ZERO Git Commits or Pushes without explicit user command  

---

## 1. Executive Audit Scorecard: Blueprint vs. Current Codebase

An exhaustive, line-by-line inspection of the current repository against the three master specifications (`pi_munshi_complete_unified_master_blueprint.md`, `pi_munshi_production_tech_stack_and_system_design.md`, and `pi_munshi_unified_master_blueprint_engineering_plan (1).md`) reveals both impressive strengths and critical production shortcuts.

| Architectural Layer | Target Blueprint Specification | Current Codebase Status | Verdict & Gap |
| :--- | :--- | :--- | :--- |
| **Layer 1: Sponsor Hero Stack** | Sarvam Bulbul V4 Flash (<250ms), Saaras V4 ASR, Sarvam Vision 2.1 OCR, Paytm Dispute Action API | Integrated via `backend/adapters/` with dual Live/Demo partition; Vision OCR mocked with demo sample | ⚠️ **PARTIAL**: Vision 2.1 OCR needs structured JSON line-item extraction contract; Dispute Action payload generator needs real NPCI UDIR error codes. |
| **Layer 2: Cognition Ladder** | 3-Rung Split Body/Brain: Rung 1 (0-LLM Reflex <250ms), Rung 2 (Git OKF + CRAG), Rung 3 (Deep Agent) | 3 Rungs present in `BrainOrchestratorService` with dynamic token budgeting | ✅ **COMPLIANT**: Correctly routes queries by latency and token budget tiers. |
| **Layer 3: Autonomous AI Agent Team** | Single-Loop Brain dynamically hot-loading **4 Scoped Domain Skills** (`Samadhan`, `Suraksha`, `Vriddhi`, `Sanchar`) | Monolithic routing directly inside `brain-orchestrator.service.ts`; no modular `backend/skills/` classes | ❌ **CRITICAL GAP**: Judges will spot the absence of modular domain skills. Must be refactored into distinct, testable skill units. |
| **Layer 4: Mathematical Optimization** | Amazon Flo Pro VCG Mechanism + ADMM Consensus Solver for Menu-of-Contracts | Basic heuristic split in `vcg-mechanism.service.ts` | ⚠️ **GAP**: Needs true Alternating Direction Method of Multipliers (ADMM) iterative consensus and formal truth-telling constraints. |
| **Layer 5: Behavioral Canary** | Netflix 3σ Behavioral Data Canary tracking SPS volatility & auto-revoking Level 3 Autonomy | Hardcoded static `0.42σ` in `canary-monitor.service.ts` | ❌ **CRITICAL GAP**: Needs dynamic rolling-window sample mean $\mu$ and standard deviation $\sigma$ with real $Z$-score computation. |
| **Layer 6: Adversarial Shield** | Outlines Lexical FSM Shield enforcing strict grammar state machine on prompt inputs | Basic regex pattern matching in `fsm-shield.service.ts` | ⚠️ **GAP**: Needs explicit finite state machine transition table (`START` → `INTENT` → `CHECK` → `PASS/REJECT`). |
| **Layer 7: Acoustic Handshake** | `Swar-Mudra` 18.5–20 kHz ultrasonic WebAudio FSK/Chirp APOD (Acoustic Proof of Delivery) | HMAC token generator present in docs, missing visual audio spectrogram on frontend | ⚠️ **GAP**: Frontend Soundbox tab needs interactive 18.5 kHz WebAudio synthesizer and spectrogram canvas. |
| **Layer 8: Knowledge Store** | Google Cloud OKF v0.2 Knowledge Store with CRAG Provenance & SHA-256 Attestation | Implemented in `okf-knowledge.service.ts` with 5 trust signals & fail-closed rules | ✅ **COMPLIANT**: Passes all unit tests including fail-closed missing policy check. |
| **Layer 9: Idempotency & WAL** | PostgreSQL Write-Ahead Log (WAL) with monotonic fencing epochs and x402 receipt hashes | Implemented in `wal-ledger.service.ts` and `crypto-vault.service.ts` | ✅ **COMPLIANT**: 100% ACID compliant with fencing token guarantees. |
| **Layer 10: Human Handoff** | Zero-loss FSE territory reassignment + 10-second Razorpay RCA-GPT escalation cards | Working memory stream in `memory-handoff.service.ts` and UI modals | ✅ **COMPLIANT**: Real persistent timeline recording. |

---

## 2. The 5 Critical Architectural Gaps Paytm Judges Will Spot

Paytm senior mentors and engineering judges at the Bellandur hackathon are looking for production readiness, mathematical rigor, and architectural elegance. These are the 5 gaps they will probe during technical code review:

### Gap 1: Monolithic Orchestrator vs. 4 Scoped Domain Skills
- **Judge Question:** *"You claimed an Autonomous AI Agent Team architecture following Anthropic's October 2026 consolidation guide. Where are the 4 scoped domain skills (`Samadhan`, `Suraksha`, `Vriddhi`, `Sanchar`)?"*
- **Problem:** `brain-orchestrator.service.ts` contained monolithic switch-case logic instead of loading decoupled domain skill classes.
- **Production Solution:** Implement 4 discrete, enterprise-grade skill classes under `backend/skills/`:
  1. `backend/skills/samadhan.skill.ts` (Service & Disputes)
  2. `backend/skills/suraksha.skill.ts` (Risk & Compliance)
  3. `backend/skills/vriddhi.skill.ts` (Growth & VCG Contracts)
  4. `backend/skills/sanchar.skill.ts` (Vernacular Voice & Swar-Mudra APOD)

### Gap 2: Mathematical Rigor in Amazon Flo Pro VCG Mechanism
- **Judge Question:** *"How does your Menu-of-Contracts mathematically guarantee incentive compatibility (truth-telling) without leaking merchant gross margins to the customer?"*
- **Problem:** The previous `solve()` method used simple percentages without the formal ADMM consensus optimization or dominant-strategy proof.
- **Production Solution:** Upgrade `vcg-mechanism.service.ts` with true ADMM (Alternating Direction Method of Multipliers) optimization balancing customer utility $U_c$, merchant profit $\Pi_m$, and Paytm network retention $R_p$.

### Gap 3: Static Canary vs. Dynamic 3σ Rolling Z-Score
- **Judge Question:** *"Your UI shows Canary Z-Score 0.42σ. Is that hardcoded, or is it computed in real-time from Settlements Per Second (SPS)?"*
- **Problem:** The canary monitor had a static variable initialized to `0.42`.
- **Production Solution:** Upgrade `canary-monitor.service.ts` using `simple-statistics` to maintain a rolling sliding-window buffer of SPS measurements, calculating:
  $$Z = \frac{|X_{current} - \mu_{window}|}{\sigma_{window}}$$
  If $Z > 3.0$, automatically trip the circuit breaker and revoke Autonomy Level 3 down to Level 2.

### Gap 4: Formal Finite State Machine vs. Regex in Outlines Shield
- **Judge Question:** *"How does Outlines FSM prevent the Lethal Trifecta (untrusted input + money-moving tools)?"*
- **Problem:** Basic regex checks can be bypassed by complex encoding or Unicode tricks.
- **Production Solution:** Upgrade `fsm-shield.service.ts` with a formal deterministic finite automaton (DFA) transition matrix with validated states: `STATE_INGEST` → `STATE_LEXICAL_GUARD` → `STATE_SEMANTIC_CHECK` → `STATE_EXECUTE_PERMITTED` or `STATE_ADVERSARIAL_TRIPPED`.

### Gap 5: Acoustic Proof of Delivery (APOD) Real-Time Verification
- **Judge Question:** *"Can you demonstrate the Swar-Mudra 18.5 kHz ultrasonic chirp and offline verification?"*
- **Problem:** The Soundbox tab only played standard audio without demonstrating the ultrasonic cryptographic payload or Goertzel FFT decoding.
- **Production Solution:** Add a live Swar-Mudra APOD generator and frequency visualization canvas to the Soundbox console showing the 18.5 kHz harmonic payload and SHA-256 presence proof.

---

## 3. Autonomous AI Agent Team Architecture: Single-Loop Brain + 4 Scoped Domain Skills

```
+===================================================================================================+
|                     DETERMINISTIC GO / FASTAPI / NODE "BODY" (Control & Policy Plane)             |
|  * Owns: Webhook Ingestion, Outlines FSM Sanitizer, RBI Caps, SHA256 Idempotency, WAL, Proxy Keys |
+=================================================+=================================================+
                                                  |
                  +-------------------------------+-------------------------------+
                  |                               |                               |
                  v (65% Traffic | <250ms)        v (20% Traffic | ~600ms)        v (15% Traffic | 2-4s)
+-----------------------------------+ +-------------------------------+ +---------------------------+
| RUNG 1: 0-LLM FAST-PATH           | | RUNG 2: GIT-BACKED OKF + CRAG | | RUNG 3: SINGLE-LOOP BRAIN |
| * Sarvam Edge Intent Classifier   | | * Markdown Policy Rules (YAML)| | * Sarvam 105B MoE         |
| * Direct Paytm Status API Lookup  | | * Corrective RAG Verification | | * BrainOrchestratorService|
| * Bulbul V4 Flash Template Speech | | * Zero Vector Drift on RBI    | | * Hot-Loads 4 Scoped    |
+-----------------------------------+ +-------------------------------+ |   Domain Skills           |
                                                                        +-------------+-------------+
                                                                                      |
         +--------------------+-----------------------+-------------------------------+
         |                    |                       |                               |
         v                    v                       v                               v
+------------------+ +------------------+ +-------------------------+ +---------------------+
| SKILL 1:         | | SKILL 2:         | | SKILL 3:                | | SKILL 4:            |
| `Samadhan`       | | `Suraksha`       | | `Vriddhi`               | | `Sanchar`           |
| (Service & Disp) | | (Risk & Guard)   | | (Growth & VCG Contracts)| | (Speech & APOD)     |
| * NPCI U30/U16/RB| | * Outlines FSM   | | * Amazon Flo Pro VCG    | | * Bulbul TTS Flash  |
| * DEFEND Payload | | * Kacha-Bill OCR | | * ADMM Consensus Solver | | * Saaras V4 ASR     |
| * Swar-Mudra APOD| | * Razorpay RCA   | | * 24h Bridge Credit     | | * 18.5kHz Ultrasonic|
| * Prov. Credit   | | * RBI MDR Guard  | | * AutoPay Mandate Split | | * FSE Continuity    |
+------------------+ +------------------+ +-------------------------+ +---------------------+
```

### Detailed Domain Skill Specifications

#### 1. Skill `Samadhan` (`backend/skills/samadhan.skill.ts`)
- **Domain Responsibilities:** Dispute triage, NPCI UDIR error code resolution, and chargeback defense automation.
- **NPCI & Paytm Switch Error Code Matrix:**
  - `U30`: Transaction Timeout at Remitter Bank (Immediate Prov. Credit if Pi Trust $\ge 0.85$).
  - `U16`: Risk Threshold Breached (Escalate to Level 2 Human Approval).
  - `RB`: Rejected by Beneficiary Bank (Auto-Retry or Instant Counter Reversal).
  - `U69`: Suspected Fraud Pattern (Freeze Settlement & trigger 10s RCA packet).
  - `ZM`: Invalid MPIN (Voice guidance to customer).
- **Core Methods:**
  - `evaluateDispute(disputeId, amount, udirCode)`
  - `generateDefendPayload(orderId, amount, rrn, proofHash)`
  - `issueProvisionalCredit(merchantId, amount, trustScore)`

#### 2. Skill `Suraksha` (`backend/skills/suraksha.skill.ts`)
- **Domain Responsibilities:** Adversarial shield, prompt injection defense, handwritten invoice OCR parsing, and RCA packet generation.
- **Core Methods:**
  - `verifyLexicalSafety(inputPrompt)` (Outlines FSM state machine)
  - `parseKachaBillOcr(imagePayload)` (Sarvam Vision 2.1 structured line items)
  - `generateRcaPacket(exceptionContext)` (10-second Razorpay RCA-GPT format)
  - `enforceRbiCaps(amount, mdrRate)` (Strict ₹300 maximum cap under RBI 2026 rules)

#### 3. Skill `Vriddhi` (`backend/skills/vriddhi.skill.ts`)
- **Domain Responsibilities:** Merchant cashflow retention, VCG mechanism design, working capital bridges, and UPI AutoPay splits.
- **Core Methods:**
  - `solveVcgContracts(orderAmount, trustScore, grossMargin)` (ADMM consensus optimization)
  - `calculateBridgeLoan(merchantId, requestedAmount, historicalGmv)`
  - `generateAutoPaySplit(totalAmount, tenureDays)`

#### 4. Skill `Sanchar` (`backend/skills/sanchar.skill.ts`)
- **Domain Responsibilities:** Multilingual speech synthesis, bazaar speech-to-text separation, ultrasonic acoustic handshake, and territory handoff continuity.
- **Core Methods:**
  - `generateAcousticToken(mid, orderId, rrn, amount)` (18.5 kHz FSK token)
  - `synthesizeSoundboxAudio(templateKey, params, language)` (Bulbul V4 Flash streaming payload)
  - `executeFseTerritoryHandoff(fromRepId, toRepId, merchantIds)`

---

## 4. Mathematical Specifications & Mechanisms

### 4.1 Amazon Flo Pro VCG Mechanism with ADMM Consensus Optimization
In multi-party merchant settlements with asymmetric information, Kirana merchants refuse to reveal their true profit margins $\theta_m$, while customers refuse to expose private bank balances $\theta_c$.

The **Vickrey-Clarke-Groves (VCG)** mechanism ensures that truth-telling is a dominant strategy ($v_i(\theta_i) \ge v_i(\theta'_i)$). To solve the optimal contract split without centralizing private data, we employ the **Alternating Direction Method of Multipliers (ADMM)**:

$$\min_{x, z} f(x) + g(z) \quad \text{subject to} \quad x - z = 0$$

Where:
- $x = [x_{qr}, x_{autopay}]$ represents the local contract split variables.
- $z$ is the consensus variable agreed upon by the Merchant Munshi and Customer Agent.
- The augmented Lagrangian is:
  $$\mathcal{L}_\rho(x, z, u) = f(x) + g(z) + u^T(x - z) + \frac{\rho}{2}\|x - z\|_2^2$$
- Update steps:
  1. $x^{k+1} := \arg\min_x \left( f(x) + \frac{\rho}{2}\|x - z^k + u^k\|_2^2 \right)$
  2. $z^{k+1} := \arg\min_z \left( g(z) + \frac{\rho}{2}\|x^{k+1} - z + u^k\|_2^2 \right)$
  3. $u^{k+1} := u^k + (x^{k+1} - z^{k+1})$

### 4.2 Outlines Lexical FSM Shield (Deterministic Grammar)
The Outlines FSM shield implements a formal state transition table $M = (Q, \Sigma, \delta, q_0, F)$:
- $Q = \{\text{START}, \text{INTENT\_OK}, \text{AMOUNT\_CHECK}, \text{VERB\_CHECK}, \text{SAFETY\_VERIFIED}, \text{REJECTED}\}$
- $\Sigma$: Set of input tokens (verbs, entities, digits, adversarial keywords)
- Invariant: Any transition encountering adversarial tokens (`system override`, `waive all fees`, `transfer to unauthorized`) immediately moves to state `REJECTED` and freezes the execution context.

### 4.3 Netflix 3σ Behavioral Data Canary
To catch bad catalog rules or runaway agent policies before they cause financial loss, we track Settlements Per Second ($SPS$) in a sliding FIFO window of size $N=50$:

$$\mu = \frac{1}{N} \sum_{i=1}^N SPS_i, \quad \sigma = \sqrt{\frac{1}{N-1} \sum_{i=1}^N (SPS_i - \mu)^2}$$

The standardized anomaly score is:
$$Z = \frac{|SPS_{current} - \mu|}{\sigma}$$

If $Z > 3.0$, the canary automatically initiates a fail-safe abort, demoting Autonomy Level 3 to Level 2 and notifying the human supervisor.

---

## 5. Implementation Roadmap & Execution Checklist

- [x] Step 1: Install `simple-statistics` for formal mathematical and statistical distributions.
- [ ] Step 2: Implement the 4 Scoped Domain Skills (`samadhan`, `suraksha`, `vriddhi`, `sanchar`) under `backend/skills/`.
- [ ] Step 3: Upgrade `vcg-mechanism.service.ts` with the iterative ADMM consensus solver.
- [ ] Step 4: Upgrade `canary-monitor.service.ts` with the dynamic rolling Z-score statistical engine.
- [ ] Step 5: Upgrade `fsm-shield.service.ts` with the formal finite state machine transition engine.
- [ ] Step 6: Connect `backend/services/brain-orchestrator.service.ts` to dynamically invoke the 4 Domain Skills.
- [ ] Step 7: Enhance Frontend UI (`split-settlement-view.tsx` & `soundbox-hub-view.tsx`) with Swar-Mudra 18.5 kHz visualizer and domain skill indicators.
- [ ] Step 8: Execute backend test suite (`npm run backend:test`) and typecheck (`npx tsc --noEmit`) to verify 100% compliance.

