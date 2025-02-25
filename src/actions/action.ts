"use server";

import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

const createDoubt = async (content: string) => {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!user) {
      throw new Error("User not logged in.");
    }
    const doubt = await db.insert(doubts).values({
      user_id: userId!,
      content: content,
    });
  } catch (error) {
    return error;
  }
};
