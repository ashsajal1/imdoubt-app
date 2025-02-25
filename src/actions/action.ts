"use server";

import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const createDoubt = async (content: string) => {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("User not logged in.");
    }
    const doubt = await db.insert(doubts).values({
      user_id: userId!,
      content: content,
    });

    if (doubt) {
      return doubt;
    }
  } catch (error) {
    return error;
  }
};
