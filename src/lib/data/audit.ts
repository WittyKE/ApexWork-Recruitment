import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LogSeverity } from "@/lib/supabase/types";

interface LogAdminActionParams {
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  severity?: LogSeverity;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit trail writer for admin-panel actions. Never throws —
 * a logging failure must not break the mutation that triggered it. No-ops in
 * demo mode (no Supabase configured).
 */
export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;

  try {
    await admin.from("audit_logs").insert({
      actor_id: params.actorId,
      actor_email: params.actorEmail,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      severity: params.severity ?? "info",
      metadata: params.metadata ?? {},
    });
  } catch {
    // Swallow — auditing is best-effort, not a mutation dependency.
  }
}
