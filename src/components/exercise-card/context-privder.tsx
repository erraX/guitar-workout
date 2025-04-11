import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { createEmptySet } from "@/utils/create-empty-set";
import { useWorkoutExerciseStore } from "@/app/_store/workout-exercise-store";
import { ExerciseSet as ExerciseSetType } from "@/types";

const ExerciseCardContext = createContext<{
  exerciseId: string;
  lastSet: ExerciseSetType | null;
  deleteExercise: () => void;
  updateBpm: (setId: string, bpm: number) => void;
  updateDuration: (setId: string, duration: number) => void;
  updateFinished: (setId: string, isFinished: boolean) => void;
  deleteSet: (setId: string) => void;
  addSet: (set: Partial<ExerciseSetType>) => void;
  completeAllSets: () => void;
  duplicateSet: (setId: string) => void;
}>(null as any);

export function ExerciseCardProvider({
  exerciseId,
  children,
}: {
  exerciseId: string;
  children: ReactNode;
}) {
  const lastSet = useWorkoutExerciseStore((state) => {
    const exercise = state.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return null;
    return exercise.sets[exercise.sets.length - 1];
  });

  const _deleteExercise = useWorkoutExerciseStore(
    (state) => state.deleteExercise
  );
  const _updateBpm = useWorkoutExerciseStore((state) => state.updateSetBpm);
  const _updateDuration = useWorkoutExerciseStore(
    (state) => state.updateSetDuration
  );
  const _updateFinished = useWorkoutExerciseStore(
    (state) => state.updateSetIsFinished
  );
  const _deleteSet = useWorkoutExerciseStore((state) => state.deleteSet);
  const _addSet = useWorkoutExerciseStore((state) => state.addSet);
  const _completeAllSets = useWorkoutExerciseStore(
    (state) => state.completeAllSets
  );
  const _duplicateSet = useWorkoutExerciseStore((state) => state.duplicateSet);

  const deleteExercise = useCallback(() => {
    _deleteExercise(exerciseId);
  }, [_deleteExercise, exerciseId]);

  const updateBpm = useCallback(
    (setId: string, bpm: number) => {
      _updateBpm(exerciseId, setId, String(bpm));
    },
    [_updateBpm, exerciseId]
  );

  const updateDuration = useCallback(
    (setId: string, duration: number) => {
      _updateDuration(exerciseId, setId, String(duration));
    },
    [_updateDuration, exerciseId]
  );

  const updateFinished = useCallback(
    (setId: string, isFinished: boolean) => {
      _updateFinished(exerciseId, setId, isFinished);
    },
    [_updateFinished, exerciseId]
  );

  const deleteSet = useCallback(
    (setId: string) => {
      _deleteSet(exerciseId, setId);
    },
    [_deleteSet, exerciseId]
  );

  const addSet = useCallback(
    (set: Partial<ExerciseSetType>) => {
      _addSet(exerciseId, {
        ...createEmptySet(),
        ...set,
      });
    },
    [_addSet, exerciseId]
  );

  const completeAllSets = useCallback(() => {
    _completeAllSets(exerciseId);
  }, [_completeAllSets, exerciseId]);

  const duplicateSet = useCallback(
    (setId: string) => {
      _duplicateSet(exerciseId, setId);
    },
    [_duplicateSet, exerciseId]
  );

  const context = useMemo(
    () => ({
      exerciseId,
      lastSet,
      deleteExercise,
      updateBpm,
      updateDuration,
      updateFinished,
      deleteSet,
      addSet,
      completeAllSets,
      duplicateSet,
    }),
    [
      exerciseId,
      lastSet,
      deleteExercise,
      updateBpm,
      updateDuration,
      updateFinished,
      deleteSet,
      addSet,
      completeAllSets,
      duplicateSet,
    ]
  );

  return (
    <ExerciseCardContext.Provider value={context}>
      {children}
    </ExerciseCardContext.Provider>
  );
}

export function useExerciseCard() {
  const context = useContext(ExerciseCardContext);
  if (!context) {
    throw new Error("ExerciseCardProvider not found");
  }
  return context;
}
