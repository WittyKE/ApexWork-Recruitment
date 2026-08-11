"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendApplicationConfirmation } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/env";
import {
  essentialContactSchema,
  essentialRoleDetailsSchema,
  type EssentialContactValues,
  type EssentialRoleDetailsValues,
} from "@/lib/validations/essential-application";
import type { ActionResult } from "@/lib/action-result";

const ROLE_LABELS: Record<string, string> = {
  caregiver: "Caregiver",
  security: "Security Guard",
  gardener: "Gardener",
  general_labour: "General Labour",
};

export async function submitEssentialApplication(
  contact: EssentialContactValues,
  details: EssentialRoleDetailsValues
): Promise<ActionResult> {
  const contactResult = essentialContactSchema.safeParse(contact);
  const detailsResult = essentialRoleDetailsSchema.safeParse(details);

  if (!contactResult.success || !detailsResult.success) {
    return { success: false, message: "Please check the form for errors and try again." };
  }

  const c = contactResult.data;
  const d = detailsResult.data;

  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const supabase = await createClient();

    if (admin && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: candidate } = await admin
          .from("candidates")
          .upsert(
            {
              profile_id: user.id,
              candidate_type: "essential",
              headline: ROLE_LABELS[d.roleType],
              location: c.location,
              right_to_work_status: c.rightToWorkStatus,
            },
            { onConflict: "profile_id" }
          )
          .select("id")
          .single();

        if (candidate) {
          const essentialRow: Record<string, unknown> = { candidate_id: candidate.id, role_type: d.roleType };

          if (d.roleType === "caregiver") {
            essentialRow.care_certificate_status = d.careCertificateStatus;
            essentialRow.nvq_level = d.nvqLevel;
            essentialRow.driving_license = d.drivingLicense;
            essentialRow.shift_availability = d.shiftAvailability;
          } else if (d.roleType === "security") {
            essentialRow.sia_license_number = d.siaLicenseNumber;
            essentialRow.sia_cctv_endorsement = d.siaCctvEndorsement;
            essentialRow.sia_license_expiry = d.siaLicenseExpiry;
          } else {
            essentialRow.equipment_experience = d.equipmentExperience;
            essentialRow.physical_availability = d.physicalAvailability;
          }

          await admin.from("essential_profiles").upsert(essentialRow, { onConflict: "candidate_id" });
        }
      }
    }
  }

  await sendApplicationConfirmation({
    candidateEmail: c.email,
    candidateName: c.fullName,
    jobTitle: `${ROLE_LABELS[d.roleType]} roles`,
  });

  return {
    success: true,
    message: "You're registered! We'll match you with suitable essential-role vacancies and contact you directly.",
  };
}
