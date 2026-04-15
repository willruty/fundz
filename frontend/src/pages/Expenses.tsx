import { useState, useEffect, useCallback } from "react";
import { DailyAverageCard } from "../components/DailyAverageCard";
import { MonthlyForecastCard } from "../components/MonthlyForecastCard";
import { HighestExpenseCard } from "../components/HighestExpenseCard";
import { ImpulsiveSpendingCard } from "../components/ImpulsiveExpenseCard";
import { DailySpendingChart } from "../components/ExpenseChartCard";
import { CategoryDistributionCard } from "../components/ExpenseCategoryDistribuitionCard";
import { TransactionTableCard, type ExpenseTransaction } from "../components/ExpensesTableCard";
import { ExpensesSkeleton } from "../components/skeletons/ExpensesSkeleton";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { getTransactions, type Transaction } from "../service/transaction.service";
import { getCategories, type Category } from "../service/categories.service";
import { getAccounts, type ApiAccount } from "../service/accounts.service";

// ── HELPERS ────────────────────────────────────────────────────────────────────

const CAT_PALETTE = ["#FF3B3B", "#08233e", "#ffd100", "#000000", "#9ca3af", "#1A6BFF", "#22c55e", "#a855f7"];

function txDate(tx: Transaction): string {
  return (tx as any).occurredAt || tx.occurred_at || "";
}

function groupByDay(txs: Transaction[]): { day: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const tx of txs) {
    const d = new Date(txDate(tx));
    const day = String(d.getDate()).padStart(2, "0");
    map.set(day, (map.get(day) ?? 0) + Math.abs(parseFloat(tx.amount)));
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, amount]) => ({ day, amount: Math.round(amount) }));
}

function buildCategoryData(
  txs: Transaction[],
  catMap: Map<string, string>,
): { name: string; value: number; color: string }[] {
  const map = new Map<string, number>();
  for (const tx of txs) {
    const catId = (tx as any).categoryId ?? tx.categoryId;
    const catName = catId ? (catMap.get(catId) ?? "Outros") : "Sem categoria";
    map.set(catName, (map.get(catName) ?? 0) + Math.abs(parseFloat(tx.amount)));
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], i) => ({
      name,
      value: Math.round(value),
      color: CAT_PALETTE[i % CAT_PALETTE.length],
    }));
}

// ── PAGE ───────────────────────────────────────────────────────────────────────

export function Expenses() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);

  const fetchData = useCallback(() => {
    return Promise.all([getTransactions(), getCategories(), getAccounts()])
      .then(([txs, cats, accs]) => {
        const onlyExpenses = txs.filter((t) => t.type === "expense");
        setExpenses(onlyExpenses);
        setCategories(cats);
        setAccounts(accs);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  if (loading) return <ExpensesSkeleton />;

  // ── DERIVED DATA ────────────────────────────────────────────────────────────

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  // Daily average
  const totalExpenses = expenses.reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
  const now = new Date();
  const dayOfMonth = now.getDate();
  const dailyAverage = dayOfMonth > 0 ? totalExpenses / dayOfMonth : 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Last 7 days amounts for sparkline
  const last7Days: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const dayTotal = expenses
      .filter((t) => txDate(t).slice(0, 10) === dayStr)
      .reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
    last7Days.push(Math.round(dayTotal));
  }

  // Highest expense
  const highest = expenses.length > 0
    ? expenses.reduce((max, t) =>
        Math.abs(parseFloat(t.amount)) > Math.abs(parseFloat(max.amount)) ? t : max
      )
    : null;

  const highestCatName = highest
    ? (catMap.get((highest as any).categoryId ?? highest.categoryId ?? "") ?? "Outros")
    : "";

  // Daily chart data
  const dailyData = groupByDay(expenses);

  // Category distribution
  const categoryData = buildCategoryData(expenses, catMap);

  // Table data
  const tableData: ExpenseTransaction[] = expenses.map((tx) => {
    const catId = (tx as any).categoryId ?? tx.categoryId;
    const accId = (tx as any).accountId ?? tx.accountId;
    const iso = txDate(tx).slice(0, 10);
    return {
      id: tx.id,
      title: tx.description || "Sem descrição",
      category: catId ? (catMap.get(catId) ?? "Outros") : "Sem categoria",
      categoryId: catId,
      accountId: accId,
      date: new Date(txDate(tx)).toLocaleDateString("pt-BR"),
      isoDate: iso,
      amount: Math.abs(parseFloat(tx.amount)),
    };
  });

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-4 lg:gap-6">
        {/* LINHA 1 */}
        <AnimatedSection index={0} className="lg:col-span-2">
          <DailyAverageCard average={dailyAverage} last7Days={last7Days} />
        </AnimatedSection>

        <AnimatedSection index={1} className="lg:col-span-2">
          <MonthlyForecastCard
            dailyAverage={dailyAverage}
            daysInMonth={daysInMonth}
          />
        </AnimatedSection>

        <AnimatedSection index={2} className="lg:col-span-2">
          <HighestExpenseCard
            amount={highest ? Math.abs(parseFloat(highest.amount)) : 0}
            date={highest ? new Date(txDate(highest)).toLocaleDateString("pt-BR") : "—"}
            category={highestCatName}
            description={highest?.description || "Nenhuma despesa encontrada"}
          />
        </AnimatedSection>

        <AnimatedSection index={3} className="sm:col-span-2 lg:col-span-4">
          <ImpulsiveSpendingCard />
        </AnimatedSection>

        {/* LINHA 2 */}
        <AnimatedSection index={4} className="sm:col-span-2 lg:col-span-5 mt-0 sm:mt-2 lg:mt-4">
          <DailySpendingChart data={dailyData} />
        </AnimatedSection>

        <AnimatedSection index={5} className="sm:col-span-2 lg:col-span-5 mt-0 sm:mt-2 lg:mt-4">
          <CategoryDistributionCard data={categoryData} />
        </AnimatedSection>

        {/* LINHA 3 */}
        <AnimatedSection index={6} className="sm:col-span-2 lg:col-span-10 mt-0 sm:mt-2 lg:mt-4">
          <TransactionTableCard
            transactions={tableData}
            categories={categories}
            accounts={accounts}
            onMutate={fetchData}
          />
        </AnimatedSection>
      </div>
    </div>
  );
}
