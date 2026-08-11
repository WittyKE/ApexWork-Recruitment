"use client";

import * as React from "react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/admin/data-table";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/supabase/types";
import { applicationStatusColors } from "@/lib/mock-data";

export interface AdminApplicationRow {
  id: string;
  job_title: string;
  candidate_name: string;
  status: ApplicationStatus;
  applied_at: string;
}

export function ApplicationsTable({ initialApplications }: { initialApplications: AdminApplicationRow[] }) {
  const [applications, setApplications] = React.useState(initialApplications);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = applications.filter((a) => statusFilter === "all" || a.status === statusFilter);

  function handleStatusChange(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Application status updated to "${APPLICATION_STATUS_LABELS[status]}".`);
  }

  function handleDelete(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    toast.success("Application removed.");
  }

  const columns: ColumnDef<AdminApplicationRow>[] = [
    {
      accessorKey: "candidate_name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Candidate <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.original.candidate_name}</span>,
    },
    {
      accessorKey: "job_title",
      header: "Job",
      cell: ({ row }) => <span className="text-sm">{row.original.job_title}</span>,
    },
    {
      accessorKey: "applied_at",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Applied <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.applied_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge className={applicationStatusColors[row.original.status]}>{APPLICATION_STATUS_LABELS[row.original.status]}</Badge>
          <Select value={row.original.status} onValueChange={(v) => handleStatusChange(row.original.id, v as ApplicationStatus)}>
            <SelectTrigger className="h-7 w-8 border-none bg-transparent p-0 shadow-none [&>svg]:mx-auto [&_span]:hidden" aria-label="Change status" />
            <SelectContent>
              {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Delete application" />}>
              <Trash2 className="size-4 text-destructive" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the application record for {row.original.candidate_name}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original.id)}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered}
      searchPlaceholder="Search by candidate or job title..."
      exportFilename="applications"
      toolbar={
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
