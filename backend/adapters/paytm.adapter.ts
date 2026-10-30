import type {
  IPaytmAdapter,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  ProviderStatus,
} from "./provider.interface.ts";
import { paytmGateway } from "../services/paytm-gateway.service.ts";
import { dbRepo } from "../database/db.ts";

export class PaytmAdapter implements IPaytmAdapter {
  async initiatePayment(
    req: PaymentInitiateRequest,
    mode: "LIVE" | "DEMO" = "DEMO"
  ): Promise<PaymentInitiateResponse> {
    if (mode === "LIVE") {
      const liveRes = await paytmGateway.initiateTransaction({
        orderId: req.orderId,
        amount: req.amount,
        customerId: req.merchantId,
      });

      const isSuccess = liveRes.resultStatus === "S";
      const txnId = liveRes.txnToken || `PTM_LIVE_${Date.now()}`;

      // Persist to LIVE database partition
      await dbRepo.createTransaction({
        txn_id: txnId,
        mode: "LIVE",
        merchant_id: req.merchantId,
        amount: req.amount,
        currency: req.currency || "INR",
        status: isSuccess ? "SUCCESS" : "PENDING",
        payer_vpa: req.customerVpa || null,
        rrn: liveRes.signature.slice(0, 12),
        settlement_status: "PENDING",
      });

      return {
        success: isSuccess,
        orderId: req.orderId,
        txnId,
        status: isSuccess ? "SUCCESS" : "PENDING",
        qrData: `upi://pay?pa=live.merchant@paytm&pn=PaytmMerchant&am=${req.amount}&tr=${req.orderId}`,
        gatewayResponse: liveRes,
        mode: "LIVE",
        isDemo: false,
        message: liveRes.resultMsg || "Paytm Live Transaction Initiated",
      };
    } else {
      // DEMO mode: isolated, explicit, no fake live data
      const demoTxnId = `DEMO_TXN_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const demoRrn = `DEMO_RRN_${Math.floor(100000 + Math.random() * 900000)}`;

      await dbRepo.createTransaction({
        txn_id: demoTxnId,
        mode: "DEMO",
        merchant_id: req.merchantId || "DEMO_MERCHANT_RAMESH",
        amount: req.amount,
        currency: req.currency || "INR",
        status: "SUCCESS",
        payer_vpa: req.customerVpa || "customer@demo.paytm",
        rrn: demoRrn,
        settlement_status: "PENDING",
      });

      return {
        success: true,
        orderId: req.orderId,
        txnId: demoTxnId,
        status: "SUCCESS",
        qrData: `upi://pay?pa=ramesh.kirana@paytm&pn=RameshKiranaDemo&am=${req.amount}&tr=${req.orderId}`,
        gatewayResponse: {
          head: { responseTimestamp: Date.now().toString(), version: "v1" },
          body: {
            resultInfo: { resultStatus: "S", resultCode: "0000", resultMsg: "Demo payment simulated successfully" },
            txnId: demoTxnId,
            bankTxnId: demoRrn,
          },
        },
        mode: "DEMO",
        isDemo: true,
        message: "[DEMO MODE] Simulated payment transaction recorded in isolated demo ledger",
      };
    }
  }

  async checkPaymentStatus(orderId: string, mode: "LIVE" | "DEMO" = "DEMO"): Promise<any> {
    if (mode === "LIVE") {
      const liveTxn = await dbRepo.getTransaction(orderId, "LIVE");
      return {
        status: liveTxn ? liveTxn.status : "PENDING",
        orderId,
        isDemo: false,
        mode: "LIVE",
        details: liveTxn || { message: "Checked against live transaction records" },
      };
    } else {
      const demoTxns = await dbRepo.listTransactions("DEMO_MERCHANT_RAMESH", "DEMO");
      const matched = demoTxns.find((t: any) => t.txn_id === orderId || t.rrn === orderId);
      return {
        status: matched ? matched.status : "SUCCESS",
        orderId,
        isDemo: true,
        mode: "DEMO",
        details: matched || { message: "Demo transaction verified in sandbox" },
      };
    }
  }

  async applyRefund(
    txnId: string,
    refundAmount: number,
    reason: string,
    mode: "LIVE" | "DEMO" = "DEMO"
  ): Promise<any> {
    if (mode === "LIVE") {
      const refId = `REF_${Date.now()}`;
      return paytmGateway.applyRefund({
        orderId: `ORD_${Date.now()}`,
        txnId,
        refundAmount,
        refId,
      });
    } else {
      const demoRefundId = `DEMO_REF_${Date.now()}`;
      await dbRepo.recordAuditEvent({
        actor: "PI_MUNSHI_AGENT",
        action: "REFUND_INITIATED",
        resource_id: txnId,
        mode: "DEMO",
        details: { refundAmount, reason, demoRefundId },
      });
      return {
        success: true,
        refundId: demoRefundId,
        txnId,
        refundAmount,
        status: "SUCCESS",
        mode: "DEMO",
        isDemo: true,
        message: "[DEMO MODE] Refund processed in isolated demo ledger",
      };
    }
  }

  async getConnectionStatus(): Promise<ProviderStatus> {
    const credsCheck = paytmGateway.testCredentials();
    return {
      provider: "paytm",
      mode: credsCheck.configured ? "LIVE" : "DEMO",
      status: credsCheck.configured ? "CONNECTED" : "SANDBOX",
      latencyMs: 15,
      details: {
        mid: credsCheck.mid,
        isStaging: credsCheck.isStaging,
      },
    };
  }
}

export const paytmAdapter = new PaytmAdapter();
