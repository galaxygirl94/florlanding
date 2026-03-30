// Flor Fit Score weights — per product spec
export const FIT_SCORE_WEIGHTS = {
  specialtyMatch: 35,
  careSettingMatch: 25,
  availabilityMatch: 20,
  locationProximity: 15,
  ehrMatch: 1,
  pslfAlignment: 4,
} as const;

export const TOTAL_POSSIBLE = Object.values(FIT_SCORE_WEIGHTS).reduce(
  (sum, w) => sum + w,
  0
); // 100

export const FIT_SCORE_LABELS = {
  excellent: { min: 80, label: "Excellent Match" as const },
  good: { min: 60, label: "Good Match" as const },
  partial: { min: 0, label: "Partial Match" as const },
} as const;

// Hard filters — disqualify before scoring
export const HARD_FILTERS = {
  requireValidStateLicense: true,
  requireAllMandatoryCertifications: true,
} as const;
