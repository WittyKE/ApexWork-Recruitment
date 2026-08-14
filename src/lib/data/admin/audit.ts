import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockAuditLogs, type AdminAuditLogRow } from "@/lib/mock-data";

export async function getAuditLogs(): Promise<AdminAuditLogRow[]> {
  if (!isSupabaseConfigured) return mockAuditLogs;
  const admin = createAdminClient();
  if (!admin) return mockAuditLogs;

  const { data, error } = await admin
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return mockAuditLogs;

  return data.map((row) => ({
    id: row.id,
    actor: row.actor_email ?? "system",
    action: row.action,
    entity_type: row.entity_type ?? "—",
    severity: row.severity,
    created_at: row.created_at,
    details: JSON.stringify(row.metadata ?? {}),
  }));
}
