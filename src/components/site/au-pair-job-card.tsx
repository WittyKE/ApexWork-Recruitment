import Link from "next/link";
import { Baby, CalendarDays, Hourglass, Languages, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { categoryAccent, categoryAccentStyle } from "@/lib/category-colors";
import { JOB_CATEGORY_LABELS, type JobWithEmployer } from "@/lib/supabase/types";

function postedFreshness(publishedAt: string | null): string | null {
  if (!publishedAt) return null;
  const hours = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  if (hours < 0) return null;
  if (hours < 24) return "Posted today";
  if (hours < 24 * 3) return "New this week";
  return null;
}

function childSummary(children: number[]) {
  const label = children.length === 1 ? "1 child" : `${children.length} children`;
  return `${label}, ${children.map((age) => `${age}y`).join("/")}`;
}

export function AuPairJobCard({ job, index = 0 }: { job: JobWithEmployer; index?: number }) {
  const auPair = job.auPair;
  if (!auPair) return null;

  const accent = categoryAccent("au_pair");
  const freshness = postedFreshness(job.published_at);
  const cover = auPair.images[0];

  return (
    <Card
      className="group relative h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both overflow-hidden border-border/60 duration-700 transition-all hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] hover:shadow-xl hover:shadow-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      style={{ animationDelay: `${index * 80}ms`, ["--accent" as string]: accent }}
    >
      <Link href={`/jobs/${job.slug}`} className="absolute inset-0 z-10" aria-label={`View Family ${auPair.familyName}`} />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`Family ${auPair.familyName} in ${auPair.country}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {freshness && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur dark:bg-black/60 dark:text-emerald-400">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            {freshness}
          </span>
        )}
        {job.status !== "published" && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 shadow-sm dark:bg-rose-500/20 dark:text-rose-300">
            Expired
          </span>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          Family {auPair.familyName}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden>{auPair.countryFlag}</span> {auPair.country}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary/70" /> {job.location}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Hourglass className="size-3.5 text-primary/70" /> {auPair.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-primary/70" /> Starts {auPair.startWindow}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Baby className="size-3.5 text-primary/70" /> {childSummary(auPair.children)}
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="size-3.5 text-primary/70" /> {auPair.languages.join(", ")}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-foreground/80">
          <Sparkles className="size-3.5 shrink-0 text-primary/70" />
          {auPair.highlight}
        </p>

        <div className="mt-4 flex flex-1 items-end justify-between border-t border-border/60 pt-4">
          <Badge className="border-0" style={categoryAccentStyle("au_pair")}>
            {JOB_CATEGORY_LABELS.au_pair}
          </Badge>
          <span className="relative z-10 inline-flex items-center gap-1 text-sm font-medium text-primary">
            View family
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
