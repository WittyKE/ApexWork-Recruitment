// One-off local script to create the first super_admin account.
// Nothing here is a credential — email/password are read from env vars at
// run time so nothing sensitive ever lands in the repo.
//
// Usage (PowerShell):
//   $env:SUPER_ADMIN_EMAIL="you@example.com"; $env:SUPER_ADMIN_PASSWORD="a strong password"
//   node --env-file=.env.local scripts/create-super-admin.mjs
//
// Usage (bash):
//   SUPER_ADMIN_EMAIL="you@example.com" SUPER_ADMIN_PASSWORD="a strong password" \
//     node --env-file=.env.local scripts/create-super-admin.mjs
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
// .env.local (same values the app already uses).

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.SUPER_ADMIN_EMAIL;
const PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const FULL_NAME = process.env.SUPER_ADMIN_NAME || "Super Admin";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Load them with --env-file=.env.local.");
  process.exit(1);
}
if (!EMAIL || !PASSWORD) {
  console.error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD before running this script.");
  process.exit(1);
}
if (PASSWORD.length < 12) {
  console.error("SUPER_ADMIN_PASSWORD should be at least 12 characters.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true,
  user_metadata: { role: "super_admin", full_name: FULL_NAME },
});

if (error || !data.user) {
  console.error("Failed to create user:", error?.message ?? "unknown error");
  process.exit(1);
}

// The handle_new_user trigger (see supabase/migrations/0001_schema.sql)
// creates the profiles row from user_metadata.role automatically, but set
// it explicitly here too in case the role wasn't in the enum yet when that
// trigger ran, or the trigger's default path was taken.
const { error: profileError } = await admin
  .from("profiles")
  .update({ role: "super_admin", full_name: FULL_NAME })
  .eq("id", data.user.id);

if (profileError) {
  console.error("User was created but the profile role update failed:", profileError.message);
  process.exit(1);
}

console.log(`Super admin created: ${EMAIL} (id: ${data.user.id})`);
console.log("Remove SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD from your shell/session now that this has run.");
