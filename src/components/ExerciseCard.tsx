import { memo, useRef } from "react";
import { ExerciseSet } from "@/types";
import { createEmptySet } from "@/utils/create-empty-set";
import { NumberInput } from "@/components/NumberInput";
import { NativeTable } from "@/components/NativeTable";
import { Trainer } from "@/components/Trainer";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiCheckboxBlankLine,
  RiCheckboxLine,
  RiDeleteBinLine,
  RiSettings2Line,
  RiPlayCircleLine,
} from "@remixicon/react";
import { produce } from "immer";
import { FC, useCallback, useMemo, useState } from "react";

export interface ExerciseCardProps {
  id: string;
  title: string;
  className?: string;
  enableUndoRedo?: boolean;
  sets: ExerciseSet[];

  onExerciseDeleted?: (id: string) => void;
  onChange?: (id: string, newSets: ExerciseSet[]) => void;

  onUndo?: () => void;
  onRedo?: () => void;
}

export interface ExerciseSetRow {
  bpm: string;
  duration: string;
  id: string;
  setNo: number;
  isFinished: boolean;
}

const findSetById = (sets: ExerciseSet[], setId: string) =>
  sets.findIndex((s) => s.id === setId);

type ProducerType =
  | { type: "UPDATE_DURATION"; payload: { id: string; duration: string } }
  | { type: "UPDATE_BPM"; payload: { id: string; bpm: string } }
  | { type: "TOGGLE_FINISHED"; payload: { id: string; isFinished: boolean } }
  | {
      type: "FINISH_TRAIN_SET";
      payload: { id: string; duration: string; isFinished: boolean };
    }
  | { type: "FINISH_ALL"; payload?: {} }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "ADD"; payload?: { set: ExerciseSet } };

const produceSets = (sets: ExerciseSet[], { type, payload }: ProducerType) =>
  produce(sets, (draftSets: ExerciseSet[]) => {
    switch (type) {
      case "UPDATE_DURATION": {
        const idx = findSetById(draftSets, payload.id);
        if (idx > -1) {
          draftSets[idx].duration = payload.duration;
        }
        break;
      }
      case "UPDATE_BPM": {
        const idx = findSetById(draftSets, payload.id);
        if (idx > -1) {
          draftSets[idx].bpm = payload.bpm;
        }
        break;
      }
      case "TOGGLE_FINISHED": {
        const idx = findSetById(draftSets, payload.id);
        if (idx > -1) {
          draftSets[idx].isFinished = payload.isFinished;
        }
        break;
      }
      case "FINISH_TRAIN_SET": {
        const idx = findSetById(draftSets, payload.id);
        if (idx > -1) {
          draftSets[idx].isFinished = payload.isFinished;
          draftSets[idx].duration = payload.duration;
        }
        break;
      }
      case "FINISH_ALL": {
        draftSets.forEach((s) => (s.isFinished = true));
        break;
      }
      case "DELETE": {
        const idx = findSetById(draftSets, payload.id);
        if (idx > -1) {
          draftSets.splice(idx, 1);
        }
        break;
      }
      case "ADD": {
        draftSets.push(createEmptySet(payload?.set));
        break;
      }
    }
  });

