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

const STATUS_STYLES: Record<JobStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  closed: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  archived: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export function JobsTable({ initialJobs }: { initialJobs: JobWithEmployer[] }) {
  const [jobs, setJobs] = React.useState(initialJobs);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [editingJob, setEditingJob] = React.useState<JobWithEmployer | null>(null);
  const [deletingJob, setDeletingJob] = React.useState<JobWithEmployer | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<JobWithEmployer[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const filtered = jobs.filter((j) => statusFilter === "all" || j.status === statusFilter);

  function handleAdd(values: AdminJobValues) {
    const newJob: JobWithEmployer = {
      id: `job-${Date.now()}`,
      employer_id: jobs[0]?.employer_id ?? "emp-1",
      title: values.title,
      slug: values.title.toLowerCase().replace(/\s+/g, "-"),
      category: values.category,
      employment_type: values.employmentType,
      location: values.location,
      is_remote: false,
      visa_sponsorship: values.visaSponsorship,
      description: "",
      requirements: null,
      benefits: null,
      status: values.status,
      published_at: values.status === "published" ? new Date().toISOString() : null,
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      employer: jobs[0]?.employer ?? { id: "emp-1", company_name: "ApexWork Demo Employer", industry: null, is_verified: true },
    };
    setJobs((prev) => [newJob, ...prev]);
    toast.success(`"${values.title}" was created.`);
  }

  function handleEdit(values: AdminJobValues) {
    if (!editingJob) return;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === editingJob.id
          ? {
              ...j,
              title: values.title,
              category: values.category,
              employment_type: values.employmentType,
              location: values.location,
              visa_sponsorship: values.visaSponsorship,
              status: values.status,
            }
          : j
      )
    );
    toast.success(`"${values.title}" was updated.`);
    setEditingJob(null);
  }

  function handleDelete() {
    if (!deletingJob) return;
    setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
    toast.success(`"${deletingJob.title}" was deleted.`);
    setDeletingJob(null);
  }

  function handleBulkDelete() {
    const ids = new Set(selectedRows.map((r) => r.id));
    setJobs((prev) => prev.filter((j) => !ids.has(j.id)));
    toast.success(`${ids.size} job(s) deleted.`);
    setBulkDeleteOpen(false);
  }

  function handleBulkStatus(status: JobStatus) {
    const ids = new Set(selectedRows.map((r) => r.id));
    setJobs((prev) => prev.map((j) => (ids.has(j.id) ? { ...j, status } : j)));
    toast.success(`${ids.size} job(s) marked as ${status}.`);
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
      cell: ({ row }) => <Badge className={STATUS_STYLES[row.original.status]}>{row.original.status}</Badge>,
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
          <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setBulkDeleteOpen(true)}>
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
              onSave={handleAdd}
              trigger={
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="size-4" /> Add New Job
                </Button>
              }
            />
          </>
        }
      />

      <JobFormDialog job={editingJob ?? undefined} open={!!editingJob} onOpenChange={(o) => !o && setEditingJob(null)} onSave={handleEdit} />

      <AlertDialog open={!!deletingJob} onOpenChange={(o) => !o && setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deletingJob?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this job listing. This action cannot be undone.</AlertDialogDescription>
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
            <AlertDialogDescription>This will permanently remove the selected job listings. This action cannot be undone.</AlertDialogDescription>
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
