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
  status: "draft" | "published" | "closed" | "filled";
  employerId?: string;
  description?: string;
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
  availability?: string;
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

export type ApplicationStatus =
  | "applied"
  | "viewed"
  | "screening"
  | "interview_requested"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_extended"
  | "offer_accepted"
  | "offer_declined"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  facilityName: string;
  nurseId: string;
  nurseName: string;
  nurseSpecialty: string;
  nurseYearsExperience: number;
  nurseCertifications: string[];
  nurseAvailability?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdate: string;
  message?: string;
}

export type InterviewType = "phone" | "video" | "in_person";
export type InterviewStatus = "requested" | "confirmed" | "declined" | "completed" | "cancelled" | "rescheduled";
export type InterviewRecommendation = "move_forward" | "reject" | "hold";

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  nurseId: string;
  nurseName: string;
  employerId: string;
  facilityName: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: {
    rating: number;
    notes: string;
    recommendation: InterviewRecommendation;
  };
  createdAt: string;
}

export type UserRole = "nurse" | "employer" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  facilityId?: string;
  facilityName?: string;
  approved?: boolean;
}

export type PipelineStage = "applied" | "screening" | "interview" | "offer" | "hired";

export interface Notification {
  id: string;
  userId: string;
  type: "application" | "interview_request" | "interview_confirmed" | "interview_declined" | "offer" | "status_change" | "new_applicant";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  facilityId: string;
  facilityName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  approved: boolean;
  createdAt: string;
}
