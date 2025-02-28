"use server";

import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Define the schema for validation
const doubtSchema = z.object({
  content: z
    .string()
    .min(10, "Doubt must be at least 20 characters.")
    .max(250, "Doubt cannot exceed 250 characters."),
});

export const createDoubt = async (content: string) => {
  try {
    // Validate the content
    const result = doubtSchema.safeParse({ content });
    if (!result.success) {
      return {
        ok: false,
        error: result.error.errors[0].message
      };
    }

    const user = auth();
    if (user.userId === null) {
      return { ok: false, error: "UNAUTHORIZED" };
    }

    const doubt = await db
      .insert(doubts)
      .values({
        user_id: user.userId,
        content,
      })
      .returning();

    return doubt ? { ok: true } : { error: "Doubt not created." };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Unknown error" };
  }
};
