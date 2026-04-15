import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { GoalsSkeleton } from "../components/skeletons/GoalsSkeleton";
import GoalModal, { type GoalFormData } from "../components/GoalModal";
import { AnimatedSection } from "../components/ui/AnimatedSection";
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
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
} from "../service/goals.service";

// ── CORES POR ÍNDICE ───────────────────────────────────────────────────────────

const GOAL_COLORS = ["#1A6BFF", "#22c55e", "#a855f7", "#f97316", "#ef4444", "#06b6d4", "#8b5cf6"];

// ── UTILITÁRIOS ────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const pct = (current: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

function fmtDeadline(str: string | null): string {
  if (!str) return "Sem prazo";
  const d = new Date(str);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function monthsLeft(dueDate: string | null): number {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  return Math.max(0, (due.getFullYear() - now.getFullYear()) * 12 + (due.getMonth() - now.getMonth()));
}

// ── GOAL SHAPE INTERNO ─────────────────────────────────────────────────────────

interface MappedGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  dueDate: string | null;
  color: string;
  requiredMonthly: number;
}

function mapGoals(raw: Goal[]): MappedGoal[] {
  return raw.map((g, i) => {
    const target = parseFloat(g.targetAmount) || 0;
    const current = parseFloat(g.currentAmount) || 0;
    const ml = monthsLeft(g.dueDate);
    const remaining = Math.max(0, target - current);
    return {
      id: g.id,
      name: g.name,
      target,
      current,
      dueDate: g.dueDate,
      color: GOAL_COLORS[i % GOAL_COLORS.length],
      requiredMonthly: ml > 0 ? Math.ceil(remaining / ml) : remaining,
    };
  });
}

function goalToFormData(goal: Goal): GoalFormData {
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: String(parseFloat(goal.targetAmount) || 0),
    currentAmount: String(parseFloat(goal.currentAmount) || 0),
    dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : "",
  };
}

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

// ── PAGE ───────────────────────────────────────────────────────────────────────

