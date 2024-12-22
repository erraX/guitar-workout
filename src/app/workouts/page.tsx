import { getExercises } from "@/service/exercise";
import { getWorkoutById } from "@/service/workout";
import { Workouts } from "./_components/Workouts";
import { WorkoutsStoreProvider } from "./_contexts/WorkoutsStoreContext";

export default async function WorkoutsPage(props: {
  searchParams: Promise<{ workoutId: string }>;
}) {
  const searchParams = await props.searchParams;
  const workoutId = Number(searchParams.workoutId);

  let workout: Awaited<ReturnType<typeof getWorkoutById>> | null = null;
  if (workoutId) {
    workout = await getWorkoutById(workoutId);
  }

  const exercises = await getExercises();

  return (
    <WorkoutsStoreProvider>
      <Workouts exercises={exercises} workoutTemplate={workout} />
    </WorkoutsStoreProvider>
  );
}
