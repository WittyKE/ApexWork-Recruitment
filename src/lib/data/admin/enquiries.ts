import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockContactMessages } from "@/lib/mock-data";
import type { ContactMessage } from "@/lib/supabase/types";

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured) return mockContactMessages;
  const admin = createAdminClient();
  if (!admin) return mockContactMessages;

  const { data, error } = await admin.from("contact_messages").select("*").order("created_at", { ascending: false });

  if (error || !data) return mockContactMessages;
  return data;
}
