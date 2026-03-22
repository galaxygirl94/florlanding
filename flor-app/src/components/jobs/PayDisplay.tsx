"use client";

import PaySubmitPrompt from "./PaySubmitPrompt";

interface PayDisplayProps {
  payMin: number | null;
  payMax: number | null;
  payUnit?: string;
  payExplained?: string;
  paySource?: string | null;
  payConfidence?: string | null;
  facilityName: string;
  specialty?: string;
  variant?: "card" | "detail";
}

/**
 * Pay display with context based on pay_source:
 *   - 'facility': full prominence, no qualifier
 *   - 'community': show "Community reported"
 *   - 'glassdoor_estimate': show "Est. based on market data"
 *   - 'bls_estimate': muted "RI market estimate"
 *   - null/no pay: "Pay not listed" + PaySubmitPrompt
 */
export default function PayDisplay({
  payMin,
  payMax,
  payUnit = "hr",
  payExplained,
  paySource,
  payConfidence,
  facilityName,
  specialty,
  variant = "card",
}: PayDisplayProps) {
  const hasPay = payMin != null && payMax != null && (payMin > 0 || payMax > 0);
  const isEstimated = paySource === "bls_estimate" || paySource === "glassdoor_estimate";
  const isCommunity = paySource === "community";
  const isFacility = paySource === "facility" || (!paySource && hasPay);

  // No pay data
  if (!hasPay) {
    return (
      <div className={variant === "detail" ? "bg-gray-50 rounded-2xl p-5 sm:p-6 mb-6" : "bg-gray-50 rounded-xl p-3 sm:p-4 mb-4"}>
        <p className="text-sm text-text-light">Pay not listed</p>
        <PaySubmitPrompt facilityName={facilityName} specialty={specialty} />
      </div>
    );
  }

  // Determine styling based on source
  const bgClass = isEstimated
    ? "bg-gray-50"
    : "bg-periwinkle-50";

  const textClass = isEstimated
    ? "text-text-light"
    : "text-periwinkle";

  const subTextClass = isEstimated
    ? "text-text-light"
    : "text-periwinkle-dark";

  // Label for non-facility pay
  const sourceLabel = isCommunity
    ? "Community reported"
    : paySource === "glassdoor_estimate"
    ? "Est. based on market data"
    : paySource === "bls_estimate"
    ? "RI market estimate"
    : null;

  if (variant === "detail") {
    return (
      <div className={`${bgClass} rounded-2xl p-5 sm:p-6 mb-6`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold ${subTextClass} uppercase tracking-wider`}>
            Pay Information
          </span>
          {sourceLabel && (
            <span className="text-[10px] font-medium bg-white/60 text-text-light px-2 py-0.5 rounded-full">
              {sourceLabel}
            </span>
          )}
        </div>
        <div className={`${isEstimated ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-bold ${textClass} mb-2`}>
          ${payMin!.toFixed(2)} - ${payMax!.toFixed(2)}
          <span className={`text-base font-normal ${subTextClass}`}>/{payUnit}</span>
        </div>
        {payExplained && isFacility && (
          <div className="bg-white/60 rounded-xl p-3 sm:p-4 mt-3">
            <div className={`text-xs font-semibold ${subTextClass} mb-1`}>Pay Explained</div>
            <p className="text-sm text-text leading-relaxed">{payExplained}</p>
          </div>
        )}
        {isEstimated && (
          <PaySubmitPrompt facilityName={facilityName} specialty={specialty} />
        )}
      </div>
    );
  }

  // Card variant
  return (
    <div className={`${bgClass} rounded-xl p-3 sm:p-4 mb-4`}>
      <div className="flex items-center gap-2">
        <div className={`${isEstimated ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"} font-bold ${textClass}`}>
          ${payMin!.toFixed(2)} - ${payMax!.toFixed(2)}
          <span className={`text-sm font-normal ${subTextClass}`}>/{payUnit}</span>
        </div>
        {sourceLabel && (
          <span className="text-[10px] font-medium bg-white/60 text-text-light px-2 py-0.5 rounded-full whitespace-nowrap">
            {sourceLabel}
          </span>
        )}
      </div>
      {payExplained && isFacility && (
        <p className="text-xs text-text-light mt-1">{payExplained}</p>
      )}
    </div>
  );
}
