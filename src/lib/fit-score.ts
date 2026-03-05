import { FIT_SCORE_WEIGHTS } from "./fit-score-config";
import { JobListing, NurseProfile, FacilityProfile } from "@/data/types";

export interface FitScoreResult {
  score: number;
  disqualified: boolean;
  disqualifyReason?: string;
  topMatch: string;
  topGap: string;
  breakdown: {
    scheduleMatch: number;
    specialtyMatch: number;
    commuteDistance: number;
    payAlignment: number;
    facilityCulture: number;
  };
}

export function calculateFitScore(
  nurse: NurseProfile,
  job: JobListing,
  facility?: FacilityProfile
): FitScoreResult {
  // Hard filter: license state
  if (
    job.licenseRequired &&
    !nurse.licenses.some(
      (l) =>
        l.state === job.location.state &&
        l.type.toLowerCase().includes(job.licenseRequired.type.toLowerCase())
    )
  ) {
    return {
      score: 0,
      disqualified: true,
      disqualifyReason: `Requires ${job.licenseRequired.type} in ${job.location.state}`,
      topMatch: "",
      topGap: `${job.licenseRequired.type} license in ${job.location.state} required`,
      breakdown: { scheduleMatch: 0, specialtyMatch: 0, commuteDistance: 0, payAlignment: 0, facilityCulture: 0 },
    };
  }

  // Hard filter: required certifications
  const missingCerts = (job.certificationsRequired || []).filter(
    (cert) =>
      !nurse.certifications.some(
        (nc) => nc.toLowerCase() === cert.toLowerCase()
      )
  );
  if (missingCerts.length > 0) {
    return {
      score: 0,
      disqualified: true,
      disqualifyReason: `Missing required: ${missingCerts.join(", ")}`,
      topMatch: "",
      topGap: `${missingCerts[0]} certification required`,
      breakdown: { scheduleMatch: 0, specialtyMatch: 0, commuteDistance: 0, payAlignment: 0, facilityCulture: 0 },
    };
  }

  let totalScore = 0;
  const matches: { category: string; points: number }[] = [];
  const gaps: { category: string; potential: number }[] = [];

  // ── 1. Schedule Match (25 pts) ──
  let schedulePoints = 0;
  if (nurse.schedulePreference && job.scheduleType) {
    if (nurse.schedulePreference.toLowerCase() === job.scheduleType.toLowerCase()) {
      schedulePoints = FIT_SCORE_WEIGHTS.scheduleMatch;
      matches.push({ category: "schedule match", points: schedulePoints });
    } else if (nurse.schedulePreference.toLowerCase() === "flexible") {
      // Flexible nurses get partial credit
      schedulePoints = Math.round(FIT_SCORE_WEIGHTS.scheduleMatch * 0.75);
      matches.push({ category: "schedule flexibility", points: schedulePoints });
    } else {
      gaps.push({ category: "schedule alignment", potential: FIT_SCORE_WEIGHTS.scheduleMatch });
    }
  } else {
    // No preference specified — give partial credit
    schedulePoints = Math.round(FIT_SCORE_WEIGHTS.scheduleMatch * 0.5);
  }
  totalScore += schedulePoints;

  // ── 2. Specialty Match (25 pts) ──
  let specialtyPoints = 0;
  if (job.specialty) {
    if (nurse.specialties.some((s) => s.toLowerCase() === job.specialty!.toLowerCase())) {
      specialtyPoints = FIT_SCORE_WEIGHTS.specialtyMatch;
      matches.push({ category: "specialty match", points: specialtyPoints });
    } else {
      // Check for related specialties — partial credit for clinical experience
      const hasAnyClinical = nurse.yearsOfExperience >= (job.experienceRange?.min || 0);
      if (hasAnyClinical && nurse.specialties.length > 0) {
        specialtyPoints = Math.round(FIT_SCORE_WEIGHTS.specialtyMatch * 0.3);
        matches.push({ category: "clinical experience", points: specialtyPoints });
      }
      gaps.push({ category: `${job.specialty} experience`, potential: FIT_SCORE_WEIGHTS.specialtyMatch - specialtyPoints });
    }
  } else {
    // No specialty required — full points
    specialtyPoints = FIT_SCORE_WEIGHTS.specialtyMatch;
    matches.push({ category: "specialty", points: specialtyPoints });
  }
  totalScore += specialtyPoints;

  // ── 3. Commute Distance (20 pts) ──
  let commutePoints = 0;
  if (nurse.locationState) {
    if (nurse.locationState === job.location.state) {
      // Same state — good match
      if (nurse.locationCity && job.location.city) {
        if (nurse.locationCity.toLowerCase() === job.location.city.toLowerCase()) {
          commutePoints = FIT_SCORE_WEIGHTS.commuteDistance;
          matches.push({ category: "same city", points: commutePoints });
        } else {
          // Same state, different city — decent match
          commutePoints = Math.round(FIT_SCORE_WEIGHTS.commuteDistance * 0.7);
          matches.push({ category: "nearby location", points: commutePoints });
        }
      } else {
        commutePoints = Math.round(FIT_SCORE_WEIGHTS.commuteDistance * 0.75);
        matches.push({ category: "same state", points: commutePoints });
      }
    } else {
      // Different state — low score
      commutePoints = Math.round(FIT_SCORE_WEIGHTS.commuteDistance * 0.2);
      gaps.push({ category: "closer location", potential: FIT_SCORE_WEIGHTS.commuteDistance - commutePoints });
    }
  } else {
    // No location set — partial credit
    commutePoints = Math.round(FIT_SCORE_WEIGHTS.commuteDistance * 0.5);
  }
  totalScore += commutePoints;

  // ── 4. Pay Alignment (15 pts) ──
  let payPoints = 0;
  if (nurse.desiredPayMin !== undefined && nurse.desiredPayMin > 0) {
    const jobMid = (job.payRange.min + job.payRange.max) / 2;
    const nurseMid = nurse.desiredPayMax
      ? (nurse.desiredPayMin + nurse.desiredPayMax) / 2
      : nurse.desiredPayMin;

    if (job.payRange.max >= nurse.desiredPayMin) {
      if (job.payRange.min >= nurse.desiredPayMin) {
        // Job pay fully meets or exceeds desired range
        payPoints = FIT_SCORE_WEIGHTS.payAlignment;
        matches.push({ category: "pay alignment", points: payPoints });
      } else {
        // Job range overlaps but doesn't fully meet — partial
        const overlap = (job.payRange.max - nurse.desiredPayMin) / (job.payRange.max - job.payRange.min);
        payPoints = Math.round(FIT_SCORE_WEIGHTS.payAlignment * Math.max(0.4, Math.min(overlap, 1)));
        matches.push({ category: "pay range overlap", points: payPoints });
      }
    } else {
      // Job max is below nurse minimum
      gaps.push({ category: "higher pay", potential: FIT_SCORE_WEIGHTS.payAlignment });
    }
  } else {
    // No pay preference — give partial credit
    payPoints = Math.round(FIT_SCORE_WEIGHTS.payAlignment * 0.5);
  }
  totalScore += payPoints;

  // ── 5. Facility Culture (15 pts) ──
  let culturePoints = 0;
  if (facility) {
    // Base culture score from star rating (0-10 pts of the 15)
    const ratingPortion = Math.round((facility.starRating / 5) * 10);

    // Culture preference match (0-5 pts of the 15)
    let prefMatch = 0;
    if (nurse.culturePreferences && nurse.culturePreferences.length > 0 && facility.culture) {
      const cultureLower = facility.culture.toLowerCase();
      const matched = nurse.culturePreferences.filter((pref) =>
        cultureLower.includes(pref.toLowerCase())
      );
      prefMatch = Math.round((matched.length / nurse.culturePreferences.length) * 5);
    } else {
      // No culture prefs set — give partial credit for the preference portion
      prefMatch = 3;
    }

    culturePoints = Math.min(ratingPortion + prefMatch, FIT_SCORE_WEIGHTS.facilityCulture);
    if (culturePoints >= 10) {
      matches.push({ category: "facility culture", points: culturePoints });
    } else {
      gaps.push({ category: "facility culture fit", potential: FIT_SCORE_WEIGHTS.facilityCulture - culturePoints });
    }
  } else {
    // No facility data — give partial credit
    culturePoints = Math.round(FIT_SCORE_WEIGHTS.facilityCulture * 0.5);
  }
  totalScore += culturePoints;

  const topMatch = matches.sort((a, b) => b.points - a.points)[0]?.category || "general qualifications";
  const topGap = gaps.sort((a, b) => b.potential - a.potential)[0]?.category || "";

  const topMatchText = `Great ${topMatch}`;
  const topGapText = topGap ? `${topGap.charAt(0).toUpperCase() + topGap.slice(1)} would boost your score` : "Strong overall match";

  return {
    score: Math.min(totalScore, 100),
    disqualified: false,
    topMatch: topMatchText,
    topGap: topGapText,
    breakdown: {
      scheduleMatch: schedulePoints,
      specialtyMatch: specialtyPoints,
      commuteDistance: commutePoints,
      payAlignment: payPoints,
      facilityCulture: culturePoints,
    },
  };
}
