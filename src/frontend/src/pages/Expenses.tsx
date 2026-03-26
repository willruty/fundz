import { DailyAverageCard } from "../components/daily-average-card";
import { MonthlyForecastCard } from "../components/monthly-forecast-card";
import { HighestExpenseCard } from "../components/highest-expense-card";
import { ImpulsiveSpendingCard } from "../components/impulsive-expense-card";
import { DailySpendingChart } from "../components/expense-chart-card";
import { CategoryDistributionCard } from "../components/expense-category-distribuition-card";
import { TransactionTableCard } from "../components/expenses-table-card";

export function Expenses() {
  return (
    <div className="min-h-screen">
      {/* Grid Principal - 10 colunas para facilitar proporções de 20% e 40% */}
      <div className="grid grid-cols-10 gap-6">
        {/* LINHA 1 */}

        {/* 20% (2/10 colunas) */}
        <div className="col-span-2">
          <DailyAverageCard />
        </div>

        {/* 20% (2/10 colunas) */}
        <div className="col-span-2">
          <MonthlyForecastCard />
        </div>

        {/* 20% (2/10 colunas) */}
        <div className="col-span-2">
          <HighestExpenseCard />
        </div>

        {/* 40% (4/10 colunas) */}
        <div className="col-span-4">
          <ImpulsiveSpendingCard />
        </div>

        {/* LINHA 2 */}

        {/* 50% (5/10 colunas) */}
        <div className="col-span-5 mt-4">
          <DailySpendingChart />
        </div>

        <div className="col-span-5 mt-4">
          <CategoryDistributionCard />
        </div>

        {/* LINHA 3 */}
        <div className="col-span-10 mt-4">
          <TransactionTableCard />
        </div>
      </div>
    </div>
  );
}
