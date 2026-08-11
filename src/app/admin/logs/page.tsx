import type { Metadata } from "next";
import { LogsTable } from "@/components/admin/logs/logs-table";
import { getAuditLogs } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Audit Logs" };

export default async function AdminLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Track user actions, API activity and system events across the platform.
        </p>
      </div>
      <LogsTable initialLogs={logs} />
    </div>
  );
}
