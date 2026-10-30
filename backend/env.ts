/**
 * Pi Munshi Reinforcement Learning (RL) Environment Specification
 * Gymnasium / PettingZoo Compatible Agent Environment
 * 
 * Formal POMDP: Tuple (S, A, P, R, Omega, O, gamma)
 * - Observation Space: Merchant State, Transaction Stream, OKF Policy, Audio Telemetry
 * - Action Space: 3-Rung Routing, Settlement Execution, VCG Contract Synthesis, Human Escalation
 * - Reward Function: Multi-Objective Reward (Settlement Velocity + Retention - Dispute Risk - Token Cost)
 */

import { mdrCalculator } from "./services/mdr-calculator.service.ts";
import { vcgMechanism } from "./services/vcg-mechanism.service.ts";
import { okfKnowledge } from "./services/okf-knowledge.service.ts";
import { fsmShield } from "./services/fsm-shield.service.ts";
import { walLedger } from "./services/wal-ledger.service.ts";
import { canaryMonitor } from "./services/canary-monitor.service.ts";

export type ObservationSpace = {
  merchantId: string;
  orderAmount: number;
  customerTrustScore: number;
  merchantMargin: number;
  hoursElapsed: number;
  activeDispute: boolean;
  canaryZScore: number;
  language: "hi-IN" | "kn-IN" | "en-IN";
  soundboxConnected: boolean;
};

export type ActionType =
  | { type: "RUNG_1_REFLEX_CONFIRM"; orderAmount: number }
  | { type: "RUNG_2_POLICY_ARBITRATE"; policyId: string; orderAmount: number }
  | { type: "RUNG_3_VCG_CONTRACT"; orderAmount: number; selectedOption: "A" | "B" | "C" }
  | { type: "HUMAN_FSE_ESCALATE"; reason: string };

export type StepResult = {
  observation: ObservationSpace;
  reward: number;
  terminated: boolean;
  truncated: boolean;
  info: {
    settlementNet?: number;
    mdrFee?: number;
    hmacSignature?: string;
    fsmPassed: boolean;
    canaryBreached: boolean;
    tokenCostUsd: number;
    latencyMs: number;
  };
};

export class PiMunshiRLEnv {
  private state: ObservationSpace;
  private stepCount: number = 0;
  private readonly maxSteps: number = 50;

  constructor(initialState?: Partial<ObservationSpace>) {
    this.state = this.getInitialState(initialState);
  }

  private getInitialState(override?: Partial<ObservationSpace>): ObservationSpace {
    return {
      merchantId: "MID-BELLANDUR-001",
      orderAmount: 3500.0,
      customerTrustScore: 0.88,
      merchantMargin: 0.12,
      hoursElapsed: 0,
      activeDispute: false,
      canaryZScore: 0.42,
      language: "hi-IN",
      soundboxConnected: true,
      ...override,
    };
  }

  /**
   * Resets the environment to an initial episode state
   */
  public reset(seed?: Partial<ObservationSpace>): { observation: ObservationSpace; info: Record<string, any> } {
    this.state = this.getInitialState(seed);
    this.stepCount = 0;
    return {
      observation: { ...this.state },
      info: { episode: 1, resetTimestamp: new Date().toISOString() },
    };
  }

  /**
   * Executes one environment step given an agent action
   */
  public step(action: ActionType): StepResult {
    this.stepCount++;
    let reward = 0;
    let terminated = false;
    let truncated = this.stepCount >= this.maxSteps;

    const info: StepResult["info"] = {
      fsmPassed: true,
      canaryBreached: false,
      tokenCostUsd: 0.00001,
      latencyMs: 15,
    };

    // 1. FSM Lexical Shield Invariant Guard
    const fsmCheck = fsmShield.validate(action.type, action);
    if (!fsmCheck.isValid) {
      reward = -10.0; // Heavy penalty for safety violation
      info.fsmPassed = false;
      terminated = true;
      return { observation: { ...this.state }, reward, terminated, truncated, info };
    }

    // 2. Process Action Dynamics
    switch (action.type) {
      case "RUNG_1_REFLEX_CONFIRM": {
        const mdr = mdrCalculator.calculate({ orderAmount: action.orderAmount });
        info.settlementNet = mdr.netSettlement;
        info.mdrFee = mdr.finalMdrFee;
        info.hmacSignature = mdr.hmacSha256;
        info.tokenCostUsd = 0.0; // 0 LLM Tokens
        info.latencyMs = 180;
        reward = +1.0; // Fast frictionless resolution
        terminated = true;
        break;
      }

      case "RUNG_2_POLICY_ARBITRATE": {
        const mdr = mdrCalculator.calculate({ orderAmount: action.orderAmount });
        const okf = okfKnowledge.evaluatePolicy({ policyId: action.policyId, orderAmount: action.orderAmount });
        info.settlementNet = mdr.netSettlement;
        info.mdrFee = mdr.finalMdrFee;
        info.tokenCostUsd = 0.00045; // ~450 Tokens
        info.latencyMs = 620;
        reward = okf.cragScore >= 0.9 ? +2.0 : -0.5;
        terminated = true;
        break;
      }

      case "RUNG_3_VCG_CONTRACT": {
        const vcg = vcgMechanism.solve({
          orderAmount: action.orderAmount,
          customerTrustScore: this.state.customerTrustScore,
        });
        info.tokenCostUsd = 0.0014; // ~1,400 Tokens
        info.latencyMs = 1850;
        // Reward: High customer trust + transaction preserved
        reward = +3.5;
        walLedger.append("VCG_CONTRACT_SETTLE", action.orderAmount, `Contract ${action.selectedOption} settled`);
        terminated = true;
        break;
      }

      case "HUMAN_FSE_ESCALATE": {
        reward = -0.2; // Small cost for human intervention
        info.latencyMs = 50;
        terminated = true;
        break;
      }
    }

    // 3. Canary Check
    const canary = canaryMonitor.getStatus();
    if (canary.isBreached) {
      info.canaryBreached = true;
      reward -= 5.0;
      terminated = true;
    }

    return {
      observation: { ...this.state },
      reward,
      terminated,
      truncated,
      info,
    };
  }
}

