"use client";

import { useMemo } from "react";
import { eachDayOfInterval, format, subDays } from "date-fns";
import {
  ActivityCalendar as _ActivityCalendar,
  type ThemeInput,
} from "react-activity-calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentYear } from "@/utils/date";
import { cn } from "@/lib/utils";

export type ThemeType = "github";

export interface Activity {
  date: string;
  count: number;
  level: number;
}

export interface ActivityCalendarProps {
  className?: string;
  year?: number;
  theme?: ThemeType;
  activities: Array<Activity>;
  renderBlockTooltip?: (activity: Activity) => React.ReactNode;
}

const THEMES = {
  github: {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
} satisfies Record<ThemeType, ThemeInput>;

export function ActivityCalendar({
  className,
  year = getCurrentYear(),
  theme = "github",
  activities,
  renderBlockTooltip = (activity) =>
    `${activity.count} minutes on ${activity.date}`,
}: ActivityCalendarProps) {
  const allDates = useMemo(
    () =>
      eachDayOfInterval({
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      }),
    [year]
  );

  const isMobile = useIsMobile();

  const activityByDate = useMemo(() => {
    const activityByDate = new Map<string, Activity>();
    activities.forEach((item) => {
      activityByDate.set(item.date, item);
    });
    return activityByDate;
  }, [activities]);

  const daysInARow = useMemo(
    () => getNumOfConsecutiveDays(activityByDate),
    [activityByDate]
  );

  const _activities = useMemo(() => {
    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const activity = activityByDate.get(dateStr);
      return {
        date: dateStr,
        count: activity?.count ?? 0,
        level: activity?.level ?? 0,
      };
    });
  }, [allDates, activityByDate]);

  const renderCalendar = (data: Activity[]) => {
    return (
      <_ActivityCalendar
        data={data}
        weekStart={1}
        theme={THEMES[theme]}
        labels={{
          totalCount:
            daysInARow > 0
              ? `You've been active for ${daysInARow} days in a row, keep it up!`
              : " ",
        }}
        renderBlock={(block, activity) => {
          if (activity.count === 0) {
            return block;
          }

          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>{block}</TooltipTrigger>
                <TooltipContent>
                  <p>{renderBlockTooltip(activity)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }}
      />
    );
  };

  return (
    <div className={cn("flex flex-col gap-4 items-center", className)}>
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {renderCalendar(
            _activities.filter((a) => new Date(a.date).getMonth() < 6)
          )}
          {renderCalendar(
            _activities.filter((a) => new Date(a.date).getMonth() >= 6)
          )}
        </div>
      ) : (
        renderCalendar(_activities)
      )}
    </div>
  );
}

function getNumOfConsecutiveDays(activityByDate: Map<string, Activity>) {
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  let result = 0;
  let key = yesterday;
  let offset = 1;
  while (true) {
    if (
      ((activityByDate.has(key) && activityByDate.get(key)?.count) || 0) > 0
    ) {
      result++;
    } else {
      break;
    }
    key = format(subDays(yesterday, offset++), "yyyy-MM-dd");
  }

  const today = format(new Date(), "yyyy-MM-dd");
  if (activityByDate.has(today) && result > 0) {
    result++;
  }

  return result;
}
