import type { CSSProperties } from "react";
import type { JobCategory } from "@/lib/supabase/types";

export const CATEGORY_ACCENTS: Record<JobCategory, string> = {
  healthcare_caregiving: "var(--chart-5)",
  security: "var(--chart-7)",
  gardening_landscaping: "var(--chart-3)",
  it_technology: "var(--chart-1)",
  engineering: "var(--chart-2)",
  hospitality: "var(--gold)",
  construction: "var(--chart-8)",
  logistics_warehouse: "var(--chart-6)",
  administration: "var(--chart-1)",
  other: "var(--muted-foreground)",
};

export function categoryAccent(category: JobCategory) {
  return CATEGORY_ACCENTS[category];
}

export function categoryAccentStyle(category: JobCategory): CSSProperties {
  const color = categoryAccent(category);
  return {
    backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
    color,
  };
}
