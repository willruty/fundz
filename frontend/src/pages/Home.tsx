import { useState, useEffect } from "react";
import { AccountList } from "../components/AccountList";
import { BalanceCard } from "../components/CurrentBalance";
import { NextGoalCard } from "../components/NextGoalCard";
import { MonthlyBalanceCard } from "../components/MonthlyBalance";
import { CategoryAnalysisCard } from "../components/CategoryAnalysis";
import { CategoryDistributionCard } from "../components/CategoryDistribution";
import { RecentTransactions } from "../components/RecentTransactions";
import { FinancialHealthCard } from "../components/FinancialHealthCard";
import { SavingsRateCard } from "../components/SavingsRateCard";
import { SubscriptionsCard } from "../components/SubscriptionsCard";
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

        {/* Linha 2: Saldo · Objetivo · Taxa de Poupança */}
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
          <SavingsRateCard transactions={dashboard.last_month_transactions} />
        </AnimatedSection>

        {/* Linha 3: Fluxo de Caixa · Distribuição por Categoria */}
        <AnimatedSection index={4} className="col-span-12 lg:col-span-8">
          <MonthlyBalanceCard
            last_month_transactions={dashboard.last_month_transactions}
          />
        </AnimatedSection>

        <AnimatedSection index={5} className="col-span-12 lg:col-span-4">
          <CategoryDistributionCard
            distribution={dashboard.categories.distribution}
          />
        </AnimatedSection>

        {/* Linha 4: Insight de Gastos · Saúde Financeira · Assinaturas */}
        <AnimatedSection index={6} className="col-span-4">
          <CategoryAnalysisCard most_used={dashboard.categories.most_used} />
        </AnimatedSection>

        <AnimatedSection index={7} className="col-span-8 lg:col-span-4">
          <FinancialHealthCard health={dashboard.financial_health} />
        </AnimatedSection>

        <AnimatedSection index={8} className="col-span-12 lg:col-span-4">
          <SubscriptionsCard subscriptions={dashboard.subscriptions} />
        </AnimatedSection>

        {/* Linha 5: Transações Recentes (full-width) */}
        <AnimatedSection index={9} className="col-span-12">
          <RecentTransactions />
        </AnimatedSection>
      </div>
    </main>
  );
}
