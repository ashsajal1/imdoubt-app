"use server";

import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { validateDoubt } from "@/lib/validations/doubt";

export const createDoubt = async (content: string, topic_id: number) => {
  try {
    const validationResult = validateDoubt({
      content,
      topicId: topic_id,
    });
    if (!validationResult.ok) {
      return {
        ok: false,
        error: validationResult.error,
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
        topic_id: topic_id,
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
