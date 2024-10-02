import { getExerciseById } from "@/service/exercise";
import ExerciseFormContainer from "./ExerciseFormContainer";
import { notFound } from "next/navigation";

export default async function ExercisesEditPage({
  params,
}: {
  params: { id: string };
}) {
  const exercise = await getExerciseById(Number(params.id));
  if (!exercise) {
    return notFound();
  }
  return <ExerciseFormContainer exercise={exercise} />;
}
