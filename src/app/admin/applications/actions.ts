"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffActor } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/data/audit";
import { getSignedFileUrl } from "@/lib/supabase/storage";
import { sendApplicationStatusUpdate } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import { adminApplicationUpdateSchema } from "@/lib/validations/admin-application";
import type { ActionResult } from "@/lib/action-result";
import type { ApplicationStatus } from "@/lib/supabase/types";

function notPermitted<T>(): ActionResult<T> {
  return { success: false, message: "You don't have permission to perform this action." };
}

function serviceUnavailable<T>(): ActionResult<T> {
  return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
}

const NOTIFY_STATUSES: ApplicationStatus[] = ["shortlisted", "interviewing", "offered", "hired", "rejected"];

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<ActionResult> {
  const parsed = adminApplicationUpdateSchema.shape.status.safeParse(status);
  if (!parsed.success) return { success: false, message: "Invalid status." };

  if (!isSupabaseConfigured) {
    return { success: true, message: "Application status updated." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: application } = await admin
    .from("applications")
    .select("id, status, job:jobs(title), candidate:candidates(profile:profiles(full_name, email))")
    .eq("id", applicationId)
    .maybeSingle();

  const { error } = await admin.from("applications").update({ status }).eq("id", applicationId);
  if (error) return { success: false, message: "Something went wrong updating the application status." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "application.status_changed",
    entityType: "application",
    entityId: applicationId,
    severity: "info",
    metadata: { from: application?.status, to: status },
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");

  let emailed = false;
  const job = application?.job as { title?: string } | null;
  const candidate = application?.candidate as { profile?: { full_name?: string; email?: string } } | null;
  if (NOTIFY_STATUSES.includes(status) && candidate?.profile?.email) {
    const result = await sendApplicationStatusUpdate({
      candidateEmail: candidate.profile.email,
      candidateName: candidate.profile.full_name ?? "there",
      jobTitle: job?.title ?? "your application",
      status,
    });
    emailed = result.success;
  }

  return {
    success: true,
    message: emailed ? `Status updated and the candidate has been notified by email.` : `Application status updated.`,
  };
}

export async function updateApplicationNotes(applicationId: string, employerNotes: string): Promise<ActionResult> {
  const parsed = adminApplicationUpdateSchema.shape.employerNotes.safeParse(employerNotes);
  if (!parsed.success) return { success: false, message: "Notes must be 2000 characters or fewer." };

  if (!isSupabaseConfigured) {
    return { success: true, message: "Notes saved." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.from("applications").update({ employer_notes: employerNotes || null }).eq("id", applicationId);
  if (error) return { success: false, message: "Something went wrong saving notes." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "application.notes_updated",
    entityType: "application",
    entityId: applicationId,
    severity: "info",
  });

  revalidatePath("/admin/applications");

  return { success: true, message: "Notes saved." };
}

export async function deleteApplication(applicationId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Application removed." };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.from("applications").delete().eq("id", applicationId);
  if (error) return { success: false, message: "Something went wrong deleting the application." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "application.deleted",
    entityType: "application",
    entityId: applicationId,
    severity: "warning",
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");

  return { success: true, message: "Application removed." };
}

type FileRef = { type: "cv" } | { type: "certificate"; index: number };

export async function getApplicationFileUrl(applicationId: string, ref: FileRef): Promise<ActionResult<{ url: string }>> {
  if (!isSupabaseConfigured) return { success: false, message: "Couldn't generate a link to that file." };

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: application } = await admin
    .from("applications")
    .select("candidate:candidates(cv_url, certificate_urls)")
    .eq("id", applicationId)
    .maybeSingle();

  const candidate = application?.candidate as { cv_url?: string | null; certificate_urls?: string[] } | null;
  if (!candidate) return { success: false, message: "Application not found." };

  const path = ref.type === "cv" ? candidate.cv_url : candidate.certificate_urls?.[ref.index];
  if (!path) return { success: false, message: "No file on record." };

  const bucket = ref.type === "cv" ? "cvs" : "certificates";
  const url = await getSignedFileUrl(bucket, path);
  if (!url) return { success: false, message: "Couldn't generate a link to that file." };

  return { success: true, message: "Link generated.", data: { url } };
}
