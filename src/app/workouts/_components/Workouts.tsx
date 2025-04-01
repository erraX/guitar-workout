"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Exercise } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { createWorkout } from "@/actions/workout";

import { AddExercise } from "@/app/workouts/_components/AddExercise";
import { ExerciseCard } from "./ExerciseCard";

import { useBeforeUnload } from "@/hooks/useBeforeUnload";

import FinishConfirmModal from "./FinishConfirmModal";
import StopWatch from "./StopWatch";
import { useWorkoutExerciseStore } from "@/app/_store/workout-exercise-store";
import { useWorkoutTimerStore } from "@/app/_store/workout-timer-store";

const getExerciseById = (exercises: Exercise[], id: number) =>
  exercises.findIndex((e) => e.id === id);

const getExerciseNameById = (exercises: Exercise[], id: number) => {
  const idx = getExerciseById(exercises, id);
  return idx > -1 ? exercises[idx].name : "";
};

export interface WorkoutsProps {
  exercises: Exercise[];
}

export function Workouts({ exercises }: WorkoutsProps) {
  const [finishedConfirmModalOpen, setFinishedConfirmModalOpen] =
    useState(false);

  const clear = useWorkoutExerciseStore((state) => state.clear);
  const addExercise = useWorkoutExerciseStore((state) => state.addExercise);
  const workoutExercises = useWorkoutExerciseStore((state) => state.exercises);

  const timerStore = useWorkoutTimerStore();

  const handleStop = useCallback(async () => {
    timerStore.stop();

    // TODO: Add loading
    const result = await createWorkout({
      duration: timerStore.duration,
      exercises: workoutExercises.map((exercise) => ({
        id: Number(exercise.exerciseId),
        notes: exercise.notes,
        sets: exercise.sets
          .filter((set) => set.isFinished)
          .map((set) => ({
            bpm: Number(set.bpm),
            duration: Number(set.duration),
          })),
      })),
    });
    if (!result.success) {
      toast.error("Failed to create workout");
    } else {
      toast.success("Workout created successfully!");
    }
  }, [timerStore, workoutExercises]);

  useBeforeUnload(timerStore.isRunning);
  useClearQueryParams();

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center mb-6 w-full">
          <StopWatch
            time={timerStore.duration}
            isRunning={timerStore.isRunning}
            onStop={() => setFinishedConfirmModalOpen(true)}
            onStart={timerStore.start}
          />
        </div>
        <div className="flex flex-row w-full mb-6 justify-center">
          <AddExercise
            exercises={exercises}
            onAddExercises={(exerciseIds) => {
              exerciseIds.forEach((exerciseId) => {
                addExercise(exerciseId);
              });
            }}
          />
          <Button className="ml-3" variant="secondary" onClick={clear}>
            Clear
          </Button>
        </div>
        <div className="w-full max-w-3xl">
          {workoutExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              notes={exercise.notes}
              className="mb-3"
              title={getExerciseNameById(
                exercises,
                Number(exercise.exerciseId)
              )}
              sets={exercise.sets}
            />
          ))}
        </div>
      </div>
      <FinishConfirmModal
        open={finishedConfirmModalOpen}
        onOpenChange={setFinishedConfirmModalOpen}
        onStop={handleStop}
        onAbort={timerStore.abort}
      />
    </>
  );
}

function useClearQueryParams() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/workouts`);
  }, [router]);
}
