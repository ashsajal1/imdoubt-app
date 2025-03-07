import { db } from "@/db/drizzle";
import { doubts, perspectives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DoubtDetail } from "@/components/DoubtDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PerspectiveForm } from "@/components/perspective-form";
import { revalidatePath } from "next/cache";
import { PerspectiveCard } from "@/components/perspective-card";

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
          rightCount={doubtsWithPerspectives.doubt.right_count ?? 0}
          wrongCount={doubtsWithPerspectives.doubt.wrong_count ?? 0}
          userReaction={null} // Replace with actual user reaction if available
          authorName="Author Name" // Replace with actual author name
          authorPhoto="https://avatar.vercel.sh/author" // Replace with actual author photo URL
          createdAt={doubtsWithPerspectives.doubt.date_time || new Date()} // Pass the createdAt prop
        />
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Perspectives</h2>
        </CardHeader>
        <CardContent>
          <PerspectiveForm doubtId={doubtId} />
          {doubtsWithPerspectives.perspectives &&
          doubtsWithPerspectives.perspectives.length > 0 ? (
            doubtsWithPerspectives.perspectives.map((perspective) => (
              <PerspectiveCard
                key={perspective.id}
                id={perspective.id}
                content={perspective.content}
                authorName={perspective.user_id}
                authorPhoto={"https://avatar.vercel.sh/" + perspective.user_id}
                createdAt={perspective.created_at ?? new Date()}
              />
            ))
          ) : (
            <p className="text-gray-600">No perspectives yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
