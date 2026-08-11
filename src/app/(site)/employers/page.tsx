import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Users2, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FeatureCard } from "@/components/site/feature-card";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Hiring Solutions for UK Employers",
  description:
    "Access vetted, right-to-work verified candidates for skilled and essential roles across the UK. Post a job with ApexWork Recruitment today.",
};

const SOLUTIONS = [
  {
    icon: <Users2 className="size-6" />,
    title: "Vetted Candidate Pool",
    description: "Every candidate is right-to-work verified before appearing in your shortlist — skilled professionals and essential workers alike.",
  },
  {
    icon: <Globe2 className="size-6" />,
    title: "Global & Local Talent",
    description: "Source locally in the UK or reach internationally qualified candidates ready for visa sponsorship.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Fast-Tracked Matching",
    description: "Our platform automatically matches skilled CVs and essential-worker registrations to your live vacancies.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    title: "Compliance Built In",
    description: "Right to Work checks, SIA/NVQ/Care Certificate verification and GDPR-compliant data handling as standard.",
  },
];

const PROCESS = [
  { step: "1", title: "Post Your Vacancy", description: "Tell us the role, requirements, and whether visa sponsorship is available." },
  { step: "2", title: "We Match Candidates", description: "Our platform surfaces right-to-work verified candidates matching your criteria within days." },
  { step: "3", title: "Review & Interview", description: "Review CVs and structured profiles directly, then invite your shortlist to interview." },
  { step: "4", title: "Hire with Confidence", description: "Onboard your new hire knowing all compliance checks have been completed." },
];

export default function EmployersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <Image src="/images/service-banner.png" alt="ApexWork service professionals" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-grid-white [mask-image:radial-gradient(ellipse_80%_60%_at_20%_0%,black_40%,transparent_100%)]" />
        <div aria-hidden className="absolute -top-20 right-1/4 size-96 animate-float-slow rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Hiring in the UK? Access Vetted Global &amp; Local Talent
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              From caregivers and SIA-licensed security guards to senior engineers, ApexWork connects your
              vacancies with right-to-work verified candidates — ready to start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/employers/post-job" className={cn(buttonVariants({ size: "lg" }), "group gap-2 shadow-lg shadow-primary/25")}>
                Post a Job <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                )}
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Recruitment Solutions Built for UK Employers</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <FeatureCard key={s.title} index={i} icon={s.icon} title={s.title} description={s.description} />
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          </div>
          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-6 left-0 hidden h-px w-full bg-linear-to-r from-transparent via-border to-transparent lg:block" />
            {PROCESS.map((p, i) => (
              <div
                key={p.step}
                className="group relative animate-in fade-in slide-in-from-bottom-4 fill-mode-both text-center duration-700"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background transition-transform duration-300 group-hover:scale-110">
                  {p.step}
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl border bg-card p-10 lg:grid-cols-3 lg:p-16">
          <div aria-hidden className="absolute -bottom-16 -left-16 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to find your next hire?</h2>
            <p className="mt-4 text-muted-foreground">
              Post a vacancy in minutes and start receiving matched candidates. Our team is also on hand to support
              higher-volume hiring campaigns for caregiver, security and labour roles.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-primary" />
              No upfront cost to post a job listing
            </div>
          </div>
          <div className="relative flex flex-col gap-3">
            <Link href="/employers/post-job" className={cn(buttonVariants({ size: "lg" }), "shadow-lg shadow-primary/20")}>
              Post a Job
            </Link>
            <a href={siteConfig.phone.href} className={buttonVariants({ size: "lg", variant: "outline" })}>
              Call {siteConfig.phone.display}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
