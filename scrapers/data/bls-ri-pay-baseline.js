/**
 * BLS Rhode Island RN Pay Baselines by Specialty
 *
 * Source: Bureau of Labor Statistics, Occupational Employment and Wage Statistics
 * Geography: Rhode Island
 * Occupation: Registered Nurses (29-1141), Licensed Practical Nurses (29-2061)
 *
 * These are fallback estimates used when a facility does not list pay.
 * All values are hourly rates.
 */

export const BLS_RI_BASELINES = {
  'Med Surg': { pay_min: 36, pay_max: 52, confidence: 'estimated' },
  'ICU': { pay_min: 42, pay_max: 58, confidence: 'estimated' },
  'Pediatrics': { pay_min: 38, pay_max: 54, confidence: 'estimated' },
  'Behavioral Health': { pay_min: 35, pay_max: 50, confidence: 'estimated' },
  'Outpatient': { pay_min: 34, pay_max: 48, confidence: 'estimated' },
  'School Nursing': { pay_min: 32, pay_max: 46, confidence: 'estimated' },
  'Long-Term Care': { pay_min: 33, pay_max: 47, confidence: 'estimated' },
  'Rehab': { pay_min: 35, pay_max: 50, confidence: 'estimated' },
  'Per Diem': { pay_min: 40, pay_max: 58, confidence: 'estimated' },
  'Home Health': { pay_min: 34, pay_max: 49, confidence: 'estimated' },
  'General RN': { pay_min: 36, pay_max: 52, confidence: 'estimated' },
};
