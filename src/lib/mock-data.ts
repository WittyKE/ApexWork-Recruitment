// Realistic mock data used whenever Supabase isn't configured (see
// src/lib/env.ts#isSupabaseConfigured), so the site and admin panel are
// fully interactive immediately after `npm install && npm run dev` with no
// backend set up. Once real env vars are supplied, src/lib/data/* switches
// to live Supabase queries automatically.

import type {
  Application,
  ApplicationStatus,
  Candidate,
  Employer,
  Job,
  JobWithEmployer,
} from "@/lib/supabase/types";

export const mockEmployers: Employer[] = [
  {
    id: "emp-1",
    profile_id: "profile-emp-1",
    company_name: "Huntingdon Care Partners",
    company_registration_number: "12345678",
    industry: "Healthcare",
    website: "https://example.com",
    company_size: "51-200",
    about: "A CQC-registered care provider operating across Cambridgeshire.",
    is_verified: true,
    created_at: "2025-11-02T09:00:00Z",
    updated_at: "2025-11-02T09:00:00Z",
  },
  {
    id: "emp-2",
    profile_id: "profile-emp-2",
    company_name: "Sentinel Guarding Ltd",
    company_registration_number: "87654321",
    industry: "Security Services",
    website: "https://example.com",
    company_size: "201-500",
    about: "SIA-approved contractor providing manned guarding across the East of England.",
    is_verified: true,
    created_at: "2025-10-18T09:00:00Z",
    updated_at: "2025-10-18T09:00:00Z",
  },
  {
    id: "emp-3",
    profile_id: "profile-emp-3",
    company_name: "Fenland Grounds & Gardens",
    company_registration_number: "19283746",
    industry: "Landscaping",
    website: "https://example.com",
    company_size: "11-50",
    about: "Commercial grounds maintenance contractor serving Cambridgeshire and Bedfordshire.",
    is_verified: false,
    created_at: "2025-09-30T09:00:00Z",
    updated_at: "2025-09-30T09:00:00Z",
  },
  {
    id: "emp-4",
    profile_id: "profile-emp-4",
    company_name: "Northbridge Fintech",
    company_registration_number: "55667788",
    industry: "Financial Technology",
    website: "https://example.com",
    company_size: "51-200",
    about: "A licensed payments platform building infrastructure for cross-border transfers.",
    is_verified: true,
    created_at: "2025-08-11T09:00:00Z",
    updated_at: "2025-08-11T09:00:00Z",
  },
  {
    id: "emp-5",
    profile_id: "profile-emp-5",
    company_name: "Ouse Valley NHS Trust Partners",
    company_registration_number: "44556677",
    industry: "Healthcare",
    website: "https://example.com",
    company_size: "500+",
    about: "Supporting NHS-adjacent staffing across residential and community care settings.",
    is_verified: true,
    created_at: "2025-07-22T09:00:00Z",
    updated_at: "2025-07-22T09:00:00Z",
  },
];

const employerById = (id: string) => mockEmployers.find((e) => e.id === id)!;

