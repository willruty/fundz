import { AccountList } from "../components/account-list";
import { BalanceCard } from "../components/current-balance";
import { NextGoalCard } from "../components/next-goal-card";
import { MonthlyBalanceCard } from "../components/monthly-balance";

export function Home() {
  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-5">
        {/* Linha 1: 100% da largura */}
        <div className="lg:col-span-2">
          <AccountList />
        </div>

        {/* Linha 2 - Lado Esquerdo: 50% da largura (dividido em 2 internamente) */}
        <div className="flex flex-row gap-5">
          <div className="flex-1">
            <BalanceCard accountId="e36bd0c1-89de-462f-8c06-02917dac1f95" />
          </div>
          <div className="flex-1">
            <NextGoalCard />
          </div>
        </div>

        {/* Linha 2 - Lado Direito: 50% da largura */}
        <div className="w-full">
          <MonthlyBalanceCard />
        </div>
      </div>
    </main>
  );
}
