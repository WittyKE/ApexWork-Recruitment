import { mockApplications, mockJobsWithEmployer } from "@/lib/mock-data";
import { JOB_CATEGORY_LABELS } from "@/lib/supabase/types";

export type DateRange = "7d" | "30d" | "90d" | "ytd";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  ytd: "Year to date",
};

function daysForRange(range: DateRange): number {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "ytd":
      return Math.ceil((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86_400_000);
  }
}

/**
 * Deterministic (no Math.random, so SSR/CSR match) daily traffic series —
 * a smooth wave plus weekly seasonality, scaled by range so longer windows
 * show believable cumulative totals.
 */
export function buildDailyTrafficSeries(range: DateRange) {
  const days = daysForRange(range);
  const today = new Date();
  const points: { date: string; visits: number; applications: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayIndex = days - i;
    const weekday = d.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.6 : 1;
    const wave = Math.sin(dayIndex / 5) * 40 + Math.cos(dayIndex / 11) * 20;
    const visits = Math.max(20, Math.round((260 + wave + dayIndex * 1.4) * weekendDip));
    const applications = Math.max(1, Math.round(visits * 0.062 + Math.sin(dayIndex / 4) * 2));
    points.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      visits,
      applications,
    });
  }

  return points;
}

export function getSummary(range: DateRange) {
  const series = buildDailyTrafficSeries(range);
  const totalVisits = series.reduce((sum, p) => sum + p.visits, 0);
  const totalApplications = series.reduce((sum, p) => sum + p.applications, 0);
  const conversionRate = totalVisits ? Math.round((totalApplications / totalVisits) * 1000) / 10 : 0;
  const avgDaily = Math.round(totalVisits / series.length);
  return { totalVisits, totalApplications, conversionRate, avgDaily };
}

export const candidateTypeSplit = [
  { type: "Skilled Professionals", value: 62 },
  { type: "Essential Workers", value: 38 },
];

export const rightToWorkSplit = [
  { status: "UK Citizen / Settled", value: 44 },
  { status: "Visa Holder", value: 21 },
  { status: "Requires Sponsorship", value: 27 },
  { status: "Other", value: 8 },
];

export function getTopJobsByApplications(limit = 5) {
  const counts = new Map<string, number>();
  for (const app of mockApplications) {
    counts.set(app.job_id, (counts.get(app.job_id) ?? 0) + 1);
  }
  return mockJobsWithEmployer
    .map((job) => ({
      title: job.title,
      employer: job.employer.company_name,
      category: JOB_CATEGORY_LABELS[job.category],
      applications: counts.get(job.id) ?? 0,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, limit);
}
