"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffActor } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/data/audit";
import { isSupabaseConfigured } from "@/lib/env";
import { adminJobSchema, type AdminJobValues } from "@/lib/validations/admin-job";
import type { ActionResult } from "@/lib/action-result";
import type { JobStatus, JobWithEmployer } from "@/lib/supabase/types";

function notPermitted<T>(): ActionResult<T> {
  return { success: false, message: "You don't have permission to perform this action." };
}

function serviceUnavailable<T>(): ActionResult<T> {
  return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
}

function buildJobFields(data: AdminJobValues) {
  return {
    employer_id: data.employerId,
    title: data.title,
    category: data.category,
    employment_type: data.employmentType,
    location: data.location,
    is_remote: data.isRemote,
    visa_sponsorship: data.visaSponsorship,
    description: data.description,
    requirements: data.requirements,
    benefits: data.benefits || null,
    status: data.status,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  };
}

export async function createAdminJob(values: AdminJobValues): Promise<ActionResult<JobWithEmployer>> {
  const parsed = adminJobSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Please check the form for errors and try again." };
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this job would be created once Supabase is connected." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const slug = `${slugify(data.title, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: job, error } = await admin
    .from("jobs")
    .insert({ ...buildJobFields(data), slug })
    .select("*, employer:employers(id, company_name, industry, is_verified)")
    .single();

  if (error || !job) return { success: false, message: "Something went wrong creating the job. Please try again." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.created",
    entityType: "job",
    entityId: job.id,
    severity: "info",
    metadata: { title: data.title, status: data.status },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");

  return { success: true, message: `"${data.title}" was created.`, data: job as unknown as JobWithEmployer };
}

export async function updateAdminJob(jobId: string, values: AdminJobValues): Promise<ActionResult<JobWithEmployer>> {
  const parsed = adminJobSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Please check the form for errors and try again." };
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this job would be updated once Supabase is connected." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: existing } = await admin.from("jobs").select("published_at").eq("id", jobId).maybeSingle();

  const update = buildJobFields(data);
  if (data.status === "published" && existing?.published_at) {
    update.published_at = existing.published_at;
  }

  const { data: job, error } = await admin
    .from("jobs")
    .update(update)
    .eq("id", jobId)
    .select("*, employer:employers(id, company_name, industry, is_verified)")
    .single();

  if (error || !job) return { success: false, message: "Something went wrong updating the job. Please try again." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.updated",
    entityType: "job",
    entityId: jobId,
    severity: "info",
    metadata: { title: data.title },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");

  return { success: true, message: `"${data.title}" was updated.`, data: job as unknown as JobWithEmployer };
}

export async function updateAdminJobStatus(jobId: string, status: JobStatus): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: `Demo mode: job would be marked ${status}.` };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: existing } = await admin.from("jobs").select("published_at").eq("id", jobId).maybeSingle();
  const update: Record<string, unknown> = { status };
  if (status === "published" && !existing?.published_at) update.published_at = new Date().toISOString();

  const { error } = await admin.from("jobs").update(update).eq("id", jobId);
  if (error) return { success: false, message: "Something went wrong updating the job status." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.status_changed",
    entityType: "job",
    entityId: jobId,
    severity: "info",
    metadata: { status },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");

  return { success: true, message: `Job marked as ${status}.` };
}

export async function bulkUpdateAdminJobStatus(jobIds: string[], status: JobStatus): Promise<ActionResult> {
  if (jobIds.length === 0) return { success: false, message: "No jobs selected." };
  if (!isSupabaseConfigured) {
    return { success: true, message: `Demo mode: ${jobIds.length} job(s) would be marked ${status}.` };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const update: Record<string, unknown> = { status };
  if (status === "published") update.published_at = new Date().toISOString();

  const { error } = await admin.from("jobs").update(update).in("id", jobIds);
  if (error) return { success: false, message: "Something went wrong updating the selected jobs." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.bulk_status_changed",
    entityType: "job",
    severity: "info",
    metadata: { status, jobIds },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");

  return { success: true, message: `${jobIds.length} job(s) marked as ${status}.` };
}

export async function deleteAdminJob(jobId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this job would be deleted once Supabase is connected." };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: job } = await admin.from("jobs").select("title").eq("id", jobId).maybeSingle();
  const { error } = await admin.from("jobs").delete().eq("id", jobId);
  if (error) return { success: false, message: "Something went wrong deleting the job." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.deleted",
    entityType: "job",
    entityId: jobId,
    severity: "warning",
    metadata: { title: job?.title },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/applications");

  return { success: true, message: `"${job?.title ?? "Job"}" and any linked applications were deleted.` };
}

export async function bulkDeleteAdminJobs(jobIds: string[]): Promise<ActionResult> {
  if (jobIds.length === 0) return { success: false, message: "No jobs selected." };
  if (!isSupabaseConfigured) {
    return { success: true, message: `Demo mode: ${jobIds.length} job(s) would be deleted.` };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.from("jobs").delete().in("id", jobIds);
  if (error) return { success: false, message: "Something went wrong deleting the selected jobs." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "job.bulk_deleted",
    entityType: "job",
    severity: "warning",
    metadata: { jobIds },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/applications");

  return { success: true, message: `${jobIds.length} job(s) deleted.` };
}
