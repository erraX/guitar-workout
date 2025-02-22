"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createExercise } from "@/actions/exercise";
import ExerciseForm from "../_components/ExerciseForm";

export default function ExercisesCreationPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const { success } = await createExercise(values);
      if (success) {
        toast.success("Exercise created successfully");
        router.push(`/exercises/`);
      } else {
        toast.error("Failed to create exercise");
      }
    } catch (error) {
      toast.error("Failed to create exercise");
    }
  };

  return (
    <ExerciseForm
      initialValues={{
        name: "",
        link: "",
        category: "",
        description: "",
      }}
      onSubmit={handleSubmit}
    />
  );
}
