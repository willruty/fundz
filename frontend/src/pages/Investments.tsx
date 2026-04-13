import { useState, useMemo, useEffect, useCallback } from "react";
import { InvestmentsSkeleton } from "../components/skeletons/InvestmentsSkeleton";
import {
  TrendingUp, TrendingDown, Calculator, Wallet, Sparkles,
  Plus, Pencil, Trash2, X, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import toast from "react-hot-toast";
import {
  getInvestments, createInvestment, updateInvestment, deleteInvestment,
  type ApiInvestment, type CreateInvestmentInput,
} from "../service/investments.service";

// ── CATEGORIAS ────────────────────────────────────────────────────────────────

export const INVESTMENT_CATEGORIES: {
  group: string;
  color: string;
  items: { id: string; label: string; defaultRate: number | null; desc: string }[];
}[] = [
  {
    group: "Renda Fixa",
    color: "#08233e",
    items: [
      { id: "poupanca",     label: "Poupança",          defaultRate: 6.17,  desc: "6,17% a.a." },
      { id: "cdb",          label: "CDB",               defaultRate: 13.65, desc: "100% CDI" },
      { id: "lci",          label: "LCI",               defaultRate: 11.50, desc: "Isento IR" },
      { id: "lca",          label: "LCA",               defaultRate: 11.00, desc: "Isento IR" },
      { id: "tesouro_selic",label: "Tesouro Selic",     defaultRate: 13.50, desc: "Pós-fixado" },
      { id: "tesouro_ipca", label: "Tesouro IPCA+",     defaultRate: 6.50,  desc: "IPCA + spread" },
      { id: "tesouro_pre",  label: "Tesouro Prefixado", defaultRate: 13.00, desc: "Prefixado" },
      { id: "debentures",   label: "Debêntures",        defaultRate: 14.00, desc: "Crédito privado" },
      { id: "cri",          label: "CRI",               defaultRate: 12.50, desc: "Isento IR" },
      { id: "cra",          label: "CRA",               defaultRate: 12.00, desc: "Isento IR" },
      { id: "coe",          label: "COE",               defaultRate: 10.00, desc: "Estruturado" },
    ],
  },
  {
    group: "Renda Variável",
    color: "#a855f7",
    items: [
      { id: "acoes",        label: "Ações",             defaultRate: null,  desc: "Bolsa B3" },
      { id: "etf",          label: "ETF",               defaultRate: null,  desc: "Fundo índice" },
      { id: "bdr",          label: "BDR",               defaultRate: null,  desc: "Ações ext." },
    ],
  },
  {
    group: "Fundos",
    color: "#f97316",
    items: [
      { id: "fii",          label: "FII",               defaultRate: 12.00, desc: "Imobiliário" },
      { id: "fundo_acoes",  label: "Fundo de Ações",    defaultRate: null,  desc: "Gestor ativo" },
      { id: "multimercado", label: "Multimercado",      defaultRate: 12.00, desc: "Multi-estratégia" },
      { id: "cambial",      label: "Fundo Cambial",     defaultRate: null,  desc: "Câmbio" },
      { id: "pgbl",         label: "PGBL",              defaultRate: 10.00, desc: "Previdência" },
      { id: "vgbl",         label: "VGBL",              defaultRate: 10.00, desc: "Previdência" },
    ],
  },
  {
    group: "Cripto",
    color: "#FF6B00",
    items: [
      { id: "bitcoin",      label: "Bitcoin",           defaultRate: null,  desc: "BTC" },
      { id: "ethereum",     label: "Ethereum",          defaultRate: null,  desc: "ETH" },
      { id: "altcoins",     label: "Altcoins",          defaultRate: null,  desc: "Outras criptos" },
    ],
  },
  {
    group: "Outros",
    color: "#64748b",
    items: [
      { id: "ouro",         label: "Ouro / Metais",     defaultRate: 8.00,  desc: "Commodities" },
      { id: "cambio",       label: "Câmbio / Dólar",    defaultRate: null,  desc: "Moeda estrangeira" },
      { id: "custom",       label: "Personalizado",     defaultRate: null,  desc: "Defina" },
    ],
  },
];

const ALL_CATEGORIES = INVESTMENT_CATEGORIES.flatMap((g) =>
  g.items.map((item) => ({ ...item, group: g.group, groupColor: g.color }))
);

function getCategoryMeta(id: string) {
  return ALL_CATEGORIES.find((c) => c.id === id) ?? {
    id,
    label: id,
    group: "Outros",
    groupColor: "#64748b",
    defaultRate: null,
    desc: "",
  };
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────

const CALC_PERIODS = [
  { key: "1a",  months: 12,  label: "1 Ano",   bg: "bg-white",              textCls: "text-[var(--primary)]", badge: "bg-[var(--secondary)] text-[var(--primary)]", divider: "border-[var(--black)]" },
  { key: "5a",  months: 60,  label: "5 Anos",  bg: "bg-[var(--secondary)]", textCls: "text-[var(--primary)]", badge: "bg-[var(--primary)] text-[var(--secondary)]", divider: "border-[var(--black)]" },
  { key: "10a", months: 120, label: "10 Anos", bg: "bg-[var(--primary)]",   textCls: "text-white",            badge: "bg-[var(--secondary)] text-[var(--primary)]", divider: "border-white/20" },
] as const;

function compound(P: number, PMT: number, annualRate: number, months: number): number {
  if (annualRate <= 0 || months === 0) return months === 0 ? P : P + PMT * months;
  const r = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  return P * Math.pow(1 + r, months) + PMT * (Math.pow(1 + r, months) - 1) / r;
}

function genChart(P: number, PMT: number, annualRate: number) {
  const pts = [];
  for (let m = 0; m <= 120; m += 2) {
    pts.push({
      m,
      label: m === 0 ? "Hoje" : m % 12 === 0 ? `${m / 12}a` : `${m}m`,
      invested: Math.round(P + PMT * m),
      total: Math.round(compound(P, PMT, annualRate, m)),
    });
  }
  return pts;
}

// ── FORMATTERS ────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtK = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$${(v / 1_000).toFixed(0)}K`;
  return fmt(v);
};

// ── INVESTMENT MODAL ──────────────────────────────────────────────────────────

interface InvestmentFormData {
  id?: string;
  name: string;
  category: string;
  amount: number | "";
  annualRate: number | "";
  startDate: string;
  notes: string;
}

const emptyForm: InvestmentFormData = {
  name: "",
  category: "cdb",
  amount: "",
  annualRate: "",
  startDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: InvestmentFormData) => void;
  initial?: InvestmentFormData | null;
  saving?: boolean;
}

