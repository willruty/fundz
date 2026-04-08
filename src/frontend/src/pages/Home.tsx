import { useState, useEffect } from "react";
import { AccountList } from "../components/AccountList";
import { BalanceCard } from "../components/CurrentBalance";
import { NextGoalCard } from "../components/NextGoalCard";
import { MonthlyBalanceCard } from "../components/MonthlyBalance";
import { CategoryAnalysisCard } from "../components/CategoryAnalysis";
import { CategoryDistributionCard } from "../components/CategoryDistribution";
import { RecentTransactions } from "../components/RecentTransactions";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { getDashboardOverview } from "../service/dashboard.service";
import type { DashboardDTO } from "../types/dashboard";

export function Home() {
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview()
      .then(setDashboard)
      .catch((err) => console.error("Erro ao buscar dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !dashboard) {
    return <HomeSkeleton />;
  }

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5">
        {/* Linha 1: Badges das Contas */}
        <div className="lg:col-span-2">
          <AccountList accounts={dashboard.accounts} />
        </div>

        {/* Linha 2: Resumo Geral */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <BalanceCard
              accounts={dashboard.accounts}
              transactions={dashboard.last_month_transactions}
            />
          </div>
          <div className="flex-1">
            <NextGoalCard goal={dashboard.goal} />
          </div>
        </div>
        <div className="w-full">
          <MonthlyBalanceCard
            last_month_transactions={dashboard.last_month_transactions}
          />
        </div>

        {/* Linha 3: Categorias */}
        <div className="w-full">
          <CategoryAnalysisCard most_used={dashboard.categories.most_used} />
        </div>
        <div className="w-full">
          <CategoryDistributionCard
            distribution={dashboard.categories.distribution}
          />
        </div>

        {/* Linha 4: Transações */}
        <div className="w-full lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </main>
  );
}
