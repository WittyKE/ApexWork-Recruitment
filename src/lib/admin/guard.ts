import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/types";

export interface StaffActor {
  id: string;
  email: string;
  role: AppRole;
}

const STAFF_ROLES: AppRole[] = ["admin", "manager", "super_admin"];

/**
 * Re-verifies the caller is a logged-in staff member (admin/manager/super_admin)
 * from inside a Server Action itself. src/proxy.ts only gates page navigation —
 * every mutating admin action must independently confirm the actor, since
 * actions are reachable as their own POST endpoint regardless of which page
 * rendered them.
 */
export async function requireStaffActor(): Promise<StaffActor | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !STAFF_ROLES.includes(profile.role)) return null;

  return { id: user.id, email: user.email ?? "", role: profile.role };
}

/**
 * Same as requireStaffActor, but only accepts the super_admin role. Use this
 * for actions that manage other staff accounts (creating/editing/suspending/
 * deleting admins and managers) — regular admins/managers must not be able
 * to alter each other's or their own staff-level access.
 */
export async function requireSuperAdmin(): Promise<StaffActor | null> {
  const actor = await requireStaffActor();
  if (!actor || actor.role !== "super_admin") return null;
  return actor;
}
