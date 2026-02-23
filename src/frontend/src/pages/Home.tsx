import { AccountList } from "../components/account-list";
import { BalanceCard } from "../components/current-balance";
import { NextGoalCard } from "../components/next-goal-card";
import { MonthlyBalanceCard } from "../components/monthly-balance";
import { CategoryAnalysisCard } from "../components/category-analysis";
import { CategoryDistributionCard } from "../components/category-distribution";
import { RecentTransactions } from "../components/recent-transactions";

export function Home() {
  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5">
        {/* Linha 1: Badges das Contas */}
        <div className="lg:col-span-2">
          <AccountList />
        </div>

        {/* Linha 2: Resumo Geral */}
        <div className="flex flex-row gap-5">
          <div className="flex-1">
            <BalanceCard accountId="e36bd0c1-89de-462f-8c06-02917dac1f95" />
          </div>
          <div className="flex-1">
            <NextGoalCard />
          </div>
        </div>
        <div className="w-full">
          <MonthlyBalanceCard />
        </div>

        {/* Linha 3: Categorias */}
        <div className="w-full">
          <CategoryAnalysisCard />
        </div>
        <div className="w-full">
          <CategoryDistributionCard />
        </div>

        {/* Linha 4: Transações */}
        <div className="w-full lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </main>
  );
}
