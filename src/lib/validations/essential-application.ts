import { z } from "zod";

export const essentialContactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter your current location"),
  rightToWorkStatus: z.enum([
    "uk_citizen",
    "settled_status",
    "pre_settled_status",
    "visa_holder",
    "requires_sponsorship",
    "other",
  ]),
});

export const roleTypeSchema = z.enum(["caregiver", "security", "gardener", "general_labour"]);

export const caregiverDetailsSchema = z.object({
  roleType: z.literal("caregiver"),
  careCertificateStatus: z.enum(["held", "in_progress", "not_held"]),
  nvqLevel: z.enum(["none", "level_2", "level_3", "level_4_plus"]),
  drivingLicense: z.boolean(),
  shiftAvailability: z.array(z.enum(["days", "nights", "weekends", "live_in"])).min(1, "Select at least one shift option"),
});

export const securityDetailsSchema = z.object({
  roleType: z.literal("security"),
  siaLicenseNumber: z.string().trim().min(6, "Enter your SIA licence number"),
  siaCctvEndorsement: z.boolean(),
  siaLicenseExpiry: z.string().trim().min(1, "Enter your licence expiry date"),
});

const gardenerFields = {
  equipmentExperience: z.string().trim().min(2, "Describe your equipment/machinery experience"),
  physicalAvailability: z.enum(["full_time", "part_time", "weekends_only", "seasonal"]),
};

// Shared shape for the gardener/general-labour form (roleType is attached
// after validation, not user-editable, so it's excluded from this schema —
// this avoids a discriminated-literal type clash between the two roles).
export const gardenerFieldsSchema = z.object(gardenerFields);

export const gardenerDetailsSchema = z.object({ roleType: z.literal("gardener"), ...gardenerFields });
export const generalLabourDetailsSchema = z.object({ roleType: z.literal("general_labour"), ...gardenerFields });

export const essentialRoleDetailsSchema = z.discriminatedUnion("roleType", [
  caregiverDetailsSchema,
  securityDetailsSchema,
  gardenerDetailsSchema,
  generalLabourDetailsSchema,
]);

export type EssentialContactValues = z.infer<typeof essentialContactSchema>;
export type EssentialRoleDetailsValues = z.infer<typeof essentialRoleDetailsSchema>;
export type EssentialApplicationValues = EssentialContactValues & EssentialRoleDetailsValues;
