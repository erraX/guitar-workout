import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { createEmptySet } from "@/utils/create-empty-set";
import type { Workout, ExerciseSet } from "@/types";

type WorkoutsStoreActions = {
  reset: (nextState: Omit<Workout, "id">) => void;
  clear: () => void;

  addExercise: (exerciseId: string) => void;
  deleteExercise: (exerciseWorkoutId: string) => void;

  addSet: (exerciseId: string, exerciseSet: ExerciseSet) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    set: Omit<ExerciseSet, "id">
  ) => void;
  updateSetBpm: (exerciseId: string, setId: string, bpm: string) => void;
  updateSetDuration: (
    exerciseId: string,
    setId: string,
    duration: string
  ) => void;
  updateSetIsFinished: (
    exerciseId: string,
    setId: string,
    isFinished: boolean
  ) => void;
  updateNotes: (exerciseId: string, notes: string) => void;
  completeAllSets: (exerciseId: string) => void;
  duplicateSet: (exerciseId: string, setId: string) => void;
};

export type WorkoutsStoreState = Workout & WorkoutsStoreActions;

export const createWorkoutsStore = () =>
  create(
    persist<WorkoutsStoreState>(
      (set) => ({
        id: uuidv4(),
        name: "Default",
        duration: 0,
        exercises: [],

        reset: (nextState) => set({ ...nextState }),

        clear: () =>
          set({
            name: "Default",
            duration: 0,
            exercises: [],
          }),

        addExercise: (exerciseId) =>
          set((state) => ({
            exercises: [
              ...state.exercises,
              {
                id: uuidv4(),
                exerciseId,
                sets: [createEmptySet()],
                notes: "",
              },
            ],
          })),

        deleteExercise: (exerciseWorkoutId) =>
          set((state) => ({
            exercises: state.exercises.filter(
              (e) => e.id !== exerciseWorkoutId
            ),
          })),

        addSet: (exerciseId, exerciseSet) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                exercise.sets.push(exerciseSet);
              }
            })
          ),

        deleteSet: (exerciseId, setId) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                exercise.sets = exercise.sets.filter((s) => s.id !== setId);
              }
            })
          ),

        updateSet: (exerciseId, setId, exerciseSet) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                const existingSet = exercise.sets.find((s) => s.id === setId);
                if (existingSet) {
                  Object.assign(existingSet, exerciseSet);
                }
              }
            })
          ),

        updateSetBpm: (exerciseId, setId, bpm) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                const existingSet = exercise.sets.find((s) => s.id === setId);
                if (existingSet) {
                  existingSet.bpm = bpm;
                }
              }
            })
          ),

        updateSetDuration: (exerciseId, setId, duration) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                const existingSet = exercise.sets.find((s) => s.id === setId);
                if (existingSet) {
                  existingSet.duration = duration;
                }
              }
            })
          ),

        updateSetIsFinished: (exerciseId, setId, isFinished) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                const existingSet = exercise.sets.find((s) => s.id === setId);
                if (existingSet) {
                  existingSet.isFinished = isFinished;
                }
              }
            })
          ),

        updateNotes: (exerciseId, notes) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                exercise.notes = notes;
              }
            })
          ),

        completeAllSets: (exerciseId) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                exercise.sets.forEach((s) => (s.isFinished = true));
              }
            })
          ),

        duplicateSet: (exerciseId, setId) =>
          set(
            produce<WorkoutsStoreState>((state) => {
              const exercise = state.exercises.find((e) => e.id === exerciseId);
              if (exercise) {
                const existingSet = exercise.sets.find((s) => s.id === setId);
                if (existingSet) {
                  exercise.sets.push({
                    ...existingSet,
                    id: uuidv4(),
                    isFinished: false,
                  });
                }
              }
            })
          ),
      }),
      {
        name: "workouts",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

export type WorkoutsStore = ReturnType<typeof createWorkoutsStore>;
