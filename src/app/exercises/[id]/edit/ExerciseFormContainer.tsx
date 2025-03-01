"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Exercise } from "@prisma/client";
import ExerciseForm from "../../_components/ExerciseForm";
import { updateExercise } from "@/actions/exercise";

export interface ExerciseFormContainerProps {
  exercise: Exercise;
}

export default function ExerciseFormContainer({
  exercise,
}: ExerciseFormContainerProps) {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const { success } = await updateExercise(exercise.id, values);
    if (success) {
      toast.success("Exercise updated successfully");
      router.push(`/exercises/`);
    } else {
      toast.error("Failed to update exercise");
    }
  };

  return (
    <ExerciseForm
      initialValues={{
        name: exercise.name,
        link: exercise.link ?? "",
        description: exercise.description ?? "",
        category: exercise.category ?? "",
        targetBpm: exercise.targetBpm || undefined,
      }}
      onSubmit={handleSubmit}
    />
  );
}
