"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { Exercise } from "@prisma/client";
import { FC, useState } from "react";

export interface AddExerciseProps {
  exercises: Exercise[];
  onAddExercises(exerciseIds: string[]): void;
}

export const AddExercise: FC<AddExerciseProps> = ({
  exercises,
  onAddExercises,
}) => {
  const modal = useDisclosure();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  return (
    <>
      <Button
        className="mb-2 w-fit self-center"
        color="primary"
        onClick={modal.onOpen}
      >
        Add Exercise
      </Button>
      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add exercise
              </ModalHeader>
              <ModalBody>
                <div>Please select one exercise to add</div>
                <div>
                  <Select
                    selectionMode="multiple"
                    label="Select an exercise"
                    className="max-w-xs"
                    onChange={(evt) => {
                      setSelectedExercises(evt.target.value.split(","));
                    }}
                  >
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={!selectedExercises.length}
                  onPress={() => {
                    onClose();
                    if (selectedExercises.length) {
                      onAddExercises(selectedExercises);
                    }
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
