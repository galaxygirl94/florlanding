// Flor Fit Score Algorithm Configuration
// Adjust weights here without rewriting scoring logic

export const FIT_SCORE_WEIGHTS = {
  specialtyMatch: 35,
  yearsOfExperience: 20,
  schedulePreference: 20,
  certificationsBonus: 10,
  locationProximity: 10,
  unionPreference: 4,
  ehrMatch: 1,
} as const;

export const TOTAL_POSSIBLE = Object.values(FIT_SCORE_WEIGHTS).reduce(
  (sum, w) => sum + w,
  0
);

// Hard filters — disqualify before scoring
export const HARD_FILTERS = {
  requireValidStateLicense: true,
  requireAllMandatoryCertifications: true,
} as const;
