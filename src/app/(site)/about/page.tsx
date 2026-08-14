import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, Globe2, MapPin, Phone, ShieldCheck, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FeatureCard } from "@/components/site/feature-card";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ApexWork Recruitment bridges global talent with UK industry needs, operating from Huntingdon with full UK regulatory compliance.",
};

const VALUES = [
  {
    icon: <Target className="size-6" />,
    title: "Our Mission",
    description:
      "To bridge global talent with UK industry needs — connecting skilled professionals and essential workers directly with employer opportunities across the country.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    title: "Compliance First",
    description:
      "Every placement is grounded in UK employment law, Right to Work verification, and GDPR-compliant data handling.",
  },
  {
    icon: <Globe2 className="size-6" />,
    title: "Global Reach",
    description:
      "We source candidates internationally as well as locally, supporting visa sponsorship routes where employers need them.",
  },
  {
    icon: <Users className="size-6" />,
    title: "People First",
    description:
      "From caregivers to senior engineers, we treat every candidate's career move with the same care and diligence.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About ApexWork Recruitment</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              ApexWork is a UK-based global recruitment and job-matching platform. We exist to bridge the gap
              between international and domestic talent and the industries that need them — from healthcare and
              security to gardening, IT and engineering.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you&apos;re a skilled professional uploading a CV or an essential worker registering for
              caregiver, security or labour roles, our platform is built to get you in front of vetted UK employers
              quickly, securely, and in full compliance with UK regulations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className={buttonVariants({ size: "lg" })}>
                Browse Live Jobs
              </Link>
              <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Get In Touch
              </Link>
            </div>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.02] sm:h-96">
            <Image src="/images/hero-banner.png" alt="ApexWork professionals" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Stand For</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <FeatureCard key={v.title} index={i} icon={v.icon} title={v.title} description={v.description} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">UK Regulatory Compliance</h2>
            <p className="mt-4 text-muted-foreground">
              ApexWork Recruitment operates in full accordance with UK employment and data protection law:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Right to Work checks under the Immigration, Asylum and Nationality Act 2006",
                "UK GDPR-compliant candidate data processing and secure storage",
                "Gangmasters and Labour Abuse Authority (GLAA) standards where applicable",
                "SIA licence verification for all security personnel placements",
                "Care Certificate and NVQ verification for healthcare & caregiving roles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 [animation-delay:150ms] transition-shadow hover:shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="size-5" />
                <h3 className="font-semibold">Our Office</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {siteConfig.address.full}
                </p>
                {siteConfig.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="flex items-center gap-2.5 transition-colors hover:text-primary"
                  >
                    <Phone className="size-4 shrink-0" />
                    {phone.display}
                  </a>
                ))}
              </div>
              <div className="group relative mt-6 aspect-video overflow-hidden rounded-lg">
                <Image
                  src="/images/office-location.jpg"
                  alt="ApexWork Recruitment office"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
