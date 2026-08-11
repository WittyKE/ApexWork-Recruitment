import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  FileCheck2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSearchBar } from "@/components/site/hero-search-bar";
import { JobCard } from "@/components/site/job-card";
import { FeatureCard } from "@/components/site/feature-card";
import { getFeaturedJobs } from "@/lib/data/jobs";
import { categoryAccent } from "@/lib/category-colors";
import type { JobCategory } from "@/lib/supabase/types";
import { siteConfig } from "@/lib/env";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const featuredJobs = await getFeaturedJobs(6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 lg:min-h-[calc(100svh-5rem)]">
        <Image
          src="/images/hero-banner.png"
          alt="ApexWork professionals collaborating"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/80 via-blue-900/50 to-blue-800/10" />
        <div className="absolute inset-0 bg-linear-to-r from-blue-800/20 via-blue-800/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-blue-800/20 via-blue-800/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_80%_18%,rgba(2,6,23,0.2),transparent_85%)]" />
        <div className="absolute inset-0 bg-grid-white opacity-10 mask-[radial-gradient(ellipse_80%_60%_at_20%_0%,black_40%,transparent_100%)]" />
        <div
          aria-hidden
          className="absolute -top-24 left-1/3 size-96 animate-float-slow rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-0 size-80 animate-float rounded-full bg-gold/15 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-24 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:px-8 lg:py-10 xl:py-16">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Badge className="mb-5 gap-1.5 bg-primary/15 text-primary hover:bg-primary/15">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              UK-Based Global Recruitment Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Gateway to <span className="text-primary">UK Jobs</span> &amp; Global Opportunities
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{siteConfig.valueProp}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply/skilled"
                className={cn(buttonVariants({ size: "lg" }), "group gap-2 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30")}
              >
                Upload Your CV (Skilled){" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/apply/essential"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "gap-2 border-white/30 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                )}
              >
                Register for Essential Roles
              </Link>
            </div>
          </div>

          <div className="mt-16 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 [animation-delay:150ms] fill-mode-both lg:mt-auto lg:pt-8 lg:pb-0">
            <HeroSearchBar />
          </div>
        </div>
      </section>

      {/* DUAL PATHWAY */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Two Pathways, One Platform</h2>
          <p className="mt-4 text-muted-foreground">
            Whichever stage of your career you&apos;re at, ApexWork has a route built for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PathwayCard
            index={0}
            icon={<FileCheck2 className="size-6" />}
            eyebrow="For Skilled Professionals"
            title="Upload Your CV, Get Matched Automatically"
            description="Our CV parsing engine reads your experience and skills, then matches you against live UK roles in IT, engineering, healthcare and more — including visa-sponsored positions."
            bullets={["Automated CV parsing & job matching", "Right to Work & visa sponsorship filters", "Secure document storage"]}
            cta={{ href: "/apply/skilled", label: "Upload Your CV" }}
          />
          <PathwayCard
            index={1}
            icon={<HeartHandshake className="size-6" />}
            eyebrow="For Essential & Skilled Labour"
            title="Direct Registration — No CV Required"
            description="Register directly for caregiver, SIA-licensed security, gardening and general labour roles with a simple structured form built for your trade."
            bullets={["Caregiver, security & gardening pathways", "Structured, role-specific questions", "Fast-tracked to matching vacancies"]}
            cta={{ href: "/apply/essential", label: "Register Now" }}
          />
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Jobs</h2>
              <p className="mt-2 text-muted-foreground">Live vacancies from vetted UK employers, updated daily.</p>
            </div>
            <Link href="/jobs" className={cn(buttonVariants({ variant: "outline" }), "group gap-2")}>
              View All Jobs <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* JOB SEEKER CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-10 lg:grid-cols-2 lg:p-16">
          <div aria-hidden className="absolute -top-16 -right-16 size-72 animate-float-slow rounded-full bg-primary/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-10 size-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/15">For Job Seekers</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Out of Work Doesn&apos;t Mean Out of Options
            </h2>
            <p className="mt-4 text-slate-300">
              Wherever you&apos;re starting from — however long you&apos;ve been searching, whatever&apos;s on
              your CV or not — there&apos;s a place for you here. We welcome people of every background,
              qualification and walk of life, and match you with real UK employers ready to give you a fair
              chance. Your next opportunity doesn&apos;t care where you&apos;ve been. It only cares where
              you&apos;re going.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/apply/skilled" className={cn(buttonVariants({ size: "lg" }), "group gap-2 shadow-lg shadow-primary/25")}>
                Upload Your CV <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/apply/essential"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                )}
              >
                Register for Essential Roles
              </Link>
            </div>
          </div>
          <div className="relative h-64 overflow-hidden rounded-2xl transition-transform duration-500 hover:scale-[1.02] lg:h-full">
            <Image src="/images/service-banner.png" alt="ApexWork job seekers starting their next role" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* TRUST & COMPLIANCE */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trust &amp; Compliance, Built In</h2>
            <p className="mt-4 text-muted-foreground">
              Every candidate and employer on ApexWork is verified against UK legal and regulatory standards.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              index={0}
              icon={<ShieldCheck className="size-6" />}
              title="Right to Work Checks"
              description="Every candidate's right to work in the UK is verified in line with Home Office requirements."
            />
            <FeatureCard
              index={1}
              icon={<UserCheck className="size-6" />}
              title="Secure Verification"
              description="Identity, certification and licence checks (SIA, NVQ, Care Certificate) are securely stored and verified."
            />
            <FeatureCard
              index={2}
              icon={<BadgeCheck className="size-6" />}
              title="UK Legal Standards"
              description="Fully compliant with UK employment law, GDPR data protection, and GLAA standards where applicable."
            />
            <FeatureCard
              index={3}
              icon={<Sparkles className="size-6" />}
              title="Vetted Employers"
              description="Every employer profile is reviewed before job postings go live on the platform."
            />
          </div>
        </div>
      </section>

      {/* ROLE CATEGORIES STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <CategoryChip index={0} icon={<Stethoscope className="size-5" />} label="Healthcare & Caregiving" category="healthcare_caregiving" />
          <CategoryChip index={1} icon={<ShieldCheck className="size-5" />} label="Security" category="security" />
          <CategoryChip index={2} icon={<Users className="size-5" />} label="Gardening & Landscaping" category="gardening_landscaping" />
          <CategoryChip index={3} icon={<Briefcase className="size-5" />} label="IT & Technology" category="it_technology" />
          <CategoryChip index={4} icon={<HeartHandshake className="size-5" />} label="Engineering" category="engineering" />
          <CategoryChip index={5} icon={<FileCheck2 className="size-5" />} label="Logistics & Warehouse" category="logistics_warehouse" />
        </div>
      </section>
    </>
  );
}

function PathwayCard({
  icon,
  eyebrow,
  title,
  description,
  bullets,
  cta,
  index = 0,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { href: string; label: string };
  index?: number;
}) {
  return (
    <Card
      className="group relative h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both overflow-hidden border-2 duration-700 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-150"
      />
      <CardContent className="relative flex h-full flex-col p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <ul className="mt-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link href={cta.href} className={cn(buttonVariants({}), "group/cta mt-6 w-full gap-2 sm:w-fit")}>
          {cta.label}
          <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

function CategoryChip({
  icon,
  label,
  category,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  category: JobCategory;
  index?: number;
}) {
  const accent = categoryAccent(category);
  return (
    <Link
      href={`/jobs?category=${category}`}
      className="group flex animate-in fade-in zoom-in-95 fill-mode-both flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center duration-500 transition-all hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_40%,transparent)] hover:shadow-lg hover:shadow-[color-mix(in_oklab,var(--accent)_18%,transparent)]"
      style={{ animationDelay: `${index * 80}ms`, ["--accent" as string]: accent }}
    >
      <span
        className="flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
      >
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
