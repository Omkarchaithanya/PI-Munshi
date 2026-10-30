import { MdrCalculatorService } from "./mdr-calculator.service.ts";
import type { MdrCalculationRequest, MdrCalculationResponse } from "../types.ts";

export function computeRealSettlement(req: MdrCalculationRequest): MdrCalculationResponse {
  return MdrCalculatorService.getInstance().calculate(req);
}
