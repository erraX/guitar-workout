import { memo, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";

type NumberInputValue = number | null | undefined;

export interface NumberInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    "onChange" | "value" | "defaultValue"
  > {
  value?: NumberInputValue;
  defaultValue?: NumberInputValue;
  onChange?: (value: NumberInputValue) => void;
  onToggleFinished?: () => void;
  onStart?: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export const NumberInput = memo(function NumberInput({
  onChange,
  onToggleFinished,
  onStart,
  defaultValue,
  value,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ...props
}: NumberInputProps) {
  const numValue = Number.isNaN(Number(value)) ? "" : String(value);
  const numDefaultValue = Number.isNaN(Number(defaultValue))
    ? undefined
    : String(defaultValue);

  return (
    <Input
      value={numValue}
      defaultValue={numDefaultValue}
      onKeyDown={(event) => {
        // Skip if meta, ctrl, or alt is pressed
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          (event.shiftKey &&
            event.key !== "ArrowUp" &&
            event.key !== "ArrowDown")
        ) {
          return;
        }

        const curValue = Number(value || 0);
        if (event.key === "ArrowUp") {
          const nextValue = event.shiftKey
            ? ensureNumberRange(curValue + 5, min, max)
            : ensureNumberRange(curValue + 1, min, max);
          onChange?.(nextValue);
          return;
        } else if (event.key === "ArrowDown") {
          const nextValue = event.shiftKey
            ? ensureNumberRange(curValue - 5, min, max)
            : ensureNumberRange(curValue - 1, min, max);
          onChange?.(nextValue);
          return;
        }

        // Allow: backspace, delete, tab, escape, enter, decimal point
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Escape",
          "Enter",
          "-",
          "t", // toggle finished
          "s", // start
        ];
        // Allow: navigation keys (home, end, arrows)
        const navigationKeys = ["Home", "End", "ArrowLeft", "ArrowRight"];

        // Allow if key is in allowedKeys or navigationKeys
        if (
          allowedKeys.includes(event.key) ||
          navigationKeys.includes(event.key)
        ) {
          if (event.key === "t") {
            onToggleFinished?.();
            return;
          }

          if (event.key === "s") {
            onStart?.();
            return;
          }

          return;
        }

        // Allow numbers
        if (/^\d$/.test(event.key)) {
          return;
        }

        event.preventDefault();
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
