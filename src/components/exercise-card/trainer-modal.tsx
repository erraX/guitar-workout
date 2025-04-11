import { memo } from "react";
import { Trainer } from "@/components/Trainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExerciseSet as ExerciseSetType } from "@/types";
import { useExerciseCard } from "./context-privder";

export const TrainerModal = memo(
  function TrainerModal({
    open,
    onOpenChange,
    exerciseName,
    set,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exerciseId: string;
    exerciseName: string;
    set: (ExerciseSetType & { setNo: number }) | null;
  }) {
    const { updateDuration, updateFinished } = useExerciseCard();

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
              updateDuration(setId, Number(duration));
              updateFinished(setId, true);
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
      prevProps.exerciseName === nextProps.exerciseName &&
      prevProps.set === nextProps.set
    );
  }
);
