import { format } from "date-fns";
import { Workout } from "@prisma/client";
import {
  ActivityCalendar as _ActivityCalendar,
  type Activity,
} from "@/components/ActivityCalendar";

export interface ActivityCalendarProps {
  data: Workout[];
}

export function ActivityCalendar({ data }: ActivityCalendarProps) {
  return <_ActivityCalendar activities={transformHistoryData(data)} />;
}

function transformHistoryData(data: Workout[]): Activity[] {
  const result = new Map<string, Activity>();

  data.forEach((workout: any) => {
    const date = format(workout.createdAt, "yyyy-MM-dd");
    const duration = workout.duration;

    if (result.has(date)) {
      result.get(date)!.count += duration;
    } else {
      result.set(date, { date, count: duration, level: 1 });
    }
  });

  return Array.from(result.values()).map((activity) => {
    let minutes = Math.round(activity.count / 60);
    if (activity.count > 0 && minutes === 0) {
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

    return { ...activity, level, count: minutes };
  });
}
