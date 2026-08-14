import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface StaffActor {
  id: string;
  email: string;
}

/**
 * Re-verifies the caller is a logged-in admin/manager from inside a Server
 * Action itself. src/proxy.ts only gates page navigation — every mutating
 * admin action must independently confirm the actor, since actions are
 * reachable as their own POST endpoint regardless of which page rendered them.
 */
export async function requireStaffActor(): Promise<StaffActor | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "manager"].includes(profile.role)) return null;

  return { id: user.id, email: user.email ?? "" };
}
