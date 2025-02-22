"use client";

import { Button } from "@/components/ui/button";
import { Exercise } from "@prisma/client";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
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

export interface AddExerciseProps {
  exercises: Exercise[];
  onAddExercises(exerciseIds: string[]): void;
}

export const AddExercise: FC<AddExerciseProps> = ({
  exercises,
  onAddExercises,
}) => {
  const [open, setOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2 w-fit self-center">Add Exercise</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Please select one exercise to add
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Popover open={selectorOpen} onOpenChange={setSelectorOpen} modal>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={selectorOpen}
                className="w-full justify-between text-wrap break-words text-left h-auto"
              >
                {selectedExercises.length
                  ? exercises
                      .filter((exercise) =>
                        selectedExercises.includes(exercise.id.toString())
                      )
                      .map((exercise) => exercise.name)
                      .join(", ")
                  : "Select exercise..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search exercise..."
                  className="h-9"
                />
                <CommandList
                  onScrollCapture={(event) => {
                    console.log("Scroll command list", event);
                  }}
                >
                  <CommandEmpty>No exercise found.</CommandEmpty>
                  <CommandGroup
                    onScrollCapture={(event) => {
                      console.log("Scroll command group", event);
                    }}
                  >
                    {exercises.map((exercise) => (
                      <CommandItem
                        key={exercise.id}
                        value={`${exercise.name}.(${exercise.id})`}
                        onSelect={() => {
                          if (
                            selectedExercises.includes(exercise.id.toString())
                          ) {
                            setSelectedExercises(
                              selectedExercises.filter(
                                (id) => id !== exercise.id.toString()
                              )
                            );
                          } else {
                            setSelectedExercises([
                              ...selectedExercises,
                              exercise.id.toString(),
                            ]);
                          }
                        }}
                      >
                        {exercise.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedExercises.includes(exercise.id.toString())
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={!selectedExercises.length}
            onClick={() => {
              if (selectedExercises.length) {
                onAddExercises(selectedExercises);
                setOpen(false);
                setSelectedExercises([]);
              }
            }}
          >
            Add
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
