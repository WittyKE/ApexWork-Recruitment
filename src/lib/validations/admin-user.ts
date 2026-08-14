import { z } from "zod";

export const adminUserSchema = z.object({
  fullName: z.string().trim().min(2, "Enter a full name"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["candidate", "employer", "admin", "manager"]),
  status: z.enum(["active", "inactive"]),
});

export type AdminUserValues = z.infer<typeof adminUserSchema>;

export const adminCreateUserSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter a full name"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().optional().or(z.literal("")),
    role: z.enum(["candidate", "employer", "admin", "manager"]),
    status: z.enum(["active", "inactive"]),
    passwordMode: z.enum(["generate", "set", "invite"]),
    password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
    companyName: z.string().trim().optional().or(z.literal("")),
  })
  .refine((v) => v.passwordMode !== "set" || (v.password && v.password.length >= 8), {
    message: "Enter a password of at least 8 characters",
    path: ["password"],
  })
  .refine((v) => v.role !== "employer" || !!v.companyName?.trim(), {
    message: "Enter a company name for an employer account",
    path: ["companyName"],
  });

export type AdminCreateUserValues = z.infer<typeof adminCreateUserSchema>;
