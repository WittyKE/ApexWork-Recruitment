import "server-only";
import { adminKpis, revenueTrend, userGrowthTrend, jobsByCategory } from "@/lib/mock-data";
import { getAdminUsers } from "./users";
import { getAdminJobs } from "./jobs";
import { getAdminApplications } from "./applications";

export async function getDashboardStats() {
  const [users, jobs, applications] = await Promise.all([getAdminUsers(), getAdminJobs(), getAdminApplications()]);

  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const totalApplications = applications.length;
  const hired = applications.filter((a) => a.status === "hired").length;
  const conversionRate = totalApplications ? Math.round((hired / totalApplications) * 1000) / 10 : 0;

  return {
    kpis: adminKpis,
    revenueTrend,
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
