"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { EditPerspectiveModal } from "@/components/edit-perspective-modal";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { deletePerspective } from "@/actions/perspective-actions";

interface PerspectiveCardProps {
  id: number;
  content: string;
  authorName: string;
  authorPhoto: string;
  createdAt: Date;
  userId: string;
  currentUserId: string;
  onPerspectiveDeleted: () => void;
}

export function PerspectiveCard({
  id,
  content,
  authorName,
  authorPhoto,
  createdAt,
  userId,
  currentUserId,
  onPerspectiveDeleted,
}: PerspectiveCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePerspective({ id });
      onPerspectiveDeleted();
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting perspective:", error);
    }
  };

  return (
    <>
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
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {userId === currentUserId && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleting(true)}
                >
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

          <ConfirmDeleteModal
            isOpen={isDeleting}
            onClose={() => setIsDeleting(false)}
            onConfirm={handleDelete}
          />
        </CardHeader>
      </Card>
    </>
  );
}
