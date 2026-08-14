"use client";

import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, ShieldCheck, ShieldX, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/admin/data-table";
import { EmployerDetailSheet } from "@/components/admin/employers/employer-detail-sheet";
import { cn } from "@/lib/utils";
import type { AdminEmployerRow } from "@/lib/data/admin/employers";
import type { JobWithEmployer } from "@/lib/supabase/types";
import { setEmployerVerified } from "@/app/admin/employers/actions";
import { useSyncedState } from "@/lib/hooks/use-synced-state";

export function EmployersTable({ initialEmployers, jobs }: { initialEmployers: AdminEmployerRow[]; jobs: JobWithEmployer[] }) {
  const [employers] = useSyncedState(initialEmployers);
  const [viewingEmployer, setViewingEmployer] = React.useState<AdminEmployerRow | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function handleToggleVerified(employer: AdminEmployerRow) {
    startTransition(async () => {
      const result = await setEmployerVerified(employer.id, !employer.is_verified);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  const columns: ColumnDef<AdminEmployerRow>[] = [
    {
      accessorKey: "company_name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Company <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.company_name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.contact_name} &middot; {row.original.contact_email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => <span className="text-sm">{row.original.industry || "—"}</span>,
    },
    {
      accessorKey: "company_size",
      header: "Size",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.company_size || "—"}</span>,
    },
    {
      accessorKey: "job_count",
      header: "Jobs Posted",
      cell: ({ row }) => <span className="text-sm">{row.original.job_count}</span>,
    },
    {
      accessorKey: "is_verified",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.is_verified
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400"
          }
        >
          {row.original.is_verified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employer = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewingEmployer(employer)}>
                  <Eye /> View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isPending} onClick={() => handleToggleVerified(employer)}>
                  {employer.is_verified ? (
                    <>
                      <ShieldX /> Unverify
                    </>
                  ) : (
                    <>
                      <ShieldCheck /> Verify
                    </>
                  )}
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
      <DataTable
        columns={columns}
        data={employers}
        searchPlaceholder="Search employers by company or contact..."
        exportFilename="employers"
        toolbar={
          <Link href="/admin/users?create=employer" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
            <UserPlus className="size-4" /> Add Employer
          </Link>
        }
      />

      <EmployerDetailSheet
        employer={viewingEmployer}
        jobs={jobs}
        open={!!viewingEmployer}
        onOpenChange={(open) => !open && setViewingEmployer(null)}
      />
    </>
  );
}
