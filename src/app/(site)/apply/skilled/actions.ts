"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendApplicationConfirmation } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import { ACCEPTED_CV_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/validations/skilled-application";
import type { ActionResult } from "@/lib/action-result";

export async function submitSkilledApplication(formData: FormData): Promise<ActionResult> {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const headline = String(formData.get("headline") || "").trim();
  const rightToWorkStatus = String(formData.get("rightToWorkStatus") || "").trim();
  const cvFile = formData.get("cvFile");

  if (!fullName || !email || !phone || !location || !headline || !rightToWorkStatus) {
    return { success: false, message: "Please complete all required fields." };
  }

  if (!(cvFile instanceof File) || cvFile.size === 0) {
    return { success: false, message: "Please attach your CV (PDF or DOCX)." };
  }
  if (cvFile.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, message: "Your CV must be 10MB or smaller." };
  }
  if (!ACCEPTED_CV_TYPES.includes(cvFile.type)) {
    return { success: false, message: "Only PDF or DOCX files are accepted." };
  }

  let cvUrl: string | null = null;

  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const supabase = await createClient();

    if (admin && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const candidateFolder = user?.id ?? crypto.randomUUID();
      const path = `${candidateFolder}/${Date.now()}-${cvFile.name}`;
      const arrayBuffer = await cvFile.arrayBuffer();

      const { error: uploadError } = await admin.storage
        .from("cvs")
        .upload(path, Buffer.from(arrayBuffer), { contentType: cvFile.type, upsert: false });

      if (!uploadError) {
        cvUrl = path;
      }

      // Best-effort candidate profile upsert — requires the applicant to be
      // authenticated; anonymous skilled applications are still recorded via
      // email notification even if we can't persist a candidate row.
      if (user) {
        await admin.from("candidates").upsert(
          {
            profile_id: user.id,
            candidate_type: "skilled",
            headline,
            location,
            right_to_work_status: rightToWorkStatus,
            cv_url: cvUrl,
            cv_filename: cvFile.name,
          },
          { onConflict: "profile_id" }
        );
      }
    }
  }

  await sendApplicationConfirmation({
    candidateEmail: email,
    candidateName: fullName,
    jobTitle: headline || "a role with ApexWork",
  });

  return {
    success: true,
    message: "Your CV has been submitted. Our team will match you against live roles and be in touch.",
  };
}
