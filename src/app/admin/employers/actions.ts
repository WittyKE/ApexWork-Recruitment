"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffActor } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/data/audit";
import { isSupabaseConfigured } from "@/lib/env";
import { adminEmployerUpdateSchema, type AdminEmployerUpdateValues } from "@/lib/validations/admin-employer";
import type { ActionResult } from "@/lib/action-result";

function notPermitted<T>(): ActionResult<T> {
  return { success: false, message: "You don't have permission to perform this action." };
}

function serviceUnavailable<T>(): ActionResult<T> {
  return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
}

export async function setEmployerVerified(employerId: string, isVerified: boolean): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: `Demo mode: employer would be marked ${isVerified ? "verified" : "unverified"}.` };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.from("employers").update({ is_verified: isVerified }).eq("id", employerId);
  if (error) return { success: false, message: "Something went wrong updating this employer." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "employer.verified_changed",
    entityType: "employer",
    entityId: employerId,
    severity: "info",
    metadata: { isVerified },
  });

  revalidatePath("/admin/employers");
  revalidatePath("/admin/jobs");

  return { success: true, message: isVerified ? "Employer verified." : "Employer unverified." };
}

export async function updateAdminEmployer(employerId: string, values: AdminEmployerUpdateValues): Promise<ActionResult> {
  const parsed = adminEmployerUpdateSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Please check the form for errors and try again." };
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this employer would be updated once Supabase is connected." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin
    .from("employers")
    .update({ is_verified: data.isVerified, industry: data.industry || null, company_size: data.companySize || null })
    .eq("id", employerId);

  if (error) return { success: false, message: "Something went wrong updating this employer." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "employer.updated",
    entityType: "employer",
    entityId: employerId,
    severity: "info",
  });

  revalidatePath("/admin/employers");
  revalidatePath("/admin/jobs");

  return { success: true, message: "Employer updated." };
}
