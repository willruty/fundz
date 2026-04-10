import { useState, useEffect } from "react";
import { AccountsSkeleton } from "../components/skeletons/AccountsSkeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
  Wallet,
  CreditCard,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Account {
  id: string;
  bank: string;
  initials: string;
  type: "Conta Corrente" | "Conta Poupança" | "Conta Digital" | "Conta Investimento";
  balance: number;
  income: number;
  expenses: number;
  color: string;
  textColor: string;
  lastUpdated: string;
  agency?: string;
  accountNumber: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  bank: string;
  bankColor: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockAccounts: Account[] = [
  {
    id: "1",
    bank: "Nubank",
    initials: "Nu",
    type: "Conta Corrente",
    balance: 4200.0,
    income: 8500,
    expenses: 3200,
    color: "#820AD1",
    textColor: "#ffffff",
    lastUpdated: "hoje, 14:32",
    accountNumber: "••••  9821",
  },
  {
    id: "2",
    bank: "Itaú",
    initials: "IT",
    type: "Conta Poupança",
    balance: 12500.0,
    income: 350,
    expenses: 0,
    color: "#003399",
    textColor: "#ffffff",
    lastUpdated: "hoje, 09:15",
    agency: "0341",
    accountNumber: "••••  4402",
  },
  {
    id: "3",
    bank: "Banco do Brasil",
    initials: "BB",
    type: "Conta Corrente",
    balance: 892.3,
    income: 1200,
    expenses: 980,
    color: "#F9D100",
    textColor: "#1a1a1a",
    lastUpdated: "ontem",
    agency: "1827",
    accountNumber: "••••  3310",
  },
  {
    id: "4",
    bank: "C6 Bank",
    initials: "C6",
    type: "Conta Digital",
    balance: 340.0,
    income: 200,
    expenses: 150,
    color: "#111111",
    textColor: "#ffffff",
    lastUpdated: "ontem",
    accountNumber: "••••  0077",
  },
];

const mockTransactions: Transaction[] = [
  { id: "1", description: "Salário referência Março",   amount: 8500,   date: "01/03", type: "income",  bank: "Nubank",          bankColor: "#820AD1" },
  { id: "2", description: "Aluguel Março",              amount: 1800,   date: "05/03", type: "expense", bank: "Itaú",            bankColor: "#003399" },
  { id: "3", description: "Mercado Pão de Açúcar",      amount: 450.9,  date: "08/03", type: "expense", bank: "Nubank",          bankColor: "#820AD1" },
  { id: "4", description: "Rendimento Poupança",        amount: 87.5,   date: "10/03", type: "income",  bank: "Itaú",            bankColor: "#003399" },
  { id: "5", description: "Farmácia Drogasil",          amount: 128.4,  date: "12/03", type: "expense", bank: "C6 Bank",         bankColor: "#111111" },
  { id: "6", description: "Transferência p/ BB",        amount: 500,    date: "15/03", type: "expense", bank: "Nubank",          bankColor: "#820AD1" },
  { id: "7", description: "Freelance Design UI",        amount: 1200,   date: "18/03", type: "income",  bank: "Banco do Brasil", bankColor: "#F9D100" },
  { id: "8", description: "Spotify + Netflix",          amount: 79.8,   date: "18/03", type: "expense", bank: "Nubank",          bankColor: "#820AD1" },
];

const monthlyFlow = [
  { month: "Out", income: 9200, expenses: 5100 },
  { month: "Nov", income: 8800, expenses: 6200 },
  { month: "Dez", income: 10500, expenses: 8900 },
  { month: "Jan", income: 8500, expenses: 4800 },
  { month: "Fev", income: 8500, expenses: 5300 },
  { month: "Mar", income: 9700, expenses: 5380 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Conta Corrente":     <Wallet size={13} strokeWidth={2.5} />,
  "Conta Poupança":     <ShieldCheck size={13} strokeWidth={2.5} />,
  "Conta Digital":      <CreditCard size={13} strokeWidth={2.5} />,
  "Conta Investimento": <TrendingUp size={13} strokeWidth={2.5} />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BankCard({ account, hidden }: { account: Account; hidden: boolean }) {
  const isLight = account.color === "#F9D100";

  return (
    <div
      className="relative flex flex-col justify-between p-6 rounded-[var(--radius-card)] border-2 border-[var(--black)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 overflow-hidden min-h-[196px] cursor-default"
      style={{ background: account.color, color: account.textColor }}
    >
      {/* Decoração geométrica */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 opacity-10"
        style={{ borderColor: account.textColor }}
      />
      <div
        className="absolute -bottom-10 -right-4 w-24 h-24 rounded-full border-2 opacity-10"
        style={{ borderColor: account.textColor }}
      />

      {/* Topo: logo + tipo */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md border-2 flex items-center justify-center font-black text-sm"
            style={{
              borderColor: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
              background: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)",
            }}
          >
            {account.initials}
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight" style={{ opacity: 1 }}>
              {account.bank}
            </p>
            <div
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider mt-0.5"
              style={{ opacity: 0.7 }}
            >
              {TYPE_ICONS[account.type]}
              {account.type}
            </div>
          </div>
        </div>
        <div
          className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border"
          style={{
            borderColor: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)",
            background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)",
            opacity: 0.9,
          }}
        >
          Atualizado: {account.lastUpdated}
        </div>
      </div>

      {/* Centro: saldo */}
      <div className="relative z-10 mt-4">
        <p
          className="text-[9px] font-black uppercase tracking-widest mb-1"
          style={{ opacity: 0.65 }}
        >
          Saldo disponível
        </p>
        <p className="text-3xl font-black tracking-tighter">
          {hidden ? "R$ ••••••" : fmt(account.balance)}
        </p>
        {account.agency && (
          <p className="text-[9px] font-bold mt-1" style={{ opacity: 0.55 }}>
            Ag. {account.agency}
          </p>
        )}
      </div>

      {/* Rodapé: número + income/expense */}
      <div className="flex justify-between items-end relative z-10 mt-3">
        <p className="text-xs font-bold tracking-[0.2em]" style={{ opacity: 0.7 }}>
          {account.accountNumber}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" style={{ opacity: 0.85 }}>
            <ArrowUpRight size={12} strokeWidth={3} />
            <span className="text-[10px] font-black">{hidden ? "••••" : fmt(account.income)}</span>
          </div>
          <div className="flex items-center gap-1" style={{ opacity: 0.85 }}>
            <ArrowDownRight size={12} strokeWidth={3} />
            <span className="text-[10px] font-black">{hidden ? "••••" : fmt(account.expenses)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Accounts() {
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AccountsSkeleton />;

  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome  = mockAccounts.reduce((s, a) => s + a.income, 0);
  const totalExpenses = mockAccounts.reduce((s, a) => s + a.expenses, 0);
  const netFlow = totalIncome - totalExpenses;

  const pieData = mockAccounts.map((a) => ({ name: a.bank, value: a.balance, color: a.color }));

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[160px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-1 border-b-2 border-dashed border-[var(--black)] pb-1">
          {d.name}
        </p>
        <div className="flex justify-between items-center gap-4">
          <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Saldo:</span>
          <span className="text-xs font-black text-[var(--primary)]">{fmt(d.value)}</span>
        </div>
        <div className="flex justify-between items-center gap-4 mt-1">
          <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Share:</span>
          <span className="text-xs font-black text-[var(--primary)]">
            {((d.value / totalBalance) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[160px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-dashed border-[var(--black)] pb-1">
          {label}
        </p>
        {payload.map((e: any, i: number) => (
          <div key={i} className="flex justify-between items-center gap-4 mb-1">
            <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">
              {e.name === "income" ? "Entradas" : "Saídas"}:
            </span>
            <span className="text-xs font-black" style={{ color: e.fill }}>
              {fmt(e.value)}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t-2 border-dashed border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
          <span className="text-[10px] font-black uppercase text-[var(--primary)]">Líquido:</span>
          <span className="text-xs font-black text-[var(--primary)]">
            {fmt(payload[0].value - payload[1].value)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col gap-6 bg-[var(--main-bg)] min-h-screen">

      {/* ── SECTION 1: Overview ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">

        {/* Saldo Consolidado — yellow col-span-2 */}
        <div className="lg:col-span-2 flex flex-col justify-between p-6 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 overflow-hidden relative cursor-default">
          {/* faded decoration */}
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] font-black text-[var(--primary)] opacity-5 select-none pointer-events-none leading-none">
            R$
          </span>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-black text-[var(--primary)] opacity-60 uppercase tracking-widest mb-1">
                Saldo Consolidado
              </h3>
              <h2 className="text-4xl sm:text-5xl font-black text-[var(--primary)] tracking-tighter">
                {hidden ? "R$ ••••••" : fmt(totalBalance)}
              </h2>
              <p className="text-[10px] font-bold text-[var(--primary)] opacity-50 uppercase tracking-wider mt-2">
                {mockAccounts.length} contas vinculadas
              </p>
            </div>
            <button
              onClick={() => setHidden((h) => !h)}
              className="p-2 bg-[var(--primary)] text-[var(--secondary)] border-2 border-[var(--black)] rounded-md shadow-[var(--neo-shadow-hover)] hover:bg-[var(--primary)]/90 transition-all cursor-pointer"
            >
              {hidden ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
            </button>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-3 gap-3">
            <div className="flex flex-col p-3 bg-[var(--primary)] border-2 border-[var(--black)] rounded-md">
              <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Entradas</span>
              <span className="text-sm font-black text-emerald-400 mt-0.5">{hidden ? "••••" : fmt(totalIncome)}</span>
            </div>
            <div className="flex flex-col p-3 bg-[var(--primary)] border-2 border-[var(--black)] rounded-md">
              <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Saídas</span>
              <span className="text-sm font-black text-[#FF3B3B] mt-0.5">{hidden ? "••••" : fmt(totalExpenses)}</span>
            </div>
            <div className="flex flex-col p-3 bg-[var(--primary)] border-2 border-[var(--black)] rounded-md">
              <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Líquido</span>
              <span className={`text-sm font-black mt-0.5 ${netFlow >= 0 ? "text-emerald-400" : "text-[#FF3B3B]"}`}>
                {hidden ? "••••" : fmt(netFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Conta principal — primary */}
        <div className="flex flex-col justify-between p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 cursor-default">
          <div>
            <h3 className="text-[10px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-widest mb-1">
              Conta Principal
            </h3>
            <div
              className="w-10 h-10 rounded-md border-2 border-white/30 bg-white/15 flex items-center justify-center font-black text-sm text-white mt-2 mb-3"
            >
              Nu
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter">
              {hidden ? "R$ ••••" : fmt(mockAccounts[0].balance)}
            </h2>
            <p className="text-[9px] font-bold text-[var(--main-bg)] opacity-50 uppercase tracking-wider mt-1">
              Nubank · Conta Corrente
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-wider">
            <ArrowUpRight size={13} strokeWidth={3} />
            Maior saldo mensal
          </div>
        </div>

        {/* Nº de Contas — white */}
        <div className="flex flex-col justify-between p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 cursor-default">
          <div>
            <h3 className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1">
              Contas Ativas
            </h3>
            <h2 className="text-6xl font-black text-[var(--primary)] tracking-tighter leading-none mt-2">
              {mockAccounts.length}
            </h2>
            <p className="text-[10px] font-bold text-[var(--black-muted)] uppercase tracking-wider mt-2">
              Bancos conectados
            </p>
          </div>
          <div className="mt-3 space-y-1.5">
            {mockAccounts.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm border border-[var(--black)] flex-shrink-0"
                  style={{ background: a.color }}
                />
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase tracking-wider truncate">
                  {a.bank}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border border-[var(--black)] bg-[var(--black)] flex-shrink-0" />
              <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase tracking-wider">C6 Bank</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Bank Cards ────────────────────────────────────────────── */}
      <div className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">

        {/* Header */}
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
              Contas
            </h3>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Seus Cartões
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHidden((h) => !h)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md text-[10px] font-black text-white uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
            >
              {hidden ? <EyeOff size={13} strokeWidth={2.5} /> : <Eye size={13} strokeWidth={2.5} />}
              {hidden ? "Mostrar" : "Ocultar"}
            </button>
            <button className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer">
              <Plus size={14} strokeWidth={3} /> Nova Conta
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {mockAccounts.map((account) => (
            <BankCard key={account.id} account={account} hidden={hidden} />
          ))}
        </div>
      </div>

      {/* ── SECTION 3: Charts + Transactions ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Distribuição por banco — PieChart (col-span-2) */}
        <div className="lg:col-span-2 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200">
          <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-4">
            <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
              Distribuição
            </h3>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Saldo por Banco
            </h2>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--black)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2 border-t-2 border-dashed border-[var(--black)] pt-4">
              {pieData.map((d) => {
                const pct = ((d.value / totalBalance) * 100).toFixed(1);
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-sm border-2 border-[var(--black)] flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider flex-1">
                      {d.name}
                    </span>
                    <span className="text-[10px] font-black text-[var(--black-muted)] uppercase">
                      {hidden ? "••••" : fmt(d.value)}
                    </span>
                    <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--secondary)] px-1.5 py-0.5 rounded border border-[var(--black)] min-w-[40px] text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fluxo mensal — BarChart (col-span-3) */}
        <div className="lg:col-span-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200">
          <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
                Histórico
              </h3>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                Fluxo Mensal
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md">
                <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">Maior entrada</span>
                <span className="text-sm font-black text-emerald-400">
                  {fmt(Math.max(...monthlyFlow.map((m) => m.income)))}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFlow} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.12} vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                    tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                    tick={{ fill: "var(--black-muted)", fontSize: 11, fontWeight: "900" }}
                    dy={8}
                  />
                  <YAxis
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "bold" }}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "var(--black)", fillOpacity: 0.04 }} />
                  <Bar dataKey="income"   name="income"   fill="var(--primary)"  stroke="var(--black)" strokeWidth={2} radius={[4, 4, 0, 0]} barSize={22} />
                  <Bar dataKey="expenses" name="expenses" fill="#FF3B3B"          stroke="var(--black)" strokeWidth={2} radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 mt-4 pt-4 border-t-2 border-dashed border-[var(--black)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[var(--primary)] border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]" />
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FF3B3B] border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]" />
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Saídas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Recent Transactions ───────────────────────────────────── */}
      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200">

        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
              Movimentações
            </h3>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Últimas Transações
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md text-[10px] font-black text-white uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer">
              <ArrowRightLeft size={13} strokeWidth={2.5} />
              Transferir
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md text-[10px] font-black text-white uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer">
              <RefreshCw size={13} strokeWidth={2.5} />
              Atualizar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-[var(--black)] bg-white">
                {["", "Data", "Descrição", "Conta", "Tipo", "Valor"].map((h, i) => (
                  <th
                    key={i}
                    className={`p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest ${i === 5 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b-2 border-[var(--black)] transition-all cursor-pointer group hover:bg-black/[0.03]"
                >
                  {/* Stripe colorida do banco */}
                  <td className="p-4 w-2 relative">
                    <div
                      className="absolute left-0 top-0 h-full w-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: tx.bankColor }}
                    />
                  </td>

                  <td className="p-4 text-xs font-bold text-[var(--black-muted)] whitespace-nowrap">
                    {tx.date}
                  </td>

                  <td className="p-4">
                    <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                      {tx.description}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className="text-[9px] font-black px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider text-white"
                      style={{ background: tx.bankColor, color: tx.bankColor === "#F9D100" ? "#1a1a1a" : "#ffffff" }}
                    >
                      {tx.bank}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${
                        tx.type === "income" ? "text-emerald-600" : "text-[#FF3B3B]"
                      }`}
                    >
                      {tx.type === "income"
                        ? <ArrowUpRight size={13} strokeWidth={3} />
                        : <ArrowDownRight size={13} strokeWidth={3} />}
                      {tx.type === "income" ? "Entrada" : "Saída"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <span
                      className={`text-sm font-black px-2 py-1 rounded border-2 border-[var(--black)] ${
                        tx.type === "income"
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-[#FF3B3B] bg-red-50"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}{hidden ? "••••" : fmt(tx.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white border-t-2 border-dashed border-[var(--black)] flex justify-between items-center">
          <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
            {mockTransactions.length} transações recentes
          </span>
          <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
            Ver todas
          </span>
        </div>
      </div>
    </main>
  );
}
