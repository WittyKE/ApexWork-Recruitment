"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  candidates: { label: "Candidates", color: "var(--chart-1)" },
  employers: { label: "Employers", color: "var(--chart-2)" },
} satisfies ChartConfig;

/**
 * Candidates (100s) and employers (10s) are different scales, so both are
 * indexed to their first month = 100. This keeps them on one honest shared
 * axis instead of a dual-axis chart, which would misrepresent one series.
 */
export function UserGrowthChart({ data }: { data: { month: string; candidates: number; employers: number }[] }) {
  const base = data[0];
  const indexed = data.map((d) => ({
    month: d.month,
    candidates: Math.round((d.candidates / base.candidates) * 100),
    employers: Math.round((d.employers / base.employers) * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate &amp; Employer Growth</CardTitle>
        <CardDescription>Indexed to 100 at the start of the period (last 7 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={indexed} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} tickFormatter={(v) => `${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="candidates" type="monotone" stroke="var(--color-candidates)" strokeWidth={2} dot={false} />
            <Line dataKey="employers" type="monotone" stroke="var(--color-employers)" strokeWidth={2} dot={false} />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
