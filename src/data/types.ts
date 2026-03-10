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
  location: { city: string; state: string; address?: string; zip?: string };
  schedule: string;
  scheduleType: string;
  scheduleBadges: string[];
  licenseRequired: { type: string; state: string };
  certificationsRequired: string[];
  certificationsPreferred?: string[];
  preferredExperience?: string;
  experienceRange?: { min: number; max: number };
  yearsSpecialtyRequired?: number;
  experienceStrict?: boolean;
  drivingRequired: boolean;
  ehrSystem?: string;
  specialty?: string;
  secondarySpecialty?: string;
  facilityType?: string;
  patientPopulation?: string;
  careSetting?: string;
  union: boolean;
  unionName?: string;
  note?: string;
  description?: string;
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
  status?: "active" | "paused" | "closed" | "draft";
  applicantCount?: number;
  facilityImage?: string;
  payHiddenElsewhere?: boolean;
  benefitTags?: string[];
  bilingualPayDifferential?: boolean;
  communityTravel?: boolean;
  newGradsWelcome?: boolean;
  tuitionPopover?: string;
  annualPayRange?: { min: number; max: number };
  payHidden?: boolean;
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
  zipCode?: string;
  licenses: { type: string; state: string; number?: string; verified: boolean; verificationStatus?: "active" | "inactive" | "expired" | "encumbered" | "not_found" | "pending" }[];
  certifications: string[];
  specialties: string[];
  yearsOfExperience: number;
  yearsSpecialty?: number;
  ehrExperience: string[];
  schedulePreference?: string;
  shiftPreferences?: string[];
  scheduleTypes?: string[];
  careSettings?: string[];
  patientPopulations?: string[];
  locationCity?: string;
  locationState?: string;
  maxCommuteMiles?: number;
  desiredPayMin?: number;
  desiredPayMax?: number;
  culturePreferences?: string[];
  unionPreference?: boolean;
  resumeUrl?: string;
  resumeFileName?: string;
  bio?: string;
  profileCompleted?: boolean;
}

export interface FacilityProfile {
  id: string;
  name: string;
  description: string;
  location: { city: string; state: string; address?: string; zip?: string };
  type: string;
  culture: string;
  ehrSystem?: string;
  starRating: number;
  reviewCount: number;
  reviews: FacilityReview[];
  logoUrl?: string;
  website?: string;
  headerImage?: string;
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
  nurseId?: string;
  nurseName?: string;
  nurseProfile?: NurseProfile;
  fitScore?: number;
  status: "applied" | "viewed" | "responded" | "new" | "reviewing" | "interview" | "offer" | "hired" | "passed";
  appliedDate: string;
  lastUpdate: string;
  note?: string;
}

export interface EmployerAccount {
  id: string;
  facilityId: string;
  email: string;
  name: string;
  role: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  nurseId: string;
  nurseName: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}
