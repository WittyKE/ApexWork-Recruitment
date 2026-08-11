-- Optional local/demo seed data. Safe to run repeatedly against a fresh
-- Supabase project after the migrations. Creates one demo employer and a
-- handful of published jobs so /jobs has content before real employers sign up.
--
-- NOTE: This does not create an auth.users row (that must go through
-- Supabase Auth). Run this only in local/dev projects, or adapt the
-- profile_id below to a real user id from auth.users.

do $$
declare
  demo_profile_id uuid := '00000000-0000-0000-0000-000000000001';
  demo_employer_id uuid;
begin
  if not exists (select 1 from public.profiles where id = demo_profile_id) then
    insert into public.profiles (id, role, full_name, email, phone)
    values (demo_profile_id, 'employer', 'ApexWork Demo Employer', 'demo-employer@apexwork.example', '+447446364856');
  end if;

  if not exists (select 1 from public.employers where profile_id = demo_profile_id) then
    insert into public.employers (profile_id, company_name, industry, website, company_size, is_verified, about)
    values (
      demo_profile_id,
      'Huntingdon Care Partners',
      'Healthcare',
      'https://example.com',
      '51-200',
      true,
      'A CQC-registered care provider operating across Cambridgeshire.'
    )
    returning id into demo_employer_id;
  else
    select id into demo_employer_id from public.employers where profile_id = demo_profile_id;
  end if;

  insert into public.jobs (employer_id, title, slug, category, employment_type, location, visa_sponsorship, description, requirements, status, published_at)
  values
    (demo_employer_id, 'Live-in Caregiver', 'live-in-caregiver-huntingdon', 'healthcare_caregiving', 'full_time', 'Huntingdon, UK', true,
     'Provide compassionate live-in care to elderly clients across Cambridgeshire, supporting daily living, medication and companionship.',
     'Care Certificate preferred, full UK driving licence, right to work in the UK.', 'published', now()),
    (demo_employer_id, 'SIA Licensed Security Guard', 'sia-security-guard-huntingdon', 'security', 'full_time', 'Huntingdon, UK', true,
     'Static and mobile security cover for a commercial business park, including CCTV monitoring and access control.',
     'Active SIA licence required, CCTV endorsement preferred.', 'published', now()),
    (demo_employer_id, 'Estate Gardener', 'estate-gardener-cambridgeshire', 'gardening_landscaping', 'full_time', 'Cambridgeshire, UK', false,
     'Maintain grounds, lawns and planting for a portfolio of commercial estates. Ride-on mower and strimmer experience an advantage.',
     'Experience with groundcare machinery, physically fit, driving licence preferred.', 'published', now()),
    (demo_employer_id, 'Senior .NET Engineer', 'senior-dotnet-engineer-remote-uk', 'it_technology', 'full_time', 'Remote (UK)', true,
     'Join a fintech engineering team building payment infrastructure. Visa sponsorship available for the right candidate.',
     '5+ years C#/.NET, Azure, strong communication skills.', 'published', now()),
    (demo_employer_id, 'Registered General Nurse', 'registered-general-nurse-peterborough', 'healthcare_caregiving', 'full_time', 'Peterborough, UK', true,
     'NMC-registered nurse for a busy residential care home. Sponsorship available under the Health & Care Worker visa.',
     'Active NMC PIN, right to work or eligible for sponsorship.', 'published', now())
  on conflict (slug) do nothing;
end $$;
