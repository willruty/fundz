import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Lock,
  ShieldAlert,
  KeyRound,
  BarChart3,
  CreditCard,
  TrendingUp,
  ArrowDownRight,
  Zap,
  Bell,
  PiggyBank,
  Wallet,
  Sparkles,
  ChevronRight,
  Check,
  X,
  Star,
  Plane,
  Beer,
  Briefcase,
  Calculator,
  Eye,
  RefreshCw,
  ArrowUpRight,
  Coffee,
  Gamepad2,
  Music2,
  ShoppingBag,
  Flame,
} from "lucide-react";

// ─── Primitives ───────────────────────────────────────────────────────────────

function Tag({ children, color = "yellow" }: { children: React.ReactNode; color?: "yellow" | "blue" | "green" | "red" }) {
  const map = {
    yellow: "bg-[#FFD100] text-[#08233E] border-[#08233E]",
    blue:   "bg-[#08233E] text-[#FFD100] border-[#08233E]",
    green:  "bg-emerald-400 text-white border-[#08233E]",
    red:    "bg-red-500 text-white border-[#08233E]",
  };
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 rounded-md ${map[color]}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#FFD100] border-2 border-[#08233E] px-4 py-2 rounded-md shadow-[3px_3px_0px_0px_rgba(8,35,62,1)] mb-6">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#08233E]">{children}</span>
    </div>
  );
}

// ─── Persona Tabs ─────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    key: "roleiro",
    icon: <Beer size={20} strokeWidth={2.5} />,
    label: "O Roleiro",
    tagline: "Quer curtir sem culpa",
    desc: "Você não vai abrir mão do show de quinta, do bar de sexta e do brunch de domingo. Tudo bem. O Fundz cria um orçamento de lazer dedicado pra você curtir sem travar a poupança.",
    features: ["Budget de lazer separado", "Alerta quando bater o limite", "Divisão de rolê com amigos"],
    mockColor: "#820AD1",
    emoji: "🍺",
  },
  {
    key: "investidor",
    icon: <TrendingUp size={20} strokeWidth={2.5} />,
    label: "O Investidor",
    tagline: "Quer fazer o dinheiro trabalhar",
    desc: "CDB, Tesouro, Fundo Imobiliário, Renda Variável. A calculadora de rendimentos do Fundz mostra exatamente quanto R$500/mês vira em 10 anos em cada tipo de investimento.",
    features: ["Calculadora de juros compostos", "Comparador de tipos de investimento", "Projeção até 10 anos"],
    mockColor: "#08233E",
    emoji: "📈",
  },
  {
    key: "freela",
    icon: <Briefcase size={20} strokeWidth={2.5} />,
    label: "O Freela / MEI",
    tagline: "Renda variável, gastos fixos",
    desc: "Mês que você fatura R$8k, mês que fatura R$3k. O Fundz te ajuda a normalizar sua renda, não esquecer o DAS do MEI e separar o dinheiro da empresa do seu pessoal.",
    features: ["Separação PF e PJ", "Lembretes de impostos (DAS)", "Projeção com renda variável"],
    mockColor: "#f97316",
    emoji: "💻",
  },
  {
    key: "estudante",
    icon: <Coffee size={20} strokeWidth={2.5} />,
    label: "O Estudante",
    tagline: "Bolsa curta, sonhos grandes",
    desc: "R$1300 de estágio pra fazer durar 30 dias é missão difícil. O Fundz divide automaticamente por categorias, mostra onde você está gastando mais e te dá uma previsão do dia 30.",
    features: ["Divisão automática por categoria", "Previsão até o fim do mês", "Metas de curto prazo"],
    mockColor: "#22c55e",
    emoji: "🎓",
  },
];

// ─── Features Grid ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <BarChart3 size={28} strokeWidth={2} />,
    title: "Dashboard Inteligente",
    desc: "Visão completa da sua vida financeira em tempo real. Gráficos que fazem sentido, não tabelas que dão sono.",
    tag: "Core",
    tagColor: "blue" as const,
    bg: "bg-white",
    size: "col-span-1",
  },
  {
    icon: <Calculator size={28} strokeWidth={2} />,
    title: "Calculadora de Rendimentos",
    desc: "Simule quanto R$500/mês rende em Poupança, CDB, Tesouro e Renda Variável. Veja o poder dos juros compostos em 6m, 1a, 5a e 10a.",
    tag: "Exclusivo",
    tagColor: "yellow" as const,
    bg: "bg-[#08233E]",
    textWhite: true,
    size: "col-span-1 md:col-span-2",
  },
  {
    icon: <Bell size={28} strokeWidth={2} />,
    title: "Alertas Antes da Dor",
    desc: "Notificação quando você está chegando no limite do orçamento. Chega de surpresa na fatura.",
    tag: "Smart",
    tagColor: "green" as const,
    bg: "bg-white",
    size: "col-span-1",
  },
  {
    icon: <RefreshCw size={28} strokeWidth={2} />,
    title: "Radar de Assinaturas",
    desc: "Descubra quanto você paga em assinaturas esquecidas todo mês. Netflix, Spotify, aquele app de meditação que você abre duas vezes por ano...",
    tag: "Favorito",
    tagColor: "red" as const,
    bg: "bg-[#FFD100]",
    size: "col-span-1",
  },
  {
    icon: <Target size={28} strokeWidth={2} />,
    title: "Metas com Prazo Real",
    desc: "Defina qualquer meta (viagem, PC Gamer, entrada do apê) e o Fundz calcula automaticamente quanto guardar por mês pra chegar lá.",
    tag: "Core",
    tagColor: "blue" as const,
    bg: "bg-white",
    size: "col-span-1 md:col-span-2",
  },
  {
    icon: <Wallet size={28} strokeWidth={2} />,
    title: "Multi-Contas",
    desc: "Nubank, Itaú, C6, inter. Todos os saldos num lugar só, sem precisar ficar abrindo app por app.",
    tag: "Pro",
    tagColor: "yellow" as const,
    bg: "bg-white",
    size: "col-span-1",
  },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  "Dashboard completo",
  "Controle de até 2 contas",
  "Metas básicas",
  "Histórico de 3 meses",
  "Alertas de limite",
];

