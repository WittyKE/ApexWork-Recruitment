import { z } from "zod";

export const adminContactStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});

export type AdminContactStatusValues = z.infer<typeof adminContactStatusSchema>;
