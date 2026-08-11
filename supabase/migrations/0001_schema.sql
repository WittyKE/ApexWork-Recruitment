-- ApexWork Recruitment Agency — Core schema
-- Requires: Supabase project with the pgcrypto/uuid-ossp extensions (enabled by default on Supabase).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('candidate', 'employer', 'admin', 'manager');

create type public.candidate_type as enum ('skilled', 'essential');

create type public.right_to_work_status as enum (
  'uk_citizen',
  'settled_status',
  'pre_settled_status',
  'visa_holder',
  'requires_sponsorship',
  'other'
);

create type public.essential_role_type as enum ('caregiver', 'security', 'gardener', 'general_labour');

create type public.job_category as enum (
  'healthcare_caregiving',
  'security',
  'gardening_landscaping',
  'it_technology',
  'engineering',
  'hospitality',
  'construction',
  'logistics_warehouse',
  'administration',
  'other'
);

create type public.employment_type as enum ('full_time', 'part_time', 'contract', 'temporary', 'seasonal');

create type public.job_status as enum ('draft', 'published', 'closed', 'archived');

create type public.application_status as enum (
  'submitted',
  'under_review',
  'shortlisted',
  'interviewing',
  'offered',
  'hired',
  'rejected',
  'withdrawn'
);

create type public.contact_status as enum ('new', 'in_progress', 'resolved');

create type public.log_severity as enum ('info', 'warning', 'error');

-- ---------------------------------------------------------------------------
-- PROFILES  (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'candidate',
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with role + profile info for candidates, employers, and staff.';

-- ---------------------------------------------------------------------------
-- EMPLOYERS
-- ---------------------------------------------------------------------------

create table public.employers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  company_name text not null,
  company_registration_number text,
  industry text,
  website text,
  company_size text,
  about text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CANDIDATES
-- ---------------------------------------------------------------------------

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  candidate_type public.candidate_type not null,
  headline text,
  location text,
  right_to_work_status public.right_to_work_status,
  target_salary_min integer,
  target_salary_max integer,
  cv_url text,
  cv_filename text,
  certificate_urls text[] default '{}',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index candidates_type_idx on public.candidates (candidate_type);

-- ---------------------------------------------------------------------------
-- ESSENTIAL WORKER PROFILES (structured, role-specific fields)
-- ---------------------------------------------------------------------------

create table public.essential_profiles (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null unique references public.candidates (id) on delete cascade,
  role_type public.essential_role_type not null,

  -- Caregiver
  care_certificate_status text,
  nvq_level text,
  driving_license boolean,
  shift_availability text[] default '{}',

  -- Security guard
  sia_license_number text,
  sia_cctv_endorsement boolean,
  sia_license_expiry date,

  -- Gardener / general labour
  equipment_experience text,
  physical_availability text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index essential_profiles_role_idx on public.essential_profiles (role_type);

-- ---------------------------------------------------------------------------
-- JOBS
-- ---------------------------------------------------------------------------

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers (id) on delete cascade,
  title text not null,
  slug text not null unique,
  category public.job_category not null,
  employment_type public.employment_type not null,
  location text not null,
  is_remote boolean not null default false,
  visa_sponsorship boolean not null default false,
  description text not null,
  requirements text,
  benefits text,
  status public.job_status not null default 'draft',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_status_idx on public.jobs (status);
create index jobs_category_idx on public.jobs (category);
create index jobs_employer_idx on public.jobs (employer_id);
create index jobs_visa_idx on public.jobs (visa_sponsorship);

-- ---------------------------------------------------------------------------
-- APPLICATIONS
-- ---------------------------------------------------------------------------

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  status public.application_status not null default 'submitted',
  cover_note text,
  employer_notes text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create index applications_job_idx on public.applications (job_id);
create index applications_candidate_idx on public.applications (candidate_id);
create index applications_status_idx on public.applications (status);

-- ---------------------------------------------------------------------------
-- CONTACT MESSAGES  (public contact form submissions)
-- ---------------------------------------------------------------------------

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AUDIT LOGS (admin panel activity stream)
-- ---------------------------------------------------------------------------

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_email text,
  action text not null,
  entity_type text,
  entity_id text,
  severity public.log_severity not null default 'info',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_severity_idx on public.audit_logs (severity);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.employers
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.candidates
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.essential_profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.jobs
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth.users row is created.
-- The role/full_name are passed in via signUp() options.data, defaulting
-- sensibly if omitted.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'candidate'),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
