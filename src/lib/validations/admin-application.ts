import { z } from "zod";

export const adminApplicationUpdateSchema = z.object({
  status: z.enum([
    "submitted",
    "under_review",
    "shortlisted",
    "interviewing",
    "offered",
    "hired",
    "rejected",
    "withdrawn",
  ]),
  employerNotes: z.string().trim().max(2000, "Notes must be 2000 characters or fewer").optional().or(z.literal("")),
});

export type AdminApplicationUpdateValues = z.infer<typeof adminApplicationUpdateSchema>;
