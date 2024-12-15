import { memo } from "react";
import { Input, InputProps } from "@nextui-org/react";

type NumberInputValue = number | null | undefined;

export interface NumberInputProps
  extends Omit<InputProps, "onChange" | "value" | "defaultValue"> {
  value?: NumberInputValue;
  defaultValue?: NumberInputValue;
  onChange?: (value: NumberInputValue) => void;
  min?: number;
  max?: number;
}

export const NumberInput = memo(function NumberInput({
  onChange,
  defaultValue,
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ...props
}: NumberInputProps) {
  const numValue = Number.isNaN(Number(value)) ? "" : String(value);
  const numDefaultValue = Number.isNaN(Number(defaultValue))
    ? ""
    : String(defaultValue);

  return (
    <Input
      isClearable
      value={numValue}
      defaultValue={numDefaultValue}
      onKeyDown={(event) => {
        // Skip if meta, ctrl, or alt is pressed
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
          return;
        }

        const curValue = Number(value ?? 0);
        if (event.key === "ArrowUp") {
          const nextValue = ensureNumberRange(curValue + 1, min, max);
          onChange?.(nextValue);
          return;
        } else if (event.key === "ArrowDown") {
          const nextValue = ensureNumberRange(curValue - 1, min, max);
          onChange?.(nextValue);
          return;
        }

        // Allow: backspace, delete, tab, escape, enter, decimal point
        const allowedKeys = ["Backspace", "Delete", "Escape", "Enter", "-"];
        // Allow: navigation keys (home, end, arrows)
        const navigationKeys = ["Home", "End", "ArrowLeft", "ArrowRight"];

        // Allow if key is in allowedKeys or navigationKeys
        if (
          allowedKeys.includes(event.key) ||
          navigationKeys.includes(event.key)
        ) {
          return;
        }

        // Allow numbers
        if (/^\d$/.test(event.key)) {
          return;
        }

        event.preventDefault();
      }}
      onClear={() => {
        onChange?.(null);
      }}
      onChange={(event) => {
        const value = event.target.value;

        const nextValue = ensureNumberRange(convertToNumber(value), min, max);

        onChange?.(nextValue);
      }}
      {...props}
    />
  );
});

function ensureNumberRange<T extends number | undefined | null>(
  num: T,
  min: number,
  max: number
) {
  if (num === undefined || num === null) {
    return num;
  }
  return Math.max(min, Math.min(max, num));
}

function convertToNumber(num: string | number | undefined | null) {
  if (num === "" || num === undefined || num === null) {
    return undefined;
  }
  return Number.isNaN(Number(num)) ? undefined : Number(num);
}
