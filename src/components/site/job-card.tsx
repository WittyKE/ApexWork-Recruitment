import Link from "next/link";
import { Briefcase, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { categoryAccent, categoryAccentStyle } from "@/lib/category-colors";
import { EMPLOYMENT_TYPE_LABELS, JOB_CATEGORY_LABELS, type JobWithEmployer } from "@/lib/supabase/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function JobCard({ job, index = 0 }: { job: JobWithEmployer; index?: number }) {
  const accent = categoryAccent(job.category);

  return (
    <Card
      className="group relative h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both border-border/60 duration-700 transition-all hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] hover:shadow-xl hover:shadow-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      style={{ animationDelay: `${index * 80}ms`, ["--accent" as string]: accent }}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: `linear-gradient(to right, ${accent}, color-mix(in oklab, ${accent} 25%, transparent))` }}
      />
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 18%, transparent), color-mix(in oklab, ${accent} 6%, transparent))`,
                color: accent,
                boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 22%, transparent)`,
              }}
            >
              {initials(job.employer.company_name)}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{job.employer.company_name}</p>
              <h3 className="mt-0.5 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                <Link href={`/jobs/${job.slug}`} className="after:absolute after:inset-0">
                  {job.title}
                </Link>
              </h3>
            </div>
          </div>
          {job.visa_sponsorship && (
            <Badge className="relative z-10 shrink-0 gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              Visa Sponsorship
            </Badge>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary/70" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-primary/70" />
            {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground">{job.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
          <Badge className="border-0" style={categoryAccentStyle(job.category)}>
            {JOB_CATEGORY_LABELS[job.category]}
          </Badge>
          <span className="relative z-10 inline-flex items-center gap-1 text-sm font-medium text-primary">
            View role
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
