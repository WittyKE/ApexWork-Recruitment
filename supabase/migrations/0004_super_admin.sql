-- Adds a super_admin role: full staff access plus the ability to manage
-- other staff (admin/manager/super_admin) accounts. Regular admins/managers
-- cannot create, edit, suspend or delete staff-level accounts — that's
-- enforced in the server actions (src/app/admin/users/actions.ts) and
-- mirrored here so is_staff() (used across RLS policies) recognizes it.

alter type public.app_role add value if not exists 'super_admin';
