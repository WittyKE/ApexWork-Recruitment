import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";

/**
 * Server Supabase client for use in Server Components, Route Handlers and
 * Server Actions. Reads/writes the auth cookie via Next's cookies() API.
 * Returns null when Supabase isn't configured — callers should fall back to
 * mock data (see src/lib/data/*) in that case.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component with no response to write to —
          // safe to ignore because middleware refreshes the session anyway.
        }
      },
    },
  });
}
