import { getAllTopics } from "@/actions/topics";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function TopicsPage() {
  const topics = await getAllTopics();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">All Topics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.name}`}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}