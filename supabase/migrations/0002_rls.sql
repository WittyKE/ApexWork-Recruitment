-- Row Level Security policies for ApexWork Recruitment Agency
-- All tables are locked down by default; policies below grant the minimum
-- access each role needs. Service-role (used by server-side API routes with
-- SUPABASE_SERVICE_ROLE_KEY) bypasses RLS entirely, which is how the admin
-- panel and transactional-email triggers perform privileged operations.

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role in ('admin', 'manager') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.owned_employer_id()
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select id from public.employers where profile_id = auth.uid();
$$;

create or replace function public.owned_candidate_id()
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select id from public.candidates where profile_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.employers enable row level security;
alter table public.candidates enable row level security;
alter table public.essential_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------

create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_staff());

create policy "profiles_update_own_or_staff"
  on public.profiles for update
  using (id = auth.uid() or public.is_staff())
  with check (id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------------
-- EMPLOYERS
-- Company info is shown publicly alongside job listings, so SELECT is open.
-- ---------------------------------------------------------------------------

create policy "employers_select_public"
  on public.employers for select
  using (true);

create policy "employers_insert_own"
  on public.employers for insert
  with check (profile_id = auth.uid());

create policy "employers_update_own_or_staff"
  on public.employers for update
  using (profile_id = auth.uid() or public.is_staff())
  with check (profile_id = auth.uid() or public.is_staff());

create policy "employers_delete_staff"
  on public.employers for delete
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- CANDIDATES
-- Own profile always visible; employers may view candidates who applied to
-- one of their jobs; staff see everything.
-- ---------------------------------------------------------------------------

create policy "candidates_select_own_employer_or_staff"
  on public.candidates for select
  using (
    profile_id = auth.uid()
    or public.is_staff()
    or exists (
      select 1
      from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.candidate_id = candidates.id
        and j.employer_id = public.owned_employer_id()
    )
  );

create policy "candidates_insert_own"
  on public.candidates for insert
  with check (profile_id = auth.uid());

create policy "candidates_update_own_or_staff"
  on public.candidates for update
  using (profile_id = auth.uid() or public.is_staff())
  with check (profile_id = auth.uid() or public.is_staff());

create policy "candidates_delete_own_or_staff"
  on public.candidates for delete
  using (profile_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------------
-- ESSENTIAL PROFILES (mirrors candidates ownership)
-- ---------------------------------------------------------------------------

create policy "essential_profiles_select_own_employer_or_staff"
  on public.essential_profiles for select
  using (
    candidate_id = public.owned_candidate_id()
    or public.is_staff()
    or exists (
      select 1
      from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.candidate_id = essential_profiles.candidate_id
        and j.employer_id = public.owned_employer_id()
    )
  );

create policy "essential_profiles_insert_own"
  on public.essential_profiles for insert
  with check (candidate_id = public.owned_candidate_id());

create policy "essential_profiles_update_own_or_staff"
  on public.essential_profiles for update
  using (candidate_id = public.owned_candidate_id() or public.is_staff())
  with check (candidate_id = public.owned_candidate_id() or public.is_staff());

create policy "essential_profiles_delete_own_or_staff"
  on public.essential_profiles for delete
  using (candidate_id = public.owned_candidate_id() or public.is_staff());

-- ---------------------------------------------------------------------------
-- JOBS
-- Published jobs are public. Employers manage their own postings regardless
-- of status. Staff manage everything (moderation).
-- ---------------------------------------------------------------------------

create policy "jobs_select_published_or_owner_or_staff"
  on public.jobs for select
  using (
    status = 'published'
    or employer_id = public.owned_employer_id()
    or public.is_staff()
  );

create policy "jobs_insert_own_employer"
  on public.jobs for insert
  with check (employer_id = public.owned_employer_id() or public.is_staff());

create policy "jobs_update_own_or_staff"
  on public.jobs for update
  using (employer_id = public.owned_employer_id() or public.is_staff())
  with check (employer_id = public.owned_employer_id() or public.is_staff());

create policy "jobs_delete_own_or_staff"
  on public.jobs for delete
  using (employer_id = public.owned_employer_id() or public.is_staff());

-- ---------------------------------------------------------------------------
-- APPLICATIONS
-- ---------------------------------------------------------------------------

create policy "applications_select_candidate_employer_or_staff"
  on public.applications for select
  using (
    candidate_id = public.owned_candidate_id()
    or public.is_staff()
    or exists (
      select 1 from public.jobs j
      where j.id = applications.job_id
        and j.employer_id = public.owned_employer_id()
    )
  );

create policy "applications_insert_own_candidate"
  on public.applications for insert
  with check (candidate_id = public.owned_candidate_id());

create policy "applications_update_candidate_employer_or_staff"
  on public.applications for update
  using (
    candidate_id = public.owned_candidate_id()
    or public.is_staff()
    or exists (
      select 1 from public.jobs j
      where j.id = applications.job_id
        and j.employer_id = public.owned_employer_id()
    )
  )
  with check (
    candidate_id = public.owned_candidate_id()
    or public.is_staff()
    or exists (
      select 1 from public.jobs j
      where j.id = applications.job_id
        and j.employer_id = public.owned_employer_id()
    )
  );

create policy "applications_delete_staff"
  on public.applications for delete
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- CONTACT MESSAGES
-- Anyone (including anonymous visitors) can submit the contact form; only
-- staff can read/manage submissions.
-- ---------------------------------------------------------------------------

create policy "contact_messages_insert_anyone"
  on public.contact_messages for insert
  with check (true);

create policy "contact_messages_select_staff"
  on public.contact_messages for select
  using (public.is_staff());

create policy "contact_messages_update_staff"
  on public.contact_messages for update
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- AUDIT LOGS
-- Written only by the service role (server-side), readable by staff only.
-- ---------------------------------------------------------------------------

create policy "audit_logs_select_staff"
  on public.audit_logs for select
  using (public.is_staff());
