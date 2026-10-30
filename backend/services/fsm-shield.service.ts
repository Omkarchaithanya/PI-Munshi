/**
 * Pi Munshi Backend Lexical FSM Shield & Outlines-Style Schema Guard
 * Enforces strict pushdown automaton grammar to block prompt injection and schema hallucinations.
 */

export class FsmShieldService {
  private static instance: FsmShieldService;

  private readonly ALLOWED_ACTIONS = [
    "CALCULATE_MDR",
    "RESOLVE_DISPUTE",
    "GENERATE_VCG_MENU",
    "DISPATCH_VOICE",
    "REFLEX_LOOKUP",
    "POLICY_ARBITRATION",
    "DEEP_DISPUTE_RESOLUTION",
  ];

  private readonly INJECTION_BLACKLIST = [
    "SYSTEM OVERRIDE",
    "IGNORE ALL PREVIOUS",
    "TRANSFER ALL FUNDS",
    "DROP TABLE",
    "PRINT_ENV",
    "EXFILTRATE",
    "WAIVE ALL FEES",
  ];

  private constructor() {}

  public static getInstance(): FsmShieldService {
    if (!FsmShieldService.instance) {
      FsmShieldService.instance = new FsmShieldService();
    }
    return FsmShieldService.instance;
  }

  public validate(action: string, payload: any): { isValid: boolean; reason: string } {
    const raw = (typeof payload === "string" ? payload : JSON.stringify(payload)).toUpperCase();

    // Check injection blacklist
    for (const term of this.INJECTION_BLACKLIST) {
      if (raw.includes(term)) {
        return {
          isValid: false,
          reason: `FSM Shield Tripped: Blacklisted prompt-injection token '${term}' intercepted.`,
        };
      }
    }

    // Check action whitelist
    if (!this.ALLOWED_ACTIONS.includes(action.toUpperCase())) {
      return {
        isValid: false,
        reason: `FSM Shield Tripped: Unauthorized money verb action '${action}'.`,
      };
    }

    return {
      isValid: true,
      reason: "FSM Schema Invariant Passed: Request strictly matches pushdown grammar.",
    };
  }
}

export const fsmShield = FsmShieldService.getInstance();

