import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ClipboardList, PlusCircle, TrendingUp, UserPlus, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/admin/kpi-card";
import { RevenueAreaChart } from "@/components/admin/revenue-area-chart";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";
import { CategoryBarChart } from "@/components/admin/category-bar-chart";
import { getAuditLogs, getDashboardStats } from "@/lib/data/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const SEVERITY_STYLES = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  error: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export default async function AdminDashboardPage() {
  const [stats, logs] = await Promise.all([getDashboardStats(), getAuditLogs()]);
  const recentActivity = logs.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of platform activity and performance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/jobs" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
            <PlusCircle className="size-4" /> New Job
          </Link>
          <Link href="/admin/users" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
            <UserPlus className="size-4" /> New User
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={stats.kpis.totalRevenue.value} change={stats.kpis.totalRevenue.change} icon={TrendingUp} format="currency" />
        <KpiCard label="Active Users" value={stats.kpis.activeUsers.value} change={stats.kpis.activeUsers.change} icon={Users} />
        <KpiCard label="Conversions (Hires)" value={stats.kpis.conversions.value} change={stats.kpis.conversions.change} icon={ClipboardList} />
        <KpiCard label="Bounce Rate" value={stats.kpis.bounceRate.value} change={stats.kpis.bounceRate.change} icon={Briefcase} format="percent" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueAreaChart data={stats.revenueTrend} />
        <UserGrowthChart data={stats.userGrowthTrend} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <CategoryBarChart data={stats.jobsByCategory} />
        </div>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-start justify-between gap-3 border-b py-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{log.actor}</p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge className={SEVERITY_STYLES[log.severity]}>{log.severity}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
