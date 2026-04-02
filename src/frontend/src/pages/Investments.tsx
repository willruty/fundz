import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Calculator, Wallet, Sparkles } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ── TIPOS DE INVESTIMENTO ─────────────────────────────────────────────────────

const INVESTMENT_TYPES = [
  { id: "poupanca", label: "Poupança",       rate: 6.17,  color: "#22c55e",  desc: "6,17% a.a."  },
  { id: "cdb",      label: "CDB 100% CDI",   rate: 13.65, color: "#1A6BFF",  desc: "13,65% a.a." },
  { id: "tesouro",  label: "Tesouro Selic",  rate: 13.50, color: "#08233e",  desc: "13,50% a.a." },
  { id: "fiis",     label: "Fundos Imob.",   rate: 12.00, color: "#f97316",  desc: "12,00% a.a." },
  { id: "acoes",    label: "Renda Variável", rate: 15.00, color: "#a855f7",  desc: "~15% a.a."   },
  { id: "custom",   label: "Personalizado",  rate: null,  color: "#FF3B3B",  desc: "Defina"      },
] as const;

// ── PORTFÓLIO MOCK ────────────────────────────────────────────────────────────

const mockPortfolio = [
  { id: 1, name: "Tesouro Selic 2029", type: "Renda Fixa",     value: 15000, annualReturn: 13.50, gainPct:  8.2, sparkline: [3,5,4,6,5,7,8,7,9,8,10,9]  },
  { id: 2, name: "CDB Banco XP",       type: "Renda Fixa",     value:  8500, annualReturn: 14.20, gainPct:  6.1, sparkline: [2,3,3,4,4,5,5,6,6,7,7,8]   },
  { id: 3, name: "IVVB11",             type: "Renda Variável", value:  6000, annualReturn: 18.50, gainPct: 12.3, sparkline: [4,5,3,6,5,8,7,9,8,10,9,11]  },
  { id: 4, name: "PETR4",              type: "Ações",          value:  3200, annualReturn: 22.00, gainPct: -3.8, sparkline: [8,7,6,7,5,6,4,5,3,4,3,2]   },
  { id: 5, name: "Bitcoin",            type: "Cripto",         value:  2800, annualReturn: 45.00, gainPct: 25.1, sparkline: [2,4,3,7,5,9,6,11,8,13,10,15]},
  { id: 6, name: "FII XPML11",         type: "FII",            value:  4200, annualReturn: 12.00, gainPct:  5.4, sparkline: [4,4,5,5,5,6,6,6,7,7,7,8]   },
];

const PORTFOLIO_COLORS: Record<string, string> = {
  "Renda Fixa":     "#08233e",
  "Renda Variável": "#a855f7",
  "Ações":          "#FF3B3B",
  "Cripto":         "#f97316",
  "FII":            "#22c55e",
};

const PERIODS = [
  { key: "6m",  months: 6,   label: "6 Meses", bg: "bg-white",              textCls: "text-[var(--primary)]", badge: "bg-[var(--secondary)] text-[var(--primary)]", divider: "border-[var(--black)]" },
  { key: "1a",  months: 12,  label: "1 Ano",   bg: "bg-[var(--secondary)]", textCls: "text-[var(--primary)]", badge: "bg-[var(--primary)] text-[var(--secondary)]", divider: "border-[var(--black)]" },
  { key: "5a",  months: 60,  label: "5 Anos",  bg: "bg-[var(--primary)]",   textCls: "text-white",            badge: "bg-[var(--secondary)] text-[var(--primary)]", divider: "border-white/20"        },
  { key: "10a", months: 120, label: "10 Anos", bg: "bg-[var(--primary)]",   textCls: "text-white",            badge: "bg-[#FF3B3B] text-white",                     divider: "border-white/20"        },
] as const;

// ── MATEMÁTICA ────────────────────────────────────────────────────────────────

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
      label:    m === 0 ? "Hoje" : m % 12 === 0 ? `${m / 12}a` : `${m}m`,
      invested: Math.round(P + PMT * m),
      total:    Math.round(compound(P, PMT, annualRate, m)),
    });
  }
  return pts;
}

// ── UTILITÁRIOS ───────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtK = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(0)}K`;
  return fmt(v);
};

// ── COMPONENTE ────────────────────────────────────────────────────────────────