export const ExerciseCard: FC<ExerciseCardProps> = memo(function ExerciseCard({
  className,
  title,
  id,
  sets,
  enableUndoRedo = false,

  onExerciseDeleted,
  onChange,

  onUndo,
  onRedo,
}) {
  const [curTrainSet, setCurTrainSet] = useState<ExerciseSetRow | null>(null);
  const confirmDeleteModal = useDisclosure();
  const timerModal = useDisclosure();
  const setsRef = useRef(sets);
  setsRef.current = sets;

  const numInputClassNames = useMemo(
    () => ({
      inputWrapper: "h-7",
    }),
    []
  );

  const addSet = useCallback(() => {
    onChange?.(
      id,
      produceSets(setsRef.current, {
        type: "ADD",
        payload: { set: setsRef.current[setsRef.current.length - 1] },
      })
    );
  }, [onChange, id]);

  const completeAll = useCallback(() => {
    onChange?.(id, produceSets(setsRef.current, { type: "FINISH_ALL" }));
  }, [onChange, id]);

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <span className="flex-1 font-medium text-sm">{title}</span>
          <Button
            isIconOnly
            className="ml-2"
            color="danger"
            size="sm"
            onClick={confirmDeleteModal.onOpen}
          >
            <RiDeleteBinLine size="18" />
          </Button>
          {enableUndoRedo && (
            <Button
              isIconOnly
              className="ml-2"
              color="warning"
              size="sm"
              onClick={onUndo}
            >
              <RiArrowGoBackLine size="18" color="white" />
            </Button>
          )}
          {enableUndoRedo && (
            <Button
              isIconOnly
              className="ml-2"
              color="warning"
              size="sm"
              onClick={onRedo}
            >
              <RiArrowGoForwardLine size="18" color="white" />
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <NativeTable
            aria-label="exercise-table"
            className="mb-3"
            columns={[
              {
                key: "setNo",
                label: "SET",
                width: 20,
              },
              {
                key: "isFinished",
                label: "",
                width: 20,
                renderCell: (row) => {
                  return (
                    <MarkSetFinishedButton
                      className="ml-2"
                      isFinished={row.isFinished}
                      onFinished={() => {
                        onChange?.(
                          id,
                          produceSets(sets, {
                            type: "TOGGLE_FINISHED",
                            payload: { id: row.id, isFinished: true },
                          })
                        );
                      }}
                      onUnfinished={() => {
                        onChange?.(
                          id,
                          produceSets(sets, {
                            type: "TOGGLE_FINISHED",
                            payload: { id: row.id, isFinished: false },
                          })
                        );
                      }}
                    />
                  );
                },
              },
              {
                key: "bpm",
                label: "BPM",
                width: 250,
                renderCell: (row) => {
                  return row.isFinished ? (
                    row.bpm
                  ) : (
                    <NumberInput
                      aria-label="bpm"
                      type="text"
                      size="sm"
                      min={0}
                      classNames={numInputClassNames}
                      value={Number(row.bpm)}
                      onChange={(value) => {
                        onChange?.(
                          id,
                          produceSets(sets, {
                            type: "UPDATE_BPM",
                            payload: {
                              id: row.id,
                              bpm: String(value),
                            },
                          })
                        );
                      }}
                    />
                  );
                },
              },
              {
                key: "duration",
                label: "DURATION",
                width: 250,
                renderCell: (row) => {
                  return row.isFinished ? (
                    row.duration
                  ) : (
                    <NumberInput
                      aria-label="bpm"
                      type="text"
                      size="sm"
                      min={0}
                      classNames={numInputClassNames}
                      value={Number(row.duration)}
                      onChange={(value) => {
                        onChange?.(
                          id,
                          produceSets(sets, {
                            type: "UPDATE_DURATION",
                            payload: {
                              id: row.id,
                              duration: String(value),
                            },
                          })
                        );
                      }}
                    />
                  );
                },
              },
              {
                key: "actions",
                label: "ACTIONS",
                width: 200,
                renderCell: (row) => {
                  return (
                    <div>
                      <Button
                        isIconOnly
                        color="success"
                        size="sm"
                        isDisabled={row.isFinished}
                        onClick={() => {
                          setCurTrainSet(row as ExerciseSetRow);
                          timerModal.onOpen();
                        }}
                      >
                        <RiPlayCircleLine size="18" color="white" />
                      </Button>
                      <Button
                        isIconOnly
                        className="ml-2"
                        color="danger"
                        size="sm"
                        onClick={() => {
                          onChange?.(
                            id,
                            produceSets(sets, {
                              type: "DELETE",
                              payload: { id: row.id },
                            })
                          );
                        }}
                      >
                        <RiDeleteBinLine size="18" color="white" />
                      </Button>
                      <SetToolButtons
                        onDelete={() => {
                          onChange?.(
                            id,
                            produceSets(sets, {
                              type: "DELETE",
                              payload: { id: row.id },
                            })
                          );
                        }}
                        onDuplicate={() => {
                          onChange?.(
                            id,
                            produceSets(sets, {
                              type: "ADD",
                              payload: {
                                set: {
                                  id: row.id + "_1",
                                  bpm: row.bpm,
                                  duration: row.duration,
                                  isFinished: row.isFinished,
                                },
                              },
                            })
                          );
                        }}
                      />
                    </div>
                  );
                },
              },
            ]}
            rows={sets.map(
              (set, index) =>
                ({
                  id: set.id,
                  setNo: index + 1,
                  bpm: set.bpm,
                  duration: set.duration,
                  isFinished: set.isFinished,
                } as ExerciseSetRow)
            )}
          />
          <div className="flex mt-3">
            <Button
              className="flex-1"
              variant="flat"
              size="sm"
              onClick={addSet}
            >
              Add Set
            </Button>
            <Button
              className="flex-1 ml-3"
              variant="flat"
              size="sm"
              color="danger"
              onClick={completeAll}
            >
              Complete All
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={confirmDeleteModal.isOpen}
        onOpenChange={confirmDeleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete exercise?
              </ModalHeader>
              <ModalBody>
                <p>This will delete &quot;{title}&quot;</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onExerciseDeleted?.(id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="full"
        hideCloseButton
        isOpen={timerModal.isOpen}
        onOpenChange={timerModal.onOpenChange}
      >
        <ModalContent>
          <Trainer
            exerciseName={title}
            set={curTrainSet}
            onEnd={(setId, duration) => {
              onChange?.(
                id,
                produceSets(sets, {
                  type: "FINISH_TRAIN_SET",
                  payload: { id: setId, duration, isFinished: true },
                })
              );
            }}
            onClose={timerModal.onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
});

const MarkSetFinishedButton = memo(function MarkSetFinishedButton({
  className,
  isFinished,
  onFinished,
  onUnfinished,
}: {
  className?: string;
  isFinished: boolean;
  onFinished: () => void;
  onUnfinished: () => void;
}) {
  return isFinished ? (
    <Button
      className={className}
      isIconOnly
      color="success"
      size="sm"
      onClick={onUnfinished}
    >
      <RiCheckboxLine color="white" size="18" />
    </Button>
  ) : (
    <Button className={className} isIconOnly size="sm" onClick={onFinished}>
      <RiCheckboxBlankLine color="white" size="18" />
    </Button>
  );
});

const SetToolButtons = memo(function SetToolButtons({
  onDelete,
  onDuplicate,
}: {
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly className="ml-2" size="sm">
          <RiSettings2Line size="18" color="white" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === "delete") {
            onDelete();
            return;
          }

          if (key === "duplicate") {
            onDuplicate();
            return;
          }
        }}
      >
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
        <DropdownItem key="duplicate">Duplicate</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});
