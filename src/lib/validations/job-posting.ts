import { z } from "zod";

export const jobPostingSchema = z.object({
  title: z.string().trim().min(3, "Enter a job title"),
  category: z.enum([
    "healthcare_caregiving",
    "security",
    "gardening_landscaping",
    "it_technology",
    "engineering",
    "hospitality",
    "construction",
    "logistics_warehouse",
    "administration",
    "other",
  ]),
  employmentType: z.enum(["full_time", "part_time", "contract", "temporary", "seasonal"]),
  location: z.string().trim().min(2, "Enter a location"),
  isRemote: z.boolean(),
  visaSponsorship: z.boolean(),
  description: z.string().trim().min(50, "Description should be at least 50 characters"),
  requirements: z.string().trim().min(10, "List the key requirements"),
  benefits: z.string().trim().optional().or(z.literal("")),
});

export type JobPostingValues = z.infer<typeof jobPostingSchema>;

export const employerRegistrationSchema = z.object({
  companyName: z.string().trim().min(2, "Enter your company name"),
  contactName: z.string().trim().min(2, "Enter a contact name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  industry: z.string().trim().min(2, "Enter your industry"),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  website: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
});

export type EmployerRegistrationValues = z.infer<typeof employerRegistrationSchema>;
