import "server-only";
import { adminKpis, userGrowthTrend, jobsByCategory } from "@/lib/mock-data";
import { getAdminUsers } from "./users";
import { getAdminJobs } from "./jobs";
import { getAdminApplications, type AdminApplicationRow } from "./applications";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getApplicationsTrend(applications: AdminApplicationRow[], months = 7) {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTH_LABELS[d.getMonth()], applications: 0 };
  });

  for (const application of applications) {
    const d = new Date(application.applied_at);
    const bucket = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) bucket.applications += 1;
  }

  return buckets.map(({ month, applications }) => ({ month, applications }));
}

export async function getDashboardStats() {
  const [users, jobs, applications] = await Promise.all([getAdminUsers(), getAdminJobs(), getAdminApplications()]);

  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const totalApplications = applications.length;
  const hired = applications.filter((a) => a.status === "hired").length;
  const conversionRate = totalApplications ? Math.round((hired / totalApplications) * 1000) / 10 : 0;

  return {
    kpis: adminKpis,
    applicationsTrend: getApplicationsTrend(applications),
    userGrowthTrend,
    jobsByCategory,
    counts: {
      totalUsers: users.length,
      activeJobs,
      totalApplications,
      hired,
      conversionRate,
    },
  };
}
