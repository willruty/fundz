import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { GoalsSkeleton } from "../components/skeletons/GoalsSkeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

// ── DADOS ──────────────────────────────────────────────────────────────────────

const mockGoals = [
  { id: 1, name: "Viagem Europa",        category: "viagem",     target: 9000,  current: 4200, deadline: "2025-12", monthlyContribution: 620,  requiredMonthly: 1000 },
  { id: 2, name: "Reserva de Emergência",category: "emergencia", target: 10000, current: 6000, deadline: "2025-06", monthlyContribution: 1050, requiredMonthly: 1250 },
  { id: 3, name: "Setup Home Office",    category: "equipamento",target: 4500,  current: 1800, deadline: "2025-03", monthlyContribution: 210,  requiredMonthly: 540  },
  { id: 4, name: "Entrada do Carro",     category: "veiculo",    target: 15000, current: 2200, deadline: "2026-08", monthlyContribution: 800,  requiredMonthly: 800  },
];

const CAT_COLOR: Record<string, string> = {
  viagem:     "#1A6BFF",
  emergencia: "#22c55e",
  equipamento:"#a855f7",
  veiculo:    "#f97316",
};

const CAT_LABEL: Record<string, string> = {
  viagem:     "Viagem",
  emergencia: "Emergência",
  equipamento:"Equipamento",
  veiculo:    "Veículo",
};

// ── UTILITÁRIOS ────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const pct = (current: number, target: number) =>
  Math.min(100, Math.round((current / target) * 100));

const fmtDeadline = (str: string) => {
  const [y, m] = str.split("-");
  return new Date(+y, +m - 1).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
};

// ── RADIAL RING ────────────────────────────────────────────────────────────────

function RadialRing({ percentage }: { percentage: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="9" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="var(--primary)" strokeWidth="9" strokeLinecap="butt"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
      />
    </svg>
  );
}

// ── TOOLTIPS ───────────────────────────────────────────────────────────────────

function ProgressTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload;
  const goal = mockGoals.find((g) => g.name === entry?.fullName);
  return (
    <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[160px]">
      <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
        {entry?.fullName}
      </p>
      <div className="flex justify-between items-center gap-4">
        <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Progresso:</span>
        <span className="text-xs font-black text-[var(--primary)]">{payload[0]?.value}%</span>
      </div>
      {goal && (
        <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
          <span className="text-[10px] font-black uppercase text-[var(--primary)]">Acumulado:</span>
          <span className="text-sm font-black text-[var(--primary)]">{fmt(goal.current)}</span>
        </div>
      )}
    </div>
  );
}

function RitmoTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const atual = payload.find((p: any) => p.dataKey === "atual")?.value ?? 0;
  const necessario = payload.find((p: any) => p.dataKey === "necessario")?.value ?? 0;
  return (
    <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
      <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">
              {entry.dataKey === "atual" ? "Atual" : "Necessário"}:
            </span>
            <span className="text-xs font-black text-[var(--primary)]">{fmt(entry.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between items-center bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
        <span className="text-[10px] font-black uppercase text-[var(--primary)]">Diferença:</span>
        <span className="text-sm font-black text-[var(--primary)]">
          {fmt(Math.abs(atual - necessario))}
        </span>
      </div>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────

export function Goals() {
  const [loading, setLoading] = useState(true);
  const [ritmoFilter, setRitmoFilter] = useState<"all" | "atual" | "necessario">("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  const totalTarget  = mockGoals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = mockGoals.reduce((s, g) => s + g.current, 0);
  const overallPct   = Math.round((totalCurrent / totalTarget) * 100);

  // Meta com maior progresso → destaque no topo
  const featured = [...mockGoals].sort(
    (a, b) => pct(b.current, b.target) - pct(a.current, a.target)
  )[0];

  // Meta mais próxima de 50% (ainda abaixo)
  const milestone = mockGoals
    .filter((g) => pct(g.current, g.target) < 50)
    .sort((a, b) => (a.target * 0.5 - a.current) - (b.target * 0.5 - b.current))[0];
  const milestoneGap = milestone ? milestone.target * 0.5 - milestone.current : 0;

  const progressData = mockGoals.map((g) => ({
    name:     g.name.split(" ").slice(0, 2).join(" "),
    fullName: g.name,
    progress: pct(g.current, g.target),
    category: g.category,
  }));

  const ritmoData = mockGoals.map((g) => ({
    name:      g.name.split(" ").slice(0, 2).join(" "),
    atual:     g.monthlyContribution,
    necessario:g.requiredMonthly,
  }));

  if (loading) return <GoalsSkeleton />;

  return (
    <main className="min-h-screen mx-auto space-y-8">

      {/* ── SEÇÃO 1 · CARDS TOPO (padrão Subscriptions: 4 cols, auto-rows-fr) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">

        {/* Meta em Destaque — col-span-2, CommitmentCard style (amarelo) */}
        <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="flex flex-col h-full px-6 py-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">
                Meta em destaque
              </h2>
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                style={{ background: CAT_COLOR[featured.category], color: "#fff" }}
              >
                {CAT_LABEL[featured.category]}
              </span>
            </div>

            <div className="flex-grow flex items-center gap-6 mb-8">
              {/* Ring SVG */}
              <div className="relative shrink-0 flex items-center justify-center">
                <RadialRing percentage={pct(featured.current, featured.target)} />
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black text-[var(--primary)] leading-none">
                    {pct(featured.current, featured.target)}%
                  </span>
                  <span className="text-[8px] font-black text-[var(--primary)] opacity-70 uppercase tracking-wider mt-0.5">
                    concluído
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-[var(--primary)] opacity-70 uppercase tracking-widest">
                  Objetivo atual
                </p>
                <h3 className="text-2xl font-black text-[var(--primary)] uppercase tracking-tighter leading-tight">
                  {featured.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} strokeWidth={2.5} className="text-[var(--primary)]" />
                  <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
                    Prazo: {fmtDeadline(featured.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-cards brancos (CommitmentCard breakdown) */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors">
                <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-1">
                  Acumulado
                </span>
                <span className="text-2xl font-black text-[var(--primary)]">
                  {fmt(featured.current)}
                </span>
              </div>
              <div className="flex flex-col p-4 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors">
                <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-1">
                  Falta
                </span>
                <span className="text-2xl font-black text-[var(--primary)]">
                  {fmt(featured.target - featured.current)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total em Metas — col-span-1, NextBillingCard style (primary) */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">
            Total em metas
          </h2>
          <div className="flex-grow flex flex-col justify-center mb-6 mt-2">
            <p className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-widest mb-1.5">
              Valor alvo total
            </p>
            <span className="text-4xl md:text-5xl font-black text-[var(--secondary)] tracking-tighter">
              {fmt(totalTarget)}
            </span>
          </div>
          <div className="flex flex-col gap-3 mt-auto pt-4 border-t-2 border-white/30 border-dashed">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
                Já guardado:
              </span>
              <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
                {fmt(totalCurrent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">
                Ainda falta:
              </span>
              <span className="text-xs font-bold text-[var(--main-bg)] tracking-tight">
                {fmt(totalTarget - totalCurrent)}
              </span>
            </div>
          </div>
        </div>

        {/* Progresso Geral — col-span-1, ActiveSubscriptionsCard style (branco) */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <h2 className="text-xs font-black text-[var(--black-muted)] uppercase tracking-widest mb-4">
            Progresso geral
          </h2>
          <div className="flex-grow flex items-center justify-start">
            <span className="text-6xl md:text-7xl font-black text-[var(--primary)] tracking-tighter drop-shadow-sm">
              {overallPct}%
            </span>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-[var(--black)] border-dashed">
            {milestone ? (
              <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider leading-relaxed">
                <span className="text-[var(--primary)] font-black">{fmt(milestoneGap)}</span> para{" "}
                {milestone.name.split(" ")[0]} atingir 50%
              </p>
            ) : (
              <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider leading-relaxed">
                Do total de metas já acumulado
              </p>
            )}
          </div>
        </div>

      </section>

      {/* ── SEÇÃO 2 · GRÁFICOS (padrão expense-chart-card: cabeçalho azul escuro) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico de Progresso por Meta */}
        <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-5 sm:p-0 shadow-[var(--neo-shadow)] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
                Visão Geral
              </h3>
              <h2 className="text-xl font-black text-white">Progresso por Meta</h2>
            </div>
            <p className="text-[10px] font-bold text-[var(--main-bg)] opacity-70 uppercase tracking-widest mt-1 text-right max-w-[140px] leading-relaxed">
              Linha pontilhada = marco dos 50%
            </p>
          </div>

          <div className="h-[280px] p-5 pt-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 16, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.1} vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                  tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                  tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "900" }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false} tickLine={false}
                  tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "bold" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={<ProgressTooltip />}
                  cursor={{ fill: "rgba(0,0,0,0.04)", stroke: "var(--black)", strokeWidth: 1.5 }}
                />
                <ReferenceLine
                  y={50}
                  stroke="var(--black)" strokeDasharray="5 4" strokeWidth={2}
                  label={{ value: "50%", position: "insideTopRight", fontSize: 10, fontWeight: "900", fill: "var(--black-muted)" }}
                />
                <Bar dataKey="progress" radius={[3, 3, 0, 0]} maxBarSize={52} stroke="var(--black)" strokeWidth={2}>
                  {progressData.map((entry, i) => (
                    <Cell key={i} fill={CAT_COLOR[entry.category]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mx-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed">
            {mockGoals.map((g) => (
              <div key={g.id} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                  style={{ backgroundColor: CAT_COLOR[g.category] }}
                />
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
                  {CAT_LABEL[g.category]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ritmo vs Necessário — AnnualSubscriptionChart style com filtros */}
        <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div>
              <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
                Aportes Mensais
              </h3>
              <h2 className="text-xl font-black text-white">Ritmo vs Necessário</h2>
            </div>
            <div className="flex items-center gap-2 bg-[var(--main-bg)] p-1.5 rounded-lg border-2 border-[var(--black)]">
              {(["all", "atual", "necessario"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRitmoFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-md transition-all border-2 cursor-pointer ${
                    ritmoFilter === f
                      ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                      : "bg-transparent text-[var(--black-muted)] border-transparent hover:text-[var(--primary)] hover:bg-black/5"
                  }`}
                >
                  {f === "all" ? "Todos" : f === "atual" ? "Atual" : "Necessário"}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] p-5 pt-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ritmoData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.1} vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                  tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                  tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "900" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "bold" }}
                  tickFormatter={(v) => `R$${v}`}
                />
                <Tooltip
                  content={<RitmoTooltip />}
                  cursor={{ fill: "rgba(0,0,0,0.04)", stroke: "var(--black)", strokeWidth: 1.5 }}
                />
                {(ritmoFilter === "all" || ritmoFilter === "atual") && (
                  <Bar
                    dataKey="atual" name="atual"
                    radius={[3, 3, 0, 0]} fill="var(--primary)" maxBarSize={32}
                    stroke="var(--black)" strokeWidth={2}
                  />
                )}
                {(ritmoFilter === "all" || ritmoFilter === "necessario") && (
                  <Bar
                    dataKey="necessario" name="necessario"
                    radius={[3, 3, 0, 0]} fill="var(--secondary)" maxBarSize={32}
                    stroke="var(--black)" strokeWidth={2}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mx-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--primary)]" />
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Aporte Atual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--secondary)]" />
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Necessário</span>
            </div>
          </div>
        </div>

      </section>

      {/* ── SEÇÃO 3 · CARDS DE METAS (padrão expense cards: cabeçalho azul por card) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockGoals.map((goal) => {
          const progress   = pct(goal.current, goal.target);
          const isOnTrack  = goal.monthlyContribution >= goal.requiredMonthly;
          const now        = new Date();
          const [dy, dm]   = goal.deadline.split("-").map(Number);
          const monthsLeft = (dy - now.getFullYear()) * 12 + (dm - now.getMonth());

          return (
            <div
              key={goal.id}
              className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]"
            >
              {/* Cabeçalho azul escuro — expense-chart-card style */}
              <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-3 flex justify-between items-center">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-[var(--black)]"
                  style={{ background: CAT_COLOR[goal.category], color: "#fff" }}
                >
                  {CAT_LABEL[goal.category]}
                </span>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-[var(--black)] rounded ${
                    isOnTrack
                      ? "bg-[#22c55e] text-white"
                      : "bg-[#FF3B3B] text-white"
                  }`}
                >
                  {isOnTrack ? "No ritmo" : "Abaixo"}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <h3 className="text-base font-black text-[var(--primary)] uppercase tracking-tight leading-tight">
                    {goal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Calendar size={11} strokeWidth={2.5} className="text-[var(--black-muted)]" />
                    <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                      {fmtDeadline(goal.deadline)}
                    </span>
                  </div>
                </div>

                {/* Valores acumulado / alvo */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">
                      Acumulado
                    </p>
                    <span className="text-xl font-black text-[var(--primary)] tracking-tighter leading-none">
                      {fmt(goal.current)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">
                      Alvo
                    </p>
                    <span className="text-sm font-bold text-[var(--black-muted)] tracking-tight">
                      {fmt(goal.target)}
                    </span>
                  </div>
                </div>

                {/* Barra de progresso — next-goal-card style */}
                <div className="w-full h-4 bg-[var(--main-bg)] rounded-full overflow-hidden border-2 border-[var(--black)]">
                  <div
                    className="h-full border-r-2 border-[var(--black)] transition-all duration-1000 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: CAT_COLOR[goal.category],
                    }}
                  />
                </div>

                {/* Rodapé: % + tempo restante */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-[var(--black)] border-dashed">
                  <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2 py-0.5 rounded border-2 border-[var(--black)] uppercase tracking-wider">
                    {progress}%
                  </span>
                  <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                    {monthsLeft > 0 ? `${monthsLeft}m restantes` : "Prazo expirado"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

    </main>
  );
}
