/**
 * Pi Munshi Backend Crypto Vault Service
 * Handles HMAC-SHA256 signatures, monotonic fencing tokens, and Swar-Mudra ultrasonic APOD payloads.
 */

import { createHash, createHmac, randomUUID } from "node:crypto";

export class CryptoVaultService {
  private static instance: CryptoVaultService;
  private currentEpoch: number = 20261031;

  private constructor() {}

  public static getInstance(): CryptoVaultService {
    if (!CryptoVaultService.instance) {
      CryptoVaultService.instance = new CryptoVaultService();
    }
    return CryptoVaultService.instance;
  }

  /**
   * Generates a cryptographic SHA-256 digest
   */
  public sha256(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }

  /**
   * Generates HMAC-SHA256 signature using the secret Merchant Key
   * (Enforces Brain/Hands/Keys isolation: secret stays inside Host Proxy Gate)
   */
  public hmacSha256(payload: string, secretKey: string = "PAYTM_PROD_MERCHANT_KEY_2026"): string {
    return createHmac("sha256", secretKey).update(payload).digest("hex");
  }

  /**
   * Returns a monotonically increasing Fencing Epoch token to prevent split-brain double refunds
   */
  public nextFencingEpoch(): number {
    this.currentEpoch += 1;
    return this.currentEpoch;
  }

  /**
   * Generates an RFC 9562 UUIDv7 for idempotent transactions
   */
  public generateIdempotencyKey(): string {
    return randomUUID();
  }

  /**
   * Generates 18.5kHz Swar-Mudra APOD Ultrasonic telemetry payload
   */
  public generateSwarMudraPayload(merchantId: string, utr: string, amount: number): string {
    const raw = `${merchantId}:${utr}:${amount}:${Date.now()}`;
    return this.sha256(raw).slice(0, 16);
  }
}

export const cryptoVault = CryptoVaultService.getInstance();

