import { useState, useEffect } from "react";
import { AccountList } from "../components/AccountList";
import { BalanceCard } from "../components/CurrentBalance";
import { NextGoalCard } from "../components/NextGoalCard";
import { MonthlyBalanceCard } from "../components/MonthlyBalance";
import { CategoryAnalysisCard } from "../components/CategoryAnalysis";
import { CategoryDistributionCard } from "../components/CategoryDistribution";
import { RecentTransactions } from "../components/RecentTransactions";
import { FinancialHealthCard } from "../components/FinancialHealthCard";
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
      <div className="grid grid-cols-12 gap-5 items-stretch">

        {/* Linha 1: Badges das Contas */}
        <div className="col-span-12">
          <AccountList accounts={dashboard.accounts} />
        </div>

        {/* Linha 2: Saldo · Objetivo · Saúde — mesma altura */}
        <div className="col-span-12 lg:col-span-5">
          <BalanceCard
            accounts={dashboard.accounts}
            transactions={dashboard.last_month_transactions}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <NextGoalCard goal={dashboard.goal} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <FinancialHealthCard health={dashboard.financial_health} />
        </div>

        {/* Linha 3: Fluxo de Caixa · Distribuição */}
        <div className="col-span-12 lg:col-span-7">
          <MonthlyBalanceCard
            last_month_transactions={dashboard.last_month_transactions}
          />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <CategoryDistributionCard
            distribution={dashboard.categories.distribution}
          />
        </div>

        {/* Linha 4: Análise de Categorias · Transações Recentes */}
        <div className="col-span-12 lg:col-span-5">
          <CategoryAnalysisCard most_used={dashboard.categories.most_used} />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <RecentTransactions />
        </div>

      </div>
    </main>
  );
}
