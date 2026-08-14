"use client";

import * as React from "react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, KeyRound, MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";
import type { AdminUserRow } from "@/lib/mock-data";
import { deleteAdminUser, resetAdminUserPassword } from "@/app/admin/users/actions";
import { useSyncedState } from "@/lib/hooks/use-synced-state";

const ROLE_STYLES: Record<AdminUserRow["role"], string> = {
  candidate: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  employer: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  manager: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  super_admin: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
};

const ROLE_LABELS: Record<AdminUserRow["role"], string> = {
  candidate: "candidate",
  employer: "employer",
  admin: "admin",
  manager: "manager",
  super_admin: "Super Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const STAFF_ROLES = new Set<AdminUserRow["role"]>(["admin", "manager", "super_admin"]);

export function UsersTable({
  initialUsers,
  initialCreateEmployer = false,
  isSuperAdmin = false,
}: {
  initialUsers: AdminUserRow[];
  initialCreateEmployer?: boolean;
  isSuperAdmin?: boolean;
}) {
  const [users] = useSyncedState(initialUsers);
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [editingUser, setEditingUser] = React.useState<AdminUserRow | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<AdminUserRow | null>(null);
  const [addOpen, setAddOpen] = React.useState(initialCreateEmployer);
  const [isPending, startTransition] = React.useTransition();

  const filtered = users.filter(
    (u) => (roleFilter === "all" || u.role === roleFilter) && (statusFilter === "all" || u.status === statusFilter)
  );

  function handleDelete() {
    if (!deletingUser) return;
    const userId = deletingUser.id;
    setDeletingUser(null);
    startTransition(async () => {
      const result = await deleteAdminUser(userId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleResetPassword(user: AdminUserRow) {
    startTransition(async () => {
      const result = await resetAdminUserPassword(user.id, user.email);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  const columns: ColumnDef<AdminUserRow>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(row.original.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.full_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge className={ROLE_STYLES[row.original.role]}>{ROLE_LABELS[row.original.role]}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "default" : "secondary"} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "last_active",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Active <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.last_active).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const locked = STAFF_ROLES.has(user.role) && !isSuperAdmin;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={locked} onClick={() => setEditingUser(user)}>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isPending || locked} onClick={() => handleResetPassword(user)}>
                  <KeyRound /> Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" disabled={locked} onClick={() => setDeletingUser(user)}>
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
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search users by name or email..."
        exportFilename="users"
        toolbar={
          <>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <UserFormDialog
              open={addOpen}
              onOpenChange={setAddOpen}
              defaultRole={initialCreateEmployer ? "employer" : undefined}
              isSuperAdmin={isSuperAdmin}
              trigger={
                <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
                  <UserPlus className="size-4" /> Add New User
                </Button>
              }
            />
          </>
        }
      />

      <UserFormDialog
        user={editingUser ?? undefined}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        isSuperAdmin={isSuperAdmin}
      />

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletingUser?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes their Supabase Auth account and profile. This action cannot be undone.
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