export function Investments() {
  const [principal,    setPrincipal]    = useState(10000);
  const [monthly,      setMonthly]      = useState(500);
  const [selectedType, setSelectedType] = useState<string>("cdb");
  const [customRate,   setCustomRate]   = useState(10);

  const currentType = INVESTMENT_TYPES.find((t) => t.id === selectedType)!;
  const annualRate  = selectedType === "custom" ? customRate : (currentType.rate ?? 10);

  const results = useMemo(
    () =>
      PERIODS.map(({ key, months, label, bg, textCls, badge, divider }) => {
        const total    = compound(principal, monthly, annualRate, months);
        const invested = principal + monthly * months;
        const juros    = total - invested;
        const pct      = invested > 0 ? ((total - invested) / invested) * 100 : 0;
        return { key, months, label, bg, textCls, badge, divider, total, invested, juros, pct };
      }),
    [principal, monthly, annualRate],
  );

  const chartData = useMemo(() => genChart(principal, monthly, annualRate), [principal, monthly, annualRate]);

  // Métricas de overview
  const totalInvested = mockPortfolio.reduce((s, a) => s + a.value, 0);
  const avgGain       = mockPortfolio.reduce((s, a) => s + a.gainPct * a.value, 0) / totalInvested;
  const bestAsset     = [...mockPortfolio].sort((a, b) => b.gainPct - a.gainPct)[0];
  const result10a     = results.find((r) => r.key === "10a")!;
  const pieData       = mockPortfolio.map((a) => ({ name: a.name, value: a.value, color: PORTFOLIO_COLORS[a.type] ?? "#ccc" }));

  const CalcTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 min-w-[180px]">
        <p className="text-[10px] font-black uppercase text-[var(--black-muted)] mb-2 border-b-2 border-[var(--black)] border-dashed pb-1">
          {d?.label}
        </p>
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

  return (
    <main className="min-h-screen mx-auto space-y-8">

      {/* ── SEÇÃO 1 · OVERVIEW (4 cols) ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">

        {/* Carteira — col-span-2, amarelo, CommitmentCard */}
        <div className="lg:col-span-2 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="flex flex-col h-full px-6 py-6 relative">
            <span aria-hidden className="pointer-events-none select-none absolute -right-3 -bottom-5 text-[130px] font-black text-[var(--primary)] opacity-[0.06] leading-none tracking-tighter">
              R$
            </span>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Carteira Total</h2>
              <div className="p-2 bg-[var(--primary)] border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                <Wallet size={16} strokeWidth={2.5} className="text-[var(--secondary)]" />
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-[10px] font-black text-[var(--primary)] opacity-70 uppercase tracking-widest mb-1">Patrimônio atual</p>
              <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter">{fmt(totalInvested)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors">
                <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Rentab. média</span>
                <span className="text-xl font-black text-[var(--primary)]">{avgGain.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col p-3 bg-white border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-colors">
                <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Ativos</span>
                <span className="text-xl font-black text-[var(--primary)]">{mockPortfolio.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Melhor Ativo — primary */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">Melhor Ativo</h2>
          <div className="flex-grow flex flex-col justify-center mb-4">
            <p className="text-[10px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-widest mb-1 truncate">{bestAsset.type}</p>
            <span className="text-base font-black text-[var(--secondary)] tracking-tight leading-snug">{bestAsset.name}</span>
            <span className="text-4xl font-black text-[var(--secondary)] tracking-tighter mt-1">+{bestAsset.gainPct}%</span>
          </div>
          <div className="pt-4 border-t-2 border-white/20 border-dashed flex justify-between items-center">
            <span className="text-[10px] font-black text-[var(--main-bg)] opacity-70 uppercase tracking-wider">Valor:</span>
            <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)]">{fmt(bestAsset.value)}</span>
          </div>
        </div>

        {/* Projeção 10a — branco */}
        <div className="lg:col-span-1 flex flex-col w-full h-full p-6 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-[var(--black-muted)] uppercase tracking-widest">Projeção 10a</h2>
            <div className="p-1.5 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-md shadow-[var(--neo-shadow-hover)]">
              <Sparkles size={13} strokeWidth={3} className="text-[var(--primary)]" />
            </div>
          </div>
          <div className="flex-grow flex items-start">
            <span className="text-4xl md:text-5xl font-black text-[var(--primary)] tracking-tighter leading-none drop-shadow-sm">
              {fmtK(result10a.total)}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-[var(--black)] border-dashed">
            <p className="text-[10px] font-bold text-[var(--black-light)] uppercase tracking-wider leading-relaxed">
              Com aportes mensais — conforme calculadora
            </p>
          </div>
        </div>

      </section>

      {/* ── SEÇÃO 2 · CALCULADORA (hero) ─────────────────────────────────────── */}
      <section className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">

        {/* Header */}
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">Ferramenta Principal</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Calculator size={26} strokeWidth={2.5} className="text-[var(--secondary)] shrink-0" />
              Calculadora de Rendimentos
            </h2>
            <p className="text-[10px] font-bold text-[var(--main-bg)] opacity-60 uppercase tracking-widest mt-1">
              Juros compostos · Aporte mensal · Projeção de patrimônio
            </p>
          </div>
          {/* Taxa em destaque */}
          <div className="flex flex-col items-end px-5 py-3 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)] shrink-0">
            <span className="text-[9px] font-black text-[var(--primary)] opacity-70 uppercase tracking-wider">Taxa anual selecionada</span>
            <span className="text-4xl font-black text-[var(--primary)] tracking-tighter leading-none">{annualRate.toFixed(2)}%</span>
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider mt-0.5">{currentType.label}</span>
          </div>
        </div>

        {/* Corpo: inputs (esq) + resultados (dir) */}
        <div className="grid grid-cols-1 lg:grid-cols-10">

          {/* ── INPUTS ─────────────────────────────────────────── */}
          <div className="lg:col-span-4 p-6 lg:border-r-2 border-b-2 lg:border-b-0 border-[var(--black)] flex flex-col gap-6 bg-[var(--main-bg)]">

            {/* Tipo */}
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-3 block">
                Tipo de Investimento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INVESTMENT_TYPES.map((type) => {
                  const isActive = selectedType === type.id;
                  const isDark = !["#22c55e"].includes(type.color);
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-start p-3 rounded-[var(--radius-main)] border-2 border-[var(--black)] transition-all cursor-pointer ${
                        isActive
                          ? "shadow-[var(--neo-shadow-hover)] translate-y-[2px] translate-x-[2px]"
                          : "bg-white shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]"
                      }`}
                      style={{ background: isActive ? type.color : "#fff" }}
                    >
                      <span
                        className="text-[9px] font-black uppercase tracking-wide leading-tight"
                        style={{ color: isActive ? (isDark ? "#fff" : "#08233e") : "var(--primary)" }}
                      >
                        {type.label}
                      </span>
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider mt-0.5"
                        style={{ color: isActive ? (isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.5)") : "var(--black-muted)" }}
                      >
                        {type.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Taxa custom */}
            {selectedType === "custom" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Taxa Anual (%)</label>
                  <span className="text-sm font-black text-white bg-[#FF3B3B] px-2.5 py-1 border-2 border-[var(--black)] rounded shadow-[var(--neo-shadow-hover)]">{customRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range" min={0.5} max={50} step={0.1}
                  value={customRate}
                  onChange={(e) => setCustomRate(Number(e.target.value))}
                  className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF3B3B] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">0,5%</span>
                  <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">50%</span>
                </div>
              </div>
            )}

            {/* Valor inicial */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Valor Inicial</label>
                <span className="text-sm font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 border-2 border-[var(--black)] rounded shadow-[var(--neo-shadow-hover)]">{fmt(principal)}</span>
              </div>
              <input
                type="range" min={500} max={500000} step={500}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm"
              />
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
              <input
                type="range" min={0} max={10000} step={100}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full h-3 appearance-none bg-white border-2 border-[var(--black)] rounded-sm cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--black)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$0</span>
                <span className="text-[9px] font-bold text-[var(--black-muted)] uppercase">R$10K/mês</span>
              </div>
            </div>

            {/* Resumo */}
            <div className="mt-auto p-4 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-main)] shadow-[var(--neo-shadow-hover)]">
              <p className="text-[9px] font-black text-[var(--secondary)] uppercase tracking-widest mb-3">Resumo da Simulação</p>
              {[
                { label: "Valor inicial",        val: fmt(principal)                  },
                { label: "Aporte/mês",           val: fmt(monthly)                    },
                { label: "Taxa anual",            val: `${annualRate.toFixed(2)}%`     },
                { label: "Total aportado (10a)", val: fmtK(principal + monthly * 120) },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-[var(--main-bg)] opacity-60 uppercase tracking-wider">{label}:</span>
                  <span className="text-[10px] font-black text-[var(--secondary)]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RESULTADOS ─────────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col">

            {/* 4 cards de resultado */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b-2 border-[var(--black)]">
              {results.map(({ key, label, bg, textCls, badge, divider, total, juros, pct }, i) => (
                <div
                  key={key}
                  className={`${bg} flex flex-col justify-between p-5 ${i < 3 ? "border-r-2 border-[var(--black)]" : ""} transition-all duration-300`}
                >
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
                      <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${textCls}`}>Juros gerado:</span>
                      <span className={`text-xs font-black ${textCls}`}>{fmtK(juros)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfico de curva de crescimento */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest">Curva de Crescimento</p>
                  <p className="text-[9px] font-bold text-[var(--black-light)] uppercase tracking-wider">Aportado vs Total com Juros Compostos</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--secondary)]" />
                    <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">Aportado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] bg-[var(--primary)]" />
                    <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">Total</span>
                  </div>
                </div>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#08233e" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#08233e" stopOpacity={0.2}  />
                      </linearGradient>
                      <linearGradient id="gInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#ffd100" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#ffd100" stopOpacity={0.3}  />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--black)" strokeOpacity={0.08} vertical={false} />
                    <XAxis
                      dataKey="label"
                      axisLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                      tickLine={{ stroke: "var(--black)", strokeWidth: 2 }}
                      tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "900" }}
                      dy={8} interval={5}
                    />
                    <YAxis
                      axisLine={false} tickLine={false}
                      tick={{ fill: "var(--black-muted)", fontSize: 10, fontWeight: "bold" }}
                      tickFormatter={fmtK}
                    />
                    <Tooltip
                      content={<CalcTooltip />}
                      cursor={{ stroke: "var(--black)", strokeWidth: 2, strokeDasharray: "4 4", opacity: 0.4 }}
                    />
                    <Area type="monotone" dataKey="invested" stroke="var(--black)" strokeWidth={2} fill="url(#gInvested)" fillOpacity={1} />
                    <Area type="monotone" dataKey="total"    stroke="var(--black)" strokeWidth={3} fill="url(#gTotal)"    fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3 · CARTEIRA DE ATIVOS ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest">Alocação</p>
            <h2 className="text-xl font-black text-[var(--primary)] uppercase tracking-tighter">Carteira de Ativos</h2>
          </div>
          <div className="flex items-center gap-4">
            <PieChart width={52} height={52}>
              <Pie data={pieData} cx={22} cy={22} innerRadius={10} outerRadius={22} dataKey="value" stroke="#000" strokeWidth={1.5}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div className="text-right border-l-2 border-[var(--black)] pl-4">
              <p className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">Total alocado</p>
              <p className="text-lg font-black text-[var(--primary)] tracking-tighter">{fmt(totalInvested)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockPortfolio.map((asset) => {
            const isPositive = asset.gainPct >= 0;
            const accent     = PORTFOLIO_COLORS[asset.type] ?? "#08233e";
            const allocPct   = Math.round((asset.value / totalInvested) * 100);
            const maxSpark   = Math.max(...asset.sparkline);

            return (
              <div
                key={asset.id}
                className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]"
              >
                {/* Header colorido */}
                <div className="px-5 py-3 border-b-2 border-[var(--black)] flex justify-between items-center" style={{ background: accent }}>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-90">{asset.type}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 border-2 border-[var(--black)] rounded uppercase tracking-wider ${isPositive ? "bg-[var(--secondary)] text-[var(--primary)]" : "bg-[#FF3B3B] text-white"}`}>
                    {isPositive ? "+" : ""}{asset.gainPct}%
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="text-sm font-black text-[var(--primary)] uppercase tracking-tight leading-tight">{asset.name}</h3>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider mb-0.5">Valor atual</p>
                      <span className="text-2xl font-black text-[var(--primary)] tracking-tighter leading-none">{fmt(asset.value)}</span>
                    </div>
                    {/* Sparkline */}
                    <div className="flex items-end gap-0.5 h-9">
                      {asset.sparkline.map((v, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-sm"
                          style={{
                            height:     `${(v / maxSpark) * 100}%`,
                            background: isPositive ? accent : "#FF3B3B",
                            border:     "1px solid black",
                            opacity:    0.5 + (i / asset.sparkline.length) * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Barra de alocação */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">Alocação na carteira</span>
                      <span className="text-[9px] font-black text-[var(--primary)] uppercase">{allocPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-sm overflow-hidden">
                      <div
                        className="h-full border-r-2 border-[var(--black)] transition-all duration-700"
                        style={{ width: `${allocPct}%`, background: accent }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t-2 border-[var(--black)] border-dashed mt-auto">
                    <div className="flex items-center gap-1.5">
                      {isPositive
                        ? <TrendingUp size={11} strokeWidth={3} className="text-emerald-500" />
                        : <TrendingDown size={11} strokeWidth={3} className="text-red-500" />}
                      <span className="text-[9px] font-black text-[var(--black-muted)] uppercase tracking-wider">Rentab./ano</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-[var(--black)] rounded uppercase tracking-wider ${isPositive ? "bg-emerald-400 text-[var(--primary)]" : "bg-red-400 text-white"}`}>
                      {asset.annualReturn}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}
