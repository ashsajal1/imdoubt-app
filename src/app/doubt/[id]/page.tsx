import { db } from "@/db/drizzle";
import { doubts, perspectives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DoubtDetail } from "@/components/DoubtDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PerspectiveForm } from "@/components/perspective-form";
import { revalidatePath } from "next/cache";
import { PerspectiveCard } from "@/components/perspective-card";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { deletePerspective } from "@/actions/perspective-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Add interfaces for metadata generation
interface DoubtPageProps {
  params: {
    id: string;
  };
}

// Add generateMetadata function for dynamic SEO
export async function generateMetadata({
  params,
}: DoubtPageProps): Promise<Metadata> {
  const doubtId = parseInt(params.id, 10);

  if (isNaN(doubtId)) {
    return {
      title: "Invalid Doubt - ImDoubt",
      description: "This doubt could not be found.",
    };
  }

  try {
    const doubt = await db
      .select()
      .from(doubts)
      .where(eq(doubts.id, doubtId))
      .then((rows) => rows[0]);

    if (!doubt) {
      return {
        title: "Doubt Not Found - ImDoubt",
        description: "The requested doubt could not be found.",
      };
    }

    const description =
      doubt.content.length > 155
        ? `${doubt.content.substring(0, 155)}...`
        : doubt.content;

    return {
      title: `${doubt.content.substring(0, 50)}... - ImDoubt`,
      description,
      openGraph: {
        title: `Doubt Discussion - ImDoubt`,
        description,
        type: "article",
        url: `/doubt/${doubtId}`,
      },
      twitter: {
        card: "summary",
        title: `Doubt Discussion - ImDoubt`,
        description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error - ImDoubt",
      description: "An error occurred while loading this doubt.",
    };
  }
}

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

  const currentUserId = auth().userId ?? null;
  const client = clerkClient();
  const authorName = doubtsWithPerspectives.doubt
    ? (await client.users.getUser(doubtsWithPerspectives.doubt.user_id))
        .fullName ?? "Unknown"
    : "Unknown";

  const getAuthorNameById = async (userId: string): Promise<string> => {
    try {
      const user = await client.users.getUser(userId);
      return user?.fullName ?? "Unknown";
    } catch (error) {
      console.error("Error fetching author name:", error);
      return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {doubtsWithPerspectives.doubt && (
        <DoubtDetail
          id={doubtsWithPerspectives.doubt.id}
          content={doubtsWithPerspectives.doubt.content}
          rightCount={doubtsWithPerspectives.doubt.right_count ?? 0}
          wrongCount={doubtsWithPerspectives.doubt.wrong_count ?? 0}
          userReaction={null} // Replace with actual user reaction if available
          authorName={authorName!} // Replace with actual author name
          authorPhoto="https://avatar.vercel.sh/author" // Replace with actual author photo URL
          createdAt={doubtsWithPerspectives.doubt.date_time || new Date()} // Pass the createdAt prop
        />
      )}

      <Card>
        <CardContent>
          <PerspectiveForm doubtId={doubtId} currentUserId={currentUserId!} />
          <CardHeader>
            <h2 className="text-xl font-semibold">Perspectives</h2>
          </CardHeader>
          {doubtsWithPerspectives.perspectives &&
          doubtsWithPerspectives.perspectives.length > 0 ? (
            doubtsWithPerspectives.perspectives.map(async (perspective) => (
              <PerspectiveCard
                key={perspective.id}
                id={perspective.id}
                content={perspective.content}
                authorName={await getAuthorNameById(perspective.user_id)}
                authorPhoto={"https://avatar.vercel.sh/" + perspective.user_id}
                createdAt={perspective.created_at ?? new Date()}
                userId={perspective.user_id}
                currentUserId={currentUserId!}
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
