import { useCallback, useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useInterval } from "@/hooks/use-interval";

type WorkoutState = "RUNNING" | "PAUSED" | "STOPPED";

interface WorkoutTimerStore {
  state: WorkoutState;
  duration: number;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setDuration: (duration: number) => void;
}

export const _useWorkoutTimerStore = create<WorkoutTimerStore>()(
  persist(
    (set) => ({
      state: "STOPPED",
      duration: 0,
      start: () => set({ state: "RUNNING", duration: 0 }),
      stop: () => set({ state: "STOPPED" }),
      pause: () => set({ state: "PAUSED" }),
      resume: () => set({ state: "RUNNING" }),
      reset: () => set({ state: "STOPPED", duration: 0 }),
      setDuration: (duration: number) => set({ duration }),
    }),
    {
      name: "workout-timer-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useWorkoutTimerStore = () => {
  const state = _useWorkoutTimerStore((state) => state.state);
  const duration = _useWorkoutTimerStore((state) => state.duration);
  const setDuration = _useWorkoutTimerStore((state) => state.setDuration);
  const start = _useWorkoutTimerStore((state) => state.start);
  const stop = _useWorkoutTimerStore((state) => state.stop);
  const pause = _useWorkoutTimerStore((state) => state.pause);
  const resume = _useWorkoutTimerStore((state) => state.resume);
  const reset = _useWorkoutTimerStore((state) => state.reset);

  const isRunning = useMemo(() => state === "RUNNING", [state]);
  const isPaused = useMemo(() => state === "PAUSED", [state]);
  const isStopped = useMemo(() => state === "STOPPED", [state]);

  const abort = useCallback(() => {
    stop();
    setDuration(0);
  }, [stop, setDuration]);

  useInterval(
    useCallback(() => {
      setDuration(duration + 1);
    }, [duration, setDuration]),
    state === "RUNNING" ? 1000 : null
  );

  return {
    state,
    duration,
    isRunning,
    isPaused,
    isStopped,
    start,
    stop,
    pause,
    resume,
    reset,
    abort,
    setDuration,
  };
};
