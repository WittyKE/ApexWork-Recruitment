"use client";

import * as React from "react";
import { Eye, FileCheck, TrendingUp, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/admin/kpi-card";
import { TrafficChart } from "@/components/admin/analytics/traffic-chart";
import { ApplicationsChart } from "@/components/admin/analytics/applications-chart";
import { DemographicsCharts } from "@/components/admin/analytics/demographics-charts";
import { TopJobsTable } from "@/components/admin/analytics/top-jobs-table";
import { buildDailyTrafficSeries, getSummary, DATE_RANGE_LABELS, type DateRange } from "@/lib/admin/analytics";

const RANGES: DateRange[] = ["7d", "30d", "90d", "ytd"];

export function AnalyticsView() {
  const [range, setRange] = React.useState<DateRange>("30d");
  const series = React.useMemo(() => buildDailyTrafficSeries(range), [range]);
  const summary = React.useMemo(() => getSummary(range), [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics &amp; Reports</h1>
          <p className="text-sm text-muted-foreground">Performance metrics, candidate demographics and top assets.</p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as DateRange)}>
          <TabsList>
            {RANGES.map((r) => (
              <TabsTrigger key={r} value={r}>
                {r.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Site Visits" value={summary.totalVisits} change={8.2} icon={Eye} />
        <KpiCard label="Applications Submitted" value={summary.totalApplications} change={5.4} icon={FileCheck} />
        <KpiCard label="Conversion Rate" value={summary.conversionRate} change={1.1} icon={TrendingUp} format="percent" />
        <KpiCard label="Avg Daily Visitors" value={summary.avgDaily} change={-2.3} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TrafficChart data={series} rangeLabel={DATE_RANGE_LABELS[range]} />
        <ApplicationsChart data={series} rangeLabel={DATE_RANGE_LABELS[range]} />
      </div>

      <DemographicsCharts />

      <TopJobsTable />
    </div>
  );
}
