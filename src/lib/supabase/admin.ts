import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";

/**
 * Privileged Supabase client using the service-role key. Bypasses RLS —
 * NEVER import this into a Client Component or expose it to the browser.
 * Used by admin-panel server actions, storage signed-URL generation, and
 * the auth trigger / audit-log writer.
 */
export function createAdminClient() {
  if (!isSupabaseConfigured || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createSupabaseClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
