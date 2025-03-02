import { db } from "@/db/drizzle";
import { doubts, perspectives } from "@/db/schema";
import { error } from "console";
import { eq } from "drizzle-orm";

export default async function DoubtPage({
  params,
}: {
  params: {
    id: string;
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
        return { error: "Doubt not found!" };
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

  // Use params.id and validate it
  const doubtId = parseInt(params.id, 10);

  if (isNaN(doubtId)) {
    return <div>Invalid doubt ID!</div>;
  }

  const doubtsWithPerspectives = await fetchDoubtWithPerspectives(doubtId);

  if (doubtsWithPerspectives.error) {
    return <div>{doubtsWithPerspectives.error}</div>;
  }

  return (
    <div>
      {doubtsWithPerspectives.doubt && (
        <h1>{doubtsWithPerspectives.doubt.content}</h1>
      )}

      <div>
        {doubtsWithPerspectives.perspectives &&
          doubtsWithPerspectives.perspectives.map((perspective) => (
            <div key={perspective.id}>
              <p>{perspective.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
