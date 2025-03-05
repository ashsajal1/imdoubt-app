import { z } from "zod";

export const perspectiveSchema = z.object({
  content: z
    .string()
    .min(1, "Perspective content is required")
    .max(500, "Perspective content must be less than 500 characters"),
});

export type PerspectiveInput = z.infer<typeof perspectiveSchema>;