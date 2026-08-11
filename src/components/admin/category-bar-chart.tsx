"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: { label: "Open Roles", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function CategoryBarChart({ data }: { data: { category: string; count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs by Category</CardTitle>
        <CardDescription>Live vacancies grouped by industry</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={150}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} barSize={18} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
