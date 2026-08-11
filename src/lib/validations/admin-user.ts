import { z } from "zod";

export const adminUserSchema = z.object({
  fullName: z.string().trim().min(2, "Enter a full name"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["candidate", "employer", "admin", "manager"]),
  status: z.enum(["active", "inactive"]),
});

export type AdminUserValues = z.infer<typeof adminUserSchema>;
