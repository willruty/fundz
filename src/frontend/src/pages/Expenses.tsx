import { DailyAverageCard } from "../components/DailyAverageCard";
import { MonthlyForecastCard } from "../components/MonthlyForecastCard";
import { HighestExpenseCard } from "../components/HighestExpenseCard";
import { ImpulsiveSpendingCard } from "../components/ImpulsiveExpenseCard";
import { DailySpendingChart } from "../components/ExpenseChartCard";
import { CategoryDistributionCard } from "../components/ExpenseCategoryDistribuitionCard";
import { TransactionTableCard } from "../components/ExpensesTableCard";

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
