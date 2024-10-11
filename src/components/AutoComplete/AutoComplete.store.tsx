import { useMemo } from "react";
import { create } from "zustand";

interface AutoCompleteStore {
  inputValue: string;
  isDropdownVisible: boolean;
  isLoading: boolean;
  setInputValue: (value: string) => void;
  toggleDropdown: (isOpen?: boolean) => void;
  toggleLoading: (isLoading?: boolean) => void;
}

const createStore = () =>
  create<AutoCompleteStore>((set) => ({
    inputValue: "",
    isDropdownVisible: false,
    isLoading: false,

    setInputValue: (value) => set({ inputValue: value }),
    toggleLoading: (isLoading) =>
      set((state) => ({
        isLoading: isLoading ?? !state.isLoading,
      })),
    toggleDropdown: (isOpen) =>
      set((state) => {
        const newIsDropdownVisible = isOpen ?? !state.isDropdownVisible;
        return {
          isDropdownVisible: newIsDropdownVisible,
          inputValue: newIsDropdownVisible ? state.inputValue : "",
        };
      }),
  }));

export const useAutoCompleteStore = () => {
  const useStore = useMemo(createStore, []);
  return useStore();
};
