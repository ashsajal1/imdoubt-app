import { z } from "zod";

export const perspectiveSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .min(1, "Perspective content is required")
    .max(2000, "Perspective content must be less than 2000 characters"),
});

export type PerspectiveInput = z.infer<typeof perspectiveSchema>;