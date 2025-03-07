"use server";

import { db } from "@/db/drizzle";
import { perspectives } from "@/db/schema";
import { perspectiveSchema } from "@/lib/validations/perspective";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface InsertPerspectiveInput {
  doubtId: number;
  userId: string;
  content: string;
}

export async function insertPerspective({
  doubtId,
  userId,
  content,
}: InsertPerspectiveInput) {
  try {
    const response = await db
      .insert(perspectives)
      .values({
        doubt_id: doubtId,
        user_id: userId,
        content: content,
      })
      .returning();

    return response;
  } catch (error) {
    console.error("Error inserting perspective:", error);
    throw new Error("Failed to insert perspective");
  }
}

interface EditPerspectiveInput {
  id: number;
  content: string;
}

export async function editPerspective(input: EditPerspectiveInput) {
  try {
    // Validate input using zod
    perspectiveSchema.parse(input);

    const { id, content } = input;

    const response = await db
      .update(perspectives)
      .set({ content, updated_at: new Date() })
      .where(eq(perspectives.id, id))
      .returning();

    if (response.length === 0) {
      throw new Error("Perspective not found");
    }

    revalidatePath(`/doubt/${response[0].doubt_id}`);
    return response[0];
  } catch (error) {
    console.error("Error editing perspective:", error);
    throw new Error("Failed to edit perspective");
  }
}
