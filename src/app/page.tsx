import { currentUser } from "@clerk/nextjs/server";
import DoubtForm from "@/components/doubt-form";
import { db } from "@/db/drizzle";
import { doubts, doubtReactions } from "@/db/schema";
import { DoubtCard } from "@/components/doubt-card";
import { sql } from "drizzle-orm";

export default async function Home() {
  const user = await currentUser();
  const userId = user?.id;

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
        : sql`NULL`,
    })
    .from(doubts)
    .limit(5);

  return (
    <main className="container mx-auto px-4 py-8">
      <DoubtForm />
      <div className="mt-8">
        {doubtsList.map((doubt) => (
          <DoubtCard
            key={doubt.id}
            id={doubt.id}
            content={doubt.content}
            createdAt={doubt.date_time!}
            rightCount={doubt.right_count}
            wrongCount={doubt.wrong_count}
            userReaction={doubt.userReaction}
            authorName={doubt.user_id} // You might want to fetch actual user names
          />
        ))}
      </div>
    </main>
  );
}
