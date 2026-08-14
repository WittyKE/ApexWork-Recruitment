"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffActor } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/data/audit";
import { sendEnquiryResolvedNotification } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import { adminContactStatusSchema } from "@/lib/validations/admin-contact";
import type { ActionResult } from "@/lib/action-result";
import type { ContactStatus } from "@/lib/supabase/types";

function notPermitted<T>(): ActionResult<T> {
  return { success: false, message: "You don't have permission to perform this action." };
}

function serviceUnavailable<T>(): ActionResult<T> {
  return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
}

export async function updateEnquiryStatus(id: string, status: ContactStatus): Promise<ActionResult> {
  const parsed = adminContactStatusSchema.shape.status.safeParse(status);
  if (!parsed.success) return { success: false, message: "Invalid status." };

  if (!isSupabaseConfigured) {
    return { success: true, message: "Enquiry status updated." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: existing } = await admin.from("contact_messages").select("name, email, subject, status").eq("id", id).maybeSingle();

  const { error } = await admin.from("contact_messages").update({ status }).eq("id", id);
  if (error) return { success: false, message: "Something went wrong updating this enquiry." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "enquiry.status_changed",
    entityType: "contact_message",
    entityId: id,
    severity: "info",
    metadata: { from: existing?.status, to: status },
  });

  revalidatePath("/admin/enquiries");

  let emailed = false;
  if (status === "resolved" && existing?.status !== "resolved" && existing?.email) {
    const result = await sendEnquiryResolvedNotification({
      name: existing.name,
      email: existing.email,
      subject: existing.subject ?? "your enquiry",
    });
    emailed = result.success;
  }

  return {
    success: true,
    message: emailed ? "Marked resolved and the sender has been notified by email." : "Enquiry status updated.",
  };
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Enquiry deleted." };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.from("contact_messages").delete().eq("id", id);
  if (error) return { success: false, message: "Something went wrong deleting this enquiry." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "enquiry.deleted",
    entityType: "contact_message",
    entityId: id,
    severity: "warning",
  });

  revalidatePath("/admin/enquiries");

  return { success: true, message: "Enquiry deleted." };
}
