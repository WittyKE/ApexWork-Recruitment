"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  applications: { label: "Applications", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ApplicationsChart({ data, rangeLabel }: { data: { date: string; applications: number }[]; rangeLabel: string }) {
  const step = Math.max(1, Math.floor(data.length / 10));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications Submitted</CardTitle>
        <CardDescription>{rangeLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={step} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="applications" fill="var(--color-applications)" radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
