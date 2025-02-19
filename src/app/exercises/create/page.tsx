"use client";

import { useRouter } from "next/navigation";
import { createExercise } from "@/actions/exercise";
import ExerciseForm from "../_components/ExerciseForm";

export default function ExercisesCreationPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    // TODO: Add loading
    await createExercise(values);
    router.push(`/exercises/`);
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