export const mockJobs: Job[] = [
  {
    id: "job-1",
    employer_id: "emp-1",
    title: "Live-in Caregiver",
    slug: "live-in-caregiver-huntingdon",
    category: "healthcare_caregiving",
    employment_type: "full_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "Provide compassionate live-in care to elderly clients across Cambridgeshire, supporting daily living, medication management and companionship. Accommodation and meals provided during rotations.",
    requirements:
      "Care Certificate preferred (training provided if not held), full UK driving licence, right to work in the UK or eligibility for Health & Care Worker visa sponsorship.",
    benefits: "Visa sponsorship, accommodation during rotation, paid training, DBS check funded.",
    status: "published",
    published_at: "2026-07-20T09:00:00Z",
    expires_at: null,
    created_at: "2026-07-20T09:00:00Z",
    updated_at: "2026-07-20T09:00:00Z",
  },
  {
    id: "job-2",
    employer_id: "emp-2",
    title: "SIA Licensed Security Guard",
    slug: "sia-security-guard-huntingdon",
    category: "security",
    employment_type: "full_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "Static and mobile security cover for a commercial business park, including CCTV monitoring, access control and incident reporting. Rotating shift pattern including nights and weekends.",
    requirements: "Active SIA Door Supervisor or Security Guarding licence required, CCTV endorsement preferred.",
    benefits: "Uniform provided, shift allowance, visa sponsorship available.",
    status: "published",
    published_at: "2026-07-28T09:00:00Z",
    expires_at: null,
    created_at: "2026-07-28T09:00:00Z",
    updated_at: "2026-07-28T09:00:00Z",
  },
  {
    id: "job-3",
    employer_id: "emp-3",
    title: "Estate Gardener",
    slug: "estate-gardener-cambridgeshire",
    category: "gardening_landscaping",
    employment_type: "full_time",
    location: "Cambridgeshire, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Maintain grounds, lawns and planting for a portfolio of commercial estates and business parks. Ride-on mower and strimmer experience an advantage. Van and tools supplied.",
    requirements: "Experience with groundcare machinery, physically fit, full UK driving licence preferred.",
    benefits: "Company van, tools provided, overtime available in summer season.",
    status: "published",
    published_at: "2026-08-01T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-01T09:00:00Z",
    updated_at: "2026-08-01T09:00:00Z",
  },
  {
    id: "job-4",
    employer_id: "emp-4",
    title: "Senior .NET Engineer",
    slug: "senior-dotnet-engineer-remote-uk",
    category: "it_technology",
    employment_type: "full_time",
    location: "Remote (UK)",
    is_remote: true,
    visa_sponsorship: true,
    description:
      "Join a fintech engineering team building resilient payment infrastructure processing millions of cross-border transactions monthly. Fully remote within the UK, with quarterly team weeks in Cambridge.",
    requirements: "5+ years C#/.NET, Azure, event-driven architecture, strong written communication skills.",
    benefits: "Skilled Worker visa sponsorship, private healthcare, 28 days annual leave, remote-first.",
    status: "published",
    published_at: "2026-06-15T09:00:00Z",
    expires_at: null,
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-06-15T09:00:00Z",
  },
  {
    id: "job-5",
    employer_id: "emp-5",
    title: "Registered General Nurse",
    slug: "registered-general-nurse-peterborough",
    category: "healthcare_caregiving",
    employment_type: "full_time",
    location: "Peterborough, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "NMC-registered nurse required for a busy residential care home providing nursing and dementia care. Sponsorship available under the Health & Care Worker visa route for internationally qualified nurses.",
    requirements: "Active NMC PIN or eligibility for NMC registration, right to work or eligible for sponsorship.",
    benefits: "Visa sponsorship, relocation support, NMC revalidation support, pension scheme.",
    status: "published",
    published_at: "2026-05-30T09:00:00Z",
    expires_at: null,
    created_at: "2026-05-30T09:00:00Z",
    updated_at: "2026-05-30T09:00:00Z",
  },
  {
    id: "job-6",
    employer_id: "emp-2",
    title: "Door Supervisor (Nights)",
    slug: "door-supervisor-nights-cambridge",
    category: "security",
    employment_type: "part_time",
    location: "Cambridge, UK",
    is_remote: false,
    visa_sponsorship: false,
    description: "Weekend night cover for licensed venues in Cambridge city centre. Flexible shifts.",
    requirements: "Active SIA Door Supervisor licence, conflict management experience.",
    benefits: "Flexible rota, uniform provided.",
    status: "published",
    published_at: "2026-08-05T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-05T09:00:00Z",
    updated_at: "2026-08-05T09:00:00Z",
  },
  {
    id: "job-7",
    employer_id: "emp-1",
    title: "Domiciliary Care Assistant",
    slug: "domiciliary-care-assistant-st-neots",
    category: "healthcare_caregiving",
    employment_type: "part_time",
    location: "St Neots, UK",
    is_remote: false,
    visa_sponsorship: false,
    description: "Visiting care rounds supporting clients with personal care, meal prep and companionship.",
    requirements: "NVQ Level 2 in Health & Social Care preferred, own transport required.",
    benefits: "Flexible shifts, paid training.",
    status: "published",
    published_at: "2026-08-08T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-08T09:00:00Z",
    updated_at: "2026-08-08T09:00:00Z",
  },
  {
    id: "job-8",
    employer_id: "emp-4",
    title: "Warehouse Operative",
    slug: "warehouse-operative-huntingdon",
    category: "logistics_warehouse",
    employment_type: "full_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: false,
    description: "Picking, packing and goods-in duties in a fast-paced distribution centre near Ermine Business Park.",
    requirements: "Forklift licence an advantage but not essential, physically fit.",
    benefits: "Shift allowance, on-site parking, staff discount.",
    status: "published",
    published_at: "2026-08-09T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-09T09:00:00Z",
    updated_at: "2026-08-09T09:00:00Z",
  },
];

export const mockJobsWithEmployer: JobWithEmployer[] = mockJobs.map((job) => ({
  ...job,
  employer: {
    id: employerById(job.employer_id).id,
    company_name: employerById(job.employer_id).company_name,
    industry: employerById(job.employer_id).industry,
    is_verified: employerById(job.employer_id).is_verified,
  },
}));

