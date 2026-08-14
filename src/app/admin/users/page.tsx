import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users/users-table";
import { getAdminUsers } from "@/lib/data/admin";
import { requireStaffActor } from "@/lib/admin/guard";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [users, params, actor] = await Promise.all([getAdminUsers(), searchParams, requireStaffActor()]);
  const createEmployer = params.create === "employer";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">Manage candidates, employers and staff accounts.</p>
      </div>
      <UsersTable initialUsers={users} initialCreateEmployer={createEmployer} isSuperAdmin={actor?.role === "super_admin"} />
    </div>
  );
}
