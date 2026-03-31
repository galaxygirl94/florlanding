export type ShiftType = "Days" | "Nights" | "Evenings" | "Rotating";
export type EmploymentType = "Full Time" | "Part Time" | "Per Diem";
export type FacilityType =
  | "Acute Care Hospital"
  | "Hospital"
  | "Psychiatric Hospital"
  | "Community Health/Nonprofit"
  | "Outpatient clinic"
  | "SNF/Long-term care"
  | "Rehab"
  | "Home health"
  | "School";
export type WeekendsRequirement = "none" | "optional" | "required";
export type OnCallRequirement = "none" | "optional" | "required";

export interface QAItem {
  id: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
  askedDate: string;
}

export interface JobListing {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: FacilityType;
  title: string;
  specialty: string;
  payMin?: number;
  payMax?: number;
  payUnit: string;
  payExplained: string;
  nightDifferential?: number;
  weekendDifferential?: number;
  signOnBonus?: number;
  loanForgivenessEligible?: boolean;
  employmentType: EmploymentType;
  shift: ShiftType;
  hoursPerWeek?: number;
  weekends: WeekendsRequirement;
  onCall: OnCallRequirement;
  location: { city: string; state: string };
  schedule: string;
  scheduleBadges: string[];
  licenseRequired: { type: string; state: string };
  certificationsRequired: string[];
  certificationsPreferred?: string[];
  preferredExperience?: string;
  experienceRange?: { min: number; max: number };
  drivingRequired: boolean;
  ehrSystem?: string;
  union: boolean;
  unionName?: string;
  verified?: boolean;
  questions: QAItem[];
  postedDate: string;
  // Legacy compat
  payRange?: { min: number; max: number };
  scheduleType?: string;
  type?: string;
  note?: string;
}

export interface NurseProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  licenses: { type: string; state: string; number?: string; verified: boolean }[];
  certifications: string[];
  specialties: string[];
  yearsOfExperience: number;
  ehrExperience: string[];
  schedulePreference?: string;
  locationCity?: string;
  locationState?: string;
  maxCommute?: number;
  payExpectation?: number;
  culturePreferences?: string[];
  unionPreference?: boolean;
  resumeUrl?: string;
  resumeFileName?: string;
  bio?: string;
}

export interface FacilityProfile {
  id: string;
  name: string;
  description: string;
  location: { city: string; state: string; address?: string };
  type: FacilityType;
  culture: string;
  ehrSystem?: string;
  starRating: number;
  reviewCount: number;
  reviews: FacilityReview[];
  logoUrl?: string;
  website?: string;
}

export interface FacilityReview {
  id: string;
  authorInitials: string;
  role: string;
  rating: number;
  date: string;
  text: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  facilityName: string;
  location: string;
  payDisplay: string;
  appliedDaysAgo: number;
  florFit: number;
  status: "applied" | "under-review" | "viewed" | "interview" | "offer";
  statusMessage: string;
  needsAttention: boolean;
}
