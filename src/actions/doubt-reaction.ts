"use server"

import { db } from "@/db/drizzle"
import { doubts, doubtReactions } from "@/db/schema"
import { auth } from "@clerk/nextjs"
import { sql } from "drizzle-orm"

type ReactionType = 'right' | 'wrong'

export async function toggleReaction(doubtId: number, reactionType: ReactionType) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return { ok: false, error: "UNAUTHORIZED" }
    }

    // Check if user already reacted
    const existingReaction = await db.query.doubtReactions.findFirst({
      where: (reaction, { eq, and }) => 
        and(eq(reaction.doubt_id, doubtId), eq(reaction.user_id, userId))
    })

    if (existingReaction) {
      // If same reaction, remove it
      if ((existingReaction.is_right && reactionType === 'right') || 
          (!existingReaction.is_right && reactionType === 'wrong')) {
        await db.delete(doubtReactions)
          .where(sql`doubt_id = ${doubtId} AND user_id = ${userId}`)
        
        // Update counts
        await db.update(doubts)
          .set({
            right_count: sql`right_count - CASE WHEN ${existingReaction.is_right} THEN 1 ELSE 0 END`,
            wrong_count: sql`wrong_count - CASE WHEN NOT ${existingReaction.is_right} THEN 1 ELSE 0 END`
          })
          .where(sql`id = ${doubtId}`)

        return { ok: true, action: 'removed' }
      }

      // If different reaction, update it
      await db.update(doubtReactions)
        .set({ is_right: reactionType === 'right' })
        .where(sql`doubt_id = ${doubtId} AND user_id = ${userId}`)

      // Update counts
      await db.update(doubts)
        .set({
          right_count: sql`right_count + CASE WHEN ${reactionType === 'right'} THEN 1 ELSE -1 END`,
          wrong_count: sql`wrong_count + CASE WHEN ${reactionType === 'wrong'} THEN 1 ELSE -1 END`
        })
        .where(sql`id = ${doubtId}`)

      return { ok: true, action: 'updated' }
    }

    // Add new reaction
    await db.insert(doubtReactions)
      .values({
        doubt_id: doubtId,
        user_id: userId,
        is_right: reactionType === 'right'
      })

    // Update counts
    await db.update(doubts)
      .set({
        right_count: sql`right_count + CASE WHEN ${reactionType === 'right'} THEN 1 ELSE 0 END`,
        wrong_count: sql`wrong_count + CASE WHEN ${reactionType === 'wrong'} THEN 1 ELSE 0 END`
      })
      .where(sql`id = ${doubtId}`)

    return { ok: true, action: 'added' }

  } catch (error) {
    console.error('Error toggling reaction:', error)
    return { ok: false, error: 'Failed to toggle reaction' }
  }
}