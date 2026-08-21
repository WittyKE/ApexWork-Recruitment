import Link from "next/link";
import {
  Baby,
  CalendarDays,
  Hourglass,
  Languages,
  MapPin,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Users,
  Utensils,
  Ban,
  Globe2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { AuPairGallery } from "@/components/site/au-pair-gallery";
import { JobCard } from "@/components/site/job-card";
import { categoryAccentStyle } from "@/lib/category-colors";
import { isJobAcceptingApplications, type JobWithEmployer } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export function AuPairJobDetail({
  job,
  relatedJobs,
}: {
  job: JobWithEmployer;
  relatedJobs: JobWithEmployer[];
}) {
  const auPair = job.auPair;
  if (!auPair) return null;

  const acceptingApplications = isJobAcceptingApplications(job);
  const childLabel = auPair.children.length === 1 ? "1 child" : `${auPair.children.length} children`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-primary">
          Jobs
        </Link>{" "}
        /{" "}
        <Link href="/jobs?category=au_pair" className="hover:text-primary">
          Au Pair
        </Link>{" "}
        / <span className="text-foreground">Family {auPair.familyName}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span aria-hidden className="text-base">
              {auPair.countryFlag}
            </span>
            {auPair.country}
            {job.employer.is_verified && (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="size-3" /> Verified Family
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Family {auPair.familyName}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Baby className="size-4" /> {childLabel} ({auPair.children.map((age) => `${age}y`).join(", ")})
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> Start: {auPair.startWindow}
            </span>
            <span className="flex items-center gap-1.5">
              <Hourglass className="size-4" /> {auPair.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="size-4" /> {auPair.languages.join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" /> {auPair.occupation}
            </span>
          </div>
        </div>
        {acceptingApplications ? (
          <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "w-full shrink-0 sm:w-auto")}>
            Express Interest
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full shrink-0 cursor-not-allowed opacity-60 sm:w-auto"
            )}
            aria-disabled="true"
          >
            Applications Closed
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge className="border-0" style={categoryAccentStyle("au_pair")}>
          Au Pair
        </Badge>
        <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400">
          <Sparkles className="size-3" /> {auPair.highlight}
        </Badge>
        {!acceptingApplications && (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400">
            {job.status === "closed" ? "Placement Filled" : "No Longer Accepting Applications"}
          </Badge>
        )}
      </div>

      {!acceptingApplications && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
          This family has already been matched with an au pair. Browse similar families below, or express interest
          so we can introduce you to other host families like this one.
        </p>
      )}

      <div className="mt-8">
        <AuPairGallery images={auPair.images} alt={`Family ${auPair.familyName} in ${job.location}`} />
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">Family Description</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
              {auPair.familyDescription.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Family Unique Experience</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{auPair.uniqueExperience}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Preferences</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PreferenceItem icon={<Users className="size-4" />} label="Au pair" value={auPair.preferences.gender} />
              <PreferenceItem icon={<CalendarDays className="size-4" />} label="Age" value={auPair.preferences.ageRange} />
              <PreferenceItem icon={<Globe2 className="size-4" />} label="Eligible region" value={auPair.preferences.region} />
              <PreferenceItem
                icon={<Languages className="size-4" />}
                label="Languages"
                value={`${auPair.preferences.languageLevel}${
                  auPair.preferences.languages.length ? ` · also welcome: ${auPair.preferences.languages.join(", ")}` : ""
                }`}
              />
              <PreferenceItem icon={<Utensils className="size-4" />} label="Food" value={auPair.preferences.food} />
              <PreferenceItem icon={<Ban className="size-4" />} label="Smoking" value={auPair.preferences.smoking} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">About Family {auPair.familyName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {auPair.occupation} · {job.location}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                This host family works with ApexWork Recruitment to welcome a caring, reliable au pair into their
                home.
              </p>
              {acceptingApplications ? (
                <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}>
                  Express interest in this family
                </Link>
              ) : (
                <span
                  className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full cursor-not-allowed opacity-60")}
                  aria-disabled="true"
                >
                  Applications Closed
                </span>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold">Not quite right?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse more host families looking for an au pair across the Netherlands, Germany and neighbouring
                countries.
              </p>
              <Link href="/jobs?category=au_pair" className={cn(buttonVariants({ variant: "secondary" }), "mt-4 w-full")}>
                Browse Au Pair Families
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedJobs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Similar Au Pair Families</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedJobs.map((related) => (
              <JobCard key={related.id} job={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PreferenceItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
