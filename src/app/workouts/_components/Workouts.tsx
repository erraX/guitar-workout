"use client";

import { useRouter } from "next/navigation";
import { AddExerciseButton } from "@/components/AddExerciseButton";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Time } from "@/components/Time";
import { useStopWatch } from "@/hooks/useStopWatch";
import { useWorkoutsState } from "@/hooks/useWorkoutsState";
import { storage } from "@/storage";
import { Exercise } from "@prisma/client";
import { useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createWorkout } from "@/actions/workout";
import StopWatchButton from "./StopWatchButton";
import FinishConfirmModal from "./FinishConfirmModal";

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
  const router = useRouter();
  const finishedConfirmModal = useDisclosure();
  const [workout, dispatchWorkout] = useWorkoutsState(
    workoutTemplate?.exercises.map((exercise: any) => ({
      id: exercise.id,
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
    })) || []
  );

  const [isRunning, setIsRunning] = useState(false);
  const stopWatch = useStopWatch();

  const handleStart = () => {
    setIsRunning(true);
    stopWatch.start();
  };

  const handleAbort = () => {
    setIsRunning(false);
    stopWatch.stop();
  };

  const handleStop = async () => {
    setIsRunning(false);
    stopWatch.stop();

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
    if (result.success) {
      storage.pushWorkout(workout);
      dispatchWorkout({ type: "RESET" });
    } else {
      console.log("create workout error", result.error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isRunning) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRunning]);

  useEffect(() => {
    router.replace(`/workouts`);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center mb-6 w-full">
          <Time className="mr-3" seconds={stopWatch.time} />
          <StopWatchButton
            isRunning={isRunning}
            onStop={finishedConfirmModal.onOpen}
            onStart={handleStart}
          />
        </div>
        <div className="flex flex-col w-full mb-6">
          <AddExerciseButton
            exercises={exercises}
            onAddExercises={(exerciseIds) => {
              exerciseIds.forEach((exerciseId) => {
                dispatchWorkout({
                  type: "ADD_EXERCISE",
                  payload: { exerciseId: Number(exerciseId) },
                });
              });
            }}
          />
        </div>
        <div className="w-full">
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              className="mb-3"
              title={getExerciseNameById(exercises, exercise.exerciseId)}
              sets={exercise.sets}
              onExerciseDeleted={() => {
                dispatchWorkout({
                  type: "DELETE_EXERCISE",
                  payload: { exerciseWorkoutId: exercise.id },
                });
              }}
              onChange={(sets) => {
                dispatchWorkout({
                  type: "UPDATE_EXERCISE",
                  payload: {
                    exerciseWorkoutId: exercise.id,
                    sets,
                  },
                });
              }}
            />
          ))}
        </div>
      </div>
      <FinishConfirmModal
        modal={finishedConfirmModal}
        onStop={handleStop}
        onAbort={handleAbort}
      />
    </>
  );
}