export const mockCandidates: Candidate[] = [
  {
    id: "cand-1",
    profile_id: "profile-cand-1",
    candidate_type: "skilled",
    headline: "Senior Backend Engineer",
    location: "Manchester, UK",
    right_to_work_status: "uk_citizen",
    cv_url: null,
    cv_filename: "j-osei-cv.pdf",
    certificate_urls: [],
    is_available: true,
    created_at: "2026-07-01T09:00:00Z",
    updated_at: "2026-07-01T09:00:00Z",
  },
  {
    id: "cand-2",
    profile_id: "profile-cand-2",
    candidate_type: "essential",
    headline: "Experienced Caregiver",
    location: "Huntingdon, UK",
    right_to_work_status: "requires_sponsorship",
    cv_url: null,
    cv_filename: null,
    certificate_urls: [],
    is_available: true,
    created_at: "2026-07-10T09:00:00Z",
    updated_at: "2026-07-10T09:00:00Z",
  },
  {
    id: "cand-3",
    profile_id: "profile-cand-3",
    candidate_type: "essential",
    headline: "SIA Licensed Security Officer",
    location: "Peterborough, UK",
    right_to_work_status: "uk_citizen",
    cv_url: null,
    cv_filename: null,
    certificate_urls: [],
    is_available: true,
    created_at: "2026-07-15T09:00:00Z",
    updated_at: "2026-07-15T09:00:00Z",
  },
];

export const mockApplications: (Application & { job_title: string; candidate_name: string })[] = [
  { id: "app-1", job_id: "job-1", candidate_id: "cand-2", status: "shortlisted", cover_note: null, employer_notes: null, applied_at: "2026-07-25T09:00:00Z", updated_at: "2026-07-26T09:00:00Z", job_title: "Live-in Caregiver", candidate_name: "Amara N." },
  { id: "app-2", job_id: "job-2", candidate_id: "cand-3", status: "interviewing", cover_note: null, employer_notes: null, applied_at: "2026-07-30T09:00:00Z", updated_at: "2026-08-01T09:00:00Z", job_title: "SIA Licensed Security Guard", candidate_name: "Marek K." },
  { id: "app-3", job_id: "job-4", candidate_id: "cand-1", status: "under_review", cover_note: null, employer_notes: null, applied_at: "2026-08-02T09:00:00Z", updated_at: "2026-08-02T09:00:00Z", job_title: "Senior .NET Engineer", candidate_name: "James O." },
  { id: "app-4", job_id: "job-5", candidate_id: "cand-2", status: "submitted", cover_note: null, employer_notes: null, applied_at: "2026-08-05T09:00:00Z", updated_at: "2026-08-05T09:00:00Z", job_title: "Registered General Nurse", candidate_name: "Amara N." },
  { id: "app-5", job_id: "job-3", candidate_id: "cand-3", status: "rejected", cover_note: null, employer_notes: null, applied_at: "2026-07-18T09:00:00Z", updated_at: "2026-07-22T09:00:00Z", job_title: "Estate Gardener", candidate_name: "Marek K." },
  { id: "app-6", job_id: "job-7", candidate_id: "cand-2", status: "hired", cover_note: null, employer_notes: null, applied_at: "2026-06-20T09:00:00Z", updated_at: "2026-07-01T09:00:00Z", job_title: "Domiciliary Care Assistant", candidate_name: "Amara N." },
];

export const applicationStatusColors: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  under_review: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  shortlisted: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  interviewing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  offered: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  withdrawn: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
};

// ---------------------------------------------------------------------------
// Admin panel mock datasets
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  id: string;
  full_name: string;
  email: string;
  role: "candidate" | "employer" | "admin" | "manager";
  status: "active" | "inactive";
  avatar_url: string | null;
  last_active: string;
  created_at: string;
}

export const mockAdminUsers: AdminUserRow[] = [
  { id: "u-1", full_name: "James Okafor", email: "james.okafor@example.com", role: "candidate", status: "active", avatar_url: null, last_active: "2026-08-09T14:20:00Z", created_at: "2026-05-12T09:00:00Z" },
  { id: "u-2", full_name: "Amara Nwosu", email: "amara.nwosu@example.com", role: "candidate", status: "active", avatar_url: null, last_active: "2026-08-10T08:05:00Z", created_at: "2026-05-20T09:00:00Z" },
  { id: "u-3", full_name: "Marek Kowalski", email: "marek.kowalski@example.com", role: "candidate", status: "active", avatar_url: null, last_active: "2026-08-08T19:40:00Z", created_at: "2026-06-01T09:00:00Z" },
  { id: "u-4", full_name: "Priya Sharma", email: "priya.sharma@huntingdoncare.example", role: "employer", status: "active", avatar_url: null, last_active: "2026-08-10T07:15:00Z", created_at: "2026-04-18T09:00:00Z" },
  { id: "u-5", full_name: "Tom Fletcher", email: "tom.fletcher@sentinelguarding.example", role: "employer", status: "active", avatar_url: null, last_active: "2026-08-09T16:00:00Z", created_at: "2026-03-30T09:00:00Z" },
  { id: "u-6", full_name: "Grace Muthoni", email: "grace.muthoni@example.com", role: "candidate", status: "inactive", avatar_url: null, last_active: "2026-06-15T09:00:00Z", created_at: "2026-02-10T09:00:00Z" },
  { id: "u-7", full_name: "David Lin", email: "david.lin@northbridge.example", role: "employer", status: "active", avatar_url: null, last_active: "2026-08-07T11:30:00Z", created_at: "2026-02-22T09:00:00Z" },
  { id: "u-8", full_name: "Sarah Bennett", email: "sarah.bennett@apexworkrecruitment.co.uk", role: "admin", status: "active", avatar_url: null, last_active: "2026-08-10T09:00:00Z", created_at: "2025-12-01T09:00:00Z" },
  { id: "u-9", full_name: "Michael Adeyemi", email: "michael.adeyemi@apexworkrecruitment.co.uk", role: "manager", status: "active", avatar_url: null, last_active: "2026-08-10T08:45:00Z", created_at: "2026-01-15T09:00:00Z" },
  { id: "u-10", full_name: "Elena Popescu", email: "elena.popescu@example.com", role: "candidate", status: "active", avatar_url: null, last_active: "2026-08-06T13:10:00Z", created_at: "2026-06-25T09:00:00Z" },
];

