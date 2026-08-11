-- Storage buckets for CV and certificate uploads.
-- Both buckets are PRIVATE — files are only ever served via short-lived
-- signed URLs generated server-side (see src/lib/supabase/storage.ts).
-- Upload path convention: {bucket}/{candidate_id}/{filename}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('cvs', 'cvs', false, 10485760, array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  ('certificates', 'certificates', false, 10485760, array[
    'application/pdf',
    'image/png',
    'image/jpeg'
  ])
on conflict (id) do nothing;

-- Candidates can upload into their own folder.
create policy "cv_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = public.owned_candidate_id()::text
  );

create policy "certificate_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = public.owned_candidate_id()::text
  );

-- Candidates can read/replace/delete their own files. Employers who have a
-- matching application, and staff, can also read (signed URL generation on
-- the server still goes through the service role, but this keeps direct
-- client access correctly scoped as a defense-in-depth measure).
create policy "cv_select_owner_employer_or_staff"
  on storage.objects for select
  using (
    bucket_id = 'cvs'
    and (
      (storage.foldername(name))[1] = public.owned_candidate_id()::text
      or public.is_staff()
      or exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where a.candidate_id::text = (storage.foldername(name))[1]
          and j.employer_id = public.owned_employer_id()
      )
    )
  );

create policy "certificate_select_owner_employer_or_staff"
  on storage.objects for select
  using (
    bucket_id = 'certificates'
    and (
      (storage.foldername(name))[1] = public.owned_candidate_id()::text
      or public.is_staff()
      or exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where a.candidate_id::text = (storage.foldername(name))[1]
          and j.employer_id = public.owned_employer_id()
      )
    )
  );

create policy "cv_update_own"
  on storage.objects for update
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = public.owned_candidate_id()::text)
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = public.owned_candidate_id()::text);

create policy "certificate_update_own"
  on storage.objects for update
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = public.owned_candidate_id()::text)
  with check (bucket_id = 'certificates' and (storage.foldername(name))[1] = public.owned_candidate_id()::text);

create policy "cv_delete_own_or_staff"
  on storage.objects for delete
  using (
    bucket_id = 'cvs'
    and ((storage.foldername(name))[1] = public.owned_candidate_id()::text or public.is_staff())
  );

create policy "certificate_delete_own_or_staff"
  on storage.objects for delete
  using (
    bucket_id = 'certificates'
    and ((storage.foldername(name))[1] = public.owned_candidate_id()::text or public.is_staff())
  );
