import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { getWorkouts, type Workout } from "@/service/workout";
import { ActivityCalendar } from "./ActivityCalendar";
import { WeeklyInsightsChart } from "./WeeklyInsightsChart";
import { TopExercisesChart } from "./TopExercisesChart";
import { WorkoutDatePicker } from "./WorkoutDatePicker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? new Date(date) : new Date();

  const [allWorkouts, curWeekWorkouts, lastWeekWorkouts] = await Promise.all([
    getWorkouts(),
    getWorkouts(getWeekDateRange(selectedDate, 0)),
    getWorkouts(getWeekDateRange(selectedDate, 1)),
  ]);

  const weeklyInsightsThisWeekDurationMap =
    getDurationMapByDay(curWeekWorkouts);
  const weeklyInsightsLastWeekDurationMap =
    getDurationMapByDay(lastWeekWorkouts);

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

  const topExercisesThisWeek = Object.values(
    curWeekWorkouts.reduce(
      (result, workout) => {
        const exercises = workout.exercises;
        for (const exercise of exercises) {
          const existing = result[exercise.exercise.id];
          if (existing) {
            existing.duration += exercise.sets.reduce(
              (acc, set) => acc + set.duration,
              0
            );
          } else {
            result[exercise.exercise.id] = {
              id: exercise.exercise.id.toString(),
              name: exercise.exercise.name,
              duration: exercise.sets.reduce(
                (acc, set) => acc + set.duration,
                0
              ),
            };
          }
        }
        return result;
      },
      {} as {
        id: string;
        name: string;
        duration: number;
      }[]
    )
  )
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center">
        <ActivityCalendar data={allWorkouts} />
      </div>
      <div className="flex justify-center mb-5">
        <WorkoutDatePicker date={date} />
      </div>
      <div className="flex flex-col gap-5 justify-center items-center">
        <WeeklyInsightsChart
          chartData={weeklyInsightsChartData}
          baseTotalDuration={curWeekWorkouts.reduce(
            (acc, workout) => acc + workout.duration,
            0
          )}
          prevTotalDuration={lastWeekWorkouts.reduce(
            (acc, workout) => acc + workout.duration,
            0
          )}
        />
        <TopExercisesChart chartData={topExercisesThisWeek} />
      </div>
    </div>
  );
}

function getDurationMapByDay(workouts: Workout[]) {
  const durationMap = new Map<string, number>();
  for (const workout of workouts) {
    const workoutDate = new Date(workout.createdAt);
    const day = workoutDate.toLocaleDateString("en-US", { weekday: "short" });
    if (!durationMap.has(day)) {
      durationMap.set(day, workout.duration);
    } else {
      durationMap.set(day, durationMap.get(day)! + workout.duration);
    }
  }
  return durationMap;
}

function getWeekDateRange(baseDay = new Date(), weekOffset: number = 0) {
  return {
    startDate: startOfWeek(subWeeks(baseDay, weekOffset), {
      weekStartsOn: 1,
    }),
    endDate: endOfWeek(subWeeks(baseDay, weekOffset), {
      weekStartsOn: 1,
    }),
  };
}