export interface AdminAuditLogRow {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  severity: "info" | "warning" | "error";
  created_at: string;
  details: string;
}

export const mockAuditLogs: AdminAuditLogRow[] = [
  { id: "log-1", actor: "Sarah Bennett", action: "job.published", entity_type: "job", severity: "info", created_at: "2026-08-10T08:12:00Z", details: "Published job 'Warehouse Operative'" },
  { id: "log-2", actor: "system", action: "auth.login_failed", entity_type: "auth", severity: "warning", created_at: "2026-08-10T07:58:00Z", details: "3 failed login attempts for tom.fletcher@sentinelguarding.example" },
  { id: "log-3", actor: "Michael Adeyemi", action: "candidate.verified", entity_type: "candidate", severity: "info", created_at: "2026-08-09T18:30:00Z", details: "Right to work verified for Amara Nwosu" },
  { id: "log-4", actor: "system", action: "email.delivery_failed", entity_type: "email", severity: "error", created_at: "2026-08-09T15:02:00Z", details: "Resend API returned 422 for application confirmation to invalid address" },
  { id: "log-5", actor: "Priya Sharma", action: "job.created", entity_type: "job", severity: "info", created_at: "2026-08-09T10:45:00Z", details: "Created draft job 'Night Care Assistant'" },
  { id: "log-6", actor: "Sarah Bennett", action: "user.role_changed", entity_type: "user", severity: "warning", created_at: "2026-08-08T16:20:00Z", details: "Changed role for Grace Muthoni to inactive" },
  { id: "log-7", actor: "system", action: "storage.upload", entity_type: "cv", severity: "info", created_at: "2026-08-08T11:05:00Z", details: "CV uploaded by candidate James Okafor (482KB, pdf)" },
  { id: "log-8", actor: "system", action: "api.rate_limited", entity_type: "api", severity: "error", created_at: "2026-08-07T22:14:00Z", details: "Rate limit hit on /api/jobs/search from 203.0.113.44" },
];

export const revenueTrend = [
  { month: "Feb", placements: 14, revenue: 42000 },
  { month: "Mar", placements: 18, revenue: 54000 },
  { month: "Apr", placements: 22, revenue: 66000 },
  { month: "May", placements: 19, revenue: 57000 },
  { month: "Jun", placements: 27, revenue: 81000 },
  { month: "Jul", placements: 31, revenue: 93000 },
  { month: "Aug", placements: 24, revenue: 72000 },
];

export const userGrowthTrend = [
  { month: "Feb", candidates: 120, employers: 8 },
  { month: "Mar", candidates: 165, employers: 11 },
  { month: "Apr", candidates: 210, employers: 14 },
  { month: "May", candidates: 268, employers: 19 },
  { month: "Jun", candidates: 340, employers: 24 },
  { month: "Jul", candidates: 412, employers: 29 },
  { month: "Aug", candidates: 468, employers: 33 },
];

export const jobsByCategory = [
  { category: "Healthcare & Caregiving", count: 38 },
  { category: "Security", count: 24 },
  { category: "IT & Technology", count: 17 },
  { category: "Gardening & Landscaping", count: 12 },
  { category: "Logistics & Warehouse", count: 15 },
  { category: "Engineering", count: 9 },
];

export const adminKpis = {
  totalRevenue: { value: 465000, change: 12.4 },
  activeUsers: { value: 501, change: 8.9 },
  conversions: { value: 146, change: 5.2 },
  bounceRate: { value: 34.1, change: -3.6 },
};
