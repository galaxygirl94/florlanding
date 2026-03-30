import { FIT_SCORE_WEIGHTS, FIT_SCORE_LABELS } from "./fit-score-config";
import { JobListing, NurseProfile } from "@/data/types";

export interface FitScoreResult {
  score: number;
  label: "Excellent Match" | "Good Match" | "Partial Match";
  disqualified: boolean;
  disqualifyReason?: string;
  topMatch: string;
  topGap: string;
}

export function calculateFitScore(
  nurse: NurseProfile,
  job: JobListing
): FitScoreResult {
  function makeLabel(score: number): "Excellent Match" | "Good Match" | "Partial Match" {
    if (score >= FIT_SCORE_LABELS.excellent.min) return FIT_SCORE_LABELS.excellent.label;
    if (score >= FIT_SCORE_LABELS.good.min) return FIT_SCORE_LABELS.good.label;
    return FIT_SCORE_LABELS.partial.label;
  }

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
      label: "Partial Match",
      disqualified: true,
      disqualifyReason: `Requires ${job.licenseRequired.type} in ${job.location.state}`,
      topMatch: "",
      topGap: `${job.licenseRequired.type} license in ${job.location.state} required`,
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
      label: "Partial Match",
      disqualified: true,
      disqualifyReason: `Missing required: ${missingCerts.join(", ")}`,
      topMatch: "",
      topGap: `${missingCerts[0]} certification required`,
    };
  }

  let score = 0;
  const matches: { category: string; points: number }[] = [];
  const gaps: { category: string; potential: number }[] = [];

  // Specialty match (35 pts)
  if (job.specialty && nurse.specialties.some((s) => s.toLowerCase() === job.specialty!.toLowerCase())) {
    score += FIT_SCORE_WEIGHTS.specialtyMatch;
    matches.push({ category: "specialty match", points: FIT_SCORE_WEIGHTS.specialtyMatch });
  } else if (job.specialty) {
    gaps.push({ category: `${job.specialty} experience`, potential: FIT_SCORE_WEIGHTS.specialtyMatch });
  }

  // Availability / schedule (20 pts) — maps to scheduleType on old job listings
  if (nurse.schedulePreference && job.scheduleType) {
    if (nurse.schedulePreference.toLowerCase() === job.scheduleType.toLowerCase()) {
      score += FIT_SCORE_WEIGHTS.availabilityMatch;
      matches.push({ category: "availability match", points: FIT_SCORE_WEIGHTS.availabilityMatch });
    } else {
      gaps.push({ category: "schedule alignment", potential: FIT_SCORE_WEIGHTS.availabilityMatch });
    }
  } else {
    score += Math.round(FIT_SCORE_WEIGHTS.availabilityMatch * 0.5);
  }

  // Care setting (25 pts) — not directly available on old job listings; award partial
  score += Math.round(FIT_SCORE_WEIGHTS.careSettingMatch * 0.5);

  // Location proximity (15 pts)
  if (nurse.locationState === job.location.state) {
    score += FIT_SCORE_WEIGHTS.locationProximity;
    matches.push({ category: "location", points: FIT_SCORE_WEIGHTS.locationProximity });
  } else {
    gaps.push({ category: "closer location", potential: FIT_SCORE_WEIGHTS.locationProximity });
  }

  // EHR match (1 pt — informational only)
  if (job.ehrSystem && nurse.ehrExperience.some((e) => e.toLowerCase() === job.ehrSystem!.toLowerCase())) {
    score += FIT_SCORE_WEIGHTS.ehrMatch;
    matches.push({ category: "EHR familiarity", points: FIT_SCORE_WEIGHTS.ehrMatch });
  }

  // PSLF alignment (4 pts) — not on old job listings; skip
  const finalScore = Math.min(score, 100);
  const topMatch = matches.sort((a, b) => b.points - a.points)[0]?.category || "general qualifications";
  const topGap = gaps.sort((a, b) => b.potential - a.potential)[0]?.category || "";

  return {
    score: finalScore,
    label: makeLabel(finalScore),
    disqualified: false,
    topMatch: `Great ${topMatch}`,
    topGap: topGap
      ? `${topGap.charAt(0).toUpperCase() + topGap.slice(1)} would boost your score`
      : "Strong overall match",
  };
}
