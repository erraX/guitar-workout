import { useEffect } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  useEffect(() => {
    if (delay === null) {
      return;
    }
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
};
