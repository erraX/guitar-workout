"use client";

import { useRouter } from "next/navigation";
import { archiveExercise } from "@/actions/exercise";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
} from "@nextui-org/react";
import { Exercise } from "@prisma/client";

export interface ExercisesTableProps {
  data: Exercise[];
}

export function ExercisesTable({ data }: ExercisesTableProps) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
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
            <TableCell>
              <Button
                size="sm"
                color="primary"
                onClick={() => {
                  router.push(`/exercises/${exercise.id}/edit`);
                }}
                className="mr-1"
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={async () => {
                  const { success } = await archiveExercise(exercise.id);
                  if (success) {
                    router.refresh();
                  }
                }}
              >
                Archive
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
