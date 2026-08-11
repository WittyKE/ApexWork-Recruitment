"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { candidateTypeSplit, rightToWorkSplit } from "@/lib/admin/analytics";

const typeConfig = {
  "Skilled Professionals": { label: "Skilled Professionals", color: "var(--chart-1)" },
  "Essential Workers": { label: "Essential Workers", color: "var(--chart-2)" },
} satisfies ChartConfig;

const rtwConfig = {
  "UK Citizen / Settled": { label: "UK Citizen / Settled", color: "var(--chart-1)" },
  "Visa Holder": { label: "Visa Holder", color: "var(--chart-2)" },
  "Requires Sponsorship": { label: "Requires Sponsorship", color: "var(--chart-3)" },
  Other: { label: "Other", color: "var(--chart-4)" },
} satisfies ChartConfig;

const TYPE_COLORS = ["var(--chart-1)", "var(--chart-2)"];
const RTW_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function DemographicsCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Mix</CardTitle>
          <CardDescription>Skilled vs. essential worker registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={typeConfig} className="mx-auto aspect-square h-64">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={candidateTypeSplit} dataKey="value" nameKey="type" innerRadius={55} outerRadius={90} strokeWidth={2}>
                {candidateTypeSplit.map((entry, index) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[index]} stroke="var(--background)" />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="type" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Right to Work Status</CardTitle>
          <CardDescription>Distribution across all registered candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={rtwConfig} className="mx-auto aspect-square h-64">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={rightToWorkSplit} dataKey="value" nameKey="status" innerRadius={55} outerRadius={90} strokeWidth={2}>
                {rightToWorkSplit.map((entry, index) => (
                  <Cell key={entry.status} fill={RTW_COLORS[index]} stroke="var(--background)" />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
