---
policy_id: "PTM-CORE-2026-DREAM-01"
title: "11:30 PM Nightly Dreaming & FSE Resignation Handoff Specification"
short_name: "Nightly Dreaming & Territory Memory"
regulator: "Paytm Field Operations Technology Group"
effective_date: "2026-09-15"
last_updated_date: "2026-10-30"
category: "NIGHTLY_DREAMING"
status: "ACTIVE"
git_commit_sha: "3d29a501bc8947ef62194a20b"
rules:
  consolidation_cron: "30 23 * * *"
  max_gist_lines: 8
  max_token_budget: 200
  dual_key_separation: true
  primary_keys:
    - "merchant_id"
    - "rep_id"
  proactive_morning_brief_time: "09:00"
---

# 11:30 PM Nightly Dreaming & FSE Resignation Handoff Specification

## 1. The Frontline Attrition Problem
Frontline sales executives (FSEs) in India experience ~18% annual turnover. When a representative leaves, traditional CRM systems lose implicit context: preferred vernacular dialects, Sunday counter arrangements, promised fee waivers, and supplier payout deadlines.

## 2. Nightly Dreaming Consolidation Pass
Every evening at 11:30 PM when merchant shops close, Pi Munshi executes a reflective consolidation pass:
- Synthesizes 90 days of noisy countertop events into an exact **8-Line (~200 token) OKF Markdown Gist**.
- Dual-Key Storage:
  - `merchant_id` memory: Promises made, counter dynamics, language preferences, active settlement tickets.
  - `rep_id` memory: Human preferences, pacing, tone, and earned autonomy authorizations.

## 3. Zero-Loss Resignation Handoff
When FSE Arun Kumar resigns at 7:00 PM, new FSE Neha Rao inherits Arun's Munshi territory on Day 1.
- Raw WhatsApp chat history is not dumped.
- Instead, the clean 8-line OKF gist, open promises, and trust scores load immediately, ensuring zero relationship disruption.
