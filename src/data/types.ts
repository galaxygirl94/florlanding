export interface JobListing {
  id: string;
  facilityId: string;
  facilityName: string;
  title: string;
  payRange: { min: number; max: number };
  payUnit: string;
  payExplained: string;
  type: string;
  hoursPerWeek?: number;
  location: { city: string; state: string };
  schedule: string;
  scheduleType: string;
  scheduleBadges: string[];
  licenseRequired: { type: string; state: string };
  certificationsRequired: string[];
  certificationsPreferred?: string[];
  preferredExperience?: string;
  drivingRequired: boolean;
  ehrSystem?: string;
  specialty?: string;
  facilityType?: string;
  union: boolean;
  unionName?: string;
  note?: string;
  experienceRange?: { min: number; max: number };
  questions: QAItem[];
  postedDate: string;
  weekends?: "Required" | "Optional" | "No Weekends";
  onCall?: "Yes" | "No" | "Optional";
  fitScore?: number;
  patientRatio?: string;
  patientRatioVerified?: boolean;
  signOnBonus?: number;
  loanForgiveness?: boolean;
  tuitionReimbursement?: boolean;
  relocationAssistance?: boolean;
  magnetDesignated?: boolean;
  remoteEligible?: boolean;
}

export interface QAItem {
  id: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
  askedDate: string;
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
  type: string;
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
  status: "applied" | "viewed" | "responded";
  appliedDate: string;
  lastUpdate: string;
}
