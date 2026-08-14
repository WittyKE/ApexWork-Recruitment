import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockJobsWithEmployer, mockEmployers } from "@/lib/mock-data";
import type { JobWithEmployer } from "@/lib/supabase/types";

export async function getAdminJobs(): Promise<JobWithEmployer[]> {
  if (!isSupabaseConfigured) return mockJobsWithEmployer;
  const admin = createAdminClient();
  if (!admin) return mockJobsWithEmployer;

  const { data, error } = await admin
    .from("jobs")
    .select("*, employer:employers(id, company_name, industry, is_verified)")
    .order("created_at", { ascending: false });

  if (error || !data) return mockJobsWithEmployer;
  return data as unknown as JobWithEmployer[];
}

export interface EmployerOption {
  id: string;
  company_name: string;
  is_verified: boolean;
}

export async function getEmployerOptions(): Promise<EmployerOption[]> {
  if (!isSupabaseConfigured) {
    return mockEmployers
      .map((e) => ({ id: e.id, company_name: e.company_name, is_verified: e.is_verified }))
      .sort((a, b) => a.company_name.localeCompare(b.company_name));
  }
  const admin = createAdminClient();
  if (!admin) return mockEmployers.map((e) => ({ id: e.id, company_name: e.company_name, is_verified: e.is_verified }));

  const { data, error } = await admin.from("employers").select("id, company_name, is_verified").order("company_name");

  if (error || !data) return mockEmployers.map((e) => ({ id: e.id, company_name: e.company_name, is_verified: e.is_verified }));
  return data;
}
