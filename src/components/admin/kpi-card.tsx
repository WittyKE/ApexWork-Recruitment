import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  format = "number",
}: {
  label: string;
  value: number;
  change: number;
  icon: LucideIcon;
  format?: "number" | "currency" | "percent";
}) {
  const isPositive = change >= 0;
  const formatted =
    format === "currency"
      ? `£${value.toLocaleString()}`
      : format === "percent"
        ? `${value}%`
        : value.toLocaleString();

  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums">{formatted}</p>
          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isPositive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(change)}% vs last period
          </div>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
