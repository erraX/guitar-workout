import { create } from "zustand";

interface AutoCompleteState {
  inputValue: string;
  isDropdownVisible: boolean;
  isLoading: boolean;
}

interface AutoCompleteActions {
  setInputValue: (value: string) => void;
  toggleDropdown: (isOpen?: boolean) => void;
  toggleLoading: (isLoading?: boolean) => void;
}

type Store = AutoCompleteState & AutoCompleteActions;

const initialState: AutoCompleteState = {
  inputValue: "",
  isDropdownVisible: false,
  isLoading: false,
};

export default create<Store>((set) => ({
  ...initialState,

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
