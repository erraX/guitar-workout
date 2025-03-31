import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoCompleteOption {
  text: string;
  value: string;
}

interface AutoCompleteProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: AutoCompleteOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function AutoComplete<T>({
  value,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  onValueChange,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-wrap break-words text-left h-auto"
        >
          {value.length
            ? options
                .filter((item) => value.includes(item.value))
                .map((item) => item.text)
                .join(", ")
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={item.value}
                  value={`${item.text}.(${item.value})`}
                  onSelect={() => {
                    if (value.includes(item.value)) {
                      onValueChange(value.filter((v) => v !== item.value));
                    } else {
                      onValueChange([...value, item.value]);
                    }
                  }}
                >
                  {item.text}
                  <Check
                    className={cn(
                      "ml-auto",
                      value.includes(item.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
