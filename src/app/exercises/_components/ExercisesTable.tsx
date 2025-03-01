"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { archiveExercise } from "@/actions/exercise";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Exercise } from "@prisma/client";
import { ArchiveX, Pencil } from "lucide-react";

export interface ExercisesTableProps {
  data: Exercise[];
}

export function ExercisesTable({ data }: ExercisesTableProps) {
  const router = useRouter();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>TARGET BPM</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>
                {exercise.link ? (
                  <Link href={exercise.link} target="_blank">
                    {exercise.name}
                  </Link>
                ) : (
                  exercise.name
                )}
              </TableCell>
              <TableCell>{exercise.category}</TableCell>
              <TableCell>{exercise.description}</TableCell>
              <TableCell>{exercise.targetBpm}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    router.push(`/exercises/${exercise.id}/edit`);
                  }}
                  className="mr-1"
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={async () => {
                    const { success } = await archiveExercise(exercise.id);
                    if (success) {
                      toast.success("Exercise archived successfully");
                      router.refresh();
                    } else {
                      toast.error("Failed to archive exercise");
                    }
                  }}
                >
                  <ArchiveX />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
