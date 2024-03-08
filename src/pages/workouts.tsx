import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import {
  RiPlayCircleLine,
  RiStopCircleLine,
} from "@remixicon/react";
import { Time } from '@/components/Time';
import { ExerciseCard } from '@/components/ExerciseCard';
import { AddExerciseButton } from '@/components/AddExerciseButton';
import { useWorkoutsState } from '@/hooks/useWorkoutsState';
import { useStopWatch } from '@/hooks/useStopWatch';
import { workoutsTemplates } from '@/dataset/workout-template';
import { exercises as exercisesData } from '@/dataset/exercises';
import { Exercise } from '@/types';

const getExerciseById = (exercises: Exercise[], id: string) => 
  exercises.findIndex(e => e.id === id);

const getExerciseNameById = (exercises: Exercise[], id: string) => {
  const idx = getExerciseById(exercises, id);
  return idx > -1 ? exercises[idx].name : '';
};

export default function Workouts() {
  const finishedConfirmModal = useDisclosure();

  const [workout, dispatchWorkout] = useWorkoutsState(workoutsTemplates[0]);

  const [isRunning, setIsRunning] = useState(false);
  const stopWatch = useStopWatch();

  const handleStart = () => {
    setIsRunning(true);
    stopWatch.start();
  };

  const handleStop = () => {
    setIsRunning(false);
    stopWatch.stop();
  };

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center mb-6 w-full">
          <Time className="mr-3" seconds={stopWatch.time} />
          {isRunning
            ? <Button isIconOnly color="danger" onClick={finishedConfirmModal.onOpen}>
              <RiStopCircleLine />
            </Button>
            : <Button isIconOnly color="success" onClick={handleStart}>
              <RiPlayCircleLine color="white" />
            </Button>
          }
        </div>
        <div className="flex flex-col w-full mb-6">
          <AddExerciseButton onAddExercise={(exerciseId) => {
            dispatchWorkout({ type: 'ADD_EXERCISE', payload: { exerciseId } });
          }} />
        </div>
        <div className="w-full">
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              className="mb-3"
              title={getExerciseNameById(exercisesData, exercise.exerciseId)}
              sets={exercise.sets}
              onExerciseDeleted={() => {
                dispatchWorkout({ type: 'DELETE_EXERCISE', payload: { exerciseWorkoutId: exercise.id } });
              }}
              onChange={(sets) => {
                dispatchWorkout({
                  type: 'UPDATE_EXERCISE',
                  payload: {
                    exerciseWorkoutId: exercise.id,
                    sets,
                  }
                });
              }}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={finishedConfirmModal.isOpen} onOpenChange={finishedConfirmModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Finish workout?</ModalHeader>
              <ModalBody>
                <p>
                  This will stop the workout
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => {
                  onClose();
                  handleStop();
                }}>
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
