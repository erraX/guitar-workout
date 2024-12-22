import { useState, useEffect } from 'react';

export const useStopWatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isRunning) {
        setTime((time) => time + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    setTime(0);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const init = ({
    time,
    isRunning,
  }: {
    time?: number;
    isRunning?: boolean;
  }) => {
    if (typeof time !== "undefined") {
      setTime(time);
    }
    if (typeof isRunning !== "undefined") {
      setIsRunning(isRunning);
    }
  };

  return {
    start,
    stop,
    time,
    init,
  };
};
