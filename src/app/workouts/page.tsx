import { getExercises } from "@/service/exercise";
import { Workouts } from "./_components/Workouts";

export default async function WorkoutsPage() {
  const exercises = await getExercises();

  return <Workouts exercises={exercises} />;
}
