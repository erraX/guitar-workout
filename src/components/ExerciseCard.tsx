import { ExerciseSet } from "@/types";
import { createEmptySet } from "@/utils/create-empty-set";
import { NumberInput } from "@/components/NumberInput";
import { Table } from "@/components/Table";
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
} from "@remixicon/react";
import { produce } from "immer";
import { FC } from "react";

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

const findSetById = (sets: ExerciseSet[], setId: string) =>
  sets.findIndex((s) => s.id === setId);

type ProducerType =
  | { type: "UPDATE_DURATION"; payload: { id: string; duration: string } }
  | { type: "UPDATE_BPM"; payload: { id: string; bpm: string } }
  | { type: "TOGGLE_FINISHED"; payload: { id: string; isFinished: boolean } }
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
          <Table
            aria-label="exercise-table"
            className="mb-3"
            columns={[
              {
                key: "setNo",
                label: "SET",
                width: 20,
              },
              {
                key: "bpm",
                label: "BPM",
                width: 200,
                renderCell: (row) => {
                  return row.isFinished ? (
                    row.bpm
                  ) : (
                    <NumberInput
                      aria-label="bpm"
                      type="text"
                      size="sm"
                      classNames={{
                        inputWrapper: "h-7",
                      }}
                      value={Number(row.bpm)}
                      onChange={(value) => {
                        onChange?.(
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
                label: "DURATION(s)",
                width: 200,
                renderCell: (row) => {
                  return row.isFinished ? (
                    row.duration
                  ) : (
                    <NumberInput
                      aria-label="bpm"
                      type="text"
                      size="sm"
                      classNames={{
                        inputWrapper: "h-7",
                      }}
                      value={Number(row.duration)}
                      onChange={(value) => {
                        onChange?.(
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
                width: 20,
                renderCell: (row) => {
                  return (
                    <div>
                      <MarkSetFinishedButton
                        isFinished={row.isFinished}
                        onFinished={() => {
                          onChange?.(
                            produceSets(sets, {
                              type: "TOGGLE_FINISHED",
                              payload: { id: row.id, isFinished: true },
                            })
                          );
                        }}
                        onUnfinished={() => {
                          onChange?.(
                            produceSets(sets, {
                              type: "TOGGLE_FINISHED",
                              payload: { id: row.id, isFinished: false },
                            })
                          );
                        }}
                      />
                      <SetToolButtons
                        onDelete={() => {
                          onChange?.(
                            produceSets(sets, {
                              type: "DELETE",
                              payload: { id: row.id },
                            })
                          );
                        }}
                        onDuplicate={() => {
                          onChange?.(
                            produceSets(sets, {
                              type: "ADD",
                              payload: { set: row },
                            })
                          );
                        }}
                      />
                    </div>
                  );
                },
              },
            ]}
            rows={sets.map((set, index) => ({
              id: set.id,
              setNo: index + 1,
              bpm: set.bpm,
              duration: set.duration,
              isFinished: set.isFinished,
            }))}
          />
          <div className="flex">
            <Button
              className="flex-1"
              variant="flat"
              size="sm"
              onClick={() => {
                onChange?.(
                  produceSets(sets, {
                    type: "ADD",
                    payload: { set: sets[sets.length - 1] },
                  })
                );
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
                onChange?.(produceSets(sets, { type: "FINISH_ALL" }));
              }}
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
                <p>This will delete "{title}"</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onExerciseDeleted?.();
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
    </>
  );
};

function MarkSetFinishedButton({
  isFinished,
  onFinished,
  onUnfinished,
}: {
  isFinished: boolean;
  onFinished: () => void;
  onUnfinished: () => void;
}) {
  return isFinished ? (
    <Button isIconOnly color="success" size="sm" onClick={onUnfinished}>
      <RiCheckboxLine color="white" size="18" />
    </Button>
  ) : (
    <Button isIconOnly size="sm" onClick={onFinished}>
      <RiCheckboxBlankLine color="white" size="18" />
    </Button>
  );
}

function SetToolButtons({
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
}