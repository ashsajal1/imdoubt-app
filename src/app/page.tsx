import { currentUser, clerkClient } from "@clerk/nextjs/server";
import DoubtForm from "@/components/doubt-form";
import { db } from "@/db/drizzle";
import { doubts, doubtReactions } from "@/db/schema";
import { DoubtCard } from "@/components/doubt-card";
import { sql } from "drizzle-orm";

export default async function Home() {
  const user = await currentUser();
  const userId = user?.id;
  const client = clerkClient();

  const doubtsList = await db
    .select({
      id: doubts.id,
      content: doubts.content,
      date_time: doubts.date_time,
      user_id: doubts.user_id,
      right_count: doubts.right_count,
      wrong_count: doubts.wrong_count,
      userReaction: userId
        ? sql<"right" | "wrong" | null>`
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM ${doubtReactions} 
            WHERE doubt_id = ${doubts.id} 
            AND user_id = ${userId}
          ) THEN
            CASE 
              WHEN (
                SELECT is_right FROM ${doubtReactions} 
                WHERE doubt_id = ${doubts.id} 
                AND user_id = ${userId}
              ) THEN 'right'
              ELSE 'wrong'
            END
          ELSE NULL
        END
      `
        : sql<"right" | "wrong" | null>`NULL`,
    })
    .from(doubts)
    .limit(5);

  // Fetch user details for each doubt
  const doubtsWithUserNames = await Promise.all(
    doubtsList.map(async (doubt) => {
      if (!doubt.user_id) {
        console.warn("Missing user_id for doubt:", doubt);
        return { ...doubt, authorName: "Unknown" };
      }

      const user = await client.users.getUser(doubt.user_id);
      return {
        ...doubt,
        authorName: user?.fullName || "Unknown",
      };
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <DoubtForm />
      <div className="mt-8">
        {doubtsWithUserNames.map((doubt) => (
          <DoubtCard
            key={doubt.id}
            id={doubt.id}
            content={doubt.content}
            createdAt={doubt.date_time!}
            rightCount={doubt.right_count ?? 0}
            wrongCount={doubt.wrong_count ?? 0}
            userReaction={doubt.userReaction}
            authorName={doubt.authorName} topicName={"Geography"}          />
        ))}
      </div>
    </main>
  );
}
