import type { ReactNode } from "react";
import type { AutoCompleteOption } from "./types";

export default function Dropdown({
  createable = false,
  options = [],
  onSelect,
  onClickCreate,
  inputValue,
  renderOption = (option) => option.label,
  renderCreator = (inputValue) => "Create option",
}: {
  createable?: boolean;
  options?: AutoCompleteOption[];
  onSelect?: (option: AutoCompleteOption) => void;
  inputValue: string;
  onClickCreate?: () => void;
  renderOption?: (option: AutoCompleteOption) => ReactNode;
  renderCreator?: (inputValue: string) => ReactNode;
}) {
  const hasOptions = options?.length > 0;

  return (
    <ul className="absolute border-black border-1 w-full">
      {options.map((option) => (
        <li
          className="hover:bg-slate-400 hover:cursor-pointer"
          key={option.value}
          onClick={() => onSelect?.(option)}
        >
          {renderOption(option)}
        </li>
      ))}
      {!hasOptions && createable && (
        <li
          className="text-slate-400 hover:cursor-pointer"
          onClick={onClickCreate}
        >
          {renderCreator(inputValue)}
        </li>
      )}
    </ul>
  );
}
