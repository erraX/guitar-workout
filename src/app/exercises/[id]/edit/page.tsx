import { getExerciseById } from "@/service/exercise";
import ExerciseFormContainer from "./ExerciseFormContainer";
import { notFound } from "next/navigation";

export default async function ExercisesEditPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const exercise = await getExerciseById(Number(params.id));
  if (!exercise) {
    return notFound();
  }
  return <ExerciseFormContainer exercise={exercise} />;
}
