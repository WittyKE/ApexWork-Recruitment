"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";

/**
 * Browser Supabase client for use in Client Components.
 * Returns null when Supabase isn't configured yet so callers can gracefully
 * fall back to a "not connected" state instead of throwing at import time.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
}
