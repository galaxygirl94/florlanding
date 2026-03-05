// Flor Fit Score Algorithm Configuration
// Five factors that match the marketing page — adjust weights here

export const FIT_SCORE_WEIGHTS = {
  scheduleMatch: 25,
  specialtyMatch: 25,
  commuteDistance: 20,
  payAlignment: 15,
  facilityCulture: 15,
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
