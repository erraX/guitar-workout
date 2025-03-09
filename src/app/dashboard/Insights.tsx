"use client";

import { WeeklyInsightsChart } from "./WeeklyInsightsChart";
import { TopExercisesChart } from "./TopExercisesChart";
import { WorkoutDatePicker } from "./WorkoutDatePicker";

import { useIsMobile } from "@/hooks/use-mobile";

export function Insights({
  date,
  weeklyInsightsChartData,
  topExercisesThisWeek,
  curWeekWorkouts,
  lastWeekWorkouts,
}: {
  date: string;
  weeklyInsightsChartData: any;
  topExercisesThisWeek: any;
  curWeekWorkouts: any;
  lastWeekWorkouts: any;
}) {
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="flex justify-center mb-5">
        <WorkoutDatePicker date={date} />
      </div>
      <div
        className={`flex ${
          isMobile ? "flex-col" : "flex-row"
        } gap-5 justify-center items-center`}
      >
        <WeeklyInsightsChart
          compact={isMobile}
          chartData={weeklyInsightsChartData}
          baseTotalDuration={curWeekWorkouts.reduce(
            (acc: number, workout: any) => acc + workout.duration,
            0
          )}
          prevTotalDuration={lastWeekWorkouts.reduce(
            (acc: number, workout: any) => acc + workout.duration,
            0
          )}
        />
        <TopExercisesChart
          compact={isMobile}
          chartData={topExercisesThisWeek}
        />
      </div>
    </div>
  );
}
