export type DashboardDTO = {
  accounts: AccountSummary[];
  goal: GoalSummary;
  last_month_transactions: TransactionSummary[];
  categories: CategorySummary;
  financial_health: FinancialHealth;
  subscriptions: SubscriptionSummary[];
};

export type AccountSummary = {
  name: string;
  balance: string;
};

export type GoalSummary = {
  name: string;
  target: string;
  current: string;
  date: string;
  percentage: string;
};

export type TransactionSummary = {
  date: string;
  value: string;
  type: string;
};

export type CategorySummary = {
  most_used: CategoryMostUsed;
  distribution: CategoryDistribution[];
};

export type CategoryMostUsed = {
  name: string;
  amount: string;
};

export type CategoryDistribution = {
  name: string;
  amount: string;
  percentage: string;
};

export type SubscriptionSummary = {
  name: string;
  category: string;
  monthlyAmount: string;
  billingCycle: string;
  nextBillingDate: string | null;
};

export type HealthLevel = 'bom' | 'atenção' | 'crítico' | 'moderado' | 'alto' | 'baixo' | 'ruim' | 'sem dados';

export type FinancialHealthIndicator = {
  label: string;
  level: HealthLevel;
  value: string;
};

export type FinancialHealth = {
  gastos: FinancialHealthIndicator;
  dividas: FinancialHealthIndicator;
  investimentos: FinancialHealthIndicator;
};
