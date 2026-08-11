import { z } from "zod";

export const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const skilledStepContactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter your current location"),
});

export const skilledStepEligibilitySchema = z.object({
  rightToWorkStatus: z.enum([
    "uk_citizen",
    "settled_status",
    "pre_settled_status",
    "visa_holder",
    "requires_sponsorship",
    "other",
  ]),
  headline: z.string().trim().min(2, "Enter your current or target job title"),
});

export const skilledStepCvSchema = z.object({
  cvFile: z
    .instanceof(File, { message: "Please upload your CV" })
    .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, "File must be 10MB or smaller")
    .refine((f) => ACCEPTED_CV_TYPES.includes(f.type), "Only PDF or DOCX files are accepted"),
  consent: z.literal(true, { message: "You must consent to processing your data" }),
});

export const skilledApplicationSchema = skilledStepContactSchema
  .merge(skilledStepEligibilitySchema)
  .merge(skilledStepCvSchema);

export type SkilledApplicationValues = z.infer<typeof skilledApplicationSchema>;
