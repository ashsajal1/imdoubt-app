"use server"

import { db } from "@/db/drizzle"
import { doubts, doubtReactions } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

type ReactionType = 'right' | 'wrong'

export async function toggleReaction(doubtId: number, reactionType: ReactionType) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return { ok: false, error: "UNAUTHORIZED" }
    }

    // Check if user already reacted
    const existingReaction = await db
      .select()
      .from(doubtReactions)
      .where(
        and(
          eq(doubtReactions.doubt_id, doubtId),
          eq(doubtReactions.user_id, userId)
        )
      )
      .limit(1)
      .then(rows => rows[0])

    if (existingReaction) {
      // If same reaction, remove it
      if ((existingReaction.is_right && reactionType === 'right') || 
          (!existingReaction.is_right && reactionType === 'wrong')) {
        await db
          .delete(doubtReactions)
          .where(
            and(
              eq(doubtReactions.doubt_id, doubtId),
              eq(doubtReactions.user_id, userId)
            )
          )
        
        // Update counts
        await db
          .update(doubts)
          .set({
            right_count: existingReaction.is_right 
              ? doubts.right_count - 1 
              : doubts.right_count,
            wrong_count: !existingReaction.is_right 
              ? doubts.wrong_count - 1 
              : doubts.wrong_count
          })
          .where(eq(doubts.id, doubtId))

        return { ok: true, action: 'removed' }
      }

      // If different reaction, update it
      await db
        .update(doubtReactions)
        .set({ is_right: reactionType === 'right' })
        .where(
          and(
            eq(doubtReactions.doubt_id, doubtId),
            eq(doubtReactions.user_id, userId)
          )
        )

      // Update counts
      await db
        .update(doubts)
        .set({
          right_count: reactionType === 'right' 
            ? doubts.right_count + 1 
            : doubts.right_count - 1,
          wrong_count: reactionType === 'wrong' 
            ? doubts.wrong_count + 1 
            : doubts.wrong_count - 1
        })
        .where(eq(doubts.id, doubtId))

      return { ok: true, action: 'updated' }
    }

    // Add new reaction
    await db
      .insert(doubtReactions)
      .values({
        doubt_id: doubtId,
        user_id: userId,
        is_right: reactionType === 'right'
      })

    // Update counts
    await db
      .update(doubts)
      .set({
        right_count: reactionType === 'right' 
          ? doubts.right_count + 1 
          : doubts.right_count,
        wrong_count: reactionType === 'wrong' 
          ? doubts.wrong_count + 1 
          : doubts.wrong_count
      })
      .where(eq(doubts.id, doubtId))

    return { ok: true, action: 'added' }

  } catch (error) {
    console.error('Error toggling reaction:', error)
    return { ok: false, error: 'Failed to toggle reaction' }
  }
}