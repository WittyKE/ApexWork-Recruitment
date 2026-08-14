// Realistic mock data used whenever Supabase isn't configured (see
// src/lib/env.ts#isSupabaseConfigured), so the site and admin panel are
// fully interactive immediately after `npm install && npm run dev` with no
// backend set up. Once real env vars are supplied, src/lib/data/* switches
// to live Supabase queries automatically.

import type {
  Application,
  ApplicationStatus,
  Candidate,
  ContactMessage,
  Employer,
  Job,
  JobWithEmployer,
  RightToWorkStatus,
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
  {
    id: "job-9",
    employer_id: "emp-5",
    title: "Night Care Assistant",
    slug: "night-care-assistant-peterborough",
    category: "healthcare_caregiving",
    employment_type: "full_time",
    location: "Peterborough, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "Overnight care assistant required for a residential care home, supporting residents with personal care, mobility and night-time checks. Waking nights rota.",
    requirements: "Care experience preferred (training provided), enhanced DBS, right to work or eligible for sponsorship.",
    benefits: "Visa sponsorship, night shift allowance, paid breaks, uniform provided.",
    status: "published",
    published_at: "2026-08-11T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-11T09:00:00Z",
    updated_at: "2026-08-11T09:00:00Z",
  },
  {
    id: "job-10",
    employer_id: "emp-1",
    title: "Dementia Care Support Worker",
    slug: "dementia-care-support-worker-cambridge",
    category: "healthcare_caregiving",
    employment_type: "full_time",
    location: "Cambridge, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "Support residents living with dementia in a specialist care unit, delivering person-centred activities, personal care and mealtime support alongside a close-knit team.",
    requirements: "Dementia care experience preferred, Care Certificate or willingness to complete one, patience and empathy.",
    benefits: "Visa sponsorship, paid induction and dementia training, pension scheme.",
    status: "published",
    published_at: "2026-08-12T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-12T09:00:00Z",
    updated_at: "2026-08-12T09:00:00Z",
  },
  {
    id: "job-11",
    employer_id: "emp-2",
    title: "Retail Security Officer",
    slug: "retail-security-officer-huntingdon",
    category: "security",
    employment_type: "full_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Front-of-house security presence for a busy retail park, deterring theft, supporting customer service and responding to incidents alongside store management.",
    requirements: "Active SIA Security Guarding licence, good communication skills, customer-facing experience an advantage.",
    benefits: "Uniform provided, weekly pay, on-site parking.",
    status: "published",
    published_at: "2026-08-03T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-03T09:00:00Z",
    updated_at: "2026-08-03T09:00:00Z",
  },
  {
    id: "job-12",
    employer_id: "emp-2",
    title: "Mobile Security Patrol Officer",
    slug: "mobile-security-patrol-officer-cambridgeshire",
    category: "security",
    employment_type: "full_time",
    location: "Cambridgeshire, UK",
    is_remote: false,
    visa_sponsorship: true,
    description:
      "Vehicle-based patrol officer covering a portfolio of commercial and industrial sites across Cambridgeshire, carrying out alarm response, lock-up/unlock and incident reporting.",
    requirements: "Active SIA licence, full UK driving licence, minimum 1 year manned guarding experience.",
    benefits: "Company vehicle for patrol shifts, visa sponsorship available, overtime available.",
    status: "published",
    published_at: "2026-08-06T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-06T09:00:00Z",
    updated_at: "2026-08-06T09:00:00Z",
  },
  {
    id: "job-13",
    employer_id: "emp-2",
    title: "Event Security Steward",
    slug: "event-security-steward-cambridge",
    category: "security",
    employment_type: "temporary",
    location: "Cambridge, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Seasonal event security stewarding for concerts, festivals and conferences across Cambridge venues. Crowd management, access control and incident reporting duties.",
    requirements: "Active SIA Door Supervisor licence, flexible availability including evenings and weekends.",
    benefits: "Flexible shifts, weekly pay, event travel expenses covered.",
    status: "published",
    published_at: "2026-08-10T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-10T09:00:00Z",
    updated_at: "2026-08-10T09:00:00Z",
  },
  {
    id: "job-14",
    employer_id: "emp-3",
    title: "Landscape Gardener",
    slug: "landscape-gardener-st-neots",
    category: "gardening_landscaping",
    employment_type: "full_time",
    location: "St Neots, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Join a small landscaping crew delivering garden design installs, planting schemes and hard landscaping for residential and commercial clients across Bedfordshire.",
    requirements: "Landscaping or horticulture experience, full UK driving licence, comfortable with manual work.",
    benefits: "Company van and tools, overtime in peak season, training towards NVQ Horticulture.",
    status: "published",
    published_at: "2026-08-02T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-02T09:00:00Z",
    updated_at: "2026-08-02T09:00:00Z",
  },
  {
    id: "job-15",
    employer_id: "emp-3",
    title: "Grounds Maintenance Operative",
    slug: "grounds-maintenance-operative-huntingdon",
    category: "gardening_landscaping",
    employment_type: "full_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Grass cutting, hedge trimming, litter picking and general grounds upkeep across a portfolio of business parks and housing developments in Huntingdonshire.",
    requirements: "Groundcare machinery experience preferred, physically fit, reliable and punctual.",
    benefits: "Tools and PPE provided, overtime available, permanent contract after probation.",
    status: "published",
    published_at: "2026-08-07T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-07T09:00:00Z",
    updated_at: "2026-08-07T09:00:00Z",
  },
  {
    id: "job-16",
    employer_id: "emp-3",
    title: "Horticultural Assistant",
    slug: "horticultural-assistant-cambridgeshire",
    category: "gardening_landscaping",
    employment_type: "part_time",
    location: "Cambridgeshire, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Support a walled kitchen garden and ornamental grounds team with planting, pruning, propagation and seasonal maintenance for a private estate.",
    requirements: "Some horticultural knowledge or a keen interest in gardening, willingness to learn.",
    benefits: "Flexible part-time hours, on-site training, produce discount.",
    status: "published",
    published_at: "2026-08-04T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-04T09:00:00Z",
    updated_at: "2026-08-04T09:00:00Z",
  },
  {
    id: "job-17",
    employer_id: "emp-3",
    title: "Tree Surgeon's Assistant",
    slug: "tree-surgeons-assistant-peterborough",
    category: "gardening_landscaping",
    employment_type: "full_time",
    location: "Peterborough, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Assist a qualified arborist with tree felling, pruning, chipping and site clearance work across residential and council contracts. Ground-level support role.",
    requirements: "Physically fit, comfortable working outdoors in all weather, full UK driving licence preferred.",
    benefits: "PPE and chainsaw ticket training provided, van travel, overtime available.",
    status: "published",
    published_at: "2026-08-13T09:00:00Z",
    expires_at: null,
    created_at: "2026-08-13T09:00:00Z",
    updated_at: "2026-08-13T09:00:00Z",
  },
  {
    id: "job-18",
    employer_id: "emp-1",
    title: "Bank Care Assistant (Weekends)",
    slug: "bank-care-assistant-weekends-huntingdon",
    category: "healthcare_caregiving",
    employment_type: "part_time",
    location: "Huntingdon, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Weekend bank care assistant cover for a residential care home, supporting the permanent team with personal care and mealtime assistance as needed.",
    requirements: "Care experience preferred, flexibility to cover weekend shifts at short notice.",
    benefits: "Flexible bank shifts, weekly pay.",
    status: "closed",
    published_at: "2026-05-01T09:00:00Z",
    expires_at: "2026-07-15T23:59:00Z",
    created_at: "2026-05-01T09:00:00Z",
    updated_at: "2026-07-16T08:00:00Z",
  },
  {
    id: "job-19",
    employer_id: "emp-2",
    title: "CCTV Control Room Operator",
    slug: "cctv-control-room-operator-cambridge",
    category: "security",
    employment_type: "full_time",
    location: "Cambridge, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Monitor a multi-site CCTV network from a central control room, liaising with mobile patrols and site security teams and logging incidents.",
    requirements: "Active SIA CCTV (Public Space Surveillance) licence, control room experience preferred.",
    benefits: "Shift allowance, indoor working environment, uniform provided.",
    status: "closed",
    published_at: "2026-04-10T09:00:00Z",
    expires_at: "2026-06-30T23:59:00Z",
    created_at: "2026-04-10T09:00:00Z",
    updated_at: "2026-07-01T08:00:00Z",
  },
  {
    id: "job-20",
    employer_id: "emp-3",
    title: "Seasonal Grounds Assistant",
    slug: "seasonal-grounds-assistant-cambridgeshire",
    category: "gardening_landscaping",
    employment_type: "seasonal",
    location: "Cambridgeshire, UK",
    is_remote: false,
    visa_sponsorship: false,
    description:
      "Spring and summer seasonal role supporting grass cutting, planting and grounds tidy-up across a portfolio of commercial sites. Fixed-term contract.",
    requirements: "Physically fit, available for the full spring/summer season, groundcare experience an advantage.",
    benefits: "Tools provided, overtime available during peak season.",
    status: "closed",
    published_at: "2026-03-01T09:00:00Z",
    expires_at: "2026-07-31T23:59:00Z",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-08-01T08:00:00Z",
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

export interface AdminApplicationRow extends Application {
  job_title: string;
  employer_company_name: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  certificate_urls: string[];
  right_to_work_status: RightToWorkStatus | null;
}

export const mockApplications: AdminApplicationRow[] = [
  { id: "app-1", job_id: "job-1", candidate_id: "cand-2", status: "shortlisted", cover_note: "I have 4 years of live-in care experience and am available to start immediately.", employer_notes: null, applied_at: "2026-07-25T09:00:00Z", updated_at: "2026-07-26T09:00:00Z", job_title: "Live-in Caregiver", employer_company_name: "Huntingdon Care Partners", candidate_name: "Amara Nwosu", candidate_email: "amara.nwosu@example.com", candidate_phone: "+44 7700 900123", cv_url: null, cv_filename: null, certificate_urls: [], right_to_work_status: "requires_sponsorship" },
  { id: "app-2", job_id: "job-2", candidate_id: "cand-3", status: "interviewing", cover_note: "Active SIA Door Supervisor licence, 6 years in manned guarding.", employer_notes: "Strong interview, referencing in progress.", applied_at: "2026-07-30T09:00:00Z", updated_at: "2026-08-01T09:00:00Z", job_title: "SIA Licensed Security Guard", employer_company_name: "Sentinel Guarding Ltd", candidate_name: "Marek Kowalski", candidate_email: "marek.kowalski@example.com", candidate_phone: "+44 7700 900456", cv_url: null, cv_filename: null, certificate_urls: [], right_to_work_status: "uk_citizen" },
  { id: "app-3", job_id: "job-4", candidate_id: "cand-1", status: "under_review", cover_note: "Attached CV covers 7 years of backend + platform engineering.", employer_notes: null, applied_at: "2026-08-02T09:00:00Z", updated_at: "2026-08-02T09:00:00Z", job_title: "Senior .NET Engineer", employer_company_name: "Northbridge Fintech", candidate_name: "James Okafor", candidate_email: "james.okafor@example.com", candidate_phone: "+44 7700 900789", cv_url: "cand-1/1753000000000-j-osei-cv.pdf", cv_filename: "j-osei-cv.pdf", certificate_urls: [], right_to_work_status: "uk_citizen" },
  { id: "app-4", job_id: "job-5", candidate_id: "cand-2", status: "submitted", cover_note: null, employer_notes: null, applied_at: "2026-08-05T09:00:00Z", updated_at: "2026-08-05T09:00:00Z", job_title: "Registered General Nurse", employer_company_name: "Ouse Valley NHS Trust Partners", candidate_name: "Amara Nwosu", candidate_email: "amara.nwosu@example.com", candidate_phone: "+44 7700 900123", cv_url: null, cv_filename: null, certificate_urls: [], right_to_work_status: "requires_sponsorship" },
  { id: "app-5", job_id: "job-3", candidate_id: "cand-3", status: "rejected", cover_note: null, employer_notes: "Role filled internally before interview stage.", applied_at: "2026-07-18T09:00:00Z", updated_at: "2026-07-22T09:00:00Z", job_title: "Estate Gardener", employer_company_name: "Fenland Grounds & Gardens", candidate_name: "Marek Kowalski", candidate_email: "marek.kowalski@example.com", candidate_phone: "+44 7700 900456", cv_url: null, cv_filename: null, certificate_urls: ["cand-3/sia-licence.pdf"], right_to_work_status: "uk_citizen" },
  { id: "app-6", job_id: "job-7", candidate_id: "cand-2", status: "hired", cover_note: null, employer_notes: "Started 1 July, onboarding complete.", applied_at: "2026-06-20T09:00:00Z", updated_at: "2026-07-01T09:00:00Z", job_title: "Domiciliary Care Assistant", employer_company_name: "Huntingdon Care Partners", candidate_name: "Amara Nwosu", candidate_email: "amara.nwosu@example.com", candidate_phone: "+44 7700 900123", cv_url: null, cv_filename: null, certificate_urls: [], right_to_work_status: "requires_sponsorship" },
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

export const mockContactMessages: ContactMessage[] = [
  { id: "msg-1", name: "Grace Muthoni", email: "grace.muthoni@example.com", phone: "+44 7700 900321", subject: "Question about visa sponsorship", message: "Hi, I'm a registered nurse based in Kenya. Do any of your healthcare roles offer Health & Care Worker visa sponsorship, and what documents would I need to apply?", status: "new", created_at: "2026-08-12T10:15:00Z" },
  { id: "msg-2", name: "Tom Fletcher", email: "tom.fletcher@sentinelguarding.example", phone: "+44 7700 900654", subject: "Bulk hiring for new contract", message: "We've just won a new site contract in Cambridge and need to hire 12 SIA-licensed security officers within a month. Can someone from your team call me to discuss a bulk placement package?", status: "in_progress", created_at: "2026-08-11T14:40:00Z" },
  { id: "msg-3", name: "Elena Popescu", email: "elena.popescu@example.com", phone: null, subject: "Unable to upload CV", message: "I tried submitting my CV through the skilled worker application form twice but it keeps failing at the upload step. Could you let me know if there's a file size or format limit?", status: "new", created_at: "2026-08-10T09:05:00Z" },
  { id: "msg-4", name: "David Lin", email: "david.lin@northbridge.example", phone: "+44 7700 900987", subject: "Employer account verification", message: "We registered an employer account last week for Northbridge Fintech but it still shows as unverified on our postings. What's needed to complete verification?", status: "resolved", created_at: "2026-08-05T11:30:00Z" },
  { id: "msg-5", name: "Sarah Ibbotson", email: "sarah.ibbotson@example.com", phone: "+44 7700 900222", subject: "General enquiry about essential roles", message: "Do you place gardeners on a seasonal, part-time basis, or only full-time contracts? I'm looking for spring/summer work only.", status: "resolved", created_at: "2026-07-29T16:00:00Z" },
];

export const mockEmployerContacts: Record<string, { contact_name: string; contact_email: string }> = {
  "emp-1": { contact_name: "Priya Sharma", contact_email: "priya.sharma@huntingdoncare.example" },
  "emp-2": { contact_name: "Tom Fletcher", contact_email: "tom.fletcher@sentinelguarding.example" },
  "emp-3": { contact_name: "Owen Marsh", contact_email: "owen.marsh@fenlandgrounds.example" },
  "emp-4": { contact_name: "David Lin", contact_email: "david.lin@northbridge.example" },
  "emp-5": { contact_name: "Helen Ackroyd", contact_email: "helen.ackroyd@ousevalleynhs.example" },
};

// ---------------------------------------------------------------------------
// Admin panel mock datasets
// ---------------------------------------------------------------------------

export interface AdminUserRow {
  id: string;
  full_name: string;
  email: string;
  role: "candidate" | "employer" | "admin" | "manager" | "super_admin";
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
  jobsApplied: { value: 146, change: 12.4 },
  activeUsers: { value: 501, change: 8.9 },
  conversions: { value: 146, change: 5.2 },
  bounceRate: { value: 34.1, change: -3.6 },
};
