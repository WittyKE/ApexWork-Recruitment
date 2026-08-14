import type { Metadata } from "next";
import { EmployersTable } from "@/components/admin/employers/employers-table";
import { getAdminJobs, getEmployersAdmin } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Employers" };

export default async function AdminEmployersPage() {
  const [employers, jobs] = await Promise.all([getEmployersAdmin(), getAdminJobs()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employers</h1>
        <p className="text-sm text-muted-foreground">Manage employer accounts, verification and their job postings.</p>
      </div>
      <EmployersTable initialEmployers={employers} jobs={jobs} />
    </div>
  );
}
