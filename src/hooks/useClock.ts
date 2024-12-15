import { useEffect, useState, useCallback, useMemo } from "react";

export function useClock() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const start = useCallback(() => {
    setIsRunning(true);
    setTime(0);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return useMemo(
    () => ({
      time,
      start,
      stop,
    }),
    [time, start, stop]
  );
}
