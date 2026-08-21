import { z } from "zod";

export const adminJobSchema = z.object({
  title: z.string().trim().min(3, "Enter a job title"),
  employerId: z.string().trim().uuid("Select an employer"),
  category: z.enum([
    "au_pair",
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
  status: z.enum(["draft", "published", "closed", "archived"]),
});

export type AdminJobValues = z.infer<typeof adminJobSchema>;
