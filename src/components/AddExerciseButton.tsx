import { FC, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { exercises } from '@/dataset/exercises';

export interface AddExerciseButtonProps {
  onAddExercise(exerciseId: string): void;
}

export const AddExerciseButton: FC<AddExerciseButtonProps> = ({ onAddExercise }) => {
  const modal = useDisclosure();
  const [selectedExercise, setSelectedExercise] = useState<string>();

  return (
    <>
      <Button
        className="mb-2"
        color="primary"
        onClick={modal.onOpen}
      >
        Add Exercise
      </Button>
      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add exercise</ModalHeader>
              <ModalBody>
                <p>
                  Please select one exercise to add
                </p>
                <p>
                  <Select
                    label="Select an exercise"
                    className="max-w-xs"
                    onChange={(evt) => {
                      setSelectedExercise(evt.target.value);
                    }}
                  >
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </Select>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" isDisabled={!selectedExercise} onPress={() => {
                  onClose();
                  if (selectedExercise) {
                    onAddExercise(selectedExercise);
                  }
                }}>
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
