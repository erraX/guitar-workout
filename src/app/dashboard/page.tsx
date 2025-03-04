import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { getWorkouts } from "@/service/workout";
import { ActivityCalendar } from "./ActivityCalendar";
import { WeeklyInsightsChart } from "./WeeklyInsightsChart";

export default async function DashboardPage() {
  const workouts = await getWorkouts();
  console.log("workouts", workouts);

  const startOfWeekThis = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endOfWeekThis = endOfWeek(new Date(), { weekStartsOn: 1 });
  const workoutsInThisWeek = workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt);
    return workoutDate >= startOfWeekThis && workoutDate <= endOfWeekThis;
  });

  const startOfWeekLast = startOfWeek(subWeeks(new Date(), 1), {
    weekStartsOn: 1,
  });
  const endOfWeekLast = endOfWeek(subWeeks(new Date(), 1), {
    weekStartsOn: 1,
  });
  const workoutsInLastWeek = workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt);
    return workoutDate >= startOfWeekLast && workoutDate <= endOfWeekLast;
  });

  const weeklyInsightsThisWeekDurationMap = new Map<string, number>();
  for (const workout of workoutsInThisWeek) {
    const workoutDate = new Date(workout.createdAt);
    const day = workoutDate.toLocaleDateString("en-US", { weekday: "short" });
    if (!weeklyInsightsThisWeekDurationMap.has(day)) {
      weeklyInsightsThisWeekDurationMap.set(day, workout.duration);
    } else {
      weeklyInsightsThisWeekDurationMap.set(
        day,
        weeklyInsightsThisWeekDurationMap.get(day)! + workout.duration
      );
    }
  }
  const weeklyInsightsLastWeekDurationMap = new Map<string, number>();
  for (const workout of workoutsInLastWeek) {
    const workoutDate = new Date(workout.createdAt);
    const day = workoutDate.toLocaleDateString("en-US", { weekday: "short" });
    if (!weeklyInsightsLastWeekDurationMap.has(day)) {
      weeklyInsightsLastWeekDurationMap.set(day, workout.duration);
    } else {
      weeklyInsightsLastWeekDurationMap.set(
        day,
        weeklyInsightsLastWeekDurationMap.get(day)! + workout.duration
      );
    }
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyInsightsChartData = weekDays.map((day) => ({
    day,
    base: Number(
      ((weeklyInsightsThisWeekDurationMap.get(day) ?? 0) / 3600).toFixed(1)
    ),
    prev: Number(
      ((weeklyInsightsLastWeekDurationMap.get(day) ?? 0) / 3600).toFixed(1)
    ),
  }));

  return (
    <div className="flex flex-col w-full">
      <ActivityCalendar data={workouts} />
      <WeeklyInsightsChart
        chartData={weeklyInsightsChartData}
        baseTotalDuration={workoutsInThisWeek.reduce(
          (acc, workout) => acc + workout.duration,
          0
        )}
        prevTotalDuration={workoutsInLastWeek.reduce(
          (acc, workout) => acc + workout.duration,
          0
        )}
      />
    </div>
  );
}
