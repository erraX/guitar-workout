import { getWorkoutHistory } from "@/service/workout";
import { HistorysTable } from "./HistoryTable";
import { ActivityCalendar } from "./ActivityCalendar";

export default async function HistoryPage() {
  const workoutHistory = await getWorkoutHistory();

  return (
    <div className="flex flex-col w-full">
      <ActivityCalendar data={workoutHistory} />
      <HistorysTable data={workoutHistory} />
    </div>
  );
}
