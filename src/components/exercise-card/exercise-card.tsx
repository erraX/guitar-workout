import { type ReactNode, memo } from "react";
import { cn } from "@/lib/utils";
import {
  Trash2,
  CopyPlus,
  SquareCheck,
  CirclePlay,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseSet as ExerciseSetType } from "@/types";
import { useExerciseCard, ExerciseCardProvider } from "./context-privder";
import {
  useTrainerContext,
  TrainerContextProvider,
} from "./trainer-context-provider";
import { TrainerModal } from "./trainer-modal";

export function ExerciseCard({
  exerciseId,
  exerciseName,
  children,
  className,
}: {
  exerciseId: string;
  exerciseName: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ExerciseCardProvider exerciseId={exerciseId} exerciseName={exerciseName}>
      <TrainerContextProvider>
        <Card className={cn(className)}>{children}</Card>
      </TrainerContextProvider>
    </ExerciseCardProvider>
  );
}

export function ExerciseCardHeader({ children }: { children: ReactNode }) {
  return <CardHeader>{children}</CardHeader>;
}

export function ExerciseCardContent({ children }: { children: ReactNode }) {
  return <CardContent className="flex flex-col gap-2">{children}</CardContent>;
}

export function ExerciseCardFooter({ children }: { children: ReactNode }) {
  return <CardFooter>{children}</CardFooter>;
}

export function ExerciseSet({ set }: { set: ExerciseSetType }) {
  const isMobile = useIsMobile();
  const { updateBpm, updateDuration, updateFinished, deleteSet, duplicateSet } =
    useExerciseCard();
  const { setCurrentSet } = useTrainerContext();

  return (
    <div className="flex flex-row items-center gap-3">
      <div>
        {set.isFinished ? (
          <Button
            variant="success"
            size="icon"
            onClick={() => {
              updateFinished(set.id, false);
            }}
          >
            <SquareCheck />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              updateFinished(set.id, true);
            }}
          >
            <SquareCheck />
          </Button>
        )}
      </div>
      <div className="flex-1">
        {set.isFinished ? (
          set.bpm
        ) : (
          <NumberInput
            aria-label="bpm"
            type="text"
            min={0}
            value={Number(set.bpm)}
            onChange={(value) => updateBpm(set.id, value ?? 0)}
          />
        )}
      </div>
      <div className="flex-1">
        {set.isFinished ? (
          set.duration
        ) : (
          <NumberInput
            aria-label="duration"
            type="text"
            min={0}
            value={Number(set.duration)}
            onChange={(value) => updateDuration(set.id, value ?? 0)}
          />
        )}
      </div>
      {isMobile ? (
        <div>
          <Button
            variant="success"
            size="icon"
            disabled={set.isFinished}
            onClick={() => {
              setCurrentSet(set);
            }}
          >
            <CirclePlay />
          </Button>
          <SetActionButtonsGroup
            onDelete={() => deleteSet(set.id)}
            onDuplicate={() => duplicateSet(set.id)}
          />
        </div>
      ) : (
        <div>
          <Button
            variant="success"
            size="icon"
            disabled={set.isFinished}
            onClick={() => {
              setCurrentSet(set);
            }}
          >
            <CirclePlay />
          </Button>
          <Button
            variant="destructive"
            className="ml-2"
            size="icon"
            onClick={() => {
              deleteSet(set.id);
            }}
          >
            <Trash2 />
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            size="icon"
            onClick={() => {
              duplicateSet(set.id);
            }}
          >
            <CopyPlus />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ExerciseCardSetActions({ className }: { className?: string }) {
  const { lastSet, addSet, completeAllSets } = useExerciseCard();

  return (
    <div
      className={cn(
        "flex flex-row justify-between items-center mt-3",
        className
      )}
    >
      <Button
        className="flex-1"
        variant="secondary"
        size="sm"
        onClick={() => {
          addSet({
            ...(lastSet
              ? { bpm: lastSet.bpm, duration: lastSet.duration }
              : {}),
          });
        }}
      >
        Add Set
      </Button>
      <Button
        className="flex-1 ml-3"
        variant="secondary"
        size="sm"
        onClick={completeAllSets}
      >
        Complete All
      </Button>
    </div>
  );
}

export function ExerciseCardHeaderActions() {
  const { deleteExercise } = useExerciseCard();

  return (
    <div>
      <Button
        variant="destructive"
        className="ml-2"
        size="icon"
        onClick={deleteExercise}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function SetTrainer() {
  const { exerciseId, exerciseName } = useExerciseCard();
  const { currentSet, setCurrentSet } = useTrainerContext();

  return (
    <TrainerModal
      exerciseId={exerciseId}
      exerciseName={exerciseName}
      set={currentSet}
      open={!!currentSet}
      onOpenChange={() => {
        setCurrentSet(null);
      }}
    />
  );
}

const SetActionButtonsGroup = memo(function SetActionButtonsGroup({
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
