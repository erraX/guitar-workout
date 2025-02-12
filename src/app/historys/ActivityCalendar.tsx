"use client";

import { eachDayOfInterval, format } from "date-fns";
import {
  ActivityCalendar as ActivityCalendarComponent,
  type ThemeInput,
} from "react-activity-calendar";
import { Workout } from "@prisma/client";
import { Tooltip } from "@nextui-org/react";

const gitHubTheme = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
} satisfies ThemeInput;

export interface ActivityCalendarProps {
  data: Workout[];
  year?: number;
}

function transformHistoryData(data: Workout[]) {
  const result = new Map<string, { date: string; duration: number }>();

  data.forEach((workout: any) => {
    const date = format(workout.createdAt, "yyyy-MM-dd");
    const duration = workout.duration;

    if (result.has(date)) {
      result.get(date)!.duration += duration;
    } else {
      result.set(date, { date, duration });
    }
  });

  return result;
}

export const ActivityCalendar = ({
  year = 2025,
  data,
}: ActivityCalendarProps) => {
  const historyByDate = transformHistoryData(data);

  const activities = eachDayOfInterval({
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  }).map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const duration = historyByDate.get(dateStr)?.duration ?? 0;
    const hours = Number((duration / 3600).toFixed(1));

    let minutes = Math.round(duration / 60);
    if (duration > 0 && minutes === 0) {
      minutes = 1;
    }

    let level = 0;
    if (minutes > 0 && minutes <= 30) {
      level = 1;
    } else if (minutes > 30 && minutes <= 60) {
      level = 2;
    } else if (minutes > 60 && minutes <= 120) {
      level = 3;
    } else if (minutes > 120) {
      level = 4;
    }

    return {
      date: dateStr,
      count: minutes,
      hours,
      level,
    };
  });

  const totalHours = activities.reduce((acc: number, activity: any) => {
    return acc + activity.hours;
  }, 0);

  return (
    <div className="mb-10">
      <ActivityCalendarComponent
        data={activities}
        weekStart={1}
        theme={gitHubTheme}
        labels={{
          totalCount: `Total ${totalHours} hours in ${year}`,
        }}
        renderBlock={(block, activity) => {
          if (activity.count === 0) {
            return block;
          }

          return (
            <Tooltip
              content={`${activity.count} minutes on ${activity.date}`}
              placement="bottom"
            >
              {block}
            </Tooltip>
          );
        }}
      />
    </div>
  );
};
