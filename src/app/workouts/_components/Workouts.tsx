"use client";

import { AddExerciseButton } from "@/components/AddExerciseButton";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Time } from "@/components/Time";
import { useStopWatch } from "@/hooks/useStopWatch";
import { useWorkoutsState } from "@/hooks/useWorkoutsState";
import { storage } from "@/storage";
import { Exercise } from "@prisma/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import StopWatchButton from "./StopWatchButton";

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

  const [workout, dispatchWorkout] = useWorkoutsState();

  const [isRunning, setIsRunning] = useState(false);
  const stopWatch = useStopWatch();

  const handleStart = () => {
    setIsRunning(true);
    stopWatch.start();
  };

  const handleStop = () => {
    setIsRunning(false);
    stopWatch.stop();
    storage.pushWorkout(workout);
    dispatchWorkout({ type: "RESET" });
  };

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
            onAddExercise={(exerciseId) => {
              dispatchWorkout({
                type: "ADD_EXERCISE",
                payload: { exerciseId },
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
      <Modal
        isOpen={finishedConfirmModal.isOpen}
        onOpenChange={finishedConfirmModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Finish workout?
              </ModalHeader>
              <ModalBody>
                <p>This will stop the workout</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    handleStop();
                  }}
                >
                  Stop
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
