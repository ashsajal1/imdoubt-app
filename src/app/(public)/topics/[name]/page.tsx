
import { db } from "@/db/drizzle";
import { doubts, topics, doubtReactions } from "@/db/schema";
import { DoubtCard } from "@/components/doubt-card";
import { sql, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";

interface TopicPageProps {
  params: {
    name: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const user = await currentUser();
  const userId = user?.id;

  if (!params.name) {
    notFound();
  }

  const doubtsList = await db
    .select({
      id: doubts.id,
      content: doubts.content,
      date_time: doubts.date_time,
      user_id: doubts.user_id,
      right_count: doubts.right_count,
      wrong_count: doubts.wrong_count,
      topic_name: topics.name,
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
    .leftJoin(topics, eq(doubts.topic_id, topics.id))
    .where(eq(topics.name, params.name))
    .orderBy(doubts.date_time);

  const doubtsWithUserNames = await Promise.all(
    doubtsList.map(async (doubt) => {
      const user = doubt.user_id 
        ? await clerkClient.users.getUser(doubt.user_id)
        : null;

      return {
        ...doubt,
        authorName: user?.firstName || "Unknown",
      };
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Doubts about {params.name}
      </h1>
      <div className="mt-8">
        {doubtsWithUserNames.length === 0 ? (
          <p className="text-center text-gray-500">
            No doubts found for this topic
          </p>
        ) : (
          doubtsWithUserNames.map((doubt) => (
            <DoubtCard
              key={doubt.id}
              id={doubt.id}
              content={doubt.content}
              createdAt={doubt.date_time!}
              rightCount={doubt.right_count ?? 0}
              wrongCount={doubt.wrong_count ?? 0}
              userReaction={doubt.userReaction}
              authorName={doubt.authorName}
              topicName={doubt.topic_name ?? "Uncategorized"}
            />
          ))
        )}
      </div>
    </main>
  );
}