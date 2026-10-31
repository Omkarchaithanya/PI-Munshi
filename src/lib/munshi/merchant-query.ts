/** @deprecated Use resolveMerchantAnswer from merchant-query-service.ts */
export { type MunshiLang } from "@/lib/munshi/merchant-query-service";

/** Brain cycle sometimes returns a generic payment line unrelated to the question. */
export function isGenericBrainVoiceReadout(query: string, voiceReadout: string): boolean {
  if (!voiceReadout?.trim()) return true;
  const generic =
    /paytm\s*(par|ನಲ್ಲಿ|per)|payment of ₹|received on paytm|प्राप्त हुए|ಸ್ವೀಕರಿಸಲಾಗಿದೆ/i.test(
      voiceReadout,
    );
  if (!generic) return false;
  const asksSpecific =
    /soundbox|settlement|सेटल|साउंड|ಸೌಂಡ|ಸೆಟಲ|500|mdr|fee|कटौती|when|kab|ಯಾವಾಗ/i.test(query);
  return asksSpecific;
}
