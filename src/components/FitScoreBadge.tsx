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
      <div className="bg-white rounded-2xl card-shadow p-4 sm:p-6">
        <div className="text-center mb-3">
          <div className={`text-4xl sm:text-5xl font-bold ${color}`}>{score}</div>
          <div className="text-sm text-text-light mt-1">out of 100</div>
          <div className="text-xs font-semibold text-periwinkle mt-1">Flor Fit Score</div>
        </div>
        <div className="text-sm text-text-light text-center">
          {topMatch}. {topGap}.
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-periwinkle-50 rounded-xl px-3 py-2">
      <span className={`text-lg font-bold ${color}`}>{score}/100</span>
      <span className="text-[10px] font-medium text-periwinkle-dark">Flor Fit</span>
    </div>
  );
}
