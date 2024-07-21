import { Button, Link } from "@nextui-org/react";
import { getExercises } from '@/service/exercise';

export default async function ExercisesPage() {
  const exercises = await getExercises();
  console.log('exercises', exercises);
  return (
    <div>
      <Link href="/exercises/create">
        <Button color="primary">Create Exercise</Button>
      </Link>
    </div>
  );
}
