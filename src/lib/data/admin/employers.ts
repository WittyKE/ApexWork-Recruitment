import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockEmployers, mockEmployerContacts, mockJobs } from "@/lib/mock-data";
import type { Employer } from "@/lib/supabase/types";

export interface AdminEmployerRow extends Employer {
  contact_name: string;
  contact_email: string;
  job_count: number;
}

export async function getEmployersAdmin(): Promise<AdminEmployerRow[]> {
  if (!isSupabaseConfigured) return buildMockEmployerRows();
  const admin = createAdminClient();
  if (!admin) return buildMockEmployerRows();

  const [{ data: employers, error: employersError }, { data: jobs, error: jobsError }] = await Promise.all([
    admin.from("employers").select("*, profile:profiles(full_name, email)").order("created_at", { ascending: false }),
    admin.from("jobs").select("employer_id"),
  ]);

  if (employersError || !employers) return buildMockEmployerRows();

  const jobCounts = new Map<string, number>();
  if (!jobsError && jobs) {
    for (const job of jobs as { employer_id: string }[]) {
      jobCounts.set(job.employer_id, (jobCounts.get(job.employer_id) ?? 0) + 1);
    }
  }

  return (employers as (Employer & { profile?: { full_name?: string; email?: string } })[]).map((row) => ({
    ...row,
    contact_name: row.profile?.full_name ?? "—",
    contact_email: row.profile?.email ?? "—",
    job_count: jobCounts.get(row.id) ?? 0,
  }));
}

function buildMockEmployerRows(): AdminEmployerRow[] {
  return mockEmployers.map((e) => ({
    ...e,
    contact_name: mockEmployerContacts[e.id]?.contact_name ?? "—",
    contact_email: mockEmployerContacts[e.id]?.contact_email ?? "—",
    job_count: mockJobs.filter((j) => j.employer_id === e.id).length,
  }));
}