const FREE_MISSING = [
  "Calculadora de rendimentos",
  "Radar de assinaturas",
  "Multi-contas ilimitadas",
  "Relatórios avançados",
  "Previsão por IA",
];

const PRO_FEATURES = [
  "Tudo do Grátis",
  "Calculadora de rendimentos",
  "Radar de assinaturas",
  "Multi-contas ilimitadas",
  "Histórico completo",
  "Relatórios avançados",
  "Previsão de gastos por IA",
  "Exportação em PDF/Excel",
  "Suporte prioritário",
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Larissa M.",
    role: "Estudante de Design, 22 anos",
    text: "Descobri que gastava R$340/mês em assinaturas que nem usava. Em 3 meses já pagou muito mais do que o plano Pro.",
    stars: 5,
    color: "#820AD1",
    initials: "LM",
  },
  {
    name: "Rafael K.",
    role: "Dev Freela, 25 anos",
    text: "A calculadora de investimentos foi o que me convenceu. Ver que R$500/mês vira R$112k em 10 anos no CDB me fez começar de verdade.",
    stars: 5,
    color: "#08233E",
    initials: "RK",
  },
  {
    name: "Ana P.",
    role: "Analista Júnior, 23 anos",
    text: "Finalmente consigo guardar para a Europa sem passar sufoco. A meta com prazo calculado mudou minha relação com dinheiro.",
    stars: 5,
    color: "#f97316",
    initials: "AP",
  },
  {
    name: "Gui F.",
    role: "MEI Fotógrafo, 27 anos",
    text: "Minha renda era completamente bagunçada. O Fundz me ajudou a entender quanto de fato eu tenho disponível depois de separar os impostos.",
    stars: 5,
    color: "#22c55e",
    initials: "GF",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState("roleiro");
  const persona = PERSONAS.find((p) => p.key === activePersona)!;

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-manrope text-[#08233E] overflow-x-hidden">

      {/* ── 1. NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white border-4 border-[#08233E] p-3 px-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] pointer-events-auto">
          <img
            src="/blue-logo.png"
            alt="Fundz"
            className="h-8 md:h-9 w-auto object-contain cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:block bg-transparent text-[#08233E] px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest border-2 border-[#08233E] hover:bg-[#08233E] hover:text-white transition-all cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#08233E] text-[#FFD100] px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest border-2 border-[#08233E] shadow-[4px_4px_0px_0px_rgba(255,209,0,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all cursor-pointer"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-8 flex items-center bg-[#08233E] overflow-hidden">
        {/* geo shapes */}
        <div className="absolute top-24 left-8 w-28 h-28 bg-[#FFD100] border-4 border-white/20 opacity-30 rotate-12" />
        <div className="absolute bottom-16 right-[42%] w-48 h-12 bg-emerald-400 rotate-[-30deg] border-4 border-white/20 opacity-20" />
        <div className="absolute top-1/3 right-16 w-40 h-40 rounded-full border-4 border-white/10 opacity-20" />
        <div className="absolute bottom-32 left-[30%] w-16 h-16 bg-[#FFD100] border-4 border-white/20 opacity-15 rotate-45" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div className="space-y-8 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD100] text-[#08233E] text-[10px] font-black uppercase tracking-widest px-4 py-2 border-4 border-white rounded-md shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-[-2deg]">
                Gestão financeira sem frescura
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Beta Aberto</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[82px] font-black leading-[0.88] tracking-tighter uppercase">
              Seu dinheiro.{" "}
              <br />
              Seu rolê.{" "}
              <br />
              <span className="relative text-[#FFD100]">
                Seu controle.
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#FFD100] opacity-30 rounded-sm" />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 max-w-lg font-bold leading-relaxed">
              O app de finanças feito para quem quer{" "}
              <span className="text-[#FFD100] font-black">ir ao show na quinta</span>,{" "}
              <span className="text-[#FFD100] font-black">guardar pra Europa</span> e{" "}
              <span className="text-[#FFD100] font-black">ainda investir</span> no mesmo mês.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="bg-[#FFD100] text-[#08233E] px-10 py-5 rounded-xl border-4 border-white font-black text-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-y-[8px] hover:translate-x-[8px] transition-all uppercase tracking-tight flex items-center gap-3 cursor-pointer"
              >
                Começar grátis <ArrowRight strokeWidth={3} size={22} />
              </button>
              <button className="flex items-center gap-2 text-white/60 font-black text-sm uppercase tracking-widest hover:text-white transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 transition-all">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
                Ver demo
              </button>
            </div>

            {/* social proof mini */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex -space-x-3">
                {["#820AD1","#f97316","#22c55e","#08233E"].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#08233E] flex items-center justify-center text-white text-[10px] font-black" style={{ background: c, zIndex: 4 - i }}>
                    {["LM","RK","AP","GF"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#FFD100" className="text-[#FFD100]" />)}
                </div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-0.5">+2.400 usuários ativos</p>
              </div>
            </div>
          </div>

          {/* Right: UI mockup collage */}
          <div className="relative hidden lg:block h-[620px] w-full">

            {/* Main card: saldo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-3xl border-4 border-[#08233E] shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] p-6 z-20 hover:-translate-y-[calc(50%+6px)] transition-transform duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b-4 border-dashed border-[#08233E]">
                <img src="/blue-logo.png" alt="" className="h-6" />
                <span className="px-3 py-1 bg-[#08233E] text-[#FFD100] text-[9px] font-black uppercase rounded-md">Março 2026</span>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Saldo disponível</p>
              <div className="text-5xl font-black text-[#08233E] tracking-tighter mb-5">
                R$ 1.850<span className="text-xl text-gray-300">,00</span>
              </div>
              <div className="space-y-2.5">
                <div className="bg-emerald-50 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-xs uppercase flex items-center gap-2">💰 Bolsa Estágio</span>
                  <span className="font-black text-emerald-600 text-sm">+ R$1.300</span>
                </div>
                <div className="bg-red-50 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-xs uppercase flex items-center gap-2">📄 DAS MEI</span>
                  <span className="font-black text-red-500 text-sm">- R$75</span>
                </div>
                <div className="bg-yellow-50 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-xs uppercase flex items-center gap-2">🎯 Meta Europa</span>
                  <span className="font-black text-[#08233E] text-sm">45%</span>
                </div>
              </div>
            </div>

            {/* Floating: Meta */}
            <div className="absolute top-[6%] right-[2%] w-[220px] bg-[#FFD100] rounded-2xl border-4 border-[#08233E] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.6)] p-4 z-30 rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white p-2 rounded-lg border-2 border-[#08233E]">
                  <Plane size={18} className="text-[#08233E]" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-[#08233E] uppercase opacity-60">Meta</p>
                  <p className="font-black text-sm text-[#08233E] uppercase leading-tight">Eurotrip 2026</p>
                </div>
              </div>
              <div className="w-full h-3 bg-white border-2 border-[#08233E] rounded-full overflow-hidden mb-1">
                <div className="w-[45%] h-full bg-emerald-400 border-r-2 border-[#08233E]" />
              </div>
              <p className="text-[9px] font-black text-[#08233E] text-right uppercase">45% · R$4.500 / R$10k</p>
            </div>

            {/* Floating: Alerta */}
            <div className="absolute bottom-[22%] left-[-2%] w-[210px] bg-[#08233E] rounded-2xl border-4 border-[#08233E] shadow-[8px_8px_0px_0px_rgba(255,209,0,1)] p-4 z-30 -rotate-4 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} className="text-[#FFD100]" strokeWidth={3} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Alerta Fundz</span>
              </div>
              <p className="text-sm font-black text-white leading-tight">
                Budget de lazer 83% usado.
              </p>
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mt-1">Faltam R$85 até o limite</p>
            </div>

            {/* Floating: rendimento */}
            <div className="absolute bottom-[8%] right-[5%] w-[190px] bg-white rounded-2xl border-4 border-[#08233E] shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] p-4 z-10 rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-emerald-500" strokeWidth={3} />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">CDB 100% CDI</span>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase">R$500/mês em 10 anos</p>
              <p className="text-2xl font-black text-emerald-600 tracking-tighter">R$112k</p>
              <p className="text-[8px] font-black text-emerald-500 uppercase">+R$52k de rendimento</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. MARQUEE ────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FFD100] border-y-4 border-[#08233E] py-4 overflow-hidden">
        <div className="animate-marquee flex gap-10 items-center text-[#08233E] font-black text-xl uppercase tracking-widest whitespace-nowrap">
          {[
            "• CHEGA DE PLANILHA CHATA",
            "• CONTROLE SEU DINHEIRO",
            "• FOQUE NO ROLÊ",
            "• INVISTA DE VERDADE",
            "• BATA SUAS METAS",
            "• SEM FRESCURA",
            "• FEITO PRA VOCÊ",
            "• CHEGA DE PLANILHA CHATA",
            "• CONTROLE SEU DINHEIRO",
            "• FOQUE NO ROLÊ",
            "• INVISTA DE VERDADE",
            "• BATA SUAS METAS",
            "• SEM FRESCURA",
            "• FEITO PRA VOCÊ",
          ].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── 4. NÚMEROS QUE IMPRESSIONAM ───────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-[#08233E] rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(8,35,62,1)]">
          {[
            { number: "2.400+", label: "Usuários ativos",      color: "bg-[#08233E] text-white",   numColor: "text-[#FFD100]" },
            { number: "R$4,2M", label: "Controlados/mês",      color: "bg-[#FFD100]",               numColor: "text-[#08233E]" },
            { number: "87%",    label: "Batem suas metas",      color: "bg-white",                  numColor: "text-[#08233E]" },
            { number: "R$340",  label: "Poupados no 1º mês",   color: "bg-emerald-400 text-white",  numColor: "text-white" },
          ].map(({ number, label, color, numColor }, i) => (
            <div
              key={i}
              className={`${color} p-8 flex flex-col items-center text-center ${i < 3 ? "border-r-2 border-[#08233E]" : ""} border-b-2 md:border-b-0 last:border-b-0`}
            >
              <span className={`text-5xl md:text-6xl font-black tracking-tighter ${numColor}`}>{number}</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PARA QUEM É VOCÊ? (Personas) ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,35,62,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(8,35,62,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SectionLabel>Para quem é?</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              O Fundz é feito pra{" "}
              <span className="bg-[#08233E] text-[#FFD100] px-3 rounded-lg">você.</span>
            </h2>
            <p className="text-lg font-bold text-gray-500 mt-4 max-w-xl mx-auto">
              Não importa onde você está na jornada financeira — temos tudo o que você precisa.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PERSONAS.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePersona(p.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-black text-sm uppercase tracking-wide transition-all cursor-pointer ${
                  activePersona === p.key
                    ? "bg-[#08233E] text-[#FFD100] border-[#08233E] shadow-[4px_4px_0px_0px_rgba(255,209,0,1)]"
                    : "bg-white text-[#08233E] border-[#08233E] hover:bg-[#08233E] hover:text-[#FFD100]"
                }`}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="bg-white border-4 border-[#08233E] rounded-3xl p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(8,35,62,1)] transition-all duration-300">
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl border-4 border-[#08233E] flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] flex-shrink-0"
                  style={{ background: persona.mockColor }}
                >
                  {persona.emoji}
                </div>
                <div>
                  <Tag color="blue">{persona.label}</Tag>
                  <h3 className="text-3xl font-black text-[#08233E] uppercase tracking-tighter mt-2 leading-none">
                    {persona.tagline}
                  </h3>
                </div>
              </div>
              <p className="text-base font-bold text-gray-600 leading-relaxed mb-8">
                {persona.desc}
              </p>
              <div className="space-y-3">
                {persona.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#FFFAF0] border-2 border-[#08233E] rounded-xl px-4 py-3">
                    <div className="w-6 h-6 rounded-md bg-[#FFD100] border-2 border-[#08233E] flex items-center justify-center flex-shrink-0">
                      <Check size={13} strokeWidth={3} className="text-[#08233E]" />
                    </div>
                    <span className="font-black text-sm uppercase text-[#08233E]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* visual mockup por persona */}
            <div
              className="relative h-[400px] rounded-3xl border-4 border-[#08233E] overflow-hidden shadow-[12px_12px_0px_0px_rgba(8,35,62,1)] flex items-center justify-center"
              style={{ background: persona.mockColor }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-24 h-24 border-4 border-white rounded-full" />
                <div className="absolute bottom-8 right-8 w-40 h-40 border-4 border-white" />
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rotate-45" />
              </div>
              <div className="relative z-10 text-center p-8">
                <div className="text-8xl mb-4">{persona.emoji}</div>
                <p className="text-white font-black text-2xl uppercase tracking-tighter leading-tight">
                  {persona.tagline}
                </p>
                <p className="text-white/60 font-bold text-sm mt-2 uppercase tracking-wider">
                  {persona.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. COMO FUNCIONA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#08233E] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-48 h-48 border-4 border-white" />
          <div className="absolute bottom-20 right-32 w-32 h-32 rounded-full border-4 border-white" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SectionLabel>Como funciona</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#FFD100] leading-none">
              3 passos. <span className="text-white">Sem enrolação.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* linha conectando os steps */}
            <div className="hidden md:block absolute top-16 left-[22%] right-[22%] h-0.5 bg-[#FFD100] opacity-30 z-0" />

            {[
              {
                num: "01",
                icon: <PiggyBank size={28} strokeWidth={2} />,
                title: "Cadastre suas contas",
                desc: "Adicione seus bancos, carteiras e contas manualmente. Zero integração obrigatória — sua privacidade 100% intacta.",
                bg: "bg-[#FFD100]",
                textColor: "text-[#08233E]",
              },
              {
                num: "02",
                icon: <Eye size={28} strokeWidth={2} />,
                title: "Veja tudo no dashboard",
                desc: "Todos os seus gastos, metas, investimentos e assinaturas numa tela só. Visual, sem enrolação.",
                bg: "bg-white",
                textColor: "text-[#08233E]",
              },
              {
                num: "03",
                icon: <Zap size={28} strokeWidth={2} />,
                title: "Aja com inteligência",
                desc: "Alertas automáticos, previsões de fim de mês, simulação de rendimentos. O Fundz pensa junto contigo.",
                bg: "bg-emerald-400",
                textColor: "text-white",
              },
            ].map(({ num, icon, title, desc, bg, textColor }, i) => (
              <div
                key={i}
                className={`relative ${bg} border-4 border-[#08233E] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(255,209,0,0.4)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(255,209,0,0.4)] transition-all duration-200 z-10`}
              >
                <span className={`absolute -top-5 -left-4 text-7xl font-black ${textColor} opacity-15 select-none leading-none`}>
                  {num}
                </span>
                <div className={`w-14 h-14 rounded-xl border-4 border-[#08233E] flex items-center justify-center mb-5 shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] ${textColor === "text-[#08233E]" ? "bg-[#08233E] text-[#FFD100]" : "bg-[#08233E] text-[#FFD100]"}`}>
                  {icon}
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight mb-3 ${textColor}`}>{title}</h3>
                <p className={`text-sm font-bold leading-relaxed ${textColor} opacity-75`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FEATURES GRID ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel>Funcionalidades</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Tudo que você precisa.{" "}
              <span className="text-white bg-[#08233E] px-3 rounded-xl border-4 border-[#FFD100]">Nada que não.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc, tag, tagColor, bg, textWhite, size }, i) => (
              <div
                key={i}
                className={`${bg} ${size} border-4 border-[#08233E] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(8,35,62,1)] transition-all duration-200 flex flex-col gap-4`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-xl border-4 border-[#08233E] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] ${textWhite ? "bg-[#FFD100] text-[#08233E]" : "bg-[#08233E] text-[#FFD100]"}`}>
                    {icon}
                  </div>
                  <Tag color={tagColor}>{tag}</Tag>
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight ${textWhite ? "text-white" : "text-[#08233E]"}`}>{title}</h3>
                <p className={`text-sm font-bold leading-relaxed ${textWhite ? "text-white/70" : "text-gray-500"}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FEATURE DESTAQUE: CALCULADORA ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,35,62,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(8,35,62,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-7">
            <SectionLabel>Exclusividade Fundz</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Veja seu dinheiro{" "}
              <span className="text-[#FFD100] bg-[#08233E] px-2 rounded-xl">crescer</span>{" "}
              na tela.
            </h2>
            <p className="text-lg font-bold text-gray-500 leading-relaxed max-w-lg">
              Nossa calculadora de juros compostos mostra o que acontece quando você investe R$500/mês durante 10 anos.
              O número vai te surpreender.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Calculator size={18} strokeWidth={2.5} />, text: "6 tipos de investimento com taxas reais" },
                { icon: <TrendingUp size={18} strokeWidth={2.5} />, text: "Projeção em 6m, 1a, 5a e 10 anos" },
                { icon: <Sparkles size={18} strokeWidth={2.5} />, text: "Veja quanto os juros rendem além do que você depositou" },
              ].map(({ icon, text }, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#FFD100] border-2 border-[#08233E] rounded-lg flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                    {icon}
                  </div>
                  <span className="font-black text-sm uppercase text-[#08233E]">{text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#08233E] text-[#FFD100] px-8 py-4 rounded-xl border-4 border-[#08233E] font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(255,209,0,1)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px] transition-all flex items-center gap-3 w-fit cursor-pointer"
            >
              Simular meus rendimentos <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>

          {/* mockup calculadora */}
          <div className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] overflow-hidden">
            <div className="p-6 border-b-4 border-[#FFD100]/30 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Calculadora</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Rendimentos Compostos</h3>
              </div>
              <div className="bg-[#FFD100] border-2 border-[#08233E] px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                <span className="text-[10px] font-black text-[#08233E] uppercase">CDB 100% CDI · 13,65%</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "6 Meses",  value: "R$ 3.210",  sub: "+R$210 juros",   bg: "bg-white",        vColor: "text-[#08233E]",  sColor: "text-emerald-600" },
                { label: "1 Ano",    value: "R$ 6.543",  sub: "+R$543 juros",   bg: "bg-[#FFD100]",    vColor: "text-[#08233E]",  sColor: "text-[#08233E]" },
                { label: "5 Anos",   value: "R$ 41.289", sub: "+R$11k juros",   bg: "bg-[#08233E] border-[#FFD100]", vColor: "text-[#FFD100]", sColor: "text-emerald-400" },
                { label: "10 Anos",  value: "R$ 112.4k", sub: "+R$52k juros 🔥", bg: "bg-[#08233E] border-red-500",  vColor: "text-[#FFD100]", sColor: "text-red-400" },
              ].map(({ label, value, sub, bg, vColor, sColor }, i) => (
                <div key={i} className={`${bg} border-4 border-[#08233E] rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${vColor} opacity-60`}>{label}</p>
                  <p className={`text-2xl font-black tracking-tighter ${vColor}`}>{value}</p>
                  <p className={`text-[10px] font-black uppercase mt-1 ${sColor}`}>{sub}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-4 flex items-center gap-3">
                <TrendingUp size={20} className="text-[#FFD100]" strokeWidth={2.5} />
                <div>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-wider">Base da simulação</p>
                  <p className="text-sm font-black text-white">R$500 inicial + R$500/mês</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. CONTROLE DE ASSINATURAS ────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* mockup */}
          <div className="bg-[#FFFAF0] border-4 border-[#08233E] rounded-3xl shadow-[16px_16px_0px_0px_rgba(8,35,62,1)] overflow-hidden">
            <div className="bg-[#08233E] px-6 py-5 border-b-4 border-[#08233E] flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Radar</p>
                <h3 className="text-xl font-black text-[#FFD100] uppercase italic">Assinaturas Ativas</h3>
              </div>
              <div className="bg-red-500 border-2 border-[#08233E] px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-black text-white uppercase">Total: R$598/mês</span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "Netflix",      type: "Assinatura", val: "R$ 39,90",  date: "18 Mar", color: "#E50914", used: true },
                { name: "Spotify",      type: "Assinatura", val: "R$ 21,90",  date: "22 Mar", color: "#1DB954", used: true },
                { name: "Duolingo Plus",type: "Assinatura", val: "R$ 49,90",  date: "05 Abr", color: "#58CC02", used: false },
                { name: "Notebook Dell",type: "Parcelamento 3/12", val: "R$ 320,00", date: "18 Mar", color: "#08233E", used: true },
                { name: "Adobe CC",     type: "Assinatura", val: "R$ 166,50", date: "01 Abr", color: "#FF0000", used: false },
              ].map(({ name, type, val, date, color, used }, i) => (
                <div key={i} className={`flex items-center justify-between p-3 border-2 border-[#08233E] rounded-xl ${!used ? "bg-red-50" : "bg-white"} shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border-2 border-[#08233E] flex items-center justify-center text-white text-[10px] font-black" style={{ background: color }}>
                      {name[0]}
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase text-[#08233E]">{name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!used && (
                      <span className="text-[8px] font-black bg-red-100 text-red-600 border border-red-300 px-2 py-0.5 rounded uppercase">Esquecida?</span>
                    )}
                    <div className="text-right">
                      <p className="font-black text-sm text-[#08233E]">{val}</p>
                      <p className="text-[9px] font-bold text-gray-400">{date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-7">
            <SectionLabel>Radar de Assinaturas</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Sabe quanto você paga em{" "}
              <span className="text-red-500">assinaturas esquecidas?</span>
            </h2>
            <p className="text-lg font-bold text-gray-500 leading-relaxed max-w-lg">
              A média dos nossos usuários descobre R$340 por mês em assinaturas que não usa mais.
              O Fundz te mostra tudo numa lista clara — e te deixa cancelar sem culpa.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Bell size={16} strokeWidth={2.5} />, text: "Alerta antes de cobrar" },
                { icon: <Eye size={16} strokeWidth={2.5} />,  text: "Visibilidade total" },
                { icon: <RefreshCw size={16} strokeWidth={2.5} />, text: "Parcelamentos rastreados" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#FFFAF0] border-2 border-[#08233E] rounded-lg px-4 py-2 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                  <span className="text-[#08233E]">{icon}</span>
                  <span className="text-[10px] font-black uppercase text-[#08233E] tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. METAS INTELIGENTES ────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#08233E] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-7">
            <SectionLabel>Metas Inteligentes</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#FFD100] leading-none">
              Sonho com data.{" "}
              <span className="text-white">E math.</span>
            </h2>
            <p className="text-lg font-bold text-white/70 leading-relaxed max-w-lg">
              Coloca o valor, escolhe quando quer chegar lá, e o Fundz te diz quanto guardar por mês.
              Europa, PC Gamer, entrada do apê — tudo com prazo real, não esperança.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "✈️", label: "Viagem",      color: "#820AD1" },
                { emoji: "🏠", label: "Entrada Apê", color: "#f97316" },
                { emoji: "💻", label: "Tech",         color: "#22c55e" },
                { emoji: "🚗", label: "Carro",        color: "#3b82f6" },
              ].map(({ emoji, label, color }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-2 border-white/20 rounded-xl p-3 hover:border-[#FFD100] transition-all cursor-default"
                  style={{ background: color + "22" }}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-black text-xs uppercase text-white tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* mockup meta */}
          <div className="bg-white border-4 border-[#FFD100] rounded-3xl shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] p-8 text-[#08233E]">
            <div className="flex justify-between items-center mb-6 pb-5 border-b-4 border-dashed border-[#08233E]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center text-xl shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                  ✈️
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meta ativa</p>
                  <h3 className="text-xl font-black uppercase tracking-tight">Eurotrip 2026</h3>
                </div>
              </div>
              <span className="bg-emerald-400 text-white text-[9px] font-black uppercase px-2.5 py-1 border-2 border-[#08233E] rounded-md shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                No Prazo
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-2">
                  <span>Guardado: R$4.500</span>
                  <span className="text-emerald-500">45%</span>
                </div>
                <div className="h-6 w-full bg-gray-100 border-2 border-[#08233E] rounded-sm overflow-hidden">
                  <div className="w-[45%] h-full bg-emerald-400 border-r-2 border-[#08233E]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-2">
                  <span>Rendimento: R$350</span>
                  <span className="text-[#FFD100]">Acelerando</span>
                </div>
                <div className="h-6 w-full bg-gray-100 border-2 border-[#08233E] rounded-sm overflow-hidden">
                  <div className="w-[15%] h-full bg-[#FFD100] border-r-2 border-[#08233E]" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t-4 border-dashed border-[#08233E] grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#FFFAF0] border-2 border-[#08233E] rounded-xl p-3">
                <p className="text-[9px] font-black text-gray-400 uppercase">Faltam</p>
                <p className="text-xl font-black text-[#08233E]">R$5.5k</p>
              </div>
              <div className="bg-[#FFFAF0] border-2 border-[#08233E] rounded-xl p-3">
                <p className="text-[9px] font-black text-gray-400 uppercase">Prazo</p>
                <p className="text-xl font-black text-[#08233E]">15m</p>
              </div>
              <div className="bg-[#FFD100] border-2 border-[#08233E] rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                <p className="text-[9px] font-black text-[#08233E] uppercase">Por mês</p>
                <p className="text-xl font-black text-[#08233E]">R$367</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. SEGURANÇA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 bg-[#FFD100] border-y-4 border-[#08233E] relative overflow-hidden">
        <Lock size={500} className="absolute -right-24 -bottom-24 text-[#08233E] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <SectionLabel>Segurança</SectionLabel>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#08233E] leading-[0.88]">
              Fortaleza<br />Digital.
            </h2>
            <p className="text-xl font-bold text-[#08233E]/70 max-w-lg">
              Seus dados são seus. Ponto final. Não vendemos, não acessamos suas senhas bancárias, não compartilhamos com terceiros.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <ShieldAlert size={18} className="text-emerald-600" />, label: "LGPD Compliant" },
                { icon: <KeyRound size={18} className="text-[#08233E]" />,      label: "Criptografia AES-256" },
                { icon: <Lock size={18} className="text-[#08233E]" />,         label: "Zero acesso bancário" },
              ].map(({ icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border-2 border-[#08233E] px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                  {icon}
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#08233E]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-52 h-52 flex-shrink-0">
            <div className="bg-[#08233E] p-10 rounded-[40px] border-4 border-[#08233E] shadow-[16px_16px_0px_0px_rgba(255,255,255,0.8)] flex items-center justify-center">
              <Lock size={100} className="text-[#FFD100]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. PLANOS ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Planos</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Simples assim.
            </h2>
            <p className="text-lg font-bold text-gray-500 mt-4">Sem pegadinha, sem asterisco no rodapé.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Grátis */}
            <div className="bg-white border-4 border-[#08233E] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] flex flex-col">
              <div className="mb-6">
                <Tag color="blue">Grátis</Tag>
                <h3 className="text-4xl font-black text-[#08233E] uppercase tracking-tighter mt-3">R$0</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Para sempre</p>
              </div>
              <div className="space-y-3 flex-1 mb-8">
                {FREE_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={16} strokeWidth={3} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-[#08233E]">{f}</span>
                  </div>
                ))}
                {FREE_MISSING.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-40">
                    <X size={16} strokeWidth={3} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-400 line-through">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-[#FFFAF0] text-[#08233E] py-4 rounded-xl border-4 border-[#08233E] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all cursor-pointer"
              >
                Começar grátis
              </button>
            </div>

            {/* Pro */}
            <div className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(255,209,0,1)] flex flex-col relative overflow-hidden">
              <div className="absolute top-5 right-5">
                <div className="bg-[#FFD100] text-[#08233E] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[#08233E] rounded-md rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                  Mais Popular
                </div>
              </div>
              <div className="mb-6">
                <Tag color="yellow">Pro</Tag>
                <div className="flex items-end gap-2 mt-3">
                  <h3 className="text-4xl font-black text-[#FFD100] uppercase tracking-tighter">R$14,90</h3>
                  <span className="text-white/50 font-bold text-sm pb-1">/mês</span>
                </div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-wider mt-1">Menos que um café por semana</p>
              </div>
              <div className="space-y-3 flex-1 mb-8">
                {PRO_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#FFD100] border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={3} className="text-[#08233E]" />
                    </div>
                    <span className="text-sm font-bold text-white/80">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-[#FFD100] text-[#08233E] py-4 rounded-xl border-4 border-[#08233E] font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Flame size={16} strokeWidth={2.5} /> Começar Pro agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. DEPOIMENTOS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Depoimentos</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              A galera já tá usando.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars, color, initials }, i) => (
              <div
                key={i}
                className="bg-white border-4 border-[#08233E] rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(8,35,62,1)] transition-all duration-200 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(stars)].map((_, j) => (
                    <Star key={j} size={14} fill="#FFD100" className="text-[#FFD100]" />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-600 leading-relaxed flex-1 mb-6">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-dashed border-[#08233E]">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-[#08233E] flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ background: color }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-black text-xs text-[#08233E] uppercase">{name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. CATEGORY VIBES (Onde você gasta?) ────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 bg-[#08233E] border-b-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-8">
            Monitore tudo que importa na sua vida
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <Beer size={18} strokeWidth={2} />,        label: "Balada & Bares",   color: "#820AD1" },
              { icon: <Plane size={18} strokeWidth={2} />,       label: "Viagens",          color: "#3b82f6" },
              { icon: <Gamepad2 size={18} strokeWidth={2} />,    label: "Games",            color: "#22c55e" },
              { icon: <Music2 size={18} strokeWidth={2} />,      label: "Shows & Cultura",  color: "#f97316" },
              { icon: <ShoppingBag size={18} strokeWidth={2} />, label: "Compras",          color: "#ec4899" },
              { icon: <Coffee size={18} strokeWidth={2} />,      label: "Cafés & Comida",   color: "#78716c" },
              { icon: <TrendingUp size={18} strokeWidth={2} />,  label: "Investimentos",    color: "#FFD100" },
              { icon: <CreditCard size={18} strokeWidth={2} />,  label: "Assinaturas",      color: "#FF3B3B" },
            ].map(({ icon, label, color }, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-white/20 hover:border-[#FFD100] transition-all cursor-default group"
                style={{ background: color + "22" }}
              >
                <span style={{ color }}>{icon}</span>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#FFD100] transition-colors">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-4 sm:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FFD100] border-4 border-[#08233E] opacity-20 rotate-12" />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-emerald-400 border-4 border-[#08233E] opacity-20" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-12 md:p-20 text-center text-white shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-32 h-32 border-4 border-white/10 rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FFD100] opacity-10 rotate-45" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#FFD100] text-[#08233E] text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-white rounded-md shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] mb-8 rotate-[-1deg]">
                <Sparkles size={13} strokeWidth={2.5} />
                Grátis pra sempre · Sem cartão
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase">
                Vai ficar só <br />
                <span className="text-[#FFD100]">olhando o saldo</span><br />
                diminuir?
              </h2>

              <p className="text-xl font-bold mb-10 max-w-2xl mx-auto text-white/70">
                2.400 pessoas já pararam de passar raiva no fim do mês.
                Junte-se e assuma o controle do seu dinheiro hoje.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-[#FFD100] text-[#08233E] px-10 py-5 rounded-xl border-4 border-white font-black text-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-y-[8px] hover:translate-x-[8px] transition-all uppercase tracking-tight flex items-center gap-3 cursor-pointer"
                >
                  Criar Conta Grátis <ArrowRight strokeWidth={3} size={22} />
                </button>
                <p className="text-white/40 font-bold text-sm uppercase tracking-wider">
                  ou <span className="text-white/60 cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/auth")}>fazer login</span>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10">
                {[
                  "✓ Sem cartão de crédito",
                  "✓ Setup em 2 minutos",
                  "✓ Cancele quando quiser",
                ].map((t, i) => (
                  <span key={i} className="text-xs font-black text-white/50 uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 16. FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#08233E] border-t-4 border-[#08233E]">
        {/* top row */}
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 border-b-2 border-white/10">
          <div>
            <img src="/blue-logo.png" alt="Fundz" className="h-8 mb-4 brightness-0 invert" />
            <p className="text-sm font-bold text-white/50 leading-relaxed">
              Gestão financeira sem frescura para a geração que quer viver e investir ao mesmo tempo.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-[#FFD100] uppercase tracking-widest mb-4">Produto</h4>
            <ul className="space-y-2">
              {["Features", "Planos", "Segurança", "Roadmap"].map((item) => (
                <li key={item}>
                  <span className="text-sm font-bold text-white/50 uppercase tracking-wider hover:text-white transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-[#FFD100] uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacidade", "Termos de Uso", "LGPD", "Cookies"].map((item) => (
                <li key={item}>
                  <span className="text-sm font-bold text-white/50 uppercase tracking-wider hover:text-white transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-[#FFD100] uppercase tracking-widest mb-4">Contato</h4>
            <ul className="space-y-2">
              {["Instagram", "Twitter/X", "LinkedIn", "E-mail"].map((item) => (
                <li key={item}>
                  <span className="text-sm font-bold text-white/50 uppercase tracking-wider hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                    {item} <ArrowUpRight size={12} strokeWidth={2.5} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* bottom row */}
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            © 2026 HR Labs. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
            Dinheiro no bolso, pé no rolê.
          </p>
        </div>
      </footer>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          min-width: 200%;
        }
      ` }} />
    </div>
  );
}
