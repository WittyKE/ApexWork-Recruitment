import type { Metadata } from "next";
import { JobsTable } from "@/components/admin/jobs/jobs-table";
import { getAdminJobs } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Jobs" };

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Management</h1>
        <p className="text-sm text-muted-foreground">Create, edit and moderate job listings across the platform.</p>
      </div>
      <JobsTable initialJobs={jobs} />
    </div>
  );
}