function InvestmentModal({ open, onClose, onSave, initial, saving }: InvestmentModalProps) {
  const [form, setForm] = useState<InvestmentFormData>(emptyForm);
  const [openGroup, setOpenGroup] = useState<string | null>("Renda Fixa");
  const isEditing = !!initial?.id;

  useEffect(() => {
    if (initial) {
      setForm(initial);
      const meta = getCategoryMeta(initial.category);
      setOpenGroup(meta.group);
    } else {
      setForm(emptyForm);
      setOpenGroup("Renda Fixa");
    }
  }, [initial, open]);

  if (!open) return null;

  const selectedMeta = getCategoryMeta(form.category);

  const handleCategorySelect = (id: string) => {
    const meta = getCategoryMeta(id);
    setForm((f) => ({
      ...f,
      category: id,
      annualRate: meta.defaultRate ?? f.annualRate,
    }));
  };

  const proj1y  = form.amount ? compound(Number(form.amount), 0, Number(form.annualRate || 0), 12)  : 0;
  const proj5y  = form.amount ? compound(Number(form.amount), 0, Number(form.annualRate || 0), 60)  : 0;
  const proj10y = form.amount ? compound(Number(form.amount), 0, Number(form.annualRate || 0), 120) : 0;

  const inputCls = "w-full px-4 py-2.5 rounded-lg border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none font-bold text-sm text-[var(--primary)] shadow-[var(--neo-shadow-hover)]";
  const labelCls = "text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--main-bg)] w-full max-w-xl rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] overflow-hidden max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-[var(--primary)] border-b-3 border-[var(--black)] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black text-[var(--secondary)] uppercase tracking-tight">
              {isEditing ? "Editar investimento" : "Novo investimento"}
            </h2>
            {form.category && (
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">
                {selectedMeta.group} · {selectedMeta.label}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md border-2 border-white/30 text-white hover:bg-white/10 cursor-pointer">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Nome */}
          <div>
            <label className={labelCls}>Nome do investimento</label>
            <input
              className={inputCls}
              placeholder="Ex: CDB Banco XP, Tesouro Selic 2029..."
              required
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Categoria — accordion por grupo */}
          <div>
            <label className={labelCls}>Categoria</label>
            <div className="space-y-1.5">
              {INVESTMENT_CATEGORIES.map((group) => {
                const isOpen = openGroup === group.group;
                const hasSelected = group.items.some((i) => i.id === form.category);
                return (
                  <div key={group.group} className="border-2 border-[var(--black)] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : group.group)}
                      className="w-full flex items-center justify-between px-4 py-2.5 font-black text-xs uppercase tracking-wider cursor-pointer transition-colors"
                      style={{ background: hasSelected ? group.color : "#fff", color: hasSelected ? "#fff" : "var(--primary)" }}
                    >
                      <span>{group.group}</span>
                      <div className="flex items-center gap-2">
                        {hasSelected && (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-white/20 rounded border border-white/30">
                            {getCategoryMeta(form.category).label}
                          </span>
                        )}
                        {isOpen ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-white border-t-2 border-[var(--black)]">
                        {group.items.map((item) => {
                          const isActive = form.category === item.id;
                          return (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => handleCategorySelect(item.id)}
                              className={`flex flex-col items-start p-2.5 rounded-lg border-2 border-[var(--black)] text-left transition-all cursor-pointer ${
                                isActive
                                  ? "translate-x-[2px] translate-y-[2px]"
                                  : "bg-white shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px]"
                              }`}
                              style={{ background: isActive ? group.color : "#fff" }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: isActive ? "#fff" : "var(--primary)" }}>
                                {item.label}
                              </span>
                              <span className="text-[9px] font-bold mt-0.5" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--black-muted)" }}>
                                {item.desc || "—"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Valor + Taxa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Valor investido</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--black-muted)]">R$</span>
                <input
                  type="number" min="0.01" step="0.01"
                  className={`${inputCls} pl-9`}
                  placeholder="0,00"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Taxa anual (%)</label>
              <div className="relative">
                <input
                  type="number" min="0" max="1000" step="0.01"
                  className={`${inputCls} pr-8`}
                  placeholder="0,00"
                  required
                  value={form.annualRate}
                  onChange={(e) => setForm({ ...form, annualRate: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--black-muted)]">%</span>
              </div>
            </div>
          </div>

          {/* Data de início */}
          <div>
            <label className={labelCls}>Data de início</label>
            <input
              type="date"
              className={inputCls}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>

          {/* Notas */}
          <div>
            <label className={labelCls}>Observações (opcional)</label>
            <input
              className={inputCls}
              placeholder="Ex: Vencimento em dez/2027, liquidez diária..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Projeções preview */}
          {form.amount && Number(form.amount) > 0 && Number(form.annualRate) > 0 && (
            <div>
              <label className={labelCls}>Projeção de rendimento</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: "1 Ano", val: proj1y }, { label: "5 Anos", val: proj5y }, { label: "10 Anos", val: proj10y }].map(({ label, val }) => (
                  <div key={label} className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                    <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-1">{label}</span>
                    <span className="text-sm font-black text-emerald-600">{fmt(val)}</span>
                    <span className="text-[9px] font-bold text-[var(--black-muted)] mt-0.5">
                      +{fmt(val - Number(form.amount))} ({(((val - Number(form.amount)) / Number(form.amount)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t-2 border-[var(--black)] bg-[var(--main-bg)] flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 cursor-pointer">
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving || !form.name || !form.amount || form.annualRate === ""}
            onClick={() => onSave(form)}
            className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-[var(--primary)] text-[var(--secondary)] shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── INVESTMENT CARD ───────────────────────────────────────────────────────────

function InvestmentCard({
  inv,
  onEdit,
  onDelete,
}: {
  inv: ApiInvestment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta    = getCategoryMeta(inv.category);
  const amount  = parseFloat(inv.amount);
  const rate    = parseFloat(inv.annualRate);
  const proj1y  = compound(amount, 0, rate, 12);
  const proj5y  = compound(amount, 0, rate, 60);
  const proj10y = compound(amount, 0, rate, 120);
  const gain1y  = proj1y - amount;
  const pct1y   = (gain1y / amount) * 100;

  return (
    <div className="group relative flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all overflow-hidden">
      {/* colored top strip */}
      <div className="h-1.5 w-full" style={{ background: meta.groupColor }} />

      {/* Action buttons */}
      <div className="absolute top-4 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded-md border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-[var(--secondary)] shadow-[var(--neo-shadow-hover)] cursor-pointer" title="Editar">
          <Pencil size={12} strokeWidth={2.5} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-md border-2 border-[var(--black)] bg-red-500 text-white hover:bg-red-600 shadow-[var(--neo-shadow-hover)] cursor-pointer" title="Excluir">
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-[var(--black)] rounded" style={{ background: meta.groupColor, color: "#fff" }}>
              {meta.label}
            </span>
            <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">{meta.group}</span>
          </div>
          <p className="font-black text-[var(--primary)] tracking-tight leading-snug">{inv.name}</p>
          {inv.notes && <p className="text-[10px] text-[var(--black-muted)] mt-0.5 truncate">{inv.notes}</p>}
        </div>

        {/* Amount + Rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col p-3 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-xl">
            <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Investido</span>
            <span className="text-base font-black text-[var(--primary)] tracking-tighter">{fmt(amount)}</span>
          </div>
          <div className="flex flex-col p-3 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-xl">
            <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Taxa a.a.</span>
            <span className="text-base font-black text-[var(--primary)] tracking-tighter">{rate.toFixed(2)}%</span>
          </div>
        </div>

        {/* Projections */}
        <div>
          <p className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-2">Projeção (juros compostos)</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "1 Ano",   val: proj1y  },
              { label: "5 Anos",  val: proj5y  },
              { label: "10 Anos", val: proj10y },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col p-2.5 border-2 border-[var(--black)] rounded-lg bg-white shadow-[var(--neo-shadow-hover)]">
                <span className="text-[8px] font-black text-[var(--black-muted)] uppercase tracking-wider">{label}</span>
                <span className="text-xs font-black text-emerald-600 mt-0.5">{fmtK(val)}</span>
                <span className="text-[8px] font-bold text-[var(--black-muted)]">
                  +{(((val - amount) / amount) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 1y gain badge */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 border-[var(--black)] ${pct1y >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
          <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">Ganho estimado em 1 ano</span>
          <div className="flex items-center gap-1">
            {pct1y >= 0
              ? <TrendingUp size={12} strokeWidth={2.5} className="text-emerald-600" />
              : <TrendingDown size={12} strokeWidth={2.5} className="text-red-500" />}
            <span className={`text-xs font-black ${pct1y >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {pct1y >= 0 ? "+" : ""}{fmt(gain1y)}
            </span>
          </div>
        </div>

        {/* Start date */}
        <p className="text-[9px] font-bold text-[var(--black-muted)] uppercase tracking-wider -mt-1">
          Desde {new Date(inv.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </p>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export function Investments() {
  const [loading,       setLoading]       = useState(true);
  const [investments,   setInvestments]   = useState<ApiInvestment[]>([]);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingInv,    setEditingInv]    = useState<InvestmentFormData | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<ApiInvestment | null>(null);

  // Calculator state
  const [principal,    setPrincipal]    = useState(10000);
  const [monthly,      setMonthly]      = useState(500);
  const [calcCategory, setCalcCategory] = useState("cdb");
  const [customRate,   setCustomRate]   = useState(10);

  const fetchData = useCallback(() =>
    getInvestments()
      .then(setInvestments)
      .catch(() => toast.error("Erro ao carregar investimentos")),
  []);

  useEffect(() => { fetchData().finally(() => setLoading(false)); }, [fetchData]);

  // ── derived portfolio metrics ──────────────────────────────────────────────

  const totalInvested = useMemo(
    () => investments.reduce((s, i) => s + parseFloat(i.amount), 0),
    [investments]
  );

  const totalProjected1y = useMemo(
    () => investments.reduce((s, i) => s + compound(parseFloat(i.amount), 0, parseFloat(i.annualRate), 12), 0),
    [investments]
  );

  const weightedRate = useMemo(() => {
    if (totalInvested === 0) return 0;
    return investments.reduce((s, i) => s + parseFloat(i.annualRate) * parseFloat(i.amount), 0) / totalInvested;
  }, [investments, totalInvested]);

  const bestInv = useMemo(
    () => investments.reduce<ApiInvestment | null>((best, i) =>
      !best || parseFloat(i.annualRate) > parseFloat(best.annualRate) ? i : best, null),
    [investments]
  );

  const pieData = useMemo(() =>
    investments.map((i) => ({
      name: i.name,
      value: parseFloat(i.amount),
      color: getCategoryMeta(i.category).groupColor,
    })),
  [investments]);

  // ── calculator ────────────────────────────────────────────────────────────

  const calcMeta    = getCategoryMeta(calcCategory);
  const annualRate  = calcCategory === "custom" ? customRate : (calcMeta.defaultRate ?? customRate);

  const calcResults = useMemo(
    () => CALC_PERIODS.map(({ key, months, label, bg, textCls, badge, divider }) => {
      const total    = compound(principal, monthly, annualRate, months);
      const invested = principal + monthly * months;
      const juros    = total - invested;
      const pct      = invested > 0 ? ((total - invested) / invested) * 100 : 0;
      return { key, months, label, bg, textCls, badge, divider, total, invested, juros, pct };
    }),
    [principal, monthly, annualRate]
  );

  const chartData = useMemo(() => genChart(principal, monthly, annualRate), [principal, monthly, annualRate]);

  const CalcTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">{d?.label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Aportado:</span>
            <span className="text-xs font-black text-[var(--primary)]">{fmt(d?.invested)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[10px] font-bold uppercase text-[var(--black-muted)]">Total:</span>
            <span className="text-xs font-black text-[var(--primary)]">{fmt(d?.total)}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t-2 border-[var(--black)] flex justify-between bg-[var(--secondary)] -mx-3 -mb-3 px-3 py-2 rounded-b-md">
          <span className="text-[10px] font-black uppercase text-[var(--primary)]">Juros:</span>
          <span className="text-sm font-black text-[var(--primary)]">{fmt(d?.total - d?.invested)}</span>
        </div>
      </div>
    );
  };

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleSave = async (data: InvestmentFormData) => {
    setSaving(true);
    try {
      if (data.id) {
        await updateInvestment({
          id: data.id,
          name: data.name,
          category: data.category,
          amount: Number(data.amount),
          annualRate: Number(data.annualRate),
          startDate: data.startDate,
          notes: data.notes || undefined,
        });
        toast.success("Investimento atualizado!");
      } else {
        const input: CreateInvestmentInput = {
          name: data.name,
          category: data.category,
          amount: Number(data.amount),
          annualRate: Number(data.annualRate),
          startDate: data.startDate,
          notes: data.notes || undefined,
        };
        await createInvestment(input);
        toast.success("Investimento adicionado!");
      }
      setModalOpen(false);
      setEditingInv(null);
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (inv: ApiInvestment) => {
    setEditingInv({
      id: inv.id,
      name: inv.name,
      category: inv.category,
      amount: parseFloat(inv.amount),
      annualRate: parseFloat(inv.annualRate),
      startDate: inv.startDate.slice(0, 10),
      notes: inv.notes ?? "",
    });
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInvestment(deleteTarget.id);
      toast.success("Investimento removido!");
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover");
    }
  };

  if (loading) return <InvestmentsSkeleton />;

  return (
    <main className="min-h-screen mx-auto space-y-8">

      {/* Modals */}
      <InvestmentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingInv(null); }}
        onSave={handleSave}
        initial={editingInv}
        saving={saving}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Remover investimento</h3>
            <p className="text-sm font-bold text-[var(--black-muted)]">
              Remover <span className="text-[var(--primary)]">{deleteTarget.name}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-red-500 text-white shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer">
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEÇÃO 1 · OVERVIEW ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">

        {/* Carteira total */}
        <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
          <div className="flex flex-col h-full px-6 py-6 relative">
            <span aria-hidden className="pointer-events-none select-none absolute -right-3 -bottom-5 text-[130px] font-black text-[var(--primary)] opacity-[0.06] leading-none tracking-tighter">R$</span>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Carteira Total</h2>
              <div className="p-2 bg-[var(--primary)] border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                <Wallet size={16} strokeWidth={2.5} className="text-[var(--secondary)]" />
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-[10px] font-black text-[var(--primary)] opacity-70 uppercase tracking-widest mb-1">Patrimônio investido</p>
              <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter">
                {investments.length === 0 ? "R$ 0,00" : fmt(totalInvested)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
                <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Rentab. média</span>
                <span className="text-xl font-black text-[var(--primary)]">{weightedRate.toFixed(2)}%</span>
              </div>
              <div className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
                <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Ativos</span>
                <span className="text-xl font-black text-[var(--primary)]">{investments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Melhor ativo */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
          <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">Maior Taxa</h2>
          {bestInv ? (
            <>
              <div className="flex-grow flex flex-col justify-center mb-4">
                <p className="text-[10px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-widest mb-1 truncate">
                  {getCategoryMeta(bestInv.category).label}
                </p>
                <span className="text-base font-black text-[var(--secondary)] tracking-tight leading-snug">{bestInv.name}</span>
                <span className="text-4xl font-black text-[var(--secondary)] tracking-tighter mt-1">
                  {parseFloat(bestInv.annualRate).toFixed(2)}%
                </span>
              </div>
              <div className="pt-4 border-t-2 border-white/20 border-dashed flex justify-between items-center">
                <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">Valor:</span>
                <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]">
                  {fmt(parseFloat(bestInv.amount))}
                </span>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-xs font-bold text-white/50 uppercase text-center">Nenhum investimento ainda</p>
            </div>
          )}
        </div>

        {/* Projeção 1 ano */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-[var(--black-muted)] uppercase tracking-widest">Projeção 1 Ano</h2>
            <div className="p-1.5 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-md shadow-[var(--neo-shadow-hover)]">
              <Sparkles size={13} strokeWidth={3} className="text-[var(--primary)]" />
            </div>
          </div>
          <div className="flex-grow flex items-start">
            <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter leading-none">
              {investments.length === 0 ? "—" : fmtK(totalProjected1y)}
            </span>
          </div>
          {investments.length > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-[var(--black)] border-dashed">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                +{fmt(totalProjected1y - totalInvested)} estimado
              </p>
            </div>
          )}
        </div>

      </section>

      {/* ── SEÇÃO 2 · CALCULADORA ────────────────────────────────────────────── */}
      <section className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">Ferramenta</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Calculator size={26} strokeWidth={2.5} className="text-[var(--secondary)] shrink-0" />
              Calculadora de Rendimentos
            </h2>
          </div>
          <div className="flex flex-col items-end px-5 py-3 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] shrink-0">
            <span className="text-[9px] font-black text-[var(--primary)] opacity-70 uppercase tracking-wider">Taxa anual</span>
            <span className="text-4xl font-black text-[var(--primary)] tracking-tighter leading-none">{annualRate.toFixed(2)}%</span>
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider mt-0.5">{calcMeta.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10">
          {/* Inputs */}
          <div className="lg:col-span-4 p-6 lg:border-r-2 border-b-2 lg:border-b-0 border-[var(--black)] flex flex-col gap-6 bg-[var(--main-bg)]">

            {/* Tipo (flat list for calculator) */}
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-3 block">Tipo de Investimento</label>
              <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {ALL_CATEGORIES.filter(c => c.id !== "custom").slice(0, 15).concat([{ id: "custom", label: "Personalizado", group: "Outros", groupColor: "#FF3B3B", defaultRate: null, desc: "Defina" }]).map((cat) => {
                  const isActive = calcCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCalcCategory(cat.id)}
                      className={`flex flex-col items-start p-2.5 rounded-[var(--radius-main)] border-2 border-[var(--black)] transition-all cursor-pointer ${isActive ? "shadow-[var(--neo-shadow-hover)] translate-y-[2px] translate-x-[2px]" : "bg-white shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]"}`}
                      style={{ background: isActive ? cat.groupColor : "#fff" }}
                    >
                      <span className="text-[9px] font-black uppercase tracking-wide leading-tight" style={{ color: isActive ? "#fff" : "var(--primary)" }}>
                        {cat.label}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: isActive ? "rgba(255,255,255,0.65)" : "var(--black-muted)" }}>
                        {cat.defaultRate ? `${cat.defaultRate}%` : cat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Taxa custom */}
            {(calcCategory === "custom" || !calcMeta.defaultRate) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Taxa Anual (%)</label>
                  <span className="text-sm font-black text-white bg-[#FF3B3B] px-2.5 py-1 border-2 border-[var(--black)] rounded shadow-[var(--neo-shadow-hover)]">{customRate.toFixed(1)}%</span>
                </div>
                <input type="range" min={0.5} max={100} step={0.1} value={customRate} onChange={(e) => setCustomRate(Number(e.target.value))}
                  className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF3B3B] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm" />
              </div>
            )}

            {/* Valor inicial */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Valor Inicial</label>
                <span className="text-sm font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 border-2 border-[var(--black)] rounded shadow-[var(--neo-shadow-hover)]">{fmt(principal)}</span>
              </div>
              <input type="range" min={500} max={500000} step={500} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm" />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$500</span>
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$500K</span>
              </div>
            </div>

            {/* Aporte mensal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Aporte Mensal</label>
                <span className="text-sm font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 border-2 border-[var(--black)] rounded shadow-[var(--neo-shadow-hover)]">{fmt(monthly)}</span>
              </div>
              <input type="range" min={0} max={10000} step={100} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm" />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$0</span>
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$10K/mês</span>
              </div>
            </div>

            {/* Resumo */}
            <div className="mt-auto p-4 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
              <p className="text-[9px] font-black text-[var(--secondary)] uppercase tracking-widest mb-3">Resumo</p>
              {[
                { label: "Valor inicial",        val: fmt(principal) },
                { label: "Aporte/mês",           val: fmt(monthly) },
                { label: "Taxa anual",            val: `${annualRate.toFixed(2)}%` },
                { label: "Total aportado (10a)", val: fmtK(principal + monthly * 120) },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-[var(--main-bg)] opacity-60 uppercase tracking-wider">{label}:</span>
                  <span className="text-[10px] font-black text-[var(--secondary)]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="grid grid-cols-3 border-b-2 border-[var(--black)]">
              {calcResults.map(({ key, label, bg, textCls, badge, divider, total, juros, pct }, i) => (
                <div key={key} className={`${bg} flex flex-col justify-between p-5 ${i < 2 ? "border-r-2 border-[var(--black)]" : ""}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest opacity-70 ${textCls}`}>{label}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 border-2 border-[var(--black)] rounded uppercase tracking-wider shadow-[var(--neo-shadow-hover)] ${badge}`}>
                      +{pct.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-wider opacity-60 mb-0.5 ${textCls}`}>Total Final</p>
                    <span className={`text-2xl font-black tracking-tighter leading-none ${textCls}`}>{fmtK(total)}</span>
                  </div>
                  <div className={`mt-4 pt-3 border-t-2 ${divider} border-dashed`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${textCls}`}>Juros:</span>
                      <span className={`text-xs font-black ${textCls}`}>{fmtK(juros)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 p-6">
              <p className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-4">Curva de Crescimento — Aportado vs Total</p>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#08233e" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#08233e" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="gInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffd100" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#ffd100" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.08} vertical={false} />
                    <XAxis dataKey="label" axisLine={{ stroke: "var(--black)", strokeWidth: 2 }} tickLine={{ stroke: "var(--black)", strokeWidth: 2 }} tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "900" }} dy={8} interval={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "bold" }} tickFormatter={fmtK} />
                    <Tooltip content={<CalcTooltip />} cursor={{ stroke: "var(--black)", strokeWidth: 2, strokeDasharray: "4 4", opacity: 0.4 }} />
                    <Area type="monotone" dataKey="invested" stroke="var(--black)" strokeWidth={2} fill="url(#gInvested)" fillOpacity={1} />
                    <Area type="monotone" dataKey="total" stroke="var(--black)" strokeWidth={3} fill="url(#gTotal)" fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3 · CARTEIRA ───────────────────────────────────────────────── */}
      <section className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">Portfólio</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Meus Investimentos</h2>
          </div>
          <div className="flex items-center gap-3">
            {investments.length > 0 && (
              <div className="flex items-center gap-3 border-r-2 border-white/20 pr-4">
                <PieChart width={44} height={44}>
                  <Pie data={pieData} cx={18} cy={18} innerRadius={8} outerRadius={18} dataKey="value" stroke="#000" strokeWidth={1.5}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
                <div>
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-wider">Total</p>
                  <p className="text-sm font-black text-[var(--secondary)]">{fmt(totalInvested)}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => { setEditingInv(null); setModalOpen(true); }}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Novo investimento
            </button>
          </div>
        </div>

        <div className="p-6">
          {investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                <TrendingUp size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
              </div>
              <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">Nenhum investimento cadastrado</p>
              <p className="text-xs font-bold text-[var(--black-muted)] text-center max-w-xs">
                Adicione seus investimentos para acompanhar o patrimônio e as projeções de rendimento.
              </p>
              <button
                onClick={() => { setEditingInv(null); setModalOpen(true); }}
                className="bg-[var(--primary)] text-[var(--secondary)] px-5 py-2.5 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 shadow-[var(--neo-shadow-hover)] hover:translate-y-[1px] hover:translate-x-[1px] transition-all cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} /> Adicionar primeiro investimento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {investments.map((inv) => (
                <InvestmentCard
                  key={inv.id}
                  inv={inv}
                  onEdit={() => handleEdit(inv)}
                  onDelete={() => setDeleteTarget(inv)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
