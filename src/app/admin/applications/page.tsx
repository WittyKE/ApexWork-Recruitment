import type { Metadata } from "next";
import { ApplicationsTable } from "@/components/admin/applications/applications-table";
import { getAdminApplications } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-sm text-muted-foreground">Track candidate applications and update their status.</p>
      </div>
      <ApplicationsTable initialApplications={applications} />
    </div>
  );
}
