"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Exercise } from "@prisma/client";
import { Button, useDisclosure } from "@nextui-org/react";

import { createWorkout } from "@/actions/workout";

import { AddExercise } from "@/components/AddExercise";
import { ExerciseCard } from "./ExerciseCard";

import { useBeforeUnload } from "@/hooks/useBeforeUnload";

import FinishConfirmModal from "./FinishConfirmModal";
import StopWatch from "./StopWatch";
import { useWorkoutsStore } from "../_contexts/WorkoutsStoreContext";

import { useWorkoutTaskState } from "../_utils/useWorkoutTaskState";

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
  const finishedConfirmModal = useDisclosure();

  const clear = useWorkoutsStore((state) => state.clear);
  const addExercise = useWorkoutsStore((state) => state.addExercise);
  const duration = useWorkoutsStore((state) => state.duration);
  const workoutExercises = useWorkoutsStore((state) => state.exercises);

  const { isRunning, time, start, abort, stop } = useWorkoutTaskState();

  const handleStop = useCallback(async () => {
    stop();

    // TODO: Add loading
    const result = await createWorkout({
      duration: time,
      exercises: workoutExercises.map((exercise) => ({
        id: Number(exercise.exerciseId),
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
    } else {
      alert("Create workout successfully!");
    }
  }, [time, workoutExercises, stop]);

  useBeforeUnload(isRunning);
  useClearQueryParams();

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
                addExercise(exerciseId);
              });
            }}
          />
          <Button className="ml-3" onClick={clear}>
            Clear
          </Button>
        </div>
        <div className="w-full max-w-3xl">
          {workoutExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
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
