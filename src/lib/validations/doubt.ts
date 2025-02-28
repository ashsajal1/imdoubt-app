import { z } from "zod"

export const doubtSchema = z.object({
  content: z
    .string()
    .min(10, "Doubt must be at least 20 characters.")
    .max(250, "Doubt cannot exceed 250 characters."),
})

export type DoubtInput = z.infer<typeof doubtSchema>

export function validateDoubt(input: { content: string }) {
  const result = doubtSchema.safeParse(input)
  if (!result.success) {
    return {
      ok: false,
      error: result.error.errors[0].message
    }
  }
  return { ok: true, data: result.data }
}