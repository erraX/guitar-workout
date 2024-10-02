import { getExercises } from "@/service/exercise";
import { getWorkoutById } from "@/service/workout";
import { Workouts } from "./_components/Workouts";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: { workoutId: string };
}) {
  const workoutId = Number(searchParams.workoutId);

  let workout: Awaited<ReturnType<typeof getWorkoutById>> | null = null;
  if (workoutId) {
    workout = await getWorkoutById(workoutId);
  }

  const exercises = await getExercises();

  return <Workouts exercises={exercises} workoutTemplate={workout} />;
}
