import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import {
  mockAdminUsers,
  mockAuditLogs,
  mockJobsWithEmployer,
  mockApplications,
  adminKpis,
  revenueTrend,
  userGrowthTrend,
  jobsByCategory,
  type AdminUserRow,
  type AdminAuditLogRow,
} from "@/lib/mock-data";
import type { JobWithEmployer } from "@/lib/supabase/types";

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  if (!isSupabaseConfigured) return mockAdminUsers;
  const admin = createAdminClient();
  if (!admin) return mockAdminUsers;

  const { data, error } = await admin
    .from("profiles")
    .select("id, full_name, email, role, is_active, avatar_url, updated_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return mockAdminUsers;

  return data.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    role: row.role,
    status: row.is_active ? "active" : "inactive",
    avatar_url: row.avatar_url,
    last_active: row.updated_at,
    created_at: row.created_at,
  }));
}

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

export async function getAdminApplications() {
  if (!isSupabaseConfigured) return mockApplications;
  const admin = createAdminClient();
  if (!admin) return mockApplications;

  const { data, error } = await admin
    .from("applications")
    .select("*, job:jobs(title), candidate:candidates(profile:profiles(full_name))")
    .order("applied_at", { ascending: false });

  if (error || !data) return mockApplications;

  return data.map((row: Record<string, unknown>) => ({
    ...row,
    job_title: (row.job as { title?: string } | null)?.title ?? "Unknown role",
    candidate_name:
      (row.candidate as { profile?: { full_name?: string } } | null)?.profile?.full_name ?? "Unknown candidate",
  })) as typeof mockApplications;
}

export async function getAuditLogs(): Promise<AdminAuditLogRow[]> {
  if (!isSupabaseConfigured) return mockAuditLogs;
  const admin = createAdminClient();
  if (!admin) return mockAuditLogs;

  const { data, error } = await admin
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return mockAuditLogs;

  return data.map((row) => ({
    id: row.id,
    actor: row.actor_email ?? "system",
    action: row.action,
    entity_type: row.entity_type ?? "—",
    severity: row.severity,
    created_at: row.created_at,
    details: JSON.stringify(row.metadata ?? {}),
  }));
}

export async function getDashboardStats() {
  const [users, jobs, applications] = await Promise.all([getAdminUsers(), getAdminJobs(), getAdminApplications()]);

  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const totalApplications = applications.length;
  const hired = applications.filter((a) => a.status === "hired").length;
  const conversionRate = totalApplications ? Math.round((hired / totalApplications) * 1000) / 10 : 0;

  return {
    kpis: adminKpis,
    revenueTrend,
    userGrowthTrend,
    jobsByCategory,
    counts: {
      totalUsers: users.length,
      activeJobs,
      totalApplications,
      hired,
      conversionRate,
    },
  };
}
