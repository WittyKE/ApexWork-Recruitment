import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type StorageBucket = "cvs" | "certificates";

const SIGNED_URL_EXPIRY_SECONDS = 300;

/**
 * Mints a short-lived signed URL for a private storage object. Called on
 * demand (e.g. when an admin clicks "View CV"), never generated ahead of
 * time or cached, so the window stays tight.
 */
export async function getSignedFileUrl(bucket: StorageBucket, path: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);
  if (error || !data) return null;
  return data.signedUrl;
}
