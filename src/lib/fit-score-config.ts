// Flor Fit Score Algorithm Configuration
// Seven factors weighted to 100 total points

export const FIT_SCORE_WEIGHTS = {
  specialty: 35,
  certifications: 20,
  experience: 15,
  shiftSchedule: 15,
  careSetting: 10,
  patientPopulation: 4,
  ehrSystem: 1,
} as const;

export const TOTAL_POSSIBLE = Object.values(FIT_SCORE_WEIGHTS).reduce(
  (sum, w) => sum + w,
  0
);

// Adjacent specialties map — used for partial credit
export const ADJACENT_SPECIALTIES: Record<string, string[]> = {
  "Med Surg": ["Telemetry", "Cardiac"],
  "Telemetry": ["Med Surg", "Cardiac"],
  "Cardiac": ["Med Surg", "Telemetry", "ICU"],
  "ICU": ["ED", "Cardiac"],
  "ED": ["ICU", "Cardiac"],
  "L&D": ["NICU"],
  "NICU": ["L&D", "Peds"],
  "Peds": ["NICU"],
  "SNF/LTC": ["Rehab", "Home Health"],
  "Rehab": ["SNF/LTC", "Home Health"],
  "Home Health": ["SNF/LTC", "Rehab"],
  "OR": ["Outpatient/Clinic"],
  "Outpatient/Clinic": ["OR"],
};

// Adjacent care settings
export const ADJACENT_CARE_SETTINGS: Record<string, string[]> = {
  "Acute care/Hospital": ["Ambulatory surgery"],
  "Ambulatory surgery": ["Acute care/Hospital"],
  "SNF/Long-term care": ["Rehab", "Home health"],
  "Rehab": ["SNF/Long-term care", "Home health"],
  "Home health": ["SNF/Long-term care", "Rehab"],
};

// ZIP code approximate coordinates for distance calculation (RI area)
export const ZIP_COORDS: Record<string, { lat: number; lng: number }> = {
  "02840": { lat: 41.4901, lng: -71.3128 }, // Newport
  "02860": { lat: 41.8787, lng: -71.3826 }, // Pawtucket
  "02903": { lat: 41.8195, lng: -71.4187 }, // Providence
  "02904": { lat: 41.8487, lng: -71.4373 }, // Providence (N)
  "02905": { lat: 41.7918, lng: -71.4061 }, // Providence (S)
  "02906": { lat: 41.8414, lng: -71.3945 }, // Providence (E)
  "02907": { lat: 41.8037, lng: -71.4290 }, // Providence
  "02908": { lat: 41.8352, lng: -71.4505 }, // Providence
  "02909": { lat: 41.8201, lng: -71.4493 }, // Providence
  "02910": { lat: 41.7710, lng: -71.3870 }, // Cranston
  "02920": { lat: 41.7804, lng: -71.4572 }, // Cranston
  "02871": { lat: 41.5820, lng: -71.2583 }, // Portsmouth
  "02882": { lat: 41.4490, lng: -71.4515 }, // Narragansett
  "02886": { lat: 41.7004, lng: -71.4218 }, // Warwick
  "02889": { lat: 41.6829, lng: -71.3725 }, // Warwick (E)
  "02893": { lat: 41.7030, lng: -71.4622 }, // West Warwick
  "02852": { lat: 41.5827, lng: -71.4614 }, // North Kingstown
  "02818": { lat: 41.6351, lng: -71.4725 }, // East Greenwich
  "02864": { lat: 41.9530, lng: -71.4312 }, // Cumberland
  "02895": { lat: 41.9630, lng: -71.5187 }, // Woonsocket
  "02919": { lat: 41.8534, lng: -71.5252 }, // Johnston
  "02816": { lat: 41.7121, lng: -71.6278 }, // Coventry
  "02806": { lat: 41.7400, lng: -71.3120 }, // Barrington
  "02809": { lat: 41.6768, lng: -71.2630 }, // Bristol
  "02835": { lat: 41.5073, lng: -71.3730 }, // Jamestown
  "02842": { lat: 41.5190, lng: -71.2810 }, // Middletown
};
