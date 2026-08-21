// Hand-written types mirroring supabase/migrations/*.sql.
// Regenerate with `supabase gen types typescript` once the project is linked
// for a fully generated Database type — these are kept in sync manually.

export type AppRole = "candidate" | "employer" | "admin" | "manager" | "super_admin";

export type CandidateType = "skilled" | "essential";

export type RightToWorkStatus =
  | "uk_citizen"
  | "settled_status"
  | "pre_settled_status"
  | "visa_holder"
  | "requires_sponsorship"
  | "other";

export type EssentialRoleType = "caregiver" | "security" | "gardener" | "general_labour";

export type JobCategory =
  | "au_pair"
  | "healthcare_caregiving"
  | "security"
  | "gardening_landscaping"
  | "it_technology"
  | "engineering"
  | "hospitality"
  | "construction"
  | "logistics_warehouse"
  | "administration"
  | "other";

export type EmploymentType = "full_time" | "part_time" | "contract" | "temporary" | "seasonal";

export type JobStatus = "draft" | "published" | "closed" | "archived";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interviewing"
  | "offered"
  | "hired"
  | "rejected"
  | "withdrawn";

export type ContactStatus = "new" | "in_progress" | "resolved";

export type LogSeverity = "info" | "warning" | "error";

export interface Profile {
  id: string;
  role: AppRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employer {
  id: string;
  profile_id: string;
  company_name: string;
  company_registration_number: string | null;
  industry: string | null;
  website: string | null;
  company_size: string | null;
  about: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  profile_id: string;
  candidate_type: CandidateType;
  headline: string | null;
  location: string | null;
  right_to_work_status: RightToWorkStatus | null;
  cv_url: string | null;
  cv_filename: string | null;
  certificate_urls: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface EssentialProfile {
  id: string;
  candidate_id: string;
  role_type: EssentialRoleType;
  care_certificate_status: string | null;
  nvq_level: string | null;
  driving_license: boolean | null;
  shift_availability: string[];
  sia_license_number: string | null;
  sia_cctv_endorsement: boolean | null;
  sia_license_expiry: string | null;
  equipment_experience: string | null;
  physical_availability: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuPairPreferences {
  gender: string;
  ageRange: string;
  region: string;
  languages: string[];
  languageLevel: string;
  food: string;
  smoking: string;
}

export interface AuPairListing {
  familyName: string;
  countryFlag: string;
  country: string;
  children: number[];
  startWindow: string;
  duration: string;
  languages: string[];
  occupation: string;
  highlight: string;
  familyDescription: string;
  uniqueExperience: string;
  preferences: AuPairPreferences;
  images: string[];
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  slug: string;
  category: JobCategory;
  employment_type: EmploymentType;
  location: string;
  is_remote: boolean;
  visa_sponsorship: boolean;
  description: string;
  requirements: string | null;
  benefits: string | null;
  status: JobStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  auPair?: AuPairListing;
}

export interface JobWithEmployer extends Job {
  employer: Pick<Employer, "id" | "company_name" | "industry" | "is_verified">;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  cover_note: string | null;
  employer_notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  severity: LogSeverity;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  au_pair: "Au Pair",
  healthcare_caregiving: "Healthcare & Caregiving",
  security: "Security",
  gardening_landscaping: "Gardening & Landscaping",
  it_technology: "IT & Technology",
  engineering: "Engineering",
  hospitality: "Hospitality",
  construction: "Construction",
  logistics_warehouse: "Logistics & Warehouse",
  administration: "Administration",
  other: "Other",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  contract: "Contract",
  temporary: "Temporary",
  seasonal: "Seasonal",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interviewing: "Interviewing",
  offered: "Offered",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function isJobAcceptingApplications(job: Pick<Job, "status" | "expires_at">): boolean {
  if (job.status !== "published") return false;
  if (job.expires_at && new Date(job.expires_at) < new Date()) return false;
  return true;
}

export const RIGHT_TO_WORK_LABELS: Record<RightToWorkStatus, string> = {
  uk_citizen: "UK Citizen",
  settled_status: "Settled Status",
  pre_settled_status: "Pre-Settled Status",
  visa_holder: "Visa Holder",
  requires_sponsorship: "Requires Sponsorship",
  other: "Other",
};
