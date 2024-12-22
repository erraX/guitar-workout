import { useState, useEffect } from "react";
import { useStopWatch } from "@/hooks/useStopWatch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useWorkoutTaskState() {
  const runningState = useRunningState();
  const stopWatch = useStopWatch();

  const [runningStateLS, setRunningStateLS] = useLocalStorage<RunningState>(
    "exercise_running_state",
    "IDLE"
  );
  const [stopWatchTimeLS, setStopWatchTimeLS] = useLocalStorage(
    "exercise_stopwatch_time",
    0
  );

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

  useEffect(() => {
    if (runningStateLS === "RUNNING") {
      runningState.init({
        state: "RUNNING",
      });
      stopWatch.init({
        time: stopWatchTimeLS,
        isRunning: true,
      });
    }
  }, []);

  useEffect(() => {
    setStopWatchTimeLS(stopWatch.time);
  }, [setStopWatchTimeLS, stopWatch.time]);

  useEffect(() => {
    setRunningStateLS(runningState.state);
  }, [setRunningStateLS, runningState.state]);

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

  const init = ({ state }: { state?: RunningState }) => {
    if (typeof state !== "undefined") {
      setState(state);
    }
  };

  return { state, isIdle, isRunning, isPaused, start, pause, stop, init };
}
