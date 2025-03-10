import { z } from "zod";

export const doubtSchema = z.object({
  content: z
    .string()
    .min(10, "Doubt must be at least 20 characters.")
    .max(250, "Doubt cannot exceed 250 characters."),
  topicId: z
    .number({
      required_error: "Topic is required",
      invalid_type_error: "Topic must be a number"
    })
    .positive("Please select a valid topic"),
});

export type DoubtInput = z.infer<typeof doubtSchema>;

export function validateDoubt(input: { content: string; topicId: number }) {
  const result = doubtSchema.safeParse(input);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      ok: false,
      error: firstError.message,
      field: firstError.path[0], // Returns 'content' or 'topicId'
    };
  }
  
  return { 
    ok: true, 
    data: result.data 
  };
}
