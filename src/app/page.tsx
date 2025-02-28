import DoubtForm from "@/components/doubt-form";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";

export default async function Home() {
  const doubtsList = await db.select().from(doubts).limit(5);

  console.log(doubtsList);

  return (
    <main>
      <DoubtForm />
      {doubtsList.map((doubt) => {
        return <div key={doubt.id}>{doubt.content}</div>;
      })}
    </main>
  );
}
