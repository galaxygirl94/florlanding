// ─── Legacy types (used by existing job listings/seed data) ────────────────

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
  union: boolean;
  unionName?: string;
  note?: string;
  experienceRange?: { min: number; max: number };
  questions: QAItem[];
  postedDate: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
  askedDate: string;
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

// ─── Nurse profile (used by fit score + legacy profile page) ───────────────

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

// ─── DB row types (Supabase) ───────────────────────────────────────────────

export type AvailabilityType = "full-time" | "part-time" | "per-diem";
export type PreferredSetting = "PACE" | "FQHC" | "school district" | "home health" | "other";

export interface NurseProfileRow {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  years_experience: number;
  specialty: string;
  preferred_settings: PreferredSetting[];
  availability: AvailabilityType;
  license_number: string;
  license_state: string;
  license_verified: boolean;
  license_expires: string | null;
  license_status: string;
  discipline_flags: boolean;
  bio?: string;
  pslf_interest: boolean;
  desired_pay_min?: number;
  desired_pay_max?: number;
  location_state?: string;
  location_city?: string;
  willing_to_travel: boolean;
  is_test_profile: boolean;
}

export type OrgType = "PACE" | "FQHC" | "School District" | "Home Health" | "Other community health";

export interface EmployerProfileRow {
  id?: string;
  created_at?: string;
  org_name: string;
  org_type: OrgType;
  address: string;
  contact_name: string;
  contact_title?: string;
  phone: string;
  email: string;
  is_nonprofit: boolean;
  flor_mission_eligible: boolean;
  verification_doc_url?: string;
}

export type PayType = "hourly" | "salary";
export type JobStatus = "draft" | "published" | "closed";
export type EmploymentType = "full-time" | "part-time" | "per-diem";

export interface JobPostingRow {
  id?: string;
  created_at?: string;
  employer_id: string;
  title: string;
  specialty_required: string;
  employment_type: EmploymentType;
  openings_count: number;
  pay_min: number;
  pay_max: number;
  pay_type: PayType;
  pay_negotiable: boolean;
  caseload?: string;
  schedule?: string;
  weekend_required: boolean;
  on_call_required: boolean;
  ehr_system?: string;
  description?: string;
  certifications_required?: string[];
  experience_preferred?: string;
  pslf_eligible: boolean;
  status: JobStatus;
  location_city?: string;
  location_state?: string;
}

export type InterviewRequestStatus = "pending" | "confirmed" | "declined";

export interface InterviewRequestRow {
  id?: string;
  created_at?: string;
  job_id?: string;
  employer_id: string;
  nurse_id: string;
  status: InterviewRequestStatus;
  message?: string;
}

// ─── Fit score (new weights) ───────────────────────────────────────────────

export interface FitScoreResult {
  score: number;
  label: "Excellent Match" | "Good Match" | "Partial Match";
  breakdown: {
    specialty: number;
    setting: number;
    availability: number;
    location: number;
    ehr: number;
    pslf: number;
  };
}
