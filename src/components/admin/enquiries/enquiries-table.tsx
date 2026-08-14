"use client";

import * as React from "react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
import { EnquiryDetailSheet } from "@/components/admin/enquiries/enquiry-detail-sheet";
import type { ContactMessage, ContactStatus } from "@/lib/supabase/types";
import { CONTACT_STATUS_LABELS, contactStatusColors } from "@/lib/admin/contact-status";
import { deleteEnquiry, updateEnquiryStatus } from "@/app/admin/enquiries/actions";
import { useSyncedState } from "@/lib/hooks/use-synced-state";

export function EnquiriesTable({ initialEnquiries }: { initialEnquiries: ContactMessage[] }) {
  const [enquiries] = useSyncedState(initialEnquiries);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [viewingEnquiry, setViewingEnquiry] = React.useState<ContactMessage | null>(null);
  const [deletingEnquiry, setDeletingEnquiry] = React.useState<ContactMessage | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const filtered = enquiries.filter((e) => statusFilter === "all" || e.status === statusFilter);

  function handleStatusChange(id: string, status: ContactStatus) {
    startTransition(async () => {
      const result = await updateEnquiryStatus(id, status);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleDelete() {
    if (!deletingEnquiry) return;
    const id = deletingEnquiry.id;
    setDeletingEnquiry(null);
    startTransition(async () => {
      const result = await deleteEnquiry(id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          From <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => <span className="text-sm">{row.original.subject || "General enquiry"}</span>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Received <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge className={contactStatusColors[row.original.status]}>{CONTACT_STATUS_LABELS[row.original.status]}</Badge>
          <Select value={row.original.status} onValueChange={(v) => handleStatusChange(row.original.id, v as ContactStatus)} disabled={isPending}>
            <SelectTrigger className="h-7 w-8 border-none bg-transparent p-0 shadow-none [&>svg]:mx-auto [&_span]:hidden" aria-label="Change status" />
            <SelectContent>
              {Object.entries(CONTACT_STATUS_LABELS).map(([value, label]) => (
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
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewingEnquiry(row.original)}>
                <Eye /> View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeletingEnquiry(row.original)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search enquiries by name, email or subject..."
        exportFilename="enquiries"
        toolbar={
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(CONTACT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EnquiryDetailSheet enquiry={viewingEnquiry} open={!!viewingEnquiry} onOpenChange={(open) => !open && setViewingEnquiry(null)} />

      <AlertDialog open={!!deletingEnquiry} onOpenChange={(open) => !open && setDeletingEnquiry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the message from {deletingEnquiry?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
