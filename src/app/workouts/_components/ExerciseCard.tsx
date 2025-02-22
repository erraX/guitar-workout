import { memo, useRef } from "react";
import { ExerciseSet } from "@/types";
import { createEmptySet } from "@/utils/create-empty-set";
import { NumberInput } from "@/components/NumberInput";
import { NativeTable } from "@/components/NativeTable";
import { Trainer } from "@/components/Trainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlay, Trash2, Settings, SquareCheck } from "lucide-react";
import { FC, useState } from "react";
import { useWorkoutsStore } from "../_contexts/WorkoutsStoreContext";

export interface ExerciseCardProps {
  id: string;
  title: string;
  className?: string;
  enableUndoRedo?: boolean;
  sets: ExerciseSet[];
  notes: string;

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

export const ExerciseCard: FC<ExerciseCardProps> = memo(function ExerciseCard({
  className,
  title,
  id,
  sets,
  notes,
  enableUndoRedo = false,
}) {
  const [curTrainSet, setCurTrainSet] = useState<ExerciseSetRow | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);

  const setsRef = useRef(sets);
  setsRef.current = sets;

  const updateNotes = useWorkoutsStore((state) => state.updateNotes);

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex-1 font-medium text-sm">{title}</span>
            <div>
              <Button
                variant="destructive"
                className="ml-2"
                size="icon"
                onClick={() => setConfirmModalOpen(true)}
              >
                <Trash2 />
              </Button>
              {enableUndoRedo && (
                <Button
                  variant="secondary"
                  className="ml-2"
                  size="icon"
                  onClick={() => {
                    console.log("undo");
                  }}
                >
                  UNDO
                </Button>
              )}
              {enableUndoRedo && (
                <Button
                  variant="secondary"
                  className="ml-2"
                  size="icon"
                  onClick={() => {
                    console.log("redo");
                  }}
                >
                  REDO
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                        setTimerModalOpen(true);
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
                        setTimerModalOpen(true);
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
                      onClickOpenModal={() => setTimerModalOpen(true)}
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
          <Textarea
            placeholder="Notes"
            className="mt-3"
            value={notes || ""}
            onChange={(e) => {
              updateNotes(id, e.target.value);
            }}
          />
        </CardContent>
      </Card>
      <DeleteExerciseModal
        title={title}
        exerciseId={id}
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
      />
      <TrainerModal
        exerciseId={id}
        exerciseName={title}
        set={curTrainSet}
        open={timerModalOpen}
        onOpenChange={setTimerModalOpen}
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
      variant="success"
      size="icon"
      onClick={() => {
        _toggleFinished(exerciseId, setId, false);
      }}
    >
      <SquareCheck />
    </Button>
  ) : (
    <Button
      className={className}
      variant="secondary"
      size="icon"
      onClick={() => {
        _toggleFinished(exerciseId, setId, true);
      }}
    >
      <SquareCheck />
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="ml-2" size="icon">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          key="delete"
          className="text-danger"
          onClick={onDelete}
        >
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem key="duplicate" onClick={onDuplicate}>
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
      variant="secondary"
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
      variant="secondary"
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
      min={0}
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
      min={0}
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
    open,
    onOpenChange,
  }: {
    title: string;
    exerciseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    const deleteExercise = useWorkoutsStore((state) => state.deleteExercise);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-1">
            <DialogTitle>Delete exercise?</DialogTitle>
          </DialogHeader>
          <p>This will delete &quot;{title}&quot;</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteExercise(exerciseId);
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.exerciseId === nextProps.exerciseId &&
      prevProps.title === nextProps.title
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
        variant="success"
        size="icon"
        disabled={isFinished}
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
        <CirclePlay />
      </Button>
      <Button
        variant="destructive"
        className="ml-2"
        size="icon"
        onClick={() => {
          deleteSet(exerciseId, setId);
        }}
      >
        <Trash2 />
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
    open,
    onOpenChange,
    exerciseId,
    exerciseName,
    set,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exerciseId: string;
    exerciseName: string;
    set: ExerciseSetRow | null;
  }) {
    const updateDuration = useWorkoutsStore((state) => state.updateSetDuration);
    const toggleFinished = useWorkoutsStore(
      (state) => state.updateSetIsFinished
    );

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trainer for {exerciseName}</DialogTitle>
          </DialogHeader>
          <Trainer
            exerciseName={exerciseName}
            set={set}
            onEnd={(setId, duration) => {
              updateDuration(exerciseId, setId, duration);
              toggleFinished(exerciseId, setId, true);
            }}
            onClose={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.exerciseId === nextProps.exerciseId &&
      prevProps.exerciseName === nextProps.exerciseName &&
      prevProps.set === nextProps.set
    );
  }
);
