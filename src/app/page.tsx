import HeroSection from "@/components/hero-section";
import { db } from "@/db/drizzle";
import { doubts } from "@/db/schema";

export default async function Home() {
  const doubtsList = await db.select().from(doubts).limit(5);

  console.log(doubtsList);

  if (doubtsList.length === 0) {
    return (
      <main>
        <HeroSection />
      </main>
    );
  }

  return (
    <main>
      {doubtsList.map((doubt) => {
        return <div key={doubt.id}>{doubt.id}</div>;
      })}
    </main>
  );
}
