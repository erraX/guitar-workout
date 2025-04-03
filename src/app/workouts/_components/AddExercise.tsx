"use client";

import { Exercise } from "@prisma/client";
import { FC, useState } from "react";

import { cn } from "@/lib/utils";
import { AutoComplete } from "@/components/ui/auto-complete";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export interface AddExerciseProps {
  exercises: Exercise[];
  className?: string;
  onAddExercises(exerciseIds: string[]): void;
}

export const AddExercise: FC<AddExerciseProps> = ({
  exercises,
  className,
  onAddExercises,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  return (
    <>
      <Button
        className={cn("self-center", className)}
        onClick={() => setOpen(true)}
      >
        Add Exercise
      </Button>
      <ConfirmDialog
        title="Add Exercise"
        description="Please select one exercise to add"
        open={open}
        setOpen={setOpen}
        confirmText="Add"
        confirmDisabled={!selectedExercises.length}
        onConfirm={() => {
          if (selectedExercises.length) {
            onAddExercises(selectedExercises);
            setSelectedExercises([]);
          }
        }}
      >
        <AutoComplete
          value={selectedExercises}
          onValueChange={setSelectedExercises}
          options={exercises.map((exercise) => ({
            text: exercise.name,
            value: exercise.id.toString(),
          }))}
          placeholder="Select exercise..."
          searchPlaceholder="Search exercise..."
          emptyText="No exercise found."
        />
      </ConfirmDialog>
    </>
  );
};
