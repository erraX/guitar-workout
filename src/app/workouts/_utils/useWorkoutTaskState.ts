import { useState } from "react";
import { useStopWatch } from "@/hooks/useStopWatch";

export function useWorkoutTaskState() {
  const runningState = useRunningState();
  const stopWatch = useStopWatch();

  const start = () => {
    runningState.start();
    stopWatch.start();
  };

  const abort = () => {
    runningState.stop();
    stopWatch.stop();
  };

  const stop = () => {
    runningState.stop();
    stopWatch.stop();
  };

  return {
    runningState: runningState.state,
    isRunning: runningState.isRunning,
    isPaused: runningState.isPaused,
    isIdle: runningState.isIdle,
    time: stopWatch.time,
    start,
    abort,
    stop,
  };
}

type RunningState = "IDLE" | "RUNNING" | "PAUSED";

function useRunningState() {
  const [state, setState] = useState<RunningState>("IDLE");

  const isIdle = state === "IDLE";
  const isRunning = state === "RUNNING";
  const isPaused = state === "PAUSED";

  const start = () => setState("RUNNING");
  const pause = () => setState("PAUSED");
  const stop = () => setState("IDLE");

  return { state, isIdle, isRunning, isPaused, start, pause, stop };
}
