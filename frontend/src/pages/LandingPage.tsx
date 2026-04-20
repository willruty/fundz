import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  Target,
  Lock,
  ShieldAlert,
  KeyRound,
  BarChart3,
  CreditCard,
  TrendingUp,
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
  Monitor,
  Home,
  Car,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 180, damping: 24 } },
};
const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
};
const SLIDE_LEFT = {
  hidden: { opacity: 0, x: -44 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 180, damping: 24 } },
};
const SLIDE_RIGHT = {
  hidden: { opacity: 0, x: 44 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 180, damping: 24 } },
};
const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const STAGGER_SLOW = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const VP = { once: true, margin: "-60px" };

// ─── Primitives ───────────────────────────────────────────────────────────────

function Tag({ children, color = "yellow" }: { children: ReactNode; color?: "yellow" | "blue" | "green" | "red" }) {
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#FFD100] border-2 border-[#08233E] px-4 py-2 rounded-md shadow-[3px_3px_0px_0px_rgba(8,35,62,1)] mb-6">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#08233E]">{children}</span>
    </div>
  );
}

function ScreenshotPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`border-4 border-dashed border-[#08233E]/20 rounded-3xl flex flex-col items-center justify-center gap-5 bg-[#08233E]/[0.03] p-12 ${className}`}>
      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#08233E]/20 flex items-center justify-center">
        <ImageIcon size={26} className="text-[#08233E]/20" strokeWidth={1.5} />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#08233E]/25 text-center max-w-[220px] leading-relaxed">
        {label}
      </p>
    </div>
  );
}

function AnimatedNumber({
  to,
  format,
  precision = 0,
}: {
  to: number;
  format: (n: number) => string;
  precision?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 45, damping: 18 });
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    if (inView) raw.set(to);
  }, [inView, raw, to]);

  useEffect(() => {
    return spring.on("change", (v) => {
      const val = precision === 0 ? Math.round(v) : parseFloat(v.toFixed(precision));
      setDisplay(format(val));
    });
  }, [spring, format, precision]);

  return <span ref={ref}>{display}</span>;
}

// ─── Persona Data ─────────────────────────────────────────────────────────────

type Persona = {
  key: string;
  IconComponent: LucideIcon;
  icon: ReactNode;
  label: string;
  tagline: string;
  desc: string;
  features: string[];
  mockColor: string;
  screenshotLabel: string;
};

const PERSONAS: Persona[] = [
  {
    key: "roleiro",
    IconComponent: Beer,
    icon: <Beer size={20} strokeWidth={2.5} />,
    label: "O Roleiro",
    tagline: "Quer curtir sem culpa",
    desc: "Você não vai abrir mão do show de quinta, do bar de sexta e do brunch de domingo. Tudo bem. O Fundz cria um orçamento de lazer dedicado pra você curtir sem travar a poupança.",
    features: ["Budget de lazer separado", "Alerta quando bater o limite", "Divisão de rolê com amigos"],
    mockColor: "#820AD1",
    screenshotLabel: "Tela de Budget de Lazer — categorias de entretenimento e alerta de limite semanal",
  },
  {
    key: "investidor",
    IconComponent: TrendingUp,
    icon: <TrendingUp size={20} strokeWidth={2.5} />,
    label: "O Investidor",
    tagline: "Quer fazer o dinheiro trabalhar",
    desc: "CDB, Tesouro, Fundo Imobiliário, Renda Variável. A calculadora de rendimentos do Fundz mostra exatamente quanto R$500/mês vira em 10 anos em cada tipo de investimento.",
    features: ["Calculadora de juros compostos", "Comparador de tipos de investimento", "Projeção até 10 anos"],
    mockColor: "#08233E",
    screenshotLabel: "Calculadora de Rendimentos — simulação CDB vs Tesouro vs Renda Variável em 10 anos",
  },
  {
    key: "freela",
    IconComponent: Briefcase,
    icon: <Briefcase size={20} strokeWidth={2.5} />,
    label: "O Freela / MEI",
    tagline: "Renda variável, gastos fixos",
    desc: "Mês que você fatura R$8k, mês que fatura R$3k. O Fundz te ajuda a normalizar sua renda, não esquecer o DAS do MEI e separar o dinheiro da empresa do seu pessoal.",
    features: ["Separação PF e PJ", "Lembretes de impostos (DAS)", "Projeção com renda variável"],
    mockColor: "#f97316",
    screenshotLabel: "Painel MEI — separação de receita PF e PJ com lembretes de guia DAS",
  },
  {
    key: "estudante",
    IconComponent: Coffee,
    icon: <Coffee size={20} strokeWidth={2.5} />,
    label: "O Estudante",
    tagline: "Bolsa curta, sonhos grandes",
    desc: "R$1300 de estágio pra fazer durar 30 dias é missão difícil. O Fundz divide automaticamente por categorias, mostra onde você está gastando mais e te dá uma previsão do dia 30.",
    features: ["Divisão automática por categoria", "Previsão até o fim do mês", "Metas de curto prazo"],
    mockColor: "#22c55e",
    screenshotLabel: "Visão do Estudante — projeção de saldo até o dia 30 e top categorias de gasto",
  },
];

// ─── Features Data ────────────────────────────────────────────────────────────


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

const HOW_STEPS = [
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
];

