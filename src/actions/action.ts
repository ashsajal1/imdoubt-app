"use server";

import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const createDoubt = async (content: string) => {
  try {
    const user = auth();
    if (user.userId === null) {
      throw new Error("User not logged in.");
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
