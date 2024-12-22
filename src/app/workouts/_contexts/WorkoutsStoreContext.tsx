"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createWorkoutsStore,
  type WorkoutsStore,
  type WorkoutsStoreState,
} from "./workoutsStore";
import type { Workout } from "@/types";

const WorkoutsStoreContext = createContext<WorkoutsStore | null>(null);

export const WorkoutsStoreProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Omit<Workout, "id">;
}) => {
  const storeRef = useRef<WorkoutsStore>();
  if (!storeRef.current) {
    storeRef.current = createWorkoutsStore();
  }

  useEffect(() => {
    if (initialState && storeRef.current) {
      storeRef.current.getState().reset(initialState);
    }
  }, []);

  return (
    <WorkoutsStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkoutsStoreContext.Provider>
  );
};

export function useWorkoutsStore(): WorkoutsStoreState;
export function useWorkoutsStore<T>(
  selector: (state: WorkoutsStoreState) => T
): T;
export function useWorkoutsStore<T>(
  selector?: (state: WorkoutsStoreState) => T
): T {
  const store = useContext(WorkoutsStoreContext);

  if (!store) {
    throw new Error("Missing `WorkoutsStoreProvider`");
  }

  return useStore(store, selector!);
}
