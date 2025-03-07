"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { EditPerspectiveModal } from "./edit-perspective-modal";

interface PerspectiveCardProps {
  id: number;
  content: string;
  authorName: string;
  authorPhoto: string;
  createdAt: Date;
  userId: string;
  currentUserId: string;
}

export function PerspectiveCard({
  id,
  content,
  authorName,
  authorPhoto,
  createdAt,
  userId,
  currentUserId,
}: PerspectiveCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <p className="mb-4">{content}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={authorPhoto} />
              <AvatarFallback>{authorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{authorName}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {userId === currentUserId && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <EditPerspectiveModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          perspectiveId={id}
          initialContent={content}
        />
      </CardHeader>
    </Card>
  );
}
