import { FC, createContext, useContext, useMemo, ReactElement } from 'react';
import { Workout } from '@/types';

export interface GlobalContextValue {
  exportToJSON(workouts: Workout[]): void;
}

export type GlobalContextProviderProps = GlobalContextValue & {
    children?: ReactElement;
};

const GlobalContext = createContext<GlobalContextValue>(null as unknown as GlobalContextValue);

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  exportToJSON,
  children,
}) => {
  const contextValues = useMemo(
    () => ({
      exportToJSON,
    }),
    [
      exportToJSON
    ],
  );

  return (
    <GlobalContext.Provider value={contextValues}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
