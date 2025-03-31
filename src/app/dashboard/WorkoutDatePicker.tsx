"use client";

import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

export function WorkoutDatePicker({ date }: { date?: string }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="text-sm text-gray-500">Select base date:</div>
      <DatePicker
        value={date ? new Date(date) : undefined}
        onChange={(value) => {
          if (!value) return;
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("date", format(value, "yyyy-MM-dd"));
          window.location.search = searchParams.toString();
        }}
      />
    </div>
  );
}
