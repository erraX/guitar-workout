import { FC } from 'react';
import { produce } from 'immer';
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@nextui-org/react';
import {
  RiDeleteBinLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiSettings2Line,
} from "@remixicon/react";
import { ExerciseSet } from '@/types';
import { createEmptySet } from '@/utils/create-empty-set';

export interface ExerciseCardProps {
  title: string;
  className?: string;
  enableUndoRedo?: boolean;
  sets: ExerciseSet[];

  onExerciseDeleted?: () => void;
  onChange?: (newSets: ExerciseSet[]) => void;

  onUndo?: () => void;
  onRedo?: () => void;
}

const findSetById = (sets: ExerciseSet[], setId: string) => sets.findIndex(s => s.id === setId);

type ProducerType =
  | { type: 'UPDATE_DURATION', payload: { id: string, duration: string } }
  | { type: 'UPDATE_BPM', payload: { id: string, bpm: string } }
  | { type: 'TOGGLE_FINISHED', payload: { id: string, isFinished: boolean } }
  | { type: 'FINISH_ALL', payload?: {} }
  | { type: 'DELETE', payload: { id: string } }
  | { type: 'ADD', payload?: { set: ExerciseSet } };

const produceSets = (sets: ExerciseSet[], { type, payload }: ProducerType) => produce(sets, (draftSets: ExerciseSet[]) => {
  switch (type) {
    case 'UPDATE_DURATION': {
      const idx = findSetById(draftSets, payload.id);
      if (idx > -1) {
        draftSets[idx].duration = payload.duration;
      }
      break;
    }
    case 'UPDATE_BPM': {
      const idx = findSetById(draftSets, payload.id);
      if (idx > -1) {
        draftSets[idx].bpm = payload.bpm;
      }
      break;
    }
    case 'TOGGLE_FINISHED': {
      const idx = findSetById(draftSets, payload.id);
      if (idx > -1) {
        draftSets[idx].isFinished = payload.isFinished;
      }
      break;
    }
    case 'FINISH_ALL': {
      draftSets.forEach(s => s.isFinished = true);
      break;
    }
    case 'DELETE': {
      const idx = findSetById(draftSets, payload.id);
      if (idx > -1) {
        draftSets.splice(idx, 1);
      }
      break;
    }
    case 'ADD': {
      draftSets.push(createEmptySet(payload?.set));
      break;
    }
  }
});

export const ExerciseCard: FC<ExerciseCardProps> = ({
  className,
  title,
  sets,
  enableUndoRedo = false,

  onExerciseDeleted,
  onChange,

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
          {enableUndoRedo && <Button
            isIconOnly
            className="ml-2"
            color="warning"
            size="sm"
            onClick={onUndo}
          >
            <RiArrowGoBackLine size="18" color="white" />
          </Button>}
          {enableUndoRedo && <Button
            isIconOnly
            className="ml-2"
            color="warning"
            size="sm"
            onClick={onRedo}
          >
            <RiArrowGoForwardLine size="18" color="white" />
          </Button>}
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
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'UPDATE_BPM',
                                payload: {
                                  id: set.id,
                                  bpm: event.target.value,
                                },
                              }
                            ));
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
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'UPDATE_DURATION',
                                payload: {
                                  id: set.id,
                                  duration: event.target.value,
                                },
                              }
                            ));
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
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'TOGGLE_FINISHED',
                                payload: {
                                  id: set.id,
                                  isFinished: false,
                                },
                              }
                            ));
                          }}
                        >
                          <RiCheckboxLine color="white" size="18" />
                        </Button>
                        : <Button
                          isIconOnly
                          size="sm"
                          onClick={() => {
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'TOGGLE_FINISHED',
                                payload: {
                                  id: set.id,
                                  isFinished: true,
                                },
                              }
                            ));
                          }}
                        >
                          <RiCheckboxBlankLine color="white" size="18" />
                        </Button>
                      }
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            className="ml-2"
                            size="sm"
                          >
                            <RiSettings2Line size="18" color="white" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => {
                          if (key === 'delete') {
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'DELETE',
                                payload: {
                                  id: set.id,
                                },
                              }
                            ));
                            return;
                          }

                          if (key === 'duplicate') {
                            onChange?.(produceSets(
                              sets,
                              {
                                type: 'ADD',
                                payload: {
                                  set,
                                },
                              }
                            ));
                            return;
                          }
                        }}>
                          <DropdownItem key="delete" className="text-danger" color="danger">Delete</DropdownItem>
                          <DropdownItem key="duplicate">Duplicate</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
                onChange?.(produceSets(
                  sets,
                  {
                    type: 'ADD',
                    payload: { set: sets[sets.length - 1] },
                  }
                ));
              }}
            >
              Add Set
            </Button>
            <Button
              className="flex-1 ml-3"
              variant="flat"
              size="sm"
              color="danger"
              onClick={() => {
                onChange?.(produceSets(
                  sets,
                  { type: 'FINISH_ALL' }
                ));
              }}
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
              <ModalHeader className="flex flex-col gap-1">Delete exercise?</ModalHeader>
              <ModalBody>
                <p>
                  This will delete "{title}"
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => {
                  onExerciseDeleted?.();
                  onClose();
                }}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
