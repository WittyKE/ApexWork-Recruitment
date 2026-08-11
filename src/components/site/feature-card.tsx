import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCENT_CYCLE = ["var(--primary)", "var(--gold)", "var(--chart-3)", "var(--chart-7)"];

export function FeatureCard({
  icon,
  title,
  description,
  index = 0,
  accent,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
  accent?: string;
  className?: string;
}) {
  const color = accent ?? ACCENT_CYCLE[index % ACCENT_CYCLE.length];

  return (
    <Card
      className={cn(
        "group/feature relative animate-in fade-in slide-in-from-bottom-4 fill-mode-both border-border/60 duration-700 transition-all hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--accent)_40%,transparent)] hover:shadow-xl hover:shadow-[color-mix(in_oklab,var(--accent)_18%,transparent)]",
        className
      )}
      style={{ animationDelay: `${index * 90}ms`, ["--accent" as string]: color }}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover/feature:scale-x-100"
        style={{ background: `linear-gradient(to right, ${color}, color-mix(in oklab, ${color} 30%, transparent))` }}
      />
      <CardContent className="p-6">
        <div
          className="flex size-11 items-center justify-center rounded-lg transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:rotate-3"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, ${color} 18%, transparent), color-mix(in oklab, ${color} 6%, transparent))`,
            color,
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 22%, transparent)`,
          }}
        >
          {icon}
        </div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
