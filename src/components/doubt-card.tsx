"use client";

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleReaction } from "@/actions/doubt-reaction";
import Link from "next/link";

interface DoubtCardProps {
  id: number;
  content: string;
  createdAt: Date;
  authorName: string;
  rightCount: number;
  wrongCount: number;
  userReaction: "right" | "wrong" | null;
}

export function DoubtCard({
  id,
  content,
  createdAt,
  authorName,
  rightCount,
  wrongCount,
  userReaction,
}: DoubtCardProps) {
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
    <Link href={`/doubt/${id}`}>
      <Card className="w-full mb-4 cursor-pointer">
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
              variant={currentUserReaction === "right" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleReaction("right");
              }}
              disabled={isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {currentRightCount}
            </Button>
            <Button
              variant={currentUserReaction === "wrong" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleReaction("wrong");
              }}
              disabled={isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {currentWrongCount}
            </Button>
          </div>
          {isPending && <p>Reacting...</p>}
        </CardFooter>
      </Card>
    </Link>
  );
}
