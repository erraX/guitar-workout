"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Exercise } from "@prisma/client";
import { Button, useDisclosure } from "@nextui-org/react";

import { createWorkout } from "@/actions/workout";

import { AddExercise } from "@/components/AddExercise";
import { ExerciseCard } from "@/components/ExerciseCard";

import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useWorkoutsStore } from "@/hooks/useWorkoutsStore";

import FinishConfirmModal from "./FinishConfirmModal";
import StopWatch from "./StopWatch";

import { useWorkoutTaskState } from "../_utils/useWorkoutTaskState";

const getExerciseById = (exercises: Exercise[], id: number) =>
  exercises.findIndex((e) => e.id === id);

const getExerciseNameById = (exercises: Exercise[], id: number) => {
  const idx = getExerciseById(exercises, id);
  return idx > -1 ? exercises[idx].name : "";
};

export interface WorkoutsProps {
  exercises: Exercise[];
  workoutTemplate?: any;
}

export function Workouts({ exercises, workoutTemplate = null }: WorkoutsProps) {
  const finishedConfirmModal = useDisclosure();

  const { reset, addExercise, deleteExercise, updateExercise, ...workout } =
    useWorkoutsStore(workoutTemplate);

  const { isRunning, time, start, abort, stop } = useWorkoutTaskState();

  const handleStop = async () => {
    stop();

    const result = await createWorkout({
      duration: workout.duration,
      exercises: workout.exercises.map((exercise) => ({
        id: exercise.exerciseId,
        sets: exercise.sets
          .filter((set) => set.isFinished)
          .map((set) => ({
            bpm: Number(set.bpm),
            duration: Number(set.duration),
          })),
      })),
    });
    if (!result.success) {
      console.log("create workout error", result.error);
    }
  };

  useBeforeUnload(isRunning);
  useClearQueryParams();

  const [num, setNum] = useState<number | undefined | null>(10);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center mb-6 w-full">
          <StopWatch
            time={time}
            isRunning={isRunning}
            onStop={finishedConfirmModal.onOpen}
            onStart={start}
          />
        </div>
        <div className="flex flex-row w-full mb-6 justify-center">
          <AddExercise
            exercises={exercises}
            onAddExercises={(exerciseIds) => {
              exerciseIds.forEach((exerciseId) => {
                addExercise(Number(exerciseId));
              });
            }}
          />
          <Button
            className="ml-3"
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </div>
        <div className="w-full max-w-3xl">
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              className="mb-3"
              title={getExerciseNameById(exercises, exercise.exerciseId)}
              sets={exercise.sets}
              onExerciseDeleted={() => {
                deleteExercise(exercise.id);
              }}
              onChange={(sets) => {
                updateExercise(exercise.id, sets);
              }}
            />
          ))}
        </div>
      </div>
      <FinishConfirmModal
        modal={finishedConfirmModal}
        onStop={handleStop}
        onAbort={abort}
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
