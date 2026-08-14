import { z } from "zod";

export const adminEmployerUpdateSchema = z.object({
  isVerified: z.boolean(),
  industry: z.string().trim().optional().or(z.literal("")),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional(),
});

export type AdminEmployerUpdateValues = z.infer<typeof adminEmployerUpdateSchema>;
