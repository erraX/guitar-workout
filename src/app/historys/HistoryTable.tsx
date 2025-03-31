"use client";

import { toast } from "sonner";
import { deleteWorkout } from "@/actions/workout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Workout } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Date } from "@/components/ui/date";
import { Badge } from "@/components/ui/badge";
import { CirclePlay, Trash2 } from "lucide-react";

export interface HistorysTableProps {
  data: Workout[];
}

export function HistorysTable({ data }: HistorysTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>EXERCISES</TableHead>
            <TableHead>CREATE DATE</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell>{workout.id}</TableCell>
              <TableCell>
                {(workout as any).exercises.map(
                  (exercise: any, index: number) => (
                    <div key={`${workout.id}-${index}`}>
                      <Badge variant="secondary" className="mb-2 mr-2">
                        {exercise.name}
                      </Badge>
                      {exercise.sets
                        .slice(0, 3)
                        .map((set: any, idx: number) => (
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
              <TableCell>
                <Date date={workout.createdAt} />
              </TableCell>
              <TableCell>
                <Button
                  className="mr-1"
                  size="icon"
                  variant="success"
                  onClick={() =>
                    router.push(`/workouts?workoutId=${workout.id}`)
                  }
                >
                  <CirclePlay />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={async () => {
                    const result = await deleteWorkout(workout.id);
                    if (!result.success) {
                      toast.error("Failed to delete workout");
                    } else {
                      toast.success("Workout deleted successfully!");
                      router.refresh();
                    }
                  }}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
