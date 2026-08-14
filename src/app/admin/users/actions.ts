"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireStaffActor } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/data/audit";
import { isSupabaseConfigured } from "@/lib/env";
import { adminCreateUserSchema, adminUserSchema, type AdminCreateUserValues, type AdminUserValues } from "@/lib/validations/admin-user";
import type { ActionResult } from "@/lib/action-result";

function notPermitted<T>(): ActionResult<T> {
  return { success: false, message: "You don't have permission to perform this action." };
}

function serviceUnavailable<T>(): ActionResult<T> {
  return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = randomBytes(14);
  let password = "";
  for (let i = 0; i < bytes.length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

export async function createAdminUser(values: AdminCreateUserValues): Promise<ActionResult<{ tempPassword?: string }>> {
  const parsed = adminCreateUserSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Please check the form for errors and try again." };
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this user would be created once Supabase is connected." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const metadata = { role: data.role, full_name: data.fullName, phone: data.phone || null };
  let newUserId: string;
  let tempPassword: string | undefined;

  if (data.passwordMode === "invite") {
    const { data: inviteData, error } = await admin.auth.admin.inviteUserByEmail(data.email, { data: metadata });
    if (error || !inviteData.user) return { success: false, message: error?.message ?? "Failed to invite user." };
    newUserId = inviteData.user.id;
  } else {
    const password = data.passwordMode === "generate" ? generateTempPassword() : (data.password as string);
    const { data: createData, error } = await admin.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (error || !createData.user) return { success: false, message: error?.message ?? "Failed to create user." };
    newUserId = createData.user.id;
    if (data.passwordMode === "generate") tempPassword = password;
  }

  if (data.role === "employer") {
    await admin.from("employers").insert({ profile_id: newUserId, company_name: data.companyName || "New Employer" });
  }
  if (data.status === "inactive") {
    await admin.from("profiles").update({ is_active: false }).eq("id", newUserId);
  }

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "user.created",
    entityType: "user",
    entityId: newUserId,
    severity: "info",
    metadata: { role: data.role, passwordMode: data.passwordMode },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  if (data.role === "employer") revalidatePath("/admin/employers");

  return {
    success: true,
    message: data.passwordMode === "invite" ? `Invitation email sent to ${data.email}.` : `${data.fullName} was created.`,
    data: { tempPassword },
  };
}

export async function updateAdminUser(userId: string, values: AdminUserValues): Promise<ActionResult> {
  const parsed = adminUserSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Please check the form for errors and try again." };
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this user would be updated once Supabase is connected." };
  }

  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { data: existing } = await admin.from("profiles").select("email, role").eq("id", userId).maybeSingle();

  if (existing && existing.email !== data.email) {
    const { error: authError } = await admin.auth.admin.updateUserById(userId, { email: data.email });
    if (authError) return { success: false, message: authError.message };
  }

  const { error } = await admin
    .from("profiles")
    .update({ full_name: data.fullName, email: data.email, role: data.role, is_active: data.status === "active" })
    .eq("id", userId);

  if (error) return { success: false, message: "Something went wrong updating the user." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "user.updated",
    entityType: "user",
    entityId: userId,
    severity: "info",
    metadata: { fullName: data.fullName },
  });

  if (existing && existing.role !== data.role) {
    await logAdminAction({
      actorId: actor.id,
      actorEmail: actor.email,
      action: "user.role_changed",
      entityType: "user",
      entityId: userId,
      severity: "warning",
      metadata: { from: existing.role, to: data.role },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");

  return { success: true, message: `${data.fullName} was updated.` };
}

export async function deleteAdminUser(userId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Demo mode: this user would be deleted once Supabase is connected." };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const admin = createAdminClient();
  if (!admin) return serviceUnavailable();

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { success: false, message: error.message || "Something went wrong deleting the user." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "user.deleted",
    entityType: "user",
    entityId: userId,
    severity: "warning",
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/employers");
  revalidatePath("/admin/dashboard");

  return { success: true, message: "User account deleted." };
}

export async function resetAdminUserPassword(userId: string, email: string): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { success: true, message: `Demo mode: a password reset link would be sent to ${email}.` };
  }
  const actor = await requireStaffActor();
  if (!actor) return notPermitted();

  const supabase = await createClient();
  if (!supabase) return serviceUnavailable();

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { success: false, message: "Something went wrong sending the reset link." };

  await logAdminAction({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "user.password_reset_requested",
    entityType: "user",
    entityId: userId,
    severity: "info",
    metadata: { email },
  });

  return { success: true, message: `Password reset link sent to ${email}.` };
}
