import { useState, useEffect } from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { Workout, ExerciseSet } from "@/types";

type Actions = {
  reset: () => void;
  init: (state: Workout) => void;
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

    init: (state: Workout) => set({ ...state }),

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

  const [workoutStoreLS, setWorkoutStoreLS] = useLocalStorage<Workout>(
    "workout_store",
    {
      id: uuidv4(),
      name: "Default",
      duration: 0,
      exercises: [],
    }
  );

  const store = useStore();

  useEffect(() => {
    if (workoutStoreLS) {
      store.init(workoutStoreLS);
    }
  }, []);

  useEffect(() => {
    setWorkoutStoreLS({
      duration: store.duration,
      id: store.id,
      exercises: store.exercises,
      name: store.name,
    });
  }, [store.duration, store.id, store.exercises, store.name]);

  return store;
};

function createEmptySet(): ExerciseSet {
  return {
    id: uuidv4(),
    bpm: "120",
    duration: "80",
    isFinished: false,
  };
}
