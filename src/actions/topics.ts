"use server";

import { db } from "@/db/drizzle";
import { topics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Define the validation schema for topics
const topicSchema = z.object({
  name: z
    .string()
    .min(1, "Topic name is required")
    .max(255, "Topic name must be less than 255 characters"),
});

interface TopicInput {
  name: string;
}

interface EditTopicInput {
  id: number;
  name: string;
}

// Create a new topic
export async function createTopic(input: TopicInput) {
  try {
    // Validate input using zod
    topicSchema.parse(input);

    const response = await db
      .insert(topics)
      .values({
        name: input.name,
      })
      .returning();

    return response[0];
  } catch (error) {
    console.error("Error creating topic:", error);
    throw new Error("Failed to create topic");
  }
}

// Edit an existing topic
export async function editTopic(input: EditTopicInput) {
  try {
    // Validate input using zod
    topicSchema.parse({ name: input.name });

    const response = await db
      .update(topics)
      .set({ name: input.name })
      .where(eq(topics.id, input.id))
      .returning();

    if (response.length === 0) {
      throw new Error("Topic not found");
    }

    return response[0];
  } catch (error) {
    console.error("Error editing topic:", error);
    throw new Error("Failed to edit topic");
  }
}

// Delete a topic
export async function deleteTopic(id: number) {
  try {
    const response = await db
      .delete(topics)
      .where(eq(topics.id, id))
      .returning();

    if (response.length === 0) {
      throw new Error("Topic not found");
    }

    return response[0];
  } catch (error) {
    console.error("Error deleting topic:", error);
    throw new Error("Failed to delete topic");
  }
}

// Get all topics
export async function getAllTopics() {
  try {
    const response = await db.select().from(topics);
    return response;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw new Error("Failed to fetch topics");
  }
}
