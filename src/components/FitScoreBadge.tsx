interface FitScoreBadgeProps {
  score: number;
  topMatch: string;
  topGap: string;
  size?: "sm" | "lg";
}

export default function FitScoreBadge({ score, topMatch, topGap, size = "sm" }: FitScoreBadgeProps) {
  const color =
    score >= 80 ? "text-success" : score >= 60 ? "text-periwinkle" : "text-amber-dark";

  if (size === "lg") {
    return (
      <div className="bg-white rounded-2xl section-shadow p-5 sm:p-6">
        <div className="text-center mb-4">
          <div className={`text-5xl sm:text-6xl font-extrabold ${color} leading-none`}>{score}</div>
          <div className="text-sm text-text-muted mt-1.5 font-medium">out of 100</div>
          <div className="text-xs font-bold text-periwinkle uppercase tracking-wider mt-1">Flor Fit Score</div>
        </div>
        <div className="text-sm text-text-light text-center leading-relaxed">
          {topMatch}. {topGap}.
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-periwinkle-50 to-periwinkle-100/50 rounded-xl px-3 py-2">
      <span className={`text-lg font-extrabold ${color}`}>{score}/100</span>
      <span className="text-[9px] font-bold text-periwinkle-dark uppercase tracking-wider">Flor Fit</span>
    </div>
  );
}
