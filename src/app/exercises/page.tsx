import Link from "next/link";
import { getExercises } from "@/service/exercise";
import { ExercisesTable } from "./_components/ExercisesTable";
import { Button } from "@/components/ui/button";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div className="flex flex-col w-full">
      <Button className="mb-3 self-end" variant="secondary" asChild>
        <Link href="/exercises/create">Create Exercise</Link>
      </Button>
      <ExercisesTable data={exercises} />
    </div>
  );
}
