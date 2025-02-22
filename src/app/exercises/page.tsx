import Link from "next/link";
import { getExercises } from "@/service/exercise";
import { ExercisesTable } from "./_components/ExercisesTable";
import { Button } from "@/components/ui/button";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div className="flex flex-col w-full">
      <Link className="mb-3" href="/exercises/create">
        <Button color="primary">Create Exercise</Button>
      </Link>
      <ExercisesTable data={exercises} />
    </div>
  );
}
