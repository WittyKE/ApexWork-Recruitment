import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { mockApplications, type AdminApplicationRow } from "@/lib/mock-data";

export type { AdminApplicationRow };

export async function getAdminApplications(): Promise<AdminApplicationRow[]> {
  if (!isSupabaseConfigured) return mockApplications;
  const admin = createAdminClient();
  if (!admin) return mockApplications;

  const { data, error } = await admin
    .from("applications")
    .select(
      `*, job:jobs(title, employer:employers(company_name)),
       candidate:candidates(id, cv_url, cv_filename, certificate_urls, right_to_work_status, profile:profiles(full_name, email, phone))`
    )
    .order("applied_at", { ascending: false });

  if (error || !data) return mockApplications;

  return data.map((row: Record<string, unknown>) => {
    const job = row.job as { title?: string; employer?: { company_name?: string } } | null;
    const candidate = row.candidate as
      | {
          cv_url?: string | null;
          cv_filename?: string | null;
          certificate_urls?: string[] | null;
          right_to_work_status?: AdminApplicationRow["right_to_work_status"];
          profile?: { full_name?: string; email?: string; phone?: string | null };
        }
      | null;

    return {
      id: row.id,
      job_id: row.job_id,
      candidate_id: row.candidate_id,
      status: row.status,
      cover_note: row.cover_note,
      employer_notes: row.employer_notes,
      applied_at: row.applied_at,
      updated_at: row.updated_at,
      job_title: job?.title ?? "Unknown role",
      employer_company_name: job?.employer?.company_name ?? "—",
      candidate_name: candidate?.profile?.full_name ?? "Unknown candidate",
      candidate_email: candidate?.profile?.email ?? "",
      candidate_phone: candidate?.profile?.phone ?? null,
      cv_url: candidate?.cv_url ?? null,
      cv_filename: candidate?.cv_filename ?? null,
      certificate_urls: candidate?.certificate_urls ?? [],
      right_to_work_status: candidate?.right_to_work_status ?? null,
    } as AdminApplicationRow;
  });
}
