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
import { AnimatedSection } from "../components/ui/AnimatedSection";
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
        <AnimatedSection index={0} className="col-span-12">
          <AccountList accounts={dashboard.accounts} />
        </AnimatedSection>

        {/* Linha 2: Saldo · Objetivo · Saúde — mesma altura */}
        <AnimatedSection index={1} className="col-span-12 lg:col-span-5">
          <BalanceCard
            accounts={dashboard.accounts}
            transactions={dashboard.last_month_transactions}
          />
        </AnimatedSection>
        <AnimatedSection index={2} className="col-span-12 lg:col-span-4">
          <NextGoalCard goal={dashboard.goal} />
        </AnimatedSection>
        <AnimatedSection index={3} className="col-span-12 lg:col-span-3">
          <FinancialHealthCard health={dashboard.financial_health} />
        </AnimatedSection>

        {/* Linha 3: Fluxo de Caixa · Distribuição */}
        <AnimatedSection index={4} className="col-span-12 lg:col-span-7">
          <MonthlyBalanceCard
            last_month_transactions={dashboard.last_month_transactions}
          />
        </AnimatedSection>
        <AnimatedSection index={5} className="col-span-12 lg:col-span-5">
          <CategoryDistributionCard
            distribution={dashboard.categories.distribution}
          />
        </AnimatedSection>

        {/* Linha 4: Análise de Categorias · Transações Recentes */}
        <AnimatedSection index={6} className="col-span-12 lg:col-span-5">
          <CategoryAnalysisCard most_used={dashboard.categories.most_used} />
        </AnimatedSection>
        <AnimatedSection index={7} className="col-span-12 lg:col-span-7">
          <RecentTransactions />
        </AnimatedSection>

      </div>
    </main>
  );
}
