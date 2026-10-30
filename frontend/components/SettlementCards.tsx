import { inrFormat } from "@/lib/munshi/backend";

export type SettlementCardsProps = {
  orderAmount: number;
  rawMdrFee: number;
  waiverApplied: boolean;
  waiverAmount: number;
  netSettlement: number;
  card1Title: string;
  card1Subtitle: string;
  card2Title: string;
  card2SubtitleCharged: string;
  card2SubtitleFree: string;
  card3Title: string;
  card3SubtitleApplied: string;
  card3SubtitleNone: string;
  card4Title: string;
  card4Subtitle: string;
};

export function SettlementCards({
  orderAmount,
  rawMdrFee,
  waiverApplied,
  waiverAmount,
  netSettlement,
  card1Title,
  card1Subtitle,
  card2Title,
  card2SubtitleCharged,
  card2SubtitleFree,
  card3Title,
  card3SubtitleApplied,
  card3SubtitleNone,
  card4Title,
  card4Subtitle,
}: SettlementCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-xl border border-line bg-ink-2 p-4">
        <span className="text-xs text-mist">{card1Title}</span>
        <div className="mt-1 text-2xl font-bold text-fg">
          {inrFormat(orderAmount)}
        </div>
        <p className="mt-1 text-[11px] text-mist">{card1Subtitle}</p>
      </div>

      <div className="rounded-xl border border-line bg-ink-2 p-4">
        <span className="text-xs text-mist">{card2Title}</span>
        <div className="mt-1 text-2xl font-bold text-amber-400">
          {orderAmount > 2000 ? inrFormat(rawMdrFee) : "₹0.00 (Nil)"}
        </div>
        <p className="mt-1 text-[11px] text-mist">
          {orderAmount > 2000 ? card2SubtitleCharged : card2SubtitleFree}
        </p>
      </div>

      <div className="rounded-xl border border-line bg-ink-2 p-4">
        <span className="text-xs text-mist">{card3Title}</span>
        <div className="mt-1 text-2xl font-bold text-emerald-400">
          {waiverApplied ? `- ${inrFormat(waiverAmount)}` : "₹0.00"}
        </div>
        <p className="mt-1 text-[11px] text-emerald-400">
          {waiverApplied ? card3SubtitleApplied : card3SubtitleNone}
        </p>
      </div>

      <div className="rounded-xl border-2 border-cyan/40 bg-cyan/5 p-4">
        <span className="text-xs font-semibold text-cyan">{card4Title}</span>
        <div className="mt-1 text-2xl font-extrabold text-cyan-2">
          {inrFormat(netSettlement)}
        </div>
        <p className="mt-1 text-[11px] text-mist">{card4Subtitle}</p>
      </div>
    </div>
  );
}
