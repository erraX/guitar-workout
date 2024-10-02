"use client";

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
    await updateExercise(exercise.id, values);
    router.push(`/exercises/`);
  };

  return (
    <ExerciseForm
      initialValues={{
        name: exercise.name,
        link: exercise.link ?? "",
        description: exercise.description ?? "",
      }}
      onSubmit={handleSubmit}
    />
  );
}
