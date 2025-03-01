import { db } from "@/db/drizzle";
import { doubts, perspectives } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DoubtPage({
  params,
}: {
  params: {
    doubtId: string;
  };
}) {
  const fetchDoubtWithPerspectives = async (doubtId: number) => {
    try {
      // Fetch the doubt from the database
      const doubtData = await db
        .select()
        .from(doubts)
        .where(eq(doubts.id, doubtId))
        .then((rows) => rows[0]);

      if (!doubtData) {
        throw new Error("Doubt not found");
      }

      // Fetch the perspectives for the doubt
      const perspectivesData = await db
        .select()
        .from(perspectives)
        .where(eq(perspectives.doubt_id, doubtId));

      return {
        doubt: doubtData,
        perspectives: perspectivesData,
      };
    } catch (error) {
      console.error("Error fetching doubt and perspectives:", error);
      throw error;
    }
  };

  const doubtsWithPerspectives = await fetchDoubtWithPerspectives(
    parseInt(params.doubtId)
  );

  return (
    <div>
      <h1>{doubtsWithPerspectives.doubt.content}</h1>

      <div>
        {doubtsWithPerspectives.perspectives.map((perspective) => (
          <div key={perspective.id}>
            <p>{perspective.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
