"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perspectiveSchema, type PerspectiveInput } from "@/lib/validations/perspective";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { insertPerspective } from "@/actions/perspective-actions";

interface PerspectiveFormProps {
  doubtId: number;
  onPerspectiveAdded: () => void;
}

export function PerspectiveForm({ doubtId, onPerspectiveAdded }: PerspectiveFormProps) {
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerspectiveInput>({
    resolver: zodResolver(perspectiveSchema),
  });

  const onSubmit = async (data: PerspectiveInput) => {
    startTransition(async () => {
      try {
        setAuthError(null);
        const response = await insertPerspective({
          doubtId,
          userId: "currentUserId", // Replace with actual user ID
          content: data.content,
        });

        if (response) {
          onPerspectiveAdded(); // Refresh perspectives list
        }
      } catch (error) {
        console.error("Error submitting perspective:", error);
        setAuthError("An unexpected error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <Label htmlFor="perspective">Add your perspective</Label>
      <Textarea
        id="perspective"
        placeholder="Enter your perspective"
        {...register("content")}
        className={`${authError ? "border-red-500" : ""}`}
      />
      {errors.content && (
        <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
      )}
      {authError && (
        <p className="text-red-500 text-sm mt-1">{authError}</p>
      )}
      <Button type="submit" className="mt-3" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}