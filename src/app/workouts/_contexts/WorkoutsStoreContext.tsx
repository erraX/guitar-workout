"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createWorkoutsStore,
  type WorkoutsStore,
  type WorkoutsStoreState,
} from "./workoutsStore";

const WorkoutsStoreContext = createContext<WorkoutsStore | null>(null);

export const WorkoutsStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<WorkoutsStore>();
  if (!storeRef.current) {
    storeRef.current = createWorkoutsStore();
  }

  return (
    <WorkoutsStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkoutsStoreContext.Provider>
  );
};

// TODO: sync with localstorage
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
