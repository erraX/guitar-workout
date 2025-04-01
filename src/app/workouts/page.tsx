import { v4 as uuidv4 } from "uuid";
import { getExercises } from "@/service/exercise";
import { getWorkoutById } from "@/service/workout";
import { Workouts } from "./_components/Workouts";
import { WorkoutExerciseStoreProvider } from "@/app/_store/workout-exercise-store";

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
    <WorkoutExerciseStoreProvider
      initialState={
        workout
          ? {
              name: "",
              duration: workout?.duration ?? 0,
              exercises:
                workout?.exercises?.map((exercise) => ({
                  id: uuidv4(),
                  exerciseId: exercise.exercise.id.toString(),
                  notes: exercise.notes ?? "",
                  sets: exercise.sets.map((set) => ({
                    id: set.id.toString(),
                    bpm: set.bpm.toString(),
                    duration: set.duration.toString(),
                    isFinished: false,
                  })),
                })) ?? [],
            }
          : undefined
      }
    >
      <Workouts exercises={exercises} />
    </WorkoutExerciseStoreProvider>
  );
}
