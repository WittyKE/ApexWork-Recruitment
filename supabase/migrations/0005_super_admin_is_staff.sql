-- Split into its own migration because a freshly added enum value
-- (0004_super_admin.sql) can't be referenced until that migration's
-- transaction has committed.

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role in ('admin', 'manager', 'super_admin') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role = 'super_admin' from public.profiles where id = auth.uid()), false);
$$;
