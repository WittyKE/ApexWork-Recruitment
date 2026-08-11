"use server";

import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendJobPostedConfirmation } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import { jobPostingSchema, type JobPostingValues } from "@/lib/validations/job-posting";
import type { ActionResult } from "@/lib/action-result";

export async function postJob(values: JobPostingValues): Promise<ActionResult> {
  const parsed = jobPostingSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "Please check the form for errors and try again." };
  }
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message:
        "Demo mode: this job would be published once Supabase is connected. Configure your environment variables to persist real postings.",
    };
  }

  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) {
    return { success: false, message: "Service temporarily unavailable. Please try again shortly." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Please sign in to your employer account before posting a job." };
  }

  const { data: employer } = await admin.from("employers").select("id, company_name").eq("profile_id", user.id).maybeSingle();
  if (!employer) {
    return { success: false, message: "Complete your employer profile before posting a job." };
  }

  const slug = `${slugify(data.title, { lower: true, strict: true })}-${Math.random().toString(36).slice(2, 7)}`;

  const { error } = await admin.from("jobs").insert({
    employer_id: employer.id,
    title: data.title,
    slug,
    category: data.category,
    employment_type: data.employmentType,
    location: data.location,
    is_remote: data.isRemote,
    visa_sponsorship: data.visaSponsorship,
    description: data.description,
    requirements: data.requirements,
    benefits: data.benefits || null,
    status: "published",
    published_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, message: "Something went wrong posting your job. Please try again." };
  }

  await sendJobPostedConfirmation({ employerEmail: user.email ?? "", companyName: employer.company_name, jobTitle: data.title });

  return { success: true, message: "Your job has been published and is now live on ApexWork." };
}
