import DoubtForm from "@/components/doubt-form";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";
import { DoubtCard } from "@/components/doubt-card";

export default async function Home() {
  const doubtsList = await db.select().from(doubts).limit(5);

  return (
    <main className="container mx-auto px-4 py-8">
      <DoubtForm />
      <div className="mt-8">
        {doubtsList.map((doubt) => (
          <DoubtCard
            key={doubt.id}
            content={doubt.content}
            createdAt={doubt.date_time!}
          />
        ))}
      </div>
    </main>
  );
}
