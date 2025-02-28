"use client"

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { formatDistanceToNow } from 'date-fns'
import { Button } from "./ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import { toggleReaction } from "@/actions/doubt-reaction"

interface DoubtCardProps {
  id: number
  content: string
  createdAt: Date
  authorName?: string
  rightCount?: number
  wrongCount?: number
  onRight?: () => void
  onWrong?: () => void
  userReaction?: 'right' | 'wrong' | null
}

export function DoubtCard({
  id,
  content,
  createdAt,
  authorName = "Anonymous",
  rightCount = 0,
  wrongCount = 0,
  onRight,
  onWrong,
  userReaction
}: DoubtCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReaction = async (type: 'right' | 'wrong') => {
    try {
      setIsLoading(true)
      const result = await toggleReaction(id, type)
      if (!result.ok) {
        throw new Error(result.error)
      }
      // Optionally refresh the page or update counts locally
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="flex items-center gap-2">
          <Button
            variant={userReaction === 'right' ? 'default' : 'outline'}
            onClick={() => handleReaction('right')}
            disabled={isLoading}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {rightCount}
          </Button>
          <Button
            variant={userReaction === 'wrong' ? 'default' : 'outline'}
            onClick={() => handleReaction('wrong')}
            disabled={isLoading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            {wrongCount}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}