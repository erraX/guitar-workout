"use client";

import { deleteWorkout } from "@/actions/workout";
import {
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Workout } from "@prisma/client";
import { useRouter } from "next/navigation";

export interface HistorysTableProps {
  data: Workout[];
}

export function HistorysTable({ data }: HistorysTableProps) {
  const router = useRouter();

  return (
    <Table isStriped>
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>EXERCISES</TableColumn>
        <TableColumn>CREATE DATE</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((workout) => (
          <TableRow key={workout.id}>
            <TableCell>{workout.id}</TableCell>
            <TableCell>
              {(workout as any).exercises.map(
                (exercise: any, index: number) => (
                  <div key={`${workout.id}-${index}`}>
                    <Chip color="primary" className="mb-2 mr-2">
                      {exercise.name}
                    </Chip>
                    {exercise.sets.slice(0, 3).map((set: any, idx: number) => (
                      <span
                        className="font-medium"
                        key={`${exercise.id}-${idx}`}
                      >
                        {set.bpm} BPM ({set.duration}s)
                        {idx < exercise.sets.length - 1 && (
                          <span className="mx-2 text-gray-500">|</span>
                        )}
                      </span>
                    ))}
                    {exercise.sets.length > 3 && <span>...</span>}
                  </div>
                )
              )}
            </TableCell>
            <TableCell>{workout.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                className="mr-1"
                size="sm"
                color="primary"
                onClick={() => router.push(`/workouts?workoutId=${workout.id}`)}
              >
                Start
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={async () => {
                  await deleteWorkout(workout.id);
                  router.refresh();
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
