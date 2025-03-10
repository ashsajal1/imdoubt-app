import { db } from "@/db/drizzle";
import { topics } from "@/db/schema";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function TopicList() {
  const allTopics = await db.select().from(topics);

  return (
    <div className="flex flex-wrap gap-2">
      {allTopics.map((topic) => (
        <Link key={topic.id} href={`/topics/${topic.name}`}>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            {topic.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
