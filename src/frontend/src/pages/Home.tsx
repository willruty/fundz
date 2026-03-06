import { useState, useEffect } from "react";
import { AccountList } from "../components/account-list";
import { BalanceCard } from "../components/current-balance";
import { NextGoalCard } from "../components/next-goal-card";
import { MonthlyBalanceCard } from "../components/monthly-balance";
import { CategoryAnalysisCard } from "../components/category-analysis";
import { CategoryDistributionCard } from "../components/category-distribution";
import { RecentTransactions } from "../components/recent-transactions";
import type { DashboardDTO } from "../types/dashboard";

export function Home() {
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8000/fundz/dashboard/overview",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const json = await res.json();

        setLoading(true);
        setDashboard(json.data);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !dashboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5">
        {/* Linha 1: Badges das Contas */}
        <div className="lg:col-span-2">
          <AccountList accounts={dashboard?.accounts} />
        </div>

        {/* Linha 2: Resumo Geral */}
        <div className="flex flex-row gap-5">
          <div className="flex-1">
            <BalanceCard accounts={dashboard.accounts} />
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
