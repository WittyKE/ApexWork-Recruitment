import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Building2, CalendarClock, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { JobCard } from "@/components/site/job-card";
import { AuPairJobDetail } from "@/components/site/au-pair-job-detail";
import { getJobBySlug, getRelatedJobs } from "@/lib/data/jobs";
import { EMPLOYMENT_TYPE_LABELS, isJobAcceptingApplications, JOB_CATEGORY_LABELS } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job not found" };
  if (job.auPair) {
    return {
      title: `Au Pair with Family ${job.auPair.familyName} — ${job.auPair.country}`,
      description: job.description.slice(0, 155),
    };
  }
  return {
    title: `${job.title} at ${job.employer.company_name}`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const relatedJobs = await getRelatedJobs(job, 3);

  if (job.category === "au_pair" && job.auPair) {
    return <AuPairJobDetail job={job} relatedJobs={relatedJobs} />;
  }

  const applyHref = `/apply/skilled?job=${job.slug}`;
  const acceptingApplications = isJobAcceptingApplications(job);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-primary">
          Jobs
        </Link>{" "}
        / <span className="text-foreground">{job.title}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="size-4" />
            {job.employer.company_name}
            {job.employer.is_verified && (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="size-3" /> Verified Employer
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {job.location}
              {job.is_remote && " (Remote)"}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" /> {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
            </span>
            {job.published_at && (
              <span className="flex items-center gap-1.5">
                <CalendarClock className="size-4" /> Posted{" "}
                {new Date(job.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </div>
        {acceptingApplications ? (
          <Link href={applyHref} className={cn(buttonVariants({ size: "lg" }), "w-full shrink-0 sm:w-auto")}>
            Apply Now
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
        <Badge variant="secondary">{JOB_CATEGORY_LABELS[job.category]}</Badge>
        {job.visa_sponsorship && (
          <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldCheck className="size-3" /> Visa Sponsorship Available
          </Badge>
        )}
        {!acceptingApplications && (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400">
            {job.status === "closed" ? "Position Closed" : "No Longer Accepting Applications"}
          </Badge>
        )}
      </div>

      {!acceptingApplications && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
          This position is no longer accepting applications. Browse similar roles below, or register your interest so
          we can match you against future opportunities.
        </p>
      )}

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">Job Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{job.description}</p>
          </section>

          {job.requirements && (
            <section>
              <h2 className="text-xl font-semibold">Requirements</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{job.requirements}</p>
            </section>
          )}

          {job.benefits && (
            <section>
              <h2 className="text-xl font-semibold">Benefits</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{job.benefits}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">About {job.employer.company_name}</h3>
              {job.employer.industry && <p className="mt-1 text-sm text-muted-foreground">{job.employer.industry}</p>}
              <p className="mt-3 text-sm text-muted-foreground">
                This employer works with ApexWork Recruitment to source right-to-work verified candidates
                for UK-based roles.
              </p>
              {acceptingApplications ? (
                <Link href={applyHref} className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}>
                  Apply for this role
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
                Register your interest and we&apos;ll match you against future roles like this one.
              </p>
              <Link href="/apply/essential" className={cn(buttonVariants({ variant: "secondary" }), "mt-4 w-full")}>
                Register for Essential Roles
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedJobs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Similar Roles</h2>
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
