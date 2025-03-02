"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleReaction } from "@/actions/doubt-reaction";
import { formatDistanceToNow } from "date-fns";

interface DoubtDetailProps {
  id: number;
  content: string;
  rightCount: number;
  wrongCount: number;
  userReaction: "right" | "wrong" | null;
  authorName: string;
  authorPhoto: string;
  createdAt: Date;
}

export function DoubtDetail({
  id,
  content,
  rightCount,
  wrongCount,
  userReaction,
  authorName,
  authorPhoto,
  createdAt,
}: DoubtDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [currentRightCount, setCurrentRightCount] = useState(rightCount);
  const [currentWrongCount, setCurrentWrongCount] = useState(wrongCount);
  const [currentUserReaction, setCurrentUserReaction] = useState(userReaction);

  const handleReaction = (type: "right" | "wrong") => {
    startTransition(async () => {
      try {
        const result = await toggleReaction(id, type);
        if (!result.ok) {
          throw new Error(result.error);
        }

        // Update counts and user reaction locally
        if (result.action === "added" || result.action === "updated") {
          if (type === "right") {
            setCurrentRightCount(currentRightCount + 1);
            if (currentUserReaction === "wrong") {
              setCurrentWrongCount(currentWrongCount - 1);
            }
          } else {
            setCurrentWrongCount(currentWrongCount + 1);
            if (currentUserReaction === "right") {
              setCurrentRightCount(currentRightCount - 1);
            }
          }
          setCurrentUserReaction(type);
        } else if (result.action === "removed") {
          if (type === "right") {
            setCurrentRightCount(currentRightCount - 1);
          } else {
            setCurrentWrongCount(currentWrongCount - 1);
          }
          setCurrentUserReaction(null);
        }
      } catch (error) {
        console.error("Failed to toggle reaction:", error);
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h1 className="text-2xl font-bold">{content}</h1>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant={currentUserReaction === "right" ? "default" : "outline"}
              onClick={() => handleReaction("right")}
              disabled={isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {currentRightCount}
            </Button>
            <Button
              variant={currentUserReaction === "wrong" ? "default" : "outline"}
              onClick={() => handleReaction("wrong")}
              disabled={isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {currentWrongCount}
            </Button>
          </div>
          {isPending && <p>Reacting...</p>}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={authorPhoto} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{authorName}</p>
            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}