"use server";

import { db } from "@/db/drizzle";
import { perspectives } from "@/db/schema";

interface InsertPerspectiveInput {
  doubtId: number;
  userId: string;
  content: string;
}

export async function insertPerspective({ doubtId, userId, content }: InsertPerspectiveInput) {
  try {
    const response = await db.insert(perspectives).values({
      doubt_id: doubtId,
      user_id: userId,
      content: content,
    }).returning();

    return response;
  } catch (error) {
    console.error("Error inserting perspective:", error);
    throw new Error("Failed to insert perspective");
  }
}