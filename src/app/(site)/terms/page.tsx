import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for candidates and employers using the ApexWork Recruitment Agency platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight">
        <p>
          These Terms of Service govern your use of the ApexWork Recruitment Agency platform, operated from{" "}
          {siteConfig.address.full}. By registering as a candidate, posting a job as an employer, or otherwise
          using our services, you agree to these terms.
        </p>

        <h2>1. Candidate Accounts</h2>
        <p>
          Candidates must provide accurate, current information, including right to work status and relevant
          qualifications or licences. Submitting false information may result in account suspension.
        </p>

        <h2>2. Employer Accounts</h2>
        <p>
          Employers must be legally registered UK businesses (or have a verifiable UK hiring entity) and agree to
          comply with UK employment law, including Right to Work checks, when engaging candidates sourced through
          ApexWork.
        </p>

        <h2>3. Job Postings</h2>
        <p>
          Employers are responsible for the accuracy of job listings, including salary ranges, requirements, and
          visa sponsorship availability. ApexWork reserves the right to remove listings that violate UK law or our
          content standards.
        </p>

        <h2>4. No Guarantee of Placement</h2>
        <p>
          ApexWork facilitates connections between candidates and employers but does not guarantee interviews,
          offers, or employment outcomes.
        </p>

        <h2>5. Data &amp; Documents</h2>
        <p>
          By uploading a CV or certificates, you consent to ApexWork sharing that information with prospective
          employers relevant to your application, in accordance with our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          ApexWork is not liable for employment decisions made by employers, or for the accuracy of information
          provided by candidates or employers on the platform.
        </p>

        <h2>7. Governing Law</h2>
        <p>These terms are governed by the laws of England and Wales.</p>

        <h2>8. Contact</h2>
        <p>
          Questions about these terms can be sent to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{" "}
          or by phone on {siteConfig.phone.display}.
        </p>
      </div>
    </div>
  );
}
