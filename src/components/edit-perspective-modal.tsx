"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  perspectiveSchema,
  type PerspectiveInput,
} from "@/lib/validations/perspective";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { editPerspective } from "@/actions/perspective-actions";

interface EditPerspectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  perspectiveId: string;
  initialContent: string;
  onPerspectiveEdited: () => void;
}

export function EditPerspectiveModal({
  isOpen,
  onClose,
  perspectiveId,
  initialContent,
  onPerspectiveEdited,
}: EditPerspectiveModalProps) {
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PerspectiveInput>({
    resolver: zodResolver(perspectiveSchema),
    defaultValues: {
      id: perspectiveId,
      content: initialContent,
    },
  });

  const onSubmit = async (data: PerspectiveInput) => {
    startTransition(async () => {
      try {
        setAuthError(null);
        await editPerspective({ ...data, id: Number(data.id) });
        onPerspectiveEdited();
        onClose();
      } catch (error) {
        console.error("Error editing perspective:", error);
        setAuthError("An unexpected error occurred");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Perspective</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...register("content")}
            className={`${authError ? "border-red-500" : ""}`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
          {authError && (
            <p className="text-red-500 text-sm mt-1">{authError}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
