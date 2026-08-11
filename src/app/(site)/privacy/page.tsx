import type { Metadata } from "next";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ApexWork Recruitment Agency collects, uses and protects your personal data, in line with UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight">
        <p>
          ApexWork Recruitment Agency (&quot;ApexWork&quot;, &quot;we&quot;, &quot;us&quot;) is committed to
          protecting the privacy of candidates, employers and website visitors. This policy explains what personal
          data we collect, why we collect it, and how it is used, in accordance with the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>

        <h2>1. Data We Collect</h2>
        <ul>
          <li>Contact details (name, email, phone number, location)</li>
          <li>CVs, certificates and supporting documents uploaded by candidates</li>
          <li>Right to Work status and, where applicable, visa/sponsorship information</li>
          <li>Role-specific credentials (e.g. SIA licence numbers, Care Certificate status, NVQ level)</li>
          <li>Employer company information for job postings</li>
          <li>Usage data collected via cookies and analytics</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>We process personal data to:</p>
        <ul>
          <li>Match candidates with relevant job opportunities</li>
          <li>Share candidate profiles and documents with prospective employers, with consent</li>
          <li>Verify Right to Work status and relevant licences/certifications</li>
          <li>Communicate about applications, job postings and account activity</li>
          <li>Comply with our legal and regulatory obligations</li>
        </ul>

        <h2>3. Data Storage &amp; Security</h2>
        <p>
          All candidate documents (CVs, certificates) are stored in access-controlled, encrypted storage. Access is
          restricted to authorised ApexWork staff and prospective employers directly relevant to an application.
        </p>

        <h2>4. Your Rights</h2>
        <p>
          Under UK GDPR, you have the right to access, correct, delete, or restrict processing of your personal
          data, and the right to data portability. To exercise these rights, contact us at{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain candidate and employer data for as long as necessary to provide our services and meet legal
          obligations, after which it is securely deleted or anonymised.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          ApexWork Recruitment Agency, {siteConfig.address.full}
          <br />
          Phone: {siteConfig.phone.display}
          <br />
          Email: {siteConfig.email}
        </p>
      </div>
    </div>
  );
}
