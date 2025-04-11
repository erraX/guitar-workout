import { createContext, type ReactNode, useContext, useState } from "react";
import { ExerciseSet as ExerciseSetType } from "@/types";

export const TrainerContext = createContext<{
  currentSet: ExerciseSetType | null;
  setCurrentSet: (set: ExerciseSetType | null) => void;
}>({
  currentSet: null,
  setCurrentSet: () => {},
});

export function TrainerContextProvider({ children }: { children: ReactNode }) {
  const [currentSet, setCurrentSet] = useState<ExerciseSetType | null>(null);

  return (
    <TrainerContext.Provider value={{ currentSet, setCurrentSet }}>
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainerContext() {
  return useContext(TrainerContext);
}
