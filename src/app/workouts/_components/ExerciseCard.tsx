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
import { FC, useCallback, useState } from "react";
import { useWorkoutsStore } from "../_contexts/WorkoutsStoreContext";
import { UseDisclosureReturn } from "./FinishConfirmModal";

export interface ExerciseCardProps {
  id: string;
  title: string;
  className?: string;
  enableUndoRedo?: boolean;
  sets: ExerciseSet[];

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

const numInputClassNames = {
  inputWrapper: "h-7",
};

export const ExerciseCard: FC<ExerciseCardProps> = memo(function ExerciseCard({
  className,
  title,
  id,
  sets,
  enableUndoRedo = false,
}) {
  const [curTrainSet, setCurTrainSet] = useState<ExerciseSetRow | null>(null);
  const confirmDeleteModal = useDisclosure();
  const timerModal = useDisclosure();
  const setsRef = useRef(sets);
  setsRef.current = sets;

  return (
    <>
      <Card
        className={className}
        onFocus={() => {
          // TODO: set some shortcuts
          console.log("focus");
        }}
      >
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
              onClick={() => {
                console.log("undo");
              }}
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
              onClick={() => {
                console.log("redo");
              }}
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
                      exerciseId={id}
                      setId={row.id}
                      className="ml-2"
                      isFinished={row.isFinished}
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
                    <BpmInput
                      exerciseId={id}
                      setId={row.id}
                      value={row.bpm}
                      onStart={() => {
                        setCurTrainSet({
                          id: row.id,
                          bpm: row.bpm,
                          duration: row.duration,
                          setNo: row.setNo,
                          isFinished: row.isFinished,
                        });
                        timerModal.onOpen();
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
                    <DurationInput
                      exerciseId={id}
                      setId={row.id}
                      value={row.duration}
                      onStart={() => {
                        setCurTrainSet({
                          id: row.id,
                          bpm: row.bpm,
                          duration: row.duration,
                          setNo: row.setNo,
                          isFinished: row.isFinished,
                        });
                        timerModal.onOpen();
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
                    <SetActions
                      exerciseId={id}
                      setId={row.id}
                      isFinished={row.isFinished}
                      onClickOpenModal={timerModal.onOpen}
                      onSetCurTrainSet={setCurTrainSet}
                    />
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
            <AddSetButton exerciseId={id} />
            <CompleteAllButton exerciseId={id} />
          </div>
        </CardBody>
      </Card>
      <DeleteExerciseModal
        title={title}
        exerciseId={id}
        modalDisclosure={confirmDeleteModal}
      />
      <TrainerModal
        timerModal={timerModal}
        exerciseId={id}
        exerciseName={title}
        set={curTrainSet}
      />
    </>
  );
});

const MarkSetFinishedButton = memo(function MarkSetFinishedButton({
  exerciseId,
  setId,
  className,
  isFinished,
}: {
  exerciseId: string;
  setId: string;
  className?: string;
  isFinished: boolean;
}) {
  const _toggleFinished = useWorkoutsStore(
    (state) => state.updateSetIsFinished
  );

  return isFinished ? (
    <Button
      className={className}
      isIconOnly
      color="success"
      size="sm"
      onClick={() => {
        _toggleFinished(exerciseId, setId, false);
      }}
    >
      <RiCheckboxLine color="white" size="18" />
    </Button>
  ) : (
    <Button
      className={className}
      isIconOnly
      size="sm"
      onClick={() => {
        _toggleFinished(exerciseId, setId, true);
      }}
    >
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

const AddSetButton = memo(function AddSetButton({
  exerciseId,
}: {
  exerciseId: string;
}) {
  const addSet = useWorkoutsStore((state) => state.addSet);
  const lastSet = useWorkoutsStore((state) => {
    const exercise = state.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return null;
    return exercise.sets[exercise.sets.length - 1];
  });

  return (
    <Button
      className="flex-1"
      variant="flat"
      size="sm"
      onClick={() => {
        addSet(exerciseId, {
          ...createEmptySet(),
          ...(lastSet ? { bpm: lastSet.bpm, duration: lastSet.duration } : {}),
        });
      }}
    >
      Add Set
    </Button>
  );
});

const CompleteAllButton = memo(function CompleteAllButton({
  exerciseId,
}: {
  exerciseId: string;
}) {
  const completeAllSets = useWorkoutsStore((state) => state.completeAllSets);

  return (
    <Button
      className="flex-1 ml-3"
      variant="flat"
      size="sm"
      onClick={() => {
        completeAllSets(exerciseId);
      }}
    >
      Complete All
    </Button>
  );
});

const BpmInput = memo(function BpmInput({
  exerciseId,
  setId,
  value,
  onStart,
}: {
  exerciseId: string;
  setId: string;
  value: string;
  onStart?: () => void;
}) {
  const updateBpm = useWorkoutsStore((state) => state.updateSetBpm);
  const toggleFinished = useWorkoutsStore((state) => state.updateSetIsFinished);

  return (
    <NumberInput
      aria-label="bpm"
      type="text"
      size="sm"
      min={0}
      classNames={numInputClassNames}
      value={Number(value)}
      onChange={(value) => {
        updateBpm(exerciseId, setId, String(value));
      }}
      onToggleFinished={() => {
        toggleFinished(exerciseId, setId, true);
      }}
      onStart={() => {
        onStart?.();
      }}
    />
  );
});

const DurationInput = memo(function DurationInput({
  exerciseId,
  setId,
  value,
  onStart,
}: {
  exerciseId: string;
  setId: string;
  value: string;
  onStart?: () => void;
}) {
  const updateDuration = useWorkoutsStore((state) => state.updateSetDuration);
  const toggleFinished = useWorkoutsStore((state) => state.updateSetIsFinished);

  return (
    <NumberInput
      aria-label="duration"
      type="text"
      size="sm"
      min={0}
      classNames={numInputClassNames}
      value={Number(value)}
      onChange={(value) => {
        updateDuration(exerciseId, setId, String(value));
      }}
      onToggleFinished={() => {
        toggleFinished(exerciseId, setId, true);
      }}
      onStart={() => {
        onStart?.();
      }}
    />
  );
});

const DeleteExerciseModal = memo(
  function DeleteExerciseModal({
    title,
    exerciseId,
    modalDisclosure,
  }: {
    title: string;
    exerciseId: string;
    modalDisclosure: UseDisclosureReturn;
  }) {
    const deleteExercise = useWorkoutsStore((state) => state.deleteExercise);

    return (
      <Modal
        isOpen={modalDisclosure.isOpen}
        onOpenChange={modalDisclosure.onOpenChange}
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
                    deleteExercise(exerciseId);
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
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.modalDisclosure.isOpen === nextProps.modalDisclosure.isOpen &&
      prevProps.exerciseId === nextProps.exerciseId
    );
  }
);

const SetActions = memo(function SetActions({
  exerciseId,
  setId,
  isFinished,
  onClickOpenModal,
  onSetCurTrainSet,
}: {
  exerciseId: string;
  setId: string;
  isFinished: boolean;
  onClickOpenModal?: () => void;
  onSetCurTrainSet: (set: ExerciseSetRow) => void;
}) {
  const deleteSet = useWorkoutsStore((state) => state.deleteSet);
  const duplicateSet = useWorkoutsStore((state) => state.duplicateSet);

  const curSet = useWorkoutsStore((state) => {
    const curSet = state.exercises
      .find((e) => e.id === exerciseId)
      ?.sets.find((s) => s.id === setId);
    return curSet;
  });

  const curSetIndex = useWorkoutsStore((state) => {
    const exercise = state.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return -1;
    return exercise.sets.findIndex((s) => s.id === setId);
  });

  return (
    <div>
      <Button
        isIconOnly
        color="success"
        size="sm"
        isDisabled={isFinished}
        onClick={() => {
          if (curSet) {
            onSetCurTrainSet({
              id: curSet.id,
              bpm: curSet.bpm,
              duration: curSet.duration,
              setNo: curSetIndex + 1,
              isFinished: curSet.isFinished,
            });
            onClickOpenModal?.();
          }
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
          deleteSet(exerciseId, setId);
        }}
      >
        <RiDeleteBinLine size="18" color="white" />
      </Button>
      <SetToolButtons
        onDelete={() => {
          deleteSet(exerciseId, setId);
        }}
        onDuplicate={() => {
          duplicateSet(exerciseId, setId);
        }}
      />
    </div>
  );
});

const TrainerModal = memo(
  function TrainerModal({
    timerModal,
    exerciseId,
    exerciseName,
    set,
  }: {
    timerModal: UseDisclosureReturn;
    exerciseId: string;
    exerciseName: string;
    set: ExerciseSetRow | null;
  }) {
    const updateDuration = useWorkoutsStore((state) => state.updateSetDuration);
    const toggleFinished = useWorkoutsStore(
      (state) => state.updateSetIsFinished
    );

    return (
      <Modal
        size="full"
        hideCloseButton
        isOpen={timerModal.isOpen}
        onOpenChange={timerModal.onOpenChange}
      >
        <ModalContent>
          <Trainer
            exerciseName={exerciseName}
            set={set}
            onEnd={(setId, duration) => {
              updateDuration(exerciseId, setId, duration);
              toggleFinished(exerciseId, setId, true);
            }}
            onClose={timerModal.onClose}
          />
        </ModalContent>
      </Modal>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.timerModal.isOpen === nextProps.timerModal.isOpen &&
      prevProps.exerciseId === nextProps.exerciseId &&
      prevProps.exerciseName === nextProps.exerciseName &&
      prevProps.set === nextProps.set
    );
  }
);
