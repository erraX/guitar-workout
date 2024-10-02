import { getWorkoutHistory } from "@/service/workout";
import { HistorysTable } from "./HistoryTable";

export default async function HistoryPage() {
  const workoutHistory = await getWorkoutHistory();

  return (
    <div className="flex flex-col w-full">
      <HistorysTable data={workoutHistory} />
    </div>
  );
}
