import { FIT_SCORE_WEIGHTS, ADJACENT_SPECIALTIES, ADJACENT_CARE_SETTINGS, ZIP_COORDS } from "./fit-score-config";
import { JobListing, NurseProfile } from "@/data/types";

export interface FitScoreBreakdown {
  specialty: number;
  certifications: number;
  experience: number;
  shiftSchedule: number;
  careSetting: number;
  patientPopulation: number;
  ehrSystem: number;
}

export interface FitScoreFlags {
  payMismatch: boolean;
  payMismatchDetail?: string;
  commuteExceeded: boolean;
  commuteExceededDetail?: string;
}

export interface FitScoreResult {
  score: number;
  breakdown: FitScoreBreakdown;
  flags: FitScoreFlags;
  topMatch: string;
  topGap: string;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistance(zip1?: string, zip2?: string): number | null {
  if (!zip1 || !zip2) return null;
  const c1 = ZIP_COORDS[zip1];
  const c2 = ZIP_COORDS[zip2];
  if (!c1 || !c2) return null;
  return Math.round(haversineDistance(c1.lat, c1.lng, c2.lat, c2.lng));
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function calculateFitScore(nurse: NurseProfile, job: JobListing): FitScoreResult {
  const breakdown: FitScoreBreakdown = {
    specialty: 0,
    certifications: 0,
    experience: 0,
    shiftSchedule: 0,
    careSetting: 0,
    patientPopulation: 0,
    ehrSystem: 0,
  };

  // ── 1. Specialty (35 pts) ──
  if (job.specialty) {
    const jobSpec = normalize(job.specialty);
    const nurseSpecs = nurse.specialties.map(normalize);

    if (nurseSpecs.includes(jobSpec)) {
      // Exact primary match
      breakdown.specialty = 35;
    } else if (job.secondarySpecialty && nurseSpecs.includes(normalize(job.secondarySpecialty))) {
      // Secondary match
      breakdown.specialty = 25;
    } else {
      // Check adjacency
      const adjList = ADJACENT_SPECIALTIES[job.specialty] || [];
      const hasAdj = nurse.specialties.some((s) => adjList.map(normalize).includes(normalize(s)));
      if (hasAdj) {
        breakdown.specialty = 15;
      }
    }
  } else {
    breakdown.specialty = 35;
  }

  // ── 2. Certifications (20 pts) ──
  const reqCerts = (job.certificationsRequired || []).map(normalize);
  if (reqCerts.length > 0) {
    const nurseCerts = nurse.certifications.map(normalize);
    const metCount = reqCerts.filter((c) => nurseCerts.includes(c)).length;
    if (metCount === reqCerts.length) {
      breakdown.certifications = 20;
    } else {
      breakdown.certifications = Math.round((metCount / reqCerts.length) * 20);
    }
  } else {
    breakdown.certifications = 20;
  }

  // ── 3. Experience (15 pts) ──
  const minTotal = job.experienceRange?.min ?? 0;
  const minSpecialty = job.yearsSpecialtyRequired ?? 0;
  const nurseTotal = nurse.yearsOfExperience ?? 0;
  const nurseSpecialty = nurse.yearsSpecialty ?? nurseTotal;

  if (nurseTotal >= minTotal && nurseSpecialty >= minSpecialty) {
    breakdown.experience = 15;
  } else if (nurseTotal >= minTotal && nurseSpecialty < minSpecialty) {
    breakdown.experience = 10;
  } else if (nurseTotal >= minTotal - 1 || nurseSpecialty >= minSpecialty - 1) {
    breakdown.experience = 8;
  } else if (minTotal > 0) {
    breakdown.experience = Math.round(Math.min(nurseTotal / minTotal, 1) * 7);
  } else {
    breakdown.experience = 15;
  }

  // ── 4. Shift & Schedule (15 pts) ──
  const nurseShifts = (nurse.shiftPreferences || []).map(normalize);
  const nurseScheduleTypes = (nurse.scheduleTypes || []).map(normalize);
  const jobShift = normalize(job.scheduleType || "");
  const jobType = normalize(job.type || "");

  let shiftMatch = false;
  let typeMatch = false;

  if (nurseShifts.length === 0 || nurseShifts.includes(jobShift)) {
    shiftMatch = true;
  }
  // Also check legacy schedulePreference field
  if (!shiftMatch && nurse.schedulePreference) {
    if (normalize(nurse.schedulePreference) === jobShift || normalize(nurse.schedulePreference) === "flexible") {
      shiftMatch = true;
    }
  }

  if (nurseScheduleTypes.length === 0 || nurseScheduleTypes.includes(jobType)) {
    typeMatch = true;
  }

  if (shiftMatch && typeMatch) {
    breakdown.shiftSchedule = 15;
  } else if (shiftMatch || typeMatch) {
    breakdown.shiftSchedule = 8;
  }

  // ── 5. Care Setting (10 pts) ──
  const jobSetting = normalize(job.careSetting || job.facilityType || "");
  if (jobSetting && nurse.careSettings && nurse.careSettings.length > 0) {
    const nursSettings = nurse.careSettings.map(normalize);
    if (nursSettings.includes(jobSetting)) {
      breakdown.careSetting = 10;
    } else {
      const adjSettings = ADJACENT_CARE_SETTINGS[job.careSetting || job.facilityType || ""] || [];
      const hasAdj = nurse.careSettings.some((s) => adjSettings.map(normalize).includes(normalize(s)));
      if (hasAdj) breakdown.careSetting = 5;
    }
  } else if (!jobSetting) {
    breakdown.careSetting = 10;
  } else {
    // No nurse care settings = partial credit
    breakdown.careSetting = 5;
  }

  // ── 6. Patient Population (4 pts) ──
  const jobPop = normalize(job.patientPopulation || "");
  if (jobPop && nurse.patientPopulations && nurse.patientPopulations.length > 0) {
    if (nurse.patientPopulations.map(normalize).includes(jobPop)) {
      breakdown.patientPopulation = 4;
    }
  } else if (!jobPop) {
    breakdown.patientPopulation = 4;
  }

  // ── 7. EHR System (1 pt) ── NEVER negative
  const jobEhr = normalize(job.ehrSystem || "");
  if (jobEhr && nurse.ehrExperience && nurse.ehrExperience.length > 0) {
    if (nurse.ehrExperience.map(normalize).includes(jobEhr)) {
      breakdown.ehrSystem = 1;
    }
  } else if (!jobEhr) {
    breakdown.ehrSystem = 1;
  }

  // ── Flags (displayed, not scored) ──
  const flags: FitScoreFlags = {
    payMismatch: false,
    commuteExceeded: false,
  };

  if (nurse.desiredPayMin && nurse.desiredPayMin > 0 && job.payRange.max < nurse.desiredPayMin) {
    flags.payMismatch = true;
    flags.payMismatchDetail = `Job max $${job.payRange.max}/hr is below your $${nurse.desiredPayMin}/hr minimum`;
  }

  const dist = getDistance(nurse.zipCode, job.location.zip);
  if (dist !== null && nurse.maxCommuteMiles && dist > nurse.maxCommuteMiles) {
    flags.commuteExceeded = true;
    flags.commuteExceededDetail = `${dist} miles away (${nurse.maxCommuteMiles} mi max)`;
  }

  const score = Object.values(breakdown).reduce((s, v) => s + v, 0);

  // Determine top match and gap
  const categories: { key: keyof FitScoreBreakdown; label: string; max: number }[] = [
    { key: "specialty", label: "Specialty match", max: FIT_SCORE_WEIGHTS.specialty },
    { key: "certifications", label: "Certifications", max: FIT_SCORE_WEIGHTS.certifications },
    { key: "experience", label: "Experience", max: FIT_SCORE_WEIGHTS.experience },
    { key: "shiftSchedule", label: "Shift & schedule", max: FIT_SCORE_WEIGHTS.shiftSchedule },
    { key: "careSetting", label: "Care setting", max: FIT_SCORE_WEIGHTS.careSetting },
    { key: "patientPopulation", label: "Patient population", max: FIT_SCORE_WEIGHTS.patientPopulation },
    { key: "ehrSystem", label: "EHR system", max: FIT_SCORE_WEIGHTS.ehrSystem },
  ];

  const sortedByScore = [...categories].sort((a, b) => breakdown[b.key] - breakdown[a.key]);
  const topMatch = sortedByScore[0]?.label || "General qualifications";

  const sortedByGap = [...categories]
    .map((c) => ({ ...c, gap: c.max - breakdown[c.key] }))
    .filter((c) => c.gap > 0)
    .sort((a, b) => b.gap - a.gap);
  const topGap = sortedByGap[0]?.label || "";

  return {
    score: Math.min(score, 100),
    breakdown,
    flags,
    topMatch,
    topGap: topGap ? `${topGap} would boost your score` : "Strong overall match",
  };
}
