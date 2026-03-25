import { DailyAverageCard } from "../components/daily-average-card";
import { MonthlyForecastCard } from "../components/monthly-forecast-card";

export function Expenses() {
  return (
    <div className="">
      <DailyAverageCard />
      <MonthlyForecastCard />
    </div>
  );
}
