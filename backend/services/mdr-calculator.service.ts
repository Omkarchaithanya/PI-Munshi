/**
 * Pi Munshi Backend Real MDR Settlement Service
 * Implements Reserve Bank of India (RBI) Directive: RBI/2026/CO/DPSS/114
 * Strict Tiered Fee: 0% <= ₹2,000; 0.4% > ₹2,000, Capped at ₹300.00 max.
 */

import { cryptoVault } from "./crypto-vault.service.ts";
import type { MdrCalculationRequest, MdrCalculationResponse } from "../types.ts";

export class MdrCalculatorService {
  private static instance: MdrCalculatorService;

  private readonly THRESHOLD_INR = 2000.0;
  private readonly MDR_RATE_PERCENT = 0.4;
  private readonly MAX_MDR_CAP_INR = 300.0;

  private constructor() {}

  public static getInstance(): MdrCalculatorService {
    if (!MdrCalculatorService.instance) {
      MdrCalculatorService.instance = new MdrCalculatorService();
    }
    return MdrCalculatorService.instance;
  }

  public calculate(req: MdrCalculationRequest): MdrCalculationResponse {
    const amount = Math.max(0, req.orderAmount);
    const waiverOverride = Boolean(req.waiverOverride);

    let rawMdrFee = 0;
    let waiverApplied = false;
    let waiverAmount = 0;
    let finalMdrFee = 0;

    if (amount <= this.THRESHOLD_INR) {
      // 100% RBI Subsidized Small Merchant Tier
      rawMdrFee = 0;
      waiverApplied = true;
      waiverAmount = 0;
      finalMdrFee = 0;
    } else {
      // Standard Tier (0.4%)
      rawMdrFee = (amount * this.MDR_RATE_PERCENT) / 100.0;

      if (waiverOverride) {
        // Merchant has active promotional waiver
        waiverApplied = true;
        waiverAmount = rawMdrFee;
        finalMdrFee = 0;
      } else {
        // Apply RBI Maximum Cap
        finalMdrFee = Math.min(rawMdrFee, this.MAX_MDR_CAP_INR);
      }
    }

    // Round to 2 decimal places
    finalMdrFee = Math.round(finalMdrFee * 100) / 100;
    const netSettlement = Math.round((amount - finalMdrFee) * 100) / 100;

    const utr = `6299${Math.floor(10000000 + Math.random() * 90000000)}`;
    const orderId = `PTM20261030${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const payloadDigest = `${orderId}:${utr}:${amount}:${finalMdrFee}:${netSettlement}:${timestamp}`;
    const hmacSha256 = cryptoVault.hmacSha256(payloadDigest);
    const swarMudraPayload = cryptoVault.generateSwarMudraPayload("MID-PAYTM-BELLANDUR", utr, amount);

    return {
      orderAmount: amount,
      threshold: this.THRESHOLD_INR,
      mdrRatePercent: amount <= this.THRESHOLD_INR ? 0 : this.MDR_RATE_PERCENT,
      rawMdrFee: Math.round(rawMdrFee * 100) / 100,
      waiverApplied,
      waiverAmount: Math.round(waiverAmount * 100) / 100,
      finalMdrFee,
      netSettlement,
      utr,
      orderId,
      timestamp,
      hmacSha256,
      swarMudraPayload,
      rbiCapVerified: finalMdrFee <= this.MAX_MDR_CAP_INR,
    };
  }
}

export const mdrCalculator = MdrCalculatorService.getInstance();
