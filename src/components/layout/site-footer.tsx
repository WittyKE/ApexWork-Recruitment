import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Link2, Globe, AtSign } from "lucide-react";
import { siteConfig } from "@/lib/env";

const JOB_SEEKER_LINKS = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/apply/skilled", label: "Upload Your CV" },
  { href: "/apply/essential", label: "Register for Essential Roles" },
];

const EMPLOYER_LINKS = [
  { href: "/employers", label: "Hiring Solutions" },
  { href: "/employers/post-job", label: "Post a Job" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="w-fit rounded-lg bg-transparent p-0">
              <Image
                src="/images/logo.png"
                alt="ApexWork Recruitment"
                width={174}
                height={44}
                className="h-9 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Your Gateway to UK Jobs &amp; Global Opportunities. We connect skilled professionals and essential
              workers directly with vetted UK employer opportunities.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{siteConfig.address.full}</span>
              </div>
              <a href={siteConfig.phone.href} className="flex items-center gap-2.5 hover:text-white">
                <Phone className="size-4 shrink-0 text-primary" />
                {siteConfig.phone.display}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 hover:text-white">
                <Mail className="size-4 shrink-0 text-primary" />
                {siteConfig.email}
              </a>
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="LinkedIn" className="rounded-full bg-slate-800 p-2 hover:bg-primary">
                <Link2 className="size-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full bg-slate-800 p-2 hover:bg-primary">
                <Globe className="size-4" />
              </a>
              <a href="#" aria-label="Twitter / X" className="rounded-full bg-slate-800 p-2 hover:bg-primary">
                <AtSign className="size-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="For Job Seekers" links={JOB_SEEKER_LINKS} />
          <FooterColumn title="For Employers" links={EMPLOYER_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-xs leading-relaxed text-slate-500">
            ApexWork Recruitment operates in full compliance with UK employment law, including Right to Work
            verification under the Immigration, Asylum and Nationality Act 2006, GDPR (UK) data protection
            requirements, and Gangmasters and Labour Abuse Authority (GLAA) standards where applicable. All
            candidate data is processed lawfully and securely.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} ApexWork Recruitment. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-slate-400 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
