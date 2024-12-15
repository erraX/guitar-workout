import { useCallback, useEffect } from "react";

export interface UseShortCutsConfigs {
  shortcuts: {
    [key: string]: () => void;
  };
}

export const useShortCuts = ({ shortcuts }: UseShortCutsConfigs) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      console.log(key);

      if (shortcuts[key]) {
        shortcuts[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
};
