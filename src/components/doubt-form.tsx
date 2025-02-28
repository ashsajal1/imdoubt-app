"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createDoubt } from "@/actions/action";
import { doubtSchema, type DoubtInput } from "@/lib/validations/doubt";

export default function DoubtForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoubtInput>({
    resolver: zodResolver(doubtSchema),
  });

  const [submittedDoubt, setSubmittedDoubt] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (data: DoubtInput) => {
    try {
      setAuthError(null);
      setSubmittedDoubt(null); // Reset previous submission
      console.log("Submitting doubt:", data);
      const response = await createDoubt(data.content);
      console.log("Doubt submission response:", response);
      
      if (response.ok) {
        setSubmittedDoubt(data.content);
        console.log("Doubt submitted successfully!");
      } else {
        if (response.error === 'UNAUTHORIZED') {
          setAuthError("Please log in to submit a doubt");
        } else {
          setAuthError(response.error || "An error occurred while submitting");
        }
      }
    } catch (error) {
      setAuthError("An unexpected error occurred");
      console.error("Exception while submitting doubt:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="doubt">Post a doubt.</Label>
        <Textarea
          id="doubt"
          placeholder="Enter your doubt statement, e.g., Internet is fake."
          className={`${authError ? 'border-red-500' : ''}`}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
        {authError && (
          <p className="text-red-500 text-sm mt-1">{authError}</p>
        )}
        <Button type="submit" className="mt-3" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {submittedDoubt && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <p className="font-semibold">Your Submitted Doubt:</p>
          <p>{submittedDoubt}</p>
        </div>
      )}
    </div>
  );
}
