"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert, CircleX, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import type { AdminAuditLogRow } from "@/lib/mock-data";

const SEVERITY_META: Record<AdminAuditLogRow["severity"], { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  warning: { icon: CircleAlert, className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  error: { icon: CircleX, className: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400" },
};

export function LogsTable({ initialLogs }: { initialLogs: AdminAuditLogRow[] }) {
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");
  const filtered = initialLogs.filter((l) => severityFilter === "all" || l.severity === severityFilter);

  const columns: ColumnDef<AdminAuditLogRow>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Timestamp <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
          {new Date(row.original.created_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      accessorKey: "actor",
      header: "Actor",
      cell: ({ row }) => <span className="font-medium">{row.original.actor}</span>,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.original.action}</code>,
    },
    {
      accessorKey: "entity_type",
      header: "Entity",
      cell: ({ row }) => <span className="text-sm text-muted-foreground capitalize">{row.original.entity_type}</span>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const meta = SEVERITY_META[row.original.severity];
        const Icon = meta.icon;
        return (
          <Badge className={`gap-1 capitalize ${meta.className}`}>
            <Icon className="size-3" />
            {row.original.severity}
          </Badge>
        );
      },
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.details}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered}
      searchPlaceholder="Search logs by actor, action or details..."
      exportFilename="audit-logs"
      toolbar={
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v ?? "all")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );
}
