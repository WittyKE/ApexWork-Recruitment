import "server-only";
import { Resend } from "resend";
import { RESEND_API_KEY, isEmailConfigured, siteConfig } from "@/lib/env";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/supabase/types";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "ApexWork Recruitment <notifications@apexworkrecruitment.co.uk>";

const resend = isEmailConfigured ? new Resend(RESEND_API_KEY) : null;

async function send(to: string | string[], subject: string, html: string) {
  if (!resend) {
    console.info(`[email:dev-mode] Would send "${subject}" to ${Array.isArray(to) ? to.join(", ") : to}`);
    return { success: true, devMode: true };
  }
  try {
    const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    if (error) {
      console.error("[email] Resend error", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[email] Failed to send", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function layout(title: string, bodyHtml: string) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f5f7; padding:32px 0;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#0f172a;padding:24px 32px;">
        <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">ApexWork Recruitment</span>
      </div>
      <div style="padding:32px;color:#1f2937;">
        <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;background:#f9fafb;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;">
        ApexWork Recruitment &middot; ${siteConfig.address.full}<br/>
        ${siteConfig.phones.map((phone) => phone.display).join(" / ")}
      </div>
    </div>
  </div>`;
}

export async function sendApplicationConfirmation(params: {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
}) {
  return send(
    params.candidateEmail,
    `Application received: ${params.jobTitle}`,
    layout(
      "We've received your application",
      `<p>Hi ${params.candidateName},</p>
       <p>Thanks for applying for <strong>${params.jobTitle}</strong> through ApexWork Recruitment. Our team will review your details and be in touch if you're shortlisted.</p>
       <p>You can expect to hear from us within 5 working days.</p>
       <p>Best regards,<br/>The ApexWork Team</p>`
    )
  );
}

export async function sendEmployerApplicationAlert(params: {
  employerEmail: string;
  companyName: string;
  jobTitle: string;
  candidateName: string;
}) {
  return send(
    params.employerEmail,
    `New applicant for ${params.jobTitle}`,
    layout(
      "You have a new applicant",
      `<p>Hi ${params.companyName} team,</p>
       <p><strong>${params.candidateName}</strong> just applied for <strong>${params.jobTitle}</strong>.</p>
       <p>Log in to your employer dashboard to review the application and CV.</p>`
    )
  );
}

export async function sendContactFormNotification(params: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return send(
    "info@apexworkrecruitment.co.uk",
    `New contact form submission: ${params.subject}`,
    layout(
      "New contact form submission",
      `<p><strong>Name:</strong> ${params.name}</p>
       <p><strong>Email:</strong> ${params.email}</p>
       <p><strong>Phone:</strong> ${params.phone || "—"}</p>
       <p><strong>Subject:</strong> ${params.subject}</p>
       <p><strong>Message:</strong></p>
       <p>${params.message.replace(/\n/g, "<br/>")}</p>`
    )
  );
}

export async function sendContactFormAcknowledgement(params: { name: string; email: string }) {
  return send(
    params.email,
    "We've received your message",
    layout(
      "Thanks for contacting ApexWork",
      `<p>Hi ${params.name},</p>
       <p>Thanks for reaching out to ApexWork Recruitment. A member of our team will get back to you shortly.</p>
       <p>If your enquiry is urgent, you can call us on ${siteConfig.phones.map((phone) => phone.display).join(" or ")}.</p>`
    )
  );
}

export async function sendJobPostedConfirmation(params: { employerEmail: string; companyName: string; jobTitle: string }) {
  return send(
    params.employerEmail,
    `Job posted: ${params.jobTitle}`,
    layout(
      "Your job posting is live",
      `<p>Hi ${params.companyName} team,</p>
       <p>Your job listing <strong>${params.jobTitle}</strong> has been submitted and is now visible to candidates on ApexWork.</p>`
    )
  );
}

export async function sendApplicationStatusUpdate(params: {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  status: ApplicationStatus;
}) {
  return send(
    params.candidateEmail,
    `Update on your application: ${params.jobTitle}`,
    layout(
      "Your application status has changed",
      `<p>Hi ${params.candidateName},</p>
       <p>Your application for <strong>${params.jobTitle}</strong> has moved to: <strong>${APPLICATION_STATUS_LABELS[params.status]}</strong>.</p>
       <p>Our team will be in touch with next steps.</p>`
    )
  );
}

export async function sendEnquiryResolvedNotification(params: { name: string; email: string; subject: string }) {
  return send(
    params.email,
    `Re: ${params.subject}`,
    layout(
      "Your enquiry has been resolved",
      `<p>Hi ${params.name},</p>
       <p>We've marked your enquiry "<strong>${params.subject}</strong>" as resolved. If you need anything further, just reply to this email or contact us directly.</p>`
    )
  );
}
