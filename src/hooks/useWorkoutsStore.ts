import { useState } from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

import type { Workout, ExerciseSet } from "@/types";

type Actions = {
  reset: () => void;
  addExercise: (exerciseId: number) => void;
  deleteExercise: (exerciseWorkoutId: string) => void;
  updateExercise: (exerciseWorkoutId: string, sets: ExerciseSet[]) => void;
};

type Store = Workout & Actions;

const createInitialState = (): Omit<Workout, "id"> => ({
  name: "Default",
  duration: 0,
  exercises: [],
});

export const createStore = (initialState: Omit<Workout, "id">) =>
  create<Store>((set) => ({
    id: uuidv4(),
    ...initialState,

    reset: () => set({ id: uuidv4(), ...initialState }),

    addExercise: (exerciseId) =>
      set((state) => ({
        exercises: [
          ...state.exercises,
          {
            id: uuidv4(),
            exerciseId,
            sets: [createEmptySet()],
          },
        ],
      })),

    deleteExercise: (exerciseWorkoutId) =>
      set((state) => ({
        exercises: state.exercises.filter((e) => e.id !== exerciseWorkoutId),
      })),

    updateExercise: (exerciseWorkoutId, sets) =>
      set((state) => ({
        exercises: state.exercises.map((e) =>
          e.id === exerciseWorkoutId ? { ...e, sets } : e
        ),
      })),
  }));

export const useWorkoutsStore = (initialState?: Omit<Workout, "id">) => {
  const [useStore] = useState(() =>
    createStore(initialState || createInitialState())
  );
  return useStore();
};

function createEmptySet(): ExerciseSet {
  return {
    id: uuidv4(),
    bpm: "120",
    duration: "80",
    isFinished: false,
  };
}
