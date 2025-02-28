"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createDoubt } from "@/actions/action";

// Define the schema for validation
const doubtSchema = z.object({
  content: z
    .string()
    .min(20, "Doubt must be at least 20 characters.")
    .max(250, "Doubt cannot exceed 250 characters."),
});

// Define TypeScript type from schema
type DoubtFormData = z.infer<typeof doubtSchema>;

export default function DoubtForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoubtFormData>({
    resolver: zodResolver(doubtSchema),
  });

  const [submittedDoubt, setSubmittedDoubt] = useState<string | null>(null);

  const onSubmit = async (data: DoubtFormData) => {
    try {
      console.log("Submitting doubt:", data);
      const response = await createDoubt(data.content);
      console.log("Doubt submission response:", response);
      
      if (response.ok) {
        setSubmittedDoubt(data.content);
        console.log("Doubt submitted successfully!");
      } else {
        console.error("Error submitting doubt:", response.error);
      }
    } catch (error) {
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
          {...register("content")}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
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
