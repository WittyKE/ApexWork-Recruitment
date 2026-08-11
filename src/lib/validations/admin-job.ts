import { z } from "zod";

export const adminJobSchema = z.object({
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
  visaSponsorship: z.boolean(),
  status: z.enum(["draft", "published", "closed", "archived"]),
});

export type AdminJobValues = z.infer<typeof adminJobSchema>;