export function Goals() {
  const [loading, setLoading] = useState(true);
  const [rawGoals, setRawGoals] = useState<Goal[]>([]);
  const [goals, setGoals] = useState<MappedGoal[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<GoalFormData | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<MappedGoal | null>(null);

  const fetchData = useCallback(() => {
    return getGoals()
      .then((raw) => {
        setRawGoals(raw);
        setGoals(mapGoals(raw));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  const handleNew = () => {
    setModalInitial(null);
    setModalOpen(true);
  };

  const handleEdit = (goal: MappedGoal) => {
    const raw = rawGoals.find((g) => g.id === goal.id);
    if (raw) {
      setModalInitial(goalToFormData(raw));
      setModalOpen(true);
    }
  };

  const handleSave = async (data: GoalFormData) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        target_amount: parseFloat(data.targetAmount) || 0,
        current_amount: parseFloat(data.currentAmount) || 0,
        due_date: data.dueDate || undefined,
      };
      if (data.id) {
        await updateGoal({ id: data.id, ...payload });
        toast.success("Meta atualizada!");
      } else {
        await createGoal(payload);
        toast.success("Meta criada!");
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (goal: MappedGoal) => {
    setDeleteTarget(goal);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGoal(deleteTarget.id);
      toast.success("Meta removida!");
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao deletar";
      toast.error(msg);
    }
  };

  // ── TOOLTIP (closure sobre goals) ───────────────────────────────────────────

  function ProgressTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const entry = payload[0]?.payload;
    const goal = goals.find((g) => g.name === entry?.fullName);
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
    const necessario = payload.find((p: any) => p.dataKey === "necessario")?.value ?? 0;
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
          {label}
        </p>
        <div className="flex justify-between items-center gap-4">
          <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Necessário/mês:</span>
          <span className="text-xs font-black text-[var(--primary)]">{fmt(necessario)}</span>
        </div>
      </div>
    );
  }

  if (loading) return <GoalsSkeleton />;

  if (goals.length === 0) {
    return (
      <main className="min-h-screen mx-auto flex items-center justify-center">
        <div className="text-center p-12 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)]">
          <p className="text-2xl font-black text-[var(--primary)] uppercase tracking-tight mb-4">Nenhuma meta cadastrada</p>
          <p className="text-sm text-[var(--black-muted)] font-bold uppercase tracking-wide mb-6">Crie sua primeira meta financeira.</p>
          <button
            onClick={handleNew}
            className="bg-[var(--secondary)] text-[var(--primary)] px-6 py-3 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 mx-auto hover:bg-[var(--secondary-hover)] transition-all shadow-[var(--neo-shadow-hover)] cursor-pointer"
          >
            <Plus size={14} strokeWidth={3} /> Nova meta
          </button>
        </div>

        <GoalModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={modalInitial}
          saving={saving}
        />
      </main>
    );
  }

  const totalTarget  = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const overallPct   = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const featured = [...goals].sort(
    (a, b) => pct(b.current, b.target) - pct(a.current, a.target)
  )[0];

  const milestone = goals
    .filter((g) => pct(g.current, g.target) < 50)
    .sort((a, b) => (a.target * 0.5 - a.current) - (b.target * 0.5 - b.current))[0];
  const milestoneGap = milestone ? milestone.target * 0.5 - milestone.current : 0;

  const progressData = goals.map((g) => ({
    name:     g.name.split(" ").slice(0, 2).join(" "),
    fullName: g.name,
    progress: pct(g.current, g.target),
    color:    g.color,
  }));

  const ritmoData = goals.map((g) => ({
    name:      g.name.split(" ").slice(0, 2).join(" "),
    necessario: g.requiredMonthly,
  }));

  return (
    <main className="min-h-screen mx-auto space-y-8">

      {/* ── SEÇÃO 1 · CARDS TOPO ── */}
      <AnimatedSection index={0} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">

        {/* Meta em Destaque */}
        <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="flex flex-col h-full px-6 py-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">
                Meta em destaque
              </h2>
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--primary)] text-white"
              >
                {pct(featured.current, featured.target)}% concluída
              </span>
            </div>

            <div className="flex-grow flex items-center gap-6 mb-8">
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
                    Prazo: {fmtDeadline(featured.dueDate)}
                  </span>
                </div>
              </div>
            </div>

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

        {/* Total em Metas */}
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

        {/* Progresso Geral */}
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

      </AnimatedSection>

      {/* ── SEÇÃO 2 · GRÁFICOS ── */}
      <AnimatedSection index={1} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mx-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed">
            {goals.map((g) => (
              <div key={g.id} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                  style={{ backgroundColor: g.color }}
                />
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
                  {g.name.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Aporte Necessário por Meta */}
        <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
                Aportes Mensais
              </h3>
              <h2 className="text-xl font-black text-white">Necessário por Meta</h2>
            </div>
            <button
              onClick={handleNew}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] transition-all shadow-[var(--neo-shadow-hover)] cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Nova meta
            </button>
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
                <Bar
                  dataKey="necessario"
                  radius={[3, 3, 0, 0]} fill="var(--secondary)" maxBarSize={52}
                  stroke="var(--black)" strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mx-5 pb-4 pt-3 border-t-2 border-[var(--black)] border-dashed">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--secondary)]" />
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">Aporte Necessário/mês</span>
            </div>
          </div>
        </div>

      </AnimatedSection>

      {/* ── SEÇÃO 3 · CARDS DE METAS ── */}
      <AnimatedSection index={2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {goals.map((goal) => {
          const progress  = pct(goal.current, goal.target);
          const ml        = monthsLeft(goal.dueDate);

          return (
            <div
              key={goal.id}
              className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] group"
            >
              <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-3 flex justify-between items-center">
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-[var(--black)] text-white"
                  style={{ background: goal.color }}
                >
                  Meta
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-[var(--black)] rounded bg-[var(--secondary)] text-[var(--primary)]">
                    {progress}%
                  </span>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white/20 transition-all text-white/70 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Pencil size={13} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(goal)}
                    className="p-1 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white/20 transition-all text-white/70 hover:text-red-300 cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <h3 className="text-base font-black text-[var(--primary)] uppercase tracking-tight leading-tight">
                    {goal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Calendar size={11} strokeWidth={2.5} className="text-[var(--black-muted)]" />
                    <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                      {fmtDeadline(goal.dueDate)}
                    </span>
                  </div>
                </div>

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

                <div className="w-full h-4 bg-[var(--main-bg)] rounded-full overflow-hidden border-2 border-[var(--black)]">
                  <div
                    className="h-full border-r-2 border-[var(--black)] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%`, background: goal.color }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t-2 border-[var(--black)] border-dashed">
                  <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2 py-0.5 rounded border-2 border-[var(--black)] uppercase tracking-wider">
                    {fmt(goal.requiredMonthly)}/mês
                  </span>
                  <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">
                    {goal.dueDate
                      ? ml > 0 ? `${ml}m restantes` : "Prazo expirado"
                      : "Sem prazo"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </AnimatedSection>

      {/* Modal de criação/edição */}
      <GoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={modalInitial}
        saving={saving}
      />

      {/* Confirm delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">
              Confirmar exclusão
            </h3>
            <p className="text-sm font-bold text-[var(--black-muted)]">
              Tem certeza que deseja remover a meta <span className="text-[var(--primary)]">{deleteTarget.name}</span>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-red-500 text-white shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
