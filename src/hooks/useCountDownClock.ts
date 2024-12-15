import { useCallback, useEffect, useState, useMemo } from "react";

export function useCountDownClock(targetTime: number, onEnd?: () => void) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(targetTime);

  const start = useCallback(() => {
    setIsRunning(true);
    setTime(targetTime);
  }, [targetTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    onEnd?.();
  }, [onEnd]);

  useEffect(() => {
    if (isRunning) {
      if (time <= 0) {
        stop();
        return;
      }
      const interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isRunning, time, stop]);

  return useMemo(
    () => ({
      time,
      start,
      stop,
    }),
    [time, start, stop]
  );
}