const CHIP_DIRS = [
  { x: 0, y: -50 }, { x: 50, y: 0 }, { x: 0, y: 50 }, { x: -50, y: 0 },
  { x: 40, y: -40 }, { x: -40, y: 40 }, { x: -40, y: -40 }, { x: 40, y: 40 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState("roleiro");
  const persona = PERSONAS.find((p) => p.key === activePersona)!;

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-manrope text-[#08233E] overflow-x-hidden">

      {/* ── 1. NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, type: "spring", stiffness: 260, damping: 28 }}
      >
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
            <motion.button
              onClick={() => navigate("/auth")}
              className="bg-[#08233E] text-[#FFD100] px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest border-2 border-[#08233E] cursor-pointer"
              style={{ boxShadow: "4px 4px 0px 0px rgba(255,209,0,1)" }}
              whileHover={{ boxShadow: "0px 0px 0px 0px rgba(255,209,0,1)", y: 4, x: 4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
            >
              Criar Conta
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-8 flex items-center bg-[#08233E] overflow-hidden">
        {/* geo shapes — slow loop */}
        <motion.div
          className="absolute top-24 left-8 w-28 h-28 bg-[#FFD100] border-4 border-white/20 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-16 right-[42%] w-48 h-12 bg-emerald-400 border-4 border-white/20 opacity-15"
          animate={{ rotate: -360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/3 right-16 w-40 h-40 rounded-full border-4 border-white/10 opacity-20"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-[30%] w-16 h-16 bg-[#FFD100] border-4 border-white/20 opacity-15"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy — staggered entrance */}
          <motion.div
            className="space-y-8 text-white"
            variants={STAGGER_SLOW}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={FADE_UP} className="flex items-center gap-3">
              <div className="bg-[#FFD100] text-[#08233E] text-[10px] font-black uppercase tracking-widest px-4 py-2 border-4 border-white rounded-md shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-[-2deg]">
                Gestão financeira sem frescura
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Beta Aberto</span>
              </div>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="text-5xl sm:text-7xl lg:text-[82px] font-black leading-[0.88] tracking-tighter uppercase"
            >
              Seu dinheiro.{" "}
              <br />
              Seu rolê.{" "}
              <br />
              <span className="relative text-[#FFD100]">
                Seu controle.
                <motion.span
                  className="absolute -bottom-1 left-0 h-2 bg-[#FFD100] opacity-30 rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            <motion.p variants={FADE_UP} className="text-lg sm:text-xl text-white/75 max-w-lg font-bold leading-relaxed">
              O app de finanças feito para quem quer{" "}
              <span className="text-[#FFD100] font-black">ir ao show na quinta</span>,{" "}
              <span className="text-[#FFD100] font-black">guardar pra Europa</span> e{" "}
              <span className="text-[#FFD100] font-black">ainda investir</span> no mesmo mês.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={() => navigate("/auth")}
                className="bg-[#FFD100] text-[#08233E] px-10 py-5 rounded-xl border-4 border-white font-black text-lg uppercase tracking-tight flex items-center gap-3 cursor-pointer"
                style={{ boxShadow: "8px 8px 0px 0px rgba(255,255,255,0.4)" }}
                whileHover={{ boxShadow: "0px 0px 0px 0px rgba(255,255,255,0.4)", y: 8, x: 8 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                Começar grátis <ArrowRight strokeWidth={3} size={22} />
              </motion.button>
              <button className="flex items-center gap-2 text-white/60 font-black text-sm uppercase tracking-widest hover:text-white transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/60 transition-all">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
                Ver demo
              </button>
            </motion.div>

            {/* social proof */}
            <motion.div variants={FADE_UP} className="flex items-center gap-4 pt-4 border-t border-white/10">
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
            </motion.div>
          </motion.div>

          {/* Right: floating UI cards (desktop) */}
          <div className="relative hidden lg:block h-[620px] w-full">

            {/* Main card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                className="w-[340px] bg-white rounded-3xl border-4 border-[#08233E] p-6"
                style={{ boxShadow: "16px 16px 0px 0px rgba(255,209,0,1)" }}
                animate={{ y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
                whileHover={{ y: -14, boxShadow: "20px 20px 0px 0px rgba(255,209,0,1)", transition: { duration: 0.3 } }}
              >
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
                    <span className="font-black text-xs uppercase flex items-center gap-2">
                      <DollarSign size={13} strokeWidth={3} className="text-emerald-500" /> Bolsa Estágio
                    </span>
                    <span className="font-black text-emerald-600 text-sm">+ R$1.300</span>
                  </div>
                  <div className="bg-red-50 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                    <span className="font-black text-xs uppercase flex items-center gap-2">
                      <FileText size={13} strokeWidth={3} className="text-red-400" /> DAS MEI
                    </span>
                    <span className="font-black text-red-500 text-sm">- R$75</span>
                  </div>
                  <div className="bg-yellow-50 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                    <span className="font-black text-xs uppercase flex items-center gap-2">
                      <Target size={13} strokeWidth={3} className="text-[#08233E]" /> Meta Europa
                    </span>
                    <span className="font-black text-[#08233E] text-sm">45%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating: Meta */}
            <div className="absolute top-[6%] right-[2%]">
              <motion.div
                className="w-[220px] bg-[#FFD100] rounded-2xl border-4 border-[#08233E] p-4 z-30"
                style={{ boxShadow: "8px 8px 0px 0px rgba(255,255,255,0.6)", rotate: 6 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                whileHover={{ rotate: 0, y: -8, transition: { duration: 0.3 } }}
              >
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
              </motion.div>
            </div>

            {/* Floating: Alerta */}
            <div className="absolute bottom-[22%] left-[-2%]">
              <motion.div
                className="w-[210px] bg-[#08233E] rounded-2xl border-4 border-[#08233E] p-4 z-30"
                style={{ boxShadow: "8px 8px 0px 0px rgba(255,209,0,1)", rotate: -4 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                whileHover={{ rotate: 0, y: -6, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={16} className="text-[#FFD100]" strokeWidth={3} />
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Alerta Fundz</span>
                </div>
                <p className="text-sm font-black text-white leading-tight">Budget de lazer 83% usado.</p>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mt-1">Faltam R$85 até o limite</p>
              </motion.div>
            </div>

            {/* Floating: Rendimento */}
            <div className="absolute bottom-[8%] right-[5%]">
              <motion.div
                className="w-[190px] bg-white rounded-2xl border-4 border-[#08233E] p-4 z-10"
                style={{ boxShadow: "8px 8px 0px 0px rgba(34,197,94,1)", rotate: 3 }}
                animate={{ y: [0, -11, 0] }}
                transition={{ repeat: Infinity, duration: 3.1, ease: "easeInOut" }}
                whileHover={{ rotate: 0, y: -8, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-emerald-500" strokeWidth={3} />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">CDB 100% CDI</span>
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase">R$500/mês em 10 anos</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter">R$112k</p>
                <p className="text-[8px] font-black text-emerald-500 uppercase">+R$52k de rendimento</p>
              </motion.div>
            </div>
          </div>

          {/* Mobile: screenshot placeholder */}
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="lg:hidden"
          >
            <ScreenshotPlaceholder
              label="Dashboard principal — visão geral de saldo, metas e últimas transações"
              className="h-[280px]"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 3. MARQUEE ────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FFD100] border-y-4 border-[#08233E] py-4 overflow-hidden group">
        <div className="animate-marquee group-hover:animate-marquee-paused flex gap-10 items-center text-[#08233E] font-black text-xl uppercase tracking-widest whitespace-nowrap">
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

      {/* ── 4. STATS ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 bg-white border-b-4 border-[#08233E]">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-[#08233E] rounded-2xl overflow-hidden"
          style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
          variants={STAGGER}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {[
            {
              label: "Usuários ativos",
              color: "bg-[#08233E] text-white",
              numColor: "text-[#FFD100]",
              to: 2400,
              format: (n: number) => n >= 2400 ? "2.400+" : n.toLocaleString("pt-BR"),
            },
            {
              label: "Controlados/mês",
              color: "bg-[#FFD100]",
              numColor: "text-[#08233E]",
              to: 4.2,
              format: (n: number) => `R$${n.toFixed(1)}M`,
              precision: 1,
            },
            {
              label: "Batem suas metas",
              color: "bg-white",
              numColor: "text-[#08233E]",
              to: 87,
              format: (n: number) => `${n}%`,
            },
            {
              label: "Poupados no 1º mês",
              color: "bg-emerald-400 text-white",
              numColor: "text-white",
              to: 340,
              format: (n: number) => `R$${n}`,
            },
          ].map(({ label, color, numColor, to, format, precision }, i) => (
            <motion.div
              key={i}
              variants={FADE_UP}
              className={`${color} p-8 flex flex-col items-center text-center ${i < 3 ? "border-r-2 border-[#08233E]" : ""} border-b-2 md:border-b-0 last:border-b-0`}
            >
              <span className={`text-5xl md:text-6xl font-black tracking-tighter ${numColor}`}>
                <AnimatedNumber to={to} format={format} precision={precision ?? 0} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 5. PERSONAS ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,35,62,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(8,35,62,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Para quem é?</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              O Fundz é feito pra{" "}
              <span className="bg-[#08233E] text-[#FFD100] px-3 rounded-lg">você.</span>
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg font-bold text-gray-500 mt-4 max-w-xl mx-auto">
              Não importa onde você está na jornada financeira — temos tudo o que você precisa.
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {PERSONAS.map((p) => (
              <motion.button
                key={p.key}
                variants={FADE_UP}
                onClick={() => setActivePersona(p.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-black text-sm uppercase tracking-wide transition-colors cursor-pointer ${
                  activePersona === p.key
                    ? "bg-[#08233E] text-[#FFD100] border-[#08233E] shadow-[4px_4px_0px_0px_rgba(255,209,0,1)]"
                    : "bg-white text-[#08233E] border-[#08233E] hover:bg-[#08233E] hover:text-[#FFD100]"
                }`}
              >
                {p.icon}
                {p.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content — AnimatePresence for tab switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              className="grid lg:grid-cols-2 gap-10 items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="bg-white border-4 border-[#08233E] rounded-3xl p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(8,35,62,1)]">
                <div className="flex items-start gap-5 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-[#08233E] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] flex-shrink-0"
                    style={{ background: persona.mockColor }}
                  >
                    <persona.IconComponent size={30} strokeWidth={2} className="text-white" />
                  </div>
                  <div>
                    <Tag color="blue">{persona.label}</Tag>
                    <h3 className="text-3xl font-black text-[#08233E] uppercase tracking-tighter mt-2 leading-none">
                      {persona.tagline}
                    </h3>
                  </div>
                </div>
                <p className="text-base font-bold text-gray-600 leading-relaxed mb-8">{persona.desc}</p>
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

              <ScreenshotPlaceholder
                label={persona.screenshotLabel}
                className="h-[400px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 6. COMO FUNCIONA — Zigzag ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#08233E] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 w-48 h-48 border-4 border-white" />
          <div className="absolute bottom-20 right-32 w-32 h-32 rounded-full border-4 border-white" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Como funciona</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#FFD100] leading-none">
              3 passos. <span className="text-white">Sem enrolação.</span>
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Vertical connector line */}
            <motion.div
              className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-[#FFD100]/20 hidden md:block"
              style={{ transformOrigin: "top", translateX: "-50%" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
            />

            <div className="space-y-10 md:space-y-14">
              {HOW_STEPS.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    className={`w-full md:w-[calc(50%-2rem)] ${!isLeft ? "md:ml-auto" : ""} relative ${step.bg} border-4 border-[#08233E] rounded-3xl p-8 z-10`}
                    style={{ boxShadow: "8px 8px 0px 0px rgba(255,209,0,0.35)" }}
                    variants={isLeft ? SLIDE_LEFT : SLIDE_RIGHT}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VP}
                    whileHover={{
                      y: -5,
                      x: isLeft ? -5 : 5,
                      boxShadow: "12px 12px 0px 0px rgba(255,209,0,0.5)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className={`absolute -top-5 -left-4 text-7xl font-black ${step.textColor} opacity-15 select-none leading-none`}>
                      {step.num}
                    </span>
                    <div className="w-14 h-14 rounded-xl border-4 border-[#08233E] bg-[#08233E] text-[#FFD100] flex items-center justify-center mb-5 shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                      {step.icon}
                    </div>
                    <h3 className={`text-xl font-black uppercase tracking-tight mb-3 ${step.textColor}`}>{step.title}</h3>
                    <p className={`text-sm font-bold leading-relaxed ${step.textColor} opacity-75`}>{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FEATURES BENTO ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-14"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Funcionalidades</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Tudo que você precisa.{" "}
              <span className="text-white bg-[#08233E] px-3 rounded-xl border-4 border-[#FFD100]">Nada que não.</span>
            </motion.h2>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            style={{ gridAutoRows: "minmax(180px, auto)" }}
          >

            {/* ── Dashboard (2×2, dark) ────────────────────────────────────────── */}
            <motion.div
              className="md:col-span-2 md:row-span-2 bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-7 flex flex-col cursor-default overflow-hidden"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -5, x: -5, boxShadow: "13px 13px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="w-12 h-12 bg-[#FFD100] text-[#08233E] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] mb-3">
                    <BarChart3 size={24} strokeWidth={2.5} />
                  </div>
                  <Tag color="yellow">Core</Tag>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Saldo total</p>
                  <p className="text-3xl font-black text-[#FFD100] tracking-tighter">R$ 4.280</p>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase mt-0.5">+R$320 esse mês</p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Dashboard Inteligente</h3>
              <p className="text-sm font-bold text-white/55 leading-relaxed mb-6 max-w-md">
                Visão completa da sua vida financeira em tempo real. Gráficos que fazem sentido, não tabelas que dão sono.
              </p>

              {/* Bar chart */}
              <div className="mt-auto">
                <div className="flex items-end gap-2 md:gap-3 h-[100px] mb-3">
                  {[
                    { label: "Alim.",    px: 52,  color: "bg-[#FFD100]" },
                    { label: "Lazer",   px: 84,  color: "bg-emerald-400" },
                    { label: "Transp.", px: 42,  color: "bg-blue-400" },
                    { label: "Saúde",   px: 66,  color: "bg-purple-400" },
                    { label: "Invest.", px: 100, color: "bg-[#FFD100]" },
                    { label: "Outros",  px: 48,  color: "bg-white/20" },
                  ].map(({ label, px, color }, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <motion.div
                        className={`w-full ${color} rounded-t-md`}
                        style={{ originY: 1, height: px }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      />
                      <span className="text-[7px] font-black text-white/30 uppercase tracking-wide leading-none">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/8 border-2 border-white/15 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">Março 2026</span>
                  <div className="flex gap-4">
                    <span className="text-[9px] font-black text-emerald-400 uppercase">+R$4.800 entrada</span>
                    <span className="text-[9px] font-black text-red-400 uppercase">−R$2.520 saída</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Alertas (1×1, yellow) ──────────────────────────────────────────── */}
            <motion.div
              className="bg-[#FFD100] border-4 border-[#08233E] rounded-3xl p-6 flex flex-col cursor-default"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -5, x: -5, boxShadow: "13px 13px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#08233E] text-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,0.35)]">
                  <Bell size={22} strokeWidth={2} />
                </div>
                <Tag color="green">Smart</Tag>
              </div>
              <h3 className="text-lg font-black text-[#08233E] uppercase tracking-tight mb-2">Alertas Antes da Dor</h3>
              <p className="text-xs font-bold text-[#08233E]/65 leading-relaxed mb-4">
                Notificação quando você está chegando no limite. Chega de surpresa na fatura.
              </p>
              <div className="mt-auto bg-white border-2 border-[#08233E] rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(8,35,62,0.35)]">
                <div className="flex items-center gap-2 mb-1.5">
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-[9px] font-black text-[#08233E]/55 uppercase tracking-wider">Alerta Fundz</span>
                </div>
                <p className="text-sm font-black text-[#08233E] leading-tight">Budget de lazer 83% usado.</p>
                <p className="text-[9px] font-bold text-[#08233E]/45 uppercase mt-0.5">Faltam R$85 até o limite</p>
              </div>
            </motion.div>

            {/* ── Radar Assinaturas (1×1, white) ────────────────────────────────── */}
            <motion.div
              className="bg-white border-4 border-[#08233E] rounded-3xl p-6 flex flex-col cursor-default"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -5, x: -5, boxShadow: "13px 13px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-[#08233E] text-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                  <RefreshCw size={22} strokeWidth={2} />
                </div>
                <Tag color="red">Favorito</Tag>
              </div>
              <h3 className="text-lg font-black text-[#08233E] uppercase tracking-tight mb-3">Radar de Assinaturas</h3>
              <div className="space-y-2 mt-auto">
                {[
                  { name: "Netflix",  val: "R$39,90",  color: "#E50914", used: true },
                  { name: "Spotify",  val: "R$21,90",  color: "#1DB954", used: true },
                  { name: "Adobe CC", val: "R$166,50", color: "#FF0000", used: false },
                ].map(({ name, val, color, used }, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center px-3 py-2 border-2 border-[#08233E] rounded-xl ${!used ? "bg-red-50" : "bg-[#FFFAF0]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded border border-[#08233E] text-white text-[8px] font-black flex items-center justify-center flex-shrink-0"
                        style={{ background: color }}
                      >
                        {name[0]}
                      </div>
                      <span className="text-[10px] font-black text-[#08233E] uppercase">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!used && (
                        <motion.span
                          className="text-[7px] font-black text-red-500 border border-red-300 bg-red-50 px-1.5 py-0.5 rounded uppercase"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          esq.
                        </motion.span>
                      )}
                      <span className="text-[10px] font-black text-[#08233E]">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t-2 border-dashed border-[#08233E] flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Total mensal</span>
                <span className="text-base font-black text-red-500">R$598</span>
              </div>
            </motion.div>

            {/* ── Calculadora (1×1, dark) ───────────────────────────────────────── */}
            <motion.div
              className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-6 flex flex-col cursor-default"
              style={{ boxShadow: "8px 8px 0px 0px rgba(255,209,0,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -5, x: -5, boxShadow: "13px 13px 0px 0px rgba(255,209,0,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#FFD100] text-[#08233E] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,209,0,0.4)]">
                  <Calculator size={22} strokeWidth={2} />
                </div>
                <Tag color="yellow">Exclusivo</Tag>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Calculadora de Rendimentos</h3>
              <p className="text-[11px] font-bold text-white/45 leading-relaxed mb-4">R$500/mês · CDB 100% CDI · 10 anos</p>
              <div className="flex items-end gap-2.5 h-[80px] mt-auto">
                {[
                  { label: "6m",  px: 18,  color: "bg-white/25" },
                  { label: "1a",  px: 32,  color: "bg-[#FFD100]/50" },
                  { label: "5a",  px: 62,  color: "bg-[#FFD100]/78" },
                  { label: "10a", px: 80,  color: "bg-[#FFD100]" },
                ].map(({ label, px, color }, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                    <motion.div
                      className={`w-full ${color} rounded-t-md`}
                      style={{ originY: 1, height: px }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                    />
                    <span className="text-[8px] font-black text-white/35 uppercase">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-black text-[#FFD100] mt-3 uppercase tracking-widest text-right">R$112k acumulado</p>
            </motion.div>

            {/* ── Metas (2×1, cream) ────────────────────────────────────────────── */}
            <motion.div
              className="md:col-span-2 bg-[#FFFAF0] border-4 border-[#08233E] rounded-3xl p-6 flex flex-col cursor-default"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.25, type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -5, x: -5, boxShadow: "13px 13px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#08233E] text-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                    <Target size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <Tag color="blue">Core</Tag>
                    <h3 className="text-xl font-black text-[#08233E] uppercase tracking-tight mt-1">Metas com Prazo Real</h3>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 max-w-[180px] text-right hidden md:block leading-relaxed">
                  Quanto guardar por mês pra chegar lá.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                {[
                  { Icon: Plane,   label: "Eurotrip 2026", target: "R$10k",  pct: 45, color: "#820AD1", need: "R$367/mês" },
                  { Icon: Monitor, label: "PC Gamer",       target: "R$6k",   pct: 70, color: "#3b82f6", need: "R$180/mês" },
                ].map(({ Icon, label, target, pct, color, need }, i) => (
                  <div key={i} className="bg-white border-2 border-[#08233E] rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg border-2 border-[#08233E] flex items-center justify-center flex-shrink-0"
                        style={{ background: color }}
                      >
                        <Icon size={16} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#08233E] uppercase leading-tight">{label}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">{target}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 border border-[#08233E] rounded-sm overflow-hidden mb-1.5">
                      <motion.div
                        className="h-full bg-emerald-400 border-r border-[#08233E]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.9, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-gray-400 uppercase">{pct}% concluído</span>
                      <span className="text-[8px] font-black text-[#08233E] uppercase">{need}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Multi-Contas (3 cols, short) ──────────────────────────────────── */}
            <motion.div
              className="md:col-span-3 bg-white border-4 border-[#08233E] rounded-3xl p-6 cursor-default"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 24 }}
              whileHover={{ y: -4, boxShadow: "12px 8px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#08233E] text-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                    <Wallet size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <Tag color="yellow">Pro</Tag>
                    <h3 className="text-xl font-black text-[#08233E] uppercase tracking-tight mt-1">Multi-Contas</h3>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-400 max-w-xs text-right hidden md:block leading-relaxed">
                  Todos os saldos num lugar só, sem precisar ficar abrindo app por app.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Nubank",  initial: "N", color: "#820AD1", balance: "R$ 1.240,00", change: "+R$240" },
                  { name: "Itaú",    initial: "I", color: "#f97316", balance: "R$ 3.150,80", change: "+R$920" },
                  { name: "C6 Bank", initial: "C", color: "#131313", balance: "R$ 880,20",   change: "−R$120" },
                  { name: "Inter",   initial: "I", color: "#FF7A00", balance: "R$ 2.010,50", change: "+R$310" },
                ].map(({ name, initial, color, balance, change }, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#FFFAF0] border-2 border-[#08233E] rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.07, type: "spring", stiffness: 220, damping: 22 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg border-2 border-[#08233E] flex items-center justify-center text-white text-xs font-black mb-3"
                      style={{ background: color }}
                    >
                      {initial}
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{name}</p>
                    <p className="text-lg font-black text-[#08233E] tracking-tighter leading-tight">{balance}</p>
                    <p className={`text-[9px] font-black uppercase mt-1 ${change.startsWith("+") ? "text-emerald-500" : "text-red-400"}`}>{change}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 8. CALCULADORA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,35,62,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(8,35,62,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            className="space-y-7"
            variants={STAGGER_SLOW}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Exclusividade Fundz</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Veja seu dinheiro{" "}
              <span className="text-[#FFD100] bg-[#08233E] px-2 rounded-xl">crescer</span>{" "}
              na tela.
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg font-bold text-gray-500 leading-relaxed max-w-lg">
              Nossa calculadora de juros compostos mostra o que acontece quando você investe R$500/mês durante 10 anos. O número vai te surpreender.
            </motion.p>
            <motion.ul variants={STAGGER} className="space-y-4">
              {[
                { icon: <Calculator size={18} strokeWidth={2.5} />, text: "6 tipos de investimento com taxas reais" },
                { icon: <TrendingUp size={18} strokeWidth={2.5} />, text: "Projeção em 6m, 1a, 5a e 10 anos" },
                { icon: <Sparkles size={18} strokeWidth={2.5} />, text: "Veja quanto os juros rendem além do que você depositou" },
              ].map(({ icon, text }, i) => (
                <motion.li key={i} variants={FADE_UP} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#FFD100] border-2 border-[#08233E] rounded-lg flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]">
                    {icon}
                  </div>
                  <span className="font-black text-sm uppercase text-[#08233E]">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={FADE_UP}>
              <motion.button
                onClick={() => navigate("/auth")}
                className="bg-[#08233E] text-[#FFD100] px-8 py-4 rounded-xl border-4 border-[#08233E] font-black text-sm uppercase tracking-widest flex items-center gap-3 w-fit cursor-pointer"
                style={{ boxShadow: "6px 6px 0px 0px rgba(255,209,0,1)" }}
                whileHover={{ boxShadow: "0px 0px 0px 0px rgba(255,209,0,1)", y: 6, x: 6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                Simular meus rendimentos <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Mockup calculadora */}
          <motion.div
            className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl overflow-hidden"
            style={{ boxShadow: "16px 16px 0px 0px rgba(255,209,0,1)" }}
            variants={SLIDE_RIGHT}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <div className="p-6 border-b-4 border-[#FFD100]/30 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Calculadora</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Rendimentos Compostos</h3>
              </div>
              <div className="bg-[#FFD100] border-2 border-[#08233E] px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                <span className="text-[10px] font-black text-[#08233E] uppercase">CDB 100% CDI · 13,65%</span>
              </div>
            </div>
            <motion.div
              className="p-6 grid grid-cols-2 gap-4"
              variants={STAGGER}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              {[
                { label: "6 Meses",  to: 3210,  fmt: (n: number) => `R$ ${n.toLocaleString("pt-BR")}`,  sub: "+R$210 juros",    bg: "bg-white",        vColor: "text-[#08233E]", sColor: "text-emerald-600" },
                { label: "1 Ano",    to: 6543,  fmt: (n: number) => `R$ ${n.toLocaleString("pt-BR")}`,  sub: "+R$543 juros",   bg: "bg-[#FFD100]",    vColor: "text-[#08233E]", sColor: "text-[#08233E]" },
                { label: "5 Anos",   to: 41289, fmt: (n: number) => `R$ ${n.toLocaleString("pt-BR")}`,  sub: "+R$11k juros",   bg: "bg-[#08233E] border-[#FFD100]", vColor: "text-[#FFD100]", sColor: "text-emerald-400" },
                { label: "10 Anos",  to: 112,   fmt: (n: number) => `R$ ${n}k`,                         sub: "+R$52k juros",   bg: "bg-[#08233E] border-red-500",  vColor: "text-[#FFD100]", sColor: "text-red-400" },
              ].map(({ label, to, fmt, sub, bg, vColor, sColor }, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className={`${bg} border-4 border-[#08233E] rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
                >
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${vColor} opacity-60`}>{label}</p>
                  <p className={`text-2xl font-black tracking-tighter ${vColor}`}>
                    <AnimatedNumber to={to} format={fmt} />
                  </p>
                  <p className={`text-[10px] font-black uppercase mt-1 ${sColor}`}>{sub}</p>
                </motion.div>
              ))}
            </motion.div>
            <div className="px-6 pb-6">
              <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-4 flex items-center gap-3">
                <TrendingUp size={20} className="text-[#FFD100]" strokeWidth={2.5} />
                <div>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-wider">Base da simulação</p>
                  <p className="text-sm font-black text-white">R$500 inicial + R$500/mês</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. ASSINATURAS ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* mockup */}
          <motion.div
            className="bg-[#FFFAF0] border-4 border-[#08233E] rounded-3xl overflow-hidden"
            style={{ boxShadow: "16px 16px 0px 0px rgba(8,35,62,1)" }}
            variants={SLIDE_LEFT}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <div className="bg-[#08233E] px-6 py-5 border-b-4 border-[#08233E] flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Radar</p>
                <h3 className="text-xl font-black text-[#FFD100] uppercase italic">Assinaturas Ativas</h3>
              </div>
              <div className="bg-red-500 border-2 border-[#08233E] px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-black text-white uppercase">Total: R$598/mês</span>
              </div>
            </div>
            <motion.div
              className="p-5 space-y-3"
              variants={STAGGER}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              {[
                { name: "Netflix",       type: "Assinatura",         val: "R$ 39,90",  date: "18 Mar", color: "#E50914", used: true },
                { name: "Spotify",       type: "Assinatura",         val: "R$ 21,90",  date: "22 Mar", color: "#1DB954", used: true },
                { name: "Duolingo Plus", type: "Assinatura",         val: "R$ 49,90",  date: "05 Abr", color: "#58CC02", used: false },
                { name: "Notebook Dell", type: "Parcelamento 3/12",  val: "R$ 320,00", date: "18 Mar", color: "#08233E", used: true },
                { name: "Adobe CC",      type: "Assinatura",         val: "R$ 166,50", date: "01 Abr", color: "#FF0000", used: false },
              ].map(({ name, type, val, date, color, used }, i) => (
                <motion.div
                  key={i}
                  variants={SLIDE_LEFT}
                  className={`flex items-center justify-between p-3 border-2 border-[#08233E] rounded-xl ${!used ? "bg-red-50" : "bg-white"} shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]`}
                >
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
                      <motion.span
                        className="text-[8px] font-black bg-red-100 text-red-600 border border-red-300 px-2 py-0.5 rounded uppercase"
                        animate={{ opacity: [1, 0.45, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Esquecida?
                      </motion.span>
                    )}
                    <div className="text-right">
                      <p className="font-black text-sm text-[#08233E]">{val}</p>
                      <p className="text-[9px] font-bold text-gray-400">{date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-7"
            variants={STAGGER_SLOW}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Radar de Assinaturas</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Sabe quanto você paga em{" "}
              <span className="text-red-500">assinaturas esquecidas?</span>
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg font-bold text-gray-500 leading-relaxed max-w-lg">
              A média dos nossos usuários descobre R$340 por mês em assinaturas que não usa mais. O Fundz te mostra tudo numa lista clara — e te deixa cancelar sem culpa.
            </motion.p>
            <motion.div variants={STAGGER} className="flex flex-wrap gap-4">
              {[
                { icon: <Bell size={16} strokeWidth={2.5} />,      text: "Alerta antes de cobrar" },
                { icon: <Eye size={16} strokeWidth={2.5} />,       text: "Visibilidade total" },
                { icon: <RefreshCw size={16} strokeWidth={2.5} />, text: "Parcelamentos rastreados" },
              ].map(({ icon, text }, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="flex items-center gap-2 bg-[#FFFAF0] border-2 border-[#08233E] rounded-lg px-4 py-2 shadow-[3px_3px_0px_0px_rgba(8,35,62,1)]"
                >
                  <span className="text-[#08233E]">{icon}</span>
                  <span className="text-[10px] font-black uppercase text-[#08233E] tracking-wider">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 10. METAS ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#08233E] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-7"
            variants={STAGGER_SLOW}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Metas Inteligentes</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#FFD100] leading-none">
              Sonho com data.{" "}
              <span className="text-white">E math.</span>
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg font-bold text-white/70 leading-relaxed max-w-lg">
              Coloca o valor, escolhe quando quer chegar lá, e o Fundz te diz quanto guardar por mês. Europa, PC Gamer, entrada do apê — tudo com prazo real, não esperança.
            </motion.p>
            <motion.div variants={STAGGER} className="grid grid-cols-2 gap-4">
              {[
                { Icon: Plane,   label: "Viagem",       color: "#820AD1" },
                { Icon: Home,    label: "Entrada Apê",  color: "#f97316" },
                { Icon: Monitor, label: "Tech",          color: "#22c55e" },
                { Icon: Car,     label: "Carro",         color: "#3b82f6" },
              ].map(({ Icon, label, color }, i) => (
                <motion.div
                  key={i}
                  variants={FADE_UP}
                  className="flex items-center gap-3 border-2 border-white/20 rounded-xl p-3 hover:border-[#FFD100] transition-colors cursor-default"
                  style={{ background: color + "22" }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Icon size={22} style={{ color }} strokeWidth={2} />
                  <span className="font-black text-xs uppercase text-white tracking-wider">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* mockup meta */}
          <motion.div
            className="bg-white border-4 border-[#FFD100] rounded-3xl p-8 text-[#08233E]"
            style={{ boxShadow: "16px 16px 0px 0px rgba(255,209,0,1)" }}
            variants={SLIDE_RIGHT}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <div className="flex justify-between items-center mb-6 pb-5 border-b-4 border-dashed border-[#08233E]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFD100] border-4 border-[#08233E] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                  <Plane size={22} className="text-[#08233E]" strokeWidth={2.5} />
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
                  <motion.div
                    className="h-full bg-emerald-400 border-r-2 border-[#08233E]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "45%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-2">
                  <span>Rendimento: R$350</span>
                  <span className="text-[#FFD100]">Acelerando</span>
                </div>
                <div className="h-6 w-full bg-gray-100 border-2 border-[#08233E] rounded-sm overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FFD100] border-r-2 border-[#08233E]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "15%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                  />
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
          </motion.div>
        </div>
      </section>

      {/* ── 11. SEGURANÇA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 bg-[#FFD100] border-y-4 border-[#08233E] relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 text-[#08233E] opacity-5 pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          >
            <Lock size={500} />
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div
            className="flex-1 space-y-6"
            variants={STAGGER_SLOW}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Segurança</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#08233E] leading-[0.88]">
              Fortaleza<br />Digital.
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-xl font-bold text-[#08233E]/70 max-w-lg">
              Seus dados são seus. Ponto final. Não vendemos, não acessamos suas senhas bancárias, não compartilhamos com terceiros.
            </motion.p>
            <motion.div variants={STAGGER} className="flex flex-wrap gap-3">
              {[
                { icon: <ShieldAlert size={18} className="text-emerald-600" />, label: "LGPD Compliant" },
                { icon: <KeyRound size={18} className="text-[#08233E]" />,      label: "Criptografia AES-256" },
                { icon: <Lock size={18} className="text-[#08233E]" />,         label: "Zero acesso bancário" },
              ].map(({ icon, label }, i) => (
                <motion.div
                  key={i}
                  variants={SLIDE_LEFT}
                  className="flex items-center gap-2 bg-white border-2 border-[#08233E] px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]"
                >
                  {icon}
                  <span className="font-black text-[10px] uppercase tracking-widest text-[#08233E]">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="w-52 h-52 flex-shrink-0"
            variants={FADE_IN}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <div className="bg-[#08233E] p-10 rounded-[40px] border-4 border-[#08233E] shadow-[16px_16px_0px_0px_rgba(255,255,255,0.8)] flex items-center justify-center">
              <Lock size={100} className="text-[#FFD100]" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 12. PLANOS ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Planos</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              Simples assim.
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg font-bold text-gray-500 mt-4">Sem pegadinha, sem asterisco no rodapé.</motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {/* Grátis */}
            <motion.div
              className="bg-white border-4 border-[#08233E] rounded-3xl p-8 flex flex-col"
              style={{ boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)" }}
              variants={FADE_UP}
              whileHover={{ y: -4, x: -4, boxShadow: "12px 12px 0px 0px rgba(8,35,62,1)", transition: { duration: 0.18 } }}
            >
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
            </motion.div>

            {/* Pro */}
            <motion.div
              className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-8 flex flex-col relative overflow-hidden"
              variants={FADE_UP}
              animate={{
                boxShadow: [
                  "12px 12px 0px 0px rgba(255,209,0,1)",
                  "8px 8px 0px 0px rgba(255,209,0,0.5)",
                  "12px 12px 0px 0px rgba(255,209,0,1)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute top-5 right-5"
                initial={{ scale: 0, rotate: 3 }}
                whileInView={{ scale: 1, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.4 }}
              >
                <div className="bg-[#FFD100] text-[#08233E] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[#08233E] rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                  Mais Popular
                </div>
              </motion.div>
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
              <motion.button
                onClick={() => navigate("/auth")}
                className="w-full bg-[#FFD100] text-[#08233E] py-4 rounded-xl border-4 border-[#08233E] font-black text-sm uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
                style={{ boxShadow: "6px 6px 0px 0px rgba(255,255,255,0.3)" }}
                whileHover={{ boxShadow: "0px 0px 0px 0px rgba(255,255,255,0.3)", y: 6, x: 6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
              >
                <Flame size={16} strokeWidth={2.5} /> Começar Pro agora
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 13. DEPOIMENTOS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFFAF0] border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <motion.div variants={FADE_UP}><SectionLabel>Depoimentos</SectionLabel></motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#08233E] leading-none">
              A galera já tá usando.
            </motion.h2>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {TESTIMONIALS.map(({ name, role, text, stars, color, initials }, i) => (
              <motion.div
                key={i}
                className="bg-white border-4 border-[#08233E] rounded-3xl p-6 flex flex-col cursor-default"
                style={{
                  boxShadow: "8px 8px 0px 0px rgba(8,35,62,1)",
                  rotate: i % 2 === 0 ? -0.8 : 0.8,
                }}
                variants={FADE_UP}
                whileHover={{
                  rotate: 0,
                  y: -5,
                  x: -5,
                  boxShadow: "12px 12px 0px 0px rgba(8,35,62,1)",
                  transition: { duration: 0.2 },
                }}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 14. CATEGORY VIBES ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 bg-[#08233E] border-b-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto">
          <motion.p
            className="text-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-8"
            variants={FADE_IN}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            Monitore tudo que importa na sua vida
          </motion.p>
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
              <motion.div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 border-white/20 cursor-default"
                style={{ background: color + "22" }}
                initial={{ opacity: 0, x: CHIP_DIRS[i].x, y: CHIP_DIRS[i].y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 22 }}
                whileHover={{ scale: 1.06, y: -3, borderColor: "#FFD100" }}
              >
                <span style={{ color }}>{icon}</span>
                <span className="text-xs font-black text-white uppercase tracking-wider">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-4 sm:px-8 bg-white relative overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-[#FFD100] border-4 border-[#08233E] opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-emerald-400 border-4 border-[#08233E] opacity-20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden"
            style={{ boxShadow: "16px 16px 0px 0px rgba(255,209,0,1)" }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, type: "spring", stiffness: 180, damping: 22 }}
          >
            <div className="absolute -top-8 -left-8 w-32 h-32 border-4 border-white/10 rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FFD100] opacity-10 rotate-45" />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 bg-[#FFD100] text-[#08233E] text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-white rounded-md shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] mb-8 rotate-[-1deg]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
              >
                <Sparkles size={13} strokeWidth={2.5} />
                Grátis pra sempre · Sem cartão
              </motion.div>

              <motion.h2
                className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase"
                variants={STAGGER}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {["Vai ficar só", "olhando o saldo", "diminuir?"].map((line, i) => (
                  <motion.span key={i} variants={FADE_UP} className="block">
                    {i === 1 ? <span className="text-[#FFD100]">{line}</span> : line}
                  </motion.span>
                ))}
              </motion.h2>

              <motion.p
                className="text-xl font-bold mb-10 max-w-2xl mx-auto text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                2.400 pessoas já pararam de passar raiva no fim do mês. Junte-se e assuma o controle do seu dinheiro hoje.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 22 }}
              >
                <motion.button
                  onClick={() => navigate("/auth")}
                  className="bg-[#FFD100] text-[#08233E] px-10 py-5 rounded-xl border-4 border-white font-black text-xl uppercase tracking-tight flex items-center gap-3 cursor-pointer"
                  style={{ boxShadow: "8px 8px 0px 0px rgba(255,255,255,0.4)" }}
                  whileHover={{ boxShadow: "0px 0px 0px 0px rgba(255,255,255,0.4)", y: 8, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                >
                  Criar Conta Grátis <ArrowRight strokeWidth={3} size={22} />
                </motion.button>
                <p className="text-white/40 font-bold text-sm uppercase tracking-wider">
                  ou{" "}
                  <span
                    className="text-white/60 cursor-pointer hover:text-white transition-colors"
                    onClick={() => navigate("/auth")}
                  >
                    fazer login
                  </span>
                </p>
              </motion.div>

              <motion.div
                className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                {["✓ Sem cartão de crédito", "✓ Setup em 2 minutos", "✓ Cancele quando quiser"].map((t, i) => (
                  <span key={i} className="text-xs font-black text-white/50 uppercase tracking-wider">{t}</span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 16. FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#08233E] border-t-4 border-[#08233E]">
        <motion.div
          className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 border-b-2 border-white/10"
          variants={STAGGER}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div variants={FADE_UP}>
            <img src="/blue-logo.png" alt="Fundz" className="h-8 mb-4 brightness-0 invert" />
            <p className="text-sm font-bold text-white/50 leading-relaxed">
              Gestão financeira sem frescura para a geração que quer viver e investir ao mesmo tempo.
            </p>
          </motion.div>
          {[
            { title: "Produto", items: ["Features", "Planos", "Segurança", "Roadmap"] },
            { title: "Legal",   items: ["Privacidade", "Termos de Uso", "LGPD", "Cookies"] },
            { title: "Contato", items: ["Instagram", "Twitter/X", "LinkedIn", "E-mail"] },
          ].map(({ title, items }) => (
            <motion.div key={title} variants={FADE_UP}>
              <h4 className="text-[10px] font-black text-[#FFD100] uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <motion.span
                      className="text-sm font-bold text-white/50 uppercase tracking-wider cursor-pointer flex items-center gap-1 w-fit"
                      whileHover={{ x: 4, color: "rgba(255,255,255,0.9)" }}
                      transition={{ duration: 0.15 }}
                    >
                      {item}
                      {title === "Contato" && <ArrowUpRight size={12} strokeWidth={2.5} />}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            © 2026 HR Labs. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
            Dinheiro no bolso, pé no rolê.
          </p>
        </div>
      </footer>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          min-width: 200%;
        }
        .animate-marquee-paused {
          animation: marquee 20s linear infinite;
          animation-play-state: paused;
          min-width: 200%;
        }
      ` }} />
    </div>
  );
}
