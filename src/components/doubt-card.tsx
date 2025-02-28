import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { formatDistanceToNow } from 'date-fns'

interface DoubtCardProps {
  content: string
  createdAt: Date
  authorName?: string
}

export function DoubtCard({ content, createdAt, authorName = "Anonymous" }: DoubtCardProps) {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${authorName}`} />
          <AvatarFallback>{authorName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">{authorName}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Add interaction buttons here if needed */}
      </CardFooter>
    </Card>
  )
}