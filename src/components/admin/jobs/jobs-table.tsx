"use client";

import * as React from "react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/admin/data-table";
import { JobFormDialog } from "@/components/admin/jobs/job-form-dialog";
import { EMPLOYMENT_TYPE_LABELS, JOB_CATEGORY_LABELS, type JobStatus, type JobWithEmployer } from "@/lib/supabase/types";
import type { AdminJobValues } from "@/lib/validations/admin-job";
import type { EmployerOption } from "@/lib/data/admin/jobs";
import { JOB_STATUS_STYLES } from "@/lib/admin/job-status";
import { useSyncedState } from "@/lib/hooks/use-synced-state";
import {
  bulkDeleteAdminJobs,
  bulkUpdateAdminJobStatus,
  createAdminJob,
  deleteAdminJob,
  updateAdminJob,
} from "@/app/admin/jobs/actions";

export function JobsTable({ initialJobs, employers }: { initialJobs: JobWithEmployer[]; employers: EmployerOption[] }) {
  const [jobs] = useSyncedState(initialJobs);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [editingJob, setEditingJob] = React.useState<JobWithEmployer | null>(null);
  const [deletingJob, setDeletingJob] = React.useState<JobWithEmployer | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<JobWithEmployer[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const filtered = jobs.filter((j) => statusFilter === "all" || j.status === statusFilter);

  function handleAdd(values: AdminJobValues) {
    startTransition(async () => {
      const result = await createAdminJob(values);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleEdit(values: AdminJobValues) {
    if (!editingJob) return;
    const jobId = editingJob.id;
    setEditingJob(null);
    startTransition(async () => {
      const result = await updateAdminJob(jobId, values);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleDelete() {
    if (!deletingJob) return;
    const jobId = deletingJob.id;
    setDeletingJob(null);
    startTransition(async () => {
      const result = await deleteAdminJob(jobId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleBulkDelete() {
    const ids = selectedRows.map((r) => r.id);
    setBulkDeleteOpen(false);
    startTransition(async () => {
      const result = await bulkDeleteAdminJobs(ids);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleBulkStatus(status: JobStatus) {
    const ids = selectedRows.map((r) => r.id);
    startTransition(async () => {
      const result = await bulkUpdateAdminJobStatus(ids, status);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  const columns: ColumnDef<JobWithEmployer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="size-4 rounded border-input"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="size-4 rounded border-input"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Job Title <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="flex items-center gap-1.5 font-medium">
            {row.original.title}
            {row.original.visa_sponsorship && <ShieldCheck className="size-3.5 text-emerald-500" />}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.employer.company_name}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary">{JOB_CATEGORY_LABELS[row.original.category]}</Badge>,
    },
    {
      accessorKey: "employment_type",
      header: "Type",
      cell: ({ row }) => <span className="text-sm">{EMPLOYMENT_TYPE_LABELS[row.original.employment_type]}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge className={JOB_STATUS_STYLES[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingJob(job)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeletingJob(job)}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {selectedRows.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-medium">{selectedRows.length} selected</span>
          <Select onValueChange={(v) => handleBulkStatus(v as JobStatus)}>
            <SelectTrigger className="h-8 w-44">
              <SelectValue placeholder="Change status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Mark Published</SelectItem>
              <SelectItem value="closed">Mark Closed</SelectItem>
              <SelectItem value="draft">Mark Draft</SelectItem>
              <SelectItem value="archived">Mark Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" className="gap-1.5" disabled={isPending} onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="size-3.5" /> Delete Selected
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search jobs by title..."
        exportFilename="jobs"
        onRowSelectionChange={setSelectedRows}
        toolbar={
          <>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <JobFormDialog
              employers={employers}
              onSave={handleAdd}
              trigger={
                <Button size="sm" className="gap-1.5" disabled={isPending}>
                  <PlusCircle className="size-4" /> Add New Job
                </Button>
              }
            />
          </>
        }
      />

      <JobFormDialog
        job={editingJob ?? undefined}
        employers={employers}
        open={!!editingJob}
        onOpenChange={(o) => !o && setEditingJob(null)}
        onSave={handleEdit}
      />

      <AlertDialog open={!!deletingJob} onOpenChange={(o) => !o && setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deletingJob?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this job listing and any linked applications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedRows.length} job(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected job listings and any linked applications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
