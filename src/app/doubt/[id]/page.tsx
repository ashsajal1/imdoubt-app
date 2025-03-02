import { db } from "@/db/drizzle";
import { doubts, perspectives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DoubtDetail } from "@/components/DoubtDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <div className="container mx-auto px-4 py-8">
      {doubtsWithPerspectives.doubt && (
        <DoubtDetail
          id={doubtsWithPerspectives.doubt.id}
          content={doubtsWithPerspectives.doubt.content}
          rightCount={doubtsWithPerspectives.doubt.right_count}
          wrongCount={doubtsWithPerspectives.doubt.wrong_count}
          userReaction={null} // Replace with actual user reaction if available
          authorName="Author Name" // Replace with actual author name
          authorPhoto="https://avatar.vercel.sh/author" // Replace with actual author photo URL
        />
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Perspectives</h2>
        </CardHeader>
        <CardContent>
          {doubtsWithPerspectives.perspectives && doubtsWithPerspectives.perspectives.length > 0 ? (
            doubtsWithPerspectives.perspectives.map((perspective) => (
              <div key={perspective.id} className="border-b border-gray-200 py-4">
                <p className="text-gray-800">{perspective.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No perspectives yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
