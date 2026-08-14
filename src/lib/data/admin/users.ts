import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockAdminUsers, type AdminUserRow } from "@/lib/mock-data";

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  if (!isSupabaseConfigured) return mockAdminUsers;
  const admin = createAdminClient();
  if (!admin) return mockAdminUsers;

  const { data, error } = await admin
    .from("profiles")
    .select("id, full_name, email, role, is_active, avatar_url, updated_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return mockAdminUsers;

  return data.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    role: row.role,
    status: row.is_active ? "active" : "inactive",
    avatar_url: row.avatar_url,
    last_active: row.updated_at,
    created_at: row.created_at,
  }));
}
