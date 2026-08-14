import type { JobStatus } from "@/lib/supabase/types";

export const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  closed: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  archived: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};
