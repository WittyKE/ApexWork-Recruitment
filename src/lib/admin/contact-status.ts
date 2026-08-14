import type { ContactStatus } from "@/lib/supabase/types";

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const contactStatusColors: Record<ContactStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};
