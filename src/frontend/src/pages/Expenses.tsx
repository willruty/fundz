import { useState, useEffect } from "react";
import { DailyAverageCard } from "../components/DailyAverageCard";
import { MonthlyForecastCard } from "../components/MonthlyForecastCard";
import { HighestExpenseCard } from "../components/HighestExpenseCard";
import { ImpulsiveSpendingCard } from "../components/ImpulsiveExpenseCard";
import { DailySpendingChart } from "../components/ExpenseChartCard";
import { CategoryDistributionCard } from "../components/ExpenseCategoryDistribuitionCard";
import { TransactionTableCard } from "../components/ExpensesTableCard";
import { ExpensesSkeleton } from "../components/skeletons/ExpensesSkeleton";

export function Expenses() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Substituir pelo fetch real quando a API estiver pronta
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ExpensesSkeleton />;

  return (
    <div className="min-h-screen">
      {/* Grid Principal - responsivo: 1 col mobile → 2 cols tablet → 10 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-4 lg:gap-6">
        {/* LINHA 1 */}

        {/* 20% desktop / 1 col mobile / 1 de 2 tablet */}
        <div className="lg:col-span-2">
          <DailyAverageCard />
        </div>

        <div className="lg:col-span-2">
          <MonthlyForecastCard />
        </div>

        <div className="lg:col-span-2">
          <HighestExpenseCard />
        </div>

        {/* 40% desktop / full width tablet e mobile */}
        <div className="sm:col-span-2 lg:col-span-4">
          <ImpulsiveSpendingCard />
        </div>

        {/* LINHA 2 */}

        <div className="sm:col-span-2 lg:col-span-5 mt-0 sm:mt-2 lg:mt-4">
          <DailySpendingChart />
        </div>

        <div className="sm:col-span-2 lg:col-span-5 mt-0 sm:mt-2 lg:mt-4">
          <CategoryDistributionCard />
        </div>

        {/* LINHA 3 */}
        <div className="sm:col-span-2 lg:col-span-10 mt-0 sm:mt-2 lg:mt-4">
          <TransactionTableCard />
        </div>
      </div>
    </div>
  );
}
