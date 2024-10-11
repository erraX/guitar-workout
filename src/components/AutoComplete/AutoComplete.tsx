"use client";

import { ReactNode, useRef } from "react";
import cls from "classnames";

import { useAutoCompleteStore } from "./AutoComplete.store";
import useClickOutside from "./useClickOutside";

import Dropdown from "./Dropdown";

import type { AutoCompleteOption } from "./types";

export interface AutoCompleteProps {
  value?: string;
  options?: AutoCompleteOption[];
  filter?: (
    inputValue: string,
    options: AutoCompleteOption[]
  ) => AutoCompleteOption[];
  onChange?: (option: AutoCompleteOption) => void;
  onCreate?: (option: AutoCompleteOption) => void;
  creator?: (inputValue: string) => Promise<AutoCompleteOption>;
  renderOption?: (option: AutoCompleteOption) => ReactNode;
  renderCreator?: (inputValue: string) => ReactNode;
}

// TODO:
// 1. Clear icon on the right of input
// 1. Custom Option data structure
// 1. Fetch options from request
// 1. Group option
// 1. disable option
// 1. Multiple selection
export default function AutoComplete({
  value,
  options = [],
  renderOption,
  renderCreator,
  filter = (_inputValue, options) => options,
  onChange,
  creator,
}: AutoCompleteProps) {
  const rootEl = useRef<HTMLDivElement>(null);
  const store = useAutoCompleteStore();

  useClickOutside({
    target: rootEl,
    onClickOutside() {
      store.toggleDropdown(false);
    },
  });

  const filteredOptions = filter(store.inputValue, options);
  const showValue =
    options.find((option) => option.value === value)?.label || "";

  return (
    <div className="relative w-full" ref={rootEl}>
      {store.isLoading && <span>loading..</span>}
      <input
        className={cls(["border-black", "border-1", "w-full"], {
          "hover:cursor-not-allowed": store.isLoading,
          "hover:cursor-pointer": !store.isDropdownVisible && !store.isLoading,
        })}
        type="text"
        disabled={store.isLoading}
        readOnly={!store.isDropdownVisible}
        value={store.isDropdownVisible ? store.inputValue : showValue}
        placeholder={showValue}
        onClick={() => {
          if (store.isLoading) {
            return;
          }
          store.toggleDropdown();
        }}
        onChange={(evt) => store.setInputValue(evt.target.value)}
      />
      {store.isDropdownVisible && (
        <Dropdown
          inputValue={store.inputValue}
          createable={typeof creator !== "undefined"}
          options={filteredOptions}
          renderOption={renderOption}
          renderCreator={renderCreator}
          onClickCreate={async () => {
            if (typeof creator === "undefined") {
              return;
            }
            store.setInputValue("");
            store.toggleLoading(true);
            store.toggleDropdown(false);
            const newOption = await creator(store.inputValue);
            store.toggleLoading(false);
            // TODO: auto select new option or not
            onChange?.(newOption);
          }}
          onSelect={(option) => {
            store.toggleDropdown(false);
            onChange?.(option);
          }}
        />
      )}
    </div>
  );
}
