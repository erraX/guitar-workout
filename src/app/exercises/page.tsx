import { Button, Link } from "@nextui-org/react";
import { getExercises } from "@/service/exercise";
import { ExercisesTable } from './_components/ExercisesTable';

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div>
      <Link href="/exercises/create">
        <Button color="primary">Create Exercise</Button>
      </Link>
      <ExercisesTable data={exercises} />
    </div>
  );
}
