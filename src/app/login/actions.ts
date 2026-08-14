"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";
import type { ActionResult } from "@/lib/action-result";

const STAFF_ROLES = new Set(["admin", "manager", "super_admin"]);

export async function signIn(values: SignInValues): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "Enter a valid email and password." };

  if (!isSupabaseConfigured) {
    return { success: false, message: "Sign-in isn't available yet — Supabase isn't configured." };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, message: "Sign-in isn't available right now." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { success: false, message: "Incorrect email or password." };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  const redirectTo = profile && STAFF_ROLES.has(profile.role) ? "/admin/dashboard" : "/";

  return { success: true, message: "Signed in.", data: { redirectTo } };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
