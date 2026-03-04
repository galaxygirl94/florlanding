import { FIT_SCORE_WEIGHTS } from "./fit-score-config";
import { JobListing, NurseProfile } from "@/data/types";

export interface FitScoreResult {
  score: number;
  disqualified: boolean;
  disqualifyReason?: string;
  topMatch: string;
  topGap: string;
}

export function calculateFitScore(
  nurse: NurseProfile,
  job: JobListing
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

  // Years of experience (20 pts)
  if (job.experienceRange) {
    const nurseYears = nurse.yearsOfExperience;
    const { min, max } = job.experienceRange;
    if (nurseYears >= min) {
      const ratio = max > min ? Math.min((nurseYears - min) / (max - min), 1) : 1;
      const pts = Math.round(FIT_SCORE_WEIGHTS.yearsOfExperience * (0.5 + 0.5 * ratio));
      score += pts;
      matches.push({ category: "experience level", points: pts });
    } else {
      gaps.push({ category: "more experience", potential: FIT_SCORE_WEIGHTS.yearsOfExperience });
    }
  } else {
    score += FIT_SCORE_WEIGHTS.yearsOfExperience;
    matches.push({ category: "experience", points: FIT_SCORE_WEIGHTS.yearsOfExperience });
  }

  // Schedule preference (20 pts)
  if (nurse.schedulePreference && job.scheduleType) {
    if (nurse.schedulePreference.toLowerCase() === job.scheduleType.toLowerCase()) {
      score += FIT_SCORE_WEIGHTS.schedulePreference;
      matches.push({ category: "schedule preference", points: FIT_SCORE_WEIGHTS.schedulePreference });
    } else {
      gaps.push({ category: "schedule alignment", potential: FIT_SCORE_WEIGHTS.schedulePreference });
    }
  } else {
    score += Math.round(FIT_SCORE_WEIGHTS.schedulePreference * 0.5);
  }

  // Bonus certifications (10 pts)
  const bonusCerts = nurse.certifications.filter(
    (c) => !(job.certificationsRequired || []).some((rc) => rc.toLowerCase() === c.toLowerCase())
  );
  if (bonusCerts.length > 0) {
    const pts = Math.min(bonusCerts.length * 3, FIT_SCORE_WEIGHTS.certificationsBonus);
    score += pts;
    matches.push({ category: "extra certifications", points: pts });
  } else {
    gaps.push({ category: "additional certifications", potential: FIT_SCORE_WEIGHTS.certificationsBonus });
  }

  // Location proximity (10 pts) — simplified for MVP
  if (nurse.locationState === job.location.state) {
    score += FIT_SCORE_WEIGHTS.locationProximity;
    matches.push({ category: "location", points: FIT_SCORE_WEIGHTS.locationProximity });
  } else {
    gaps.push({ category: "closer location", potential: FIT_SCORE_WEIGHTS.locationProximity });
  }

  // Union preference (4 pts)
  if (nurse.unionPreference !== undefined) {
    if (nurse.unionPreference === job.union) {
      score += FIT_SCORE_WEIGHTS.unionPreference;
      matches.push({ category: "union preference", points: FIT_SCORE_WEIGHTS.unionPreference });
    }
  } else {
    score += Math.round(FIT_SCORE_WEIGHTS.unionPreference * 0.5);
  }

  // EHR match (1 pt — informational only)
  if (job.ehrSystem && nurse.ehrExperience.some((e) => e.toLowerCase() === job.ehrSystem!.toLowerCase())) {
    score += FIT_SCORE_WEIGHTS.ehrMatch;
    matches.push({ category: "EHR familiarity", points: FIT_SCORE_WEIGHTS.ehrMatch });
  }

  const topMatch = matches.sort((a, b) => b.points - a.points)[0]?.category || "general qualifications";
  const topGap = gaps.sort((a, b) => b.potential - a.potential)[0]?.category || "";

  const topMatchText = `Great ${topMatch}`;
  const topGapText = topGap ? `${topGap.charAt(0).toUpperCase() + topGap.slice(1)} would boost your score` : "Strong overall match";

  return {
    score: Math.min(score, 100),
    disqualified: false,
    topMatch: topMatchText,
    topGap: topGapText,
  };
}
