import { FC } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import {
  RiDeleteBinLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "@remixicon/react";

export interface ExerciseSet {
  id: string;
  bpm: string;
  duration: string;
  isFinished: boolean;
}

export interface ExerciseCardProps {
  title: string;
  className?: string;
  sets?: ExerciseSet[];

  // Change handlers
  onExerciseDeleted?: () => void;
  onExerciseFinished?: () => void;

  onSetAdded?: () => void;
  onSetDeleted?: (setId: string) => void;
  onSetChanged?: (set: ExerciseSet) => void;

  onUndo?: () => void;
  onRedo?: () => void;
}

export const ExerciseCard: FC<ExerciseCardProps> = ({
  className,
  title,
  sets,

  onExerciseDeleted,
  onExerciseFinished,
  onSetAdded,
  onSetDeleted,
  onSetChanged,

  onUndo,
  onRedo,
}) => {
  const confirmDeleteModal = useDisclosure();

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <span>{title}</span>
          <Button
            isIconOnly
            className="ml-2"
            color="danger"
            size="sm"
            onClick={() => {
              confirmDeleteModal.onOpen();
              onExerciseDeleted?.();
            }}
          >
            <RiDeleteBinLine size="18" />
          </Button>
          <Button
            isIconOnly
            className="ml-2"
            color="warning"
            size="sm"
            onClick={onUndo}
          >
            <RiArrowGoBackLine size="18" color="white" />
          </Button>
          <Button
            isIconOnly
            className="ml-2"
            color="warning"
            size="sm"
            onClick={onRedo}
          >
            <RiArrowGoForwardLine size="18" color="white" />
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="exercise-table" className="mb-3">
            <TableHeader>
              <TableColumn width={20}>SET</TableColumn>
              <TableColumn width={200}>BPM</TableColumn>
              <TableColumn width={200}>DURATION(s)</TableColumn>
              <TableColumn width={20}>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {
                (sets || []).map((set, index) => (
                  <TableRow key={set.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {set.isFinished
                        ? set.bpm
                        : <Input
                          aria-label="bpm"
                          type="text"
                          size="sm"
                          classNames={{
                            inputWrapper: 'h-7'
                          }}
                          value={set.bpm}
                          onChange={(event) => {
                            onSetChanged?.({
                              ...set,
                              bpm: event.target.value,
                            });
                          }}
                        />
                      }
                    </TableCell>
                    <TableCell>
                      {set.isFinished
                        ? set.duration
                        : <Input
                          aria-label="duration"
                          type="text"
                          size="sm"
                          classNames={{
                            inputWrapper: 'h-7'
                          }}
                          value={set.duration}
                          onChange={(event) => {
                            onSetChanged?.({
                              ...set,
                              duration: event.target.value,
                            });
                          }}
                        />
                      }
                    </TableCell>
                    <TableCell>
                      {set.isFinished
                        ? <Button
                          isIconOnly
                          color="success"
                          size="sm"
                          onClick={() => {
                            onSetChanged?.({
                              ...set,
                              isFinished: false,
                            });
                          }}
                        >
                          <RiCheckboxLine color="white" size="18" />
                        </Button>
                        : <Button
                          isIconOnly
                          color="success"
                          size="sm"
                          onClick={() => {
                            onSetChanged?.({
                              ...set,
                              isFinished: true,
                            });
                          }}
                        >
                          <RiCheckboxBlankLine color="white" size="18" />
                        </Button>
                      }
                      <Button
                        isIconOnly
                        className="ml-2"
                        color="danger"
                        size="sm"
                        onClick={() => {
                          onSetDeleted?.(set.id);
                        }}
                      >
                        <RiDeleteBinLine size="18" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <div className="flex">
            <Button
              className="flex-1"
              variant="flat"
              size="sm"
              onClick={() => {
                onSetAdded?.();
              }}
            >
              Add Set
            </Button>
            <Button
              className="flex-1 ml-3"
              variant="flat"
              size="sm"
              color="danger"
              onClick={onExerciseFinished}
            >
              Complete All
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={confirmDeleteModal.isOpen} onOpenChange={confirmDeleteModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete exercise</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure to delete this exercise?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={() => {
                  onExerciseDeleted?.();
                  onClose();
                }}>
                  Delete
                </Button>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
