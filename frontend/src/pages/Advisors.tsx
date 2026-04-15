import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  Plus,
  X,
  Check,
  Pencil,
  Trash2,
  Flame,
  Crown,
  Compass,
  User,
  Clock,
  MessageSquare,
  Bot,
  History,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import {
  chatWithAdvisor,
  buildFinancialContext,
  type ChatMessage,
} from "../service/advisors.service";

// ── Types ──────────────────────────────────────────────────────────────────

type Persona = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  catchphrase: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  system: string;
  suggestions: string[];
  custom?: boolean;
};

type ChatSession = {
  id: string;
  personaId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

// ── Personas ───────────────────────────────────────────────────────────────

const PRESET_PERSONAS: Persona[] = [
  {
    id: "vibe",
    name: "Vibe",
    tagline: "Caos Consciente",
    desc: "Sem sermão, sem frescura. Te ajuda a curtir a vida sem zerar a conta.",
    catchphrase: "E aí, qual é o plano?",
    color: "#FF3B3B",
    textColor: "#ffffff",
    icon: <Flame size={22} strokeWidth={2.5} />,
    system: `Você é Vibe, o conselheiro financeiro da galera que curte viver a vida.
Você fala de forma casual e direta, usa gírias brasileiras naturais (cara, mano, trampo, role, etc.), é animado e nunca pregador.
Você equilibra curtição com responsabilidade — não é irresponsável, mas entende que dinheiro existe pra ser usado com inteligência.
Suas respostas são curtas, práticas e com energia. Use emojis quando fizer sentido.
Sempre baseie suas respostas nos dados financeiros reais do usuário fornecidos no contexto.
Nunca invente números. Se não tiver dado, diga que não tem como calcular sem mais info.`,
    suggestions: [
      "Cabe um show de R$200 esse mês?",
      "Quanto posso gastar no fim de semana sem culpa?",
      "Tô gastando demais em alguma coisa?",
      "Onde posso economizar sem abrir mão de curtir?",
    ],
  },
  {
    id: "core",
    name: "Core",
    tagline: "Seriedade & Performance",
    desc: "Cada real tem função. Focado em crescimento, resultado e eficiência.",
    catchphrase: "O que os seus dados dizem sobre você?",
    color: "#08233e",
    textColor: "#ffd100",
    icon: <Crown size={22} strokeWidth={2.5} />,
    system: `Você é Core, estrategista financeiro sênior com foco absoluto em maximização de patrimônio.
Você é direto, analítico e baseado em dados. Usa termos financeiros com precisão mas sempre explica quando necessário.
Você identifica ineficiências, oportunidades de investimento e cortes de gastos com lógica cirúrgica.
Suas respostas incluem números, percentuais e comparações quando relevante.
Você não tem paciência para desculpas mas respeita as limitações reais do usuário.
Sempre baseie suas respostas nos dados financeiros reais fornecidos no contexto.
Seja conciso, denso em valor, sem enrolação.`,
    suggestions: [
      "Minha taxa de poupança está no nível certo?",
      "Onde posso cortar para investir mais?",
      "Meu perfil de investimento faz sentido?",
      "Em quanto tempo atinjo minha meta nesse ritmo?",
    ],
  },
  {
    id: "flow",
    name: "Flow",
    tagline: "Organização & Equilíbrio",
    desc: "Saúde financeira de verdade. Sem culpa, sem extremos, só hábitos que duram.",
    catchphrase: "Como você realmente se sente com seu dinheiro?",
    color: "#22c55e",
    textColor: "#ffffff",
    icon: <Compass size={22} strokeWidth={2.5} />,
    system: `Você é Flow, consultor(a) de bem-estar financeiro que acredita em equilíbrio sustentável.
Você combina análise financeira sólida com inteligência emocional e visão de longo prazo.
É acolhedor(a), prático(a) e nunca julga escolhas passadas — foca em caminhos para frente.
Você entende que dinheiro é uma ferramenta para qualidade de vida, não um fim em si mesmo.
Suas respostas são honestas mas empáticas, e constroem confiança gradual em vez de pressão.
Sempre baseie suas respostas nos dados financeiros reais fornecidos no contexto.
Use linguagem clara e acessível, sem jargão desnecessário.`,
    suggestions: [
      "Minha relação com dinheiro está saudável?",
      "Como criar uma reserva de emergência sem sofrimento?",
      "Tenho gastos que valem a pena mesmo custando mais?",
      "Como equilibrar curtição e poupança?",
    ],
  },
];

// ── Storage ────────────────────────────────────────────────────────────────

const PERSONAS_KEY = "fundz_custom_personas_v2";
const SESSIONS_KEY = "fundz_chat_sessions_v1";

function loadCustomPersonas(): Persona[] {
  try {
    const raw = localStorage.getItem(PERSONAS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.map((p: Persona) => ({
      ...p,
      textColor: p.textColor ?? "#ffffff",
      icon: <User size={22} strokeWidth={2.5} />,
    }));
  } catch {
    return [];
  }
}

function saveCustomPersonas(personas: Persona[]) {
  const serializable = personas.map((p) => {
    const copy: Partial<Persona> = { ...p };
    delete copy.icon;
    return copy;
  });
  localStorage.setItem(PERSONAS_KEY, JSON.stringify(serializable));
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function formatDateShort(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ── Custom persona modal ───────────────────────────────────────────────────

function CustomModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Persona>;
  onSave: (p: Omit<Persona, "id" | "icon" | "catchphrase">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [system, setSystem] = useState(initial?.system ?? "");
  const [color, setColor] = useState(initial?.color ?? "#a855f7");
  const colors = [
    "#a855f7",
    "#FF3B3B",
    "#22c55e",
    "#08233e",
    "#ffd100",
    "#ec4899",
    "#f59e0b",
    "#14b8a6",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-lg rounded-[var(--radius-card)] overflow-hidden border-2 border-black shadow-[var(--neo-shadow)] bg-[var(--main-bg)]"
      >
        <div
          className="px-6 py-4 border-b-2 border-black flex items-center justify-between"
          style={{
            background: color,
            color: color === "#ffd100" ? "#000" : "#fff",
          }}
        >
          <span className="text-sm font-black uppercase tracking-widest">
            {initial?.system ? "Editar" : "Novo"} Advisor
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border-2 border-black bg-white text-black hover:bg-[var(--secondary)] shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-1.5 block">
                Nome
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="Ex: MEU COACH"
                className="w-full px-3 py-2.5 text-sm font-bold bg-white border-2 border-black rounded-md text-black placeholder-black/30 focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-1.5 block">
                Estilo
              </label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                maxLength={30}
                placeholder="Ex: Minimalista"
                className="w-full px-3 py-2.5 text-sm font-bold bg-white border-2 border-black rounded-md text-black placeholder-black/30 focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-1.5 block">
              Cor
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-md border-2 border-black cursor-pointer transition-all"
                  style={{
                    background: c,
                    transform:
                      color === c ? "translate(2px, 2px)" : "translate(0, 0)",
                    boxShadow: color === c ? "none" : "2px 2px 0px 0px #000",
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-1.5 block">
              Prompt do sistema
            </label>
            <textarea
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              rows={6}
              placeholder={`Como seu advisor deve se comportar?\n\nEx: Você é um coach financeiro budista que foca em minimalismo e desapego material...`}
              className="w-full px-3 py-2.5 text-sm font-medium bg-white border-2 border-black rounded-md text-black placeholder-black/30 focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all resize-none leading-relaxed"
            />
            <p className="text-[10px] text-black/40 mt-1 font-bold">
              Seus dados financeiros são incluídos automaticamente.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-md bg-white border-2 border-black text-black hover:bg-black/5 cursor-pointer shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!name.trim() || !system.trim()) return;
                onSave({
                  name: name.trim().toUpperCase(),
                  tagline: tagline.trim() || "Personalizado",
                  desc: "Advisor personalizado.",
                  color,
                  textColor: color === "#ffd100" ? "#000000" : "#ffffff",
                  system: system.trim(),
                  suggestions: [],
                  custom: true,
                });
              }}
              disabled={!name.trim() || !system.trim()}
              className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-md border-2 border-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              style={{
                background: color,
                color: color === "#ffd100" ? "#000" : "#fff",
              }}
            >
              <Check size={13} strokeWidth={3} /> Salvar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Persona card (neo-brutalist) ───────────────────────────────────────────

function PersonaCard({
  persona,
  index,
  sessionCount,
  onSelect,
}: {
  persona: Persona;
  index: number;
  sessionCount: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 28,
      }}
      onClick={onSelect}
      whileHover={{ translateX: 2, translateY: 2 }}
      className="group relative flex flex-col text-left rounded-[var(--radius-card)] border-2 border-black shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer overflow-hidden min-h-[320px]"
      style={{ background: persona.color, color: persona.textColor }}
    >
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full border-2 opacity-20 pointer-events-none"
        style={{ borderColor: persona.textColor }}
      />
      <div
        className="absolute -bottom-16 -left-8 w-32 h-32 rounded-full border-2 opacity-15 pointer-events-none"
        style={{ borderColor: persona.textColor }}
      />

      <div className="flex justify-between items-start p-6 relative z-10">
        <span
          className="text-[10px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-md border-2"
          style={{
            borderColor: persona.textColor,
            background: `${persona.textColor}15`,
          }}
        >
          0{index + 1}
        </span>
        <div
          className="w-11 h-11 rounded-md border-2 flex items-center justify-center"
          style={{
            borderColor: persona.textColor,
            background: `${persona.textColor}20`,
          }}
        >
          {persona.icon}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end p-6 pt-0 relative z-10">
        <h2
          className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-2"
          style={{ fontFamily: "Catchland, sans-serif" }}
        >
          {persona.name}
        </h2>
        <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-90">
          {persona.tagline}
        </p>
        <p className="text-sm font-medium leading-relaxed opacity-80 mb-4">
          {persona.desc}
        </p>

        <div
          className="text-xs font-medium italic opacity-70 border-l-2 pl-3 mb-5"
          style={{ borderColor: persona.textColor }}
        >
          "{persona.catchphrase}"
        </div>

        <div
          className="flex items-center justify-between pt-3 border-t-2"
          style={{ borderColor: `${persona.textColor}30` }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 flex items-center gap-1.5">
            <MessageSquare size={11} strokeWidth={3} />
            {sessionCount} {sessionCount === 1 ? "conversa" : "conversas"}
          </span>
          <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
            Conversar
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ── Selection screen ───────────────────────────────────────────────────────

function SelectionScreen({
  customPersonas,
  sessions,
  allPersonas,
  onSelect,
  onOpenSession,
  onDeleteSession,
  onNewCustom,
  onEditCustom,
  onDeleteCustom,
}: {
  customPersonas: Persona[];
  sessions: ChatSession[];
  allPersonas: Persona[];
  onSelect: (p: Persona, newSession: boolean) => void;
  onOpenSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
  onNewCustom: () => void;
  onEditCustom: (p: Persona) => void;
  onDeleteCustom: (id: string) => void;
}) {
  const sessionCountByPersona = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      map[s.personaId] = (map[s.personaId] ?? 0) + 1;
    });
    return map;
  }, [sessions]);

  const recentSessions = useMemo(
    () => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 12),
    [sessions],
  );

  const personaById = useMemo(() => {
    const map: Record<string, Persona> = {};
    allPersonas.forEach((p) => (map[p.id] = p));
    return map;
  }, [allPersonas]);

  return (
    <motion.div
      key="select"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col h-full overflow-y-auto bg-[var(--main-bg)]"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-10 pt-8 md:pt-10 pb-6 mt-8 mx-auto w-full">
        <h1
          className="text-4xl md:text-5xl text-[var(--primary)] leading-[0.95] mb-2"
          style={{ fontFamily: "Catchland, sans-serif" }}
        >
          Com <span className="text-[var(--secondary)] px-2">quem</span> quer
          conversar hoje?
        </h1>
        <p className="text-sm md:text-base text-black/60 font-medium max-w-2xl">
          Três personalidades, três formas de olhar pro seu dinheiro. Escolha o
          tom e comece um papo — ou volte em uma conversa anterior.
        </p>
      </div>

      {/* Persona cards */}
      <div className="px-4 sm:px-6 md:px-10 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESET_PERSONAS.map((persona, i) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              index={i}
              sessionCount={sessionCountByPersona[persona.id] ?? 0}
              onSelect={() => onSelect(persona, true)}
            />
          ))}
        </div>
      </div>

      {/* Custom personas */}
      <div className="px-4 sm:px-6 md:px-10 pb-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">
            Advisors Personalizados
          </span>
          <div className="h-[2px] flex-1 bg-black/10" />
        </div>
        <div className="flex flex-wrap gap-3">
          {customPersonas.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-md border-2 border-black bg-white shadow-[var(--neo-shadow-hover)]"
            >
              <button
                onClick={() => onSelect(p, true)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-md border-2 border-black flex items-center justify-center"
                  style={{ background: p.color, color: p.textColor }}
                >
                  <User size={13} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-black tracking-tight uppercase">
                    {p.name}
                  </p>
                  <p className="text-[9px] text-black/50 uppercase tracking-wider font-bold">
                    {p.tagline}
                  </p>
                </div>
              </button>
              <div className="flex gap-1 ml-1">
                <button
                  onClick={() => onEditCustom(p)}
                  className="p-1.5 rounded-md border-2 border-black bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] cursor-pointer"
                  title="Editar"
                >
                  <Pencil size={10} strokeWidth={3} className="text-black" />
                </button>
                <button
                  onClick={() => onDeleteCustom(p.id)}
                  className="p-1.5 rounded-md border-2 border-black bg-red-500 hover:bg-red-600 cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 size={10} strokeWidth={3} className="text-white" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={onNewCustom}
            className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-black/40 bg-transparent text-black/50 hover:text-black hover:border-black hover:bg-white transition-all cursor-pointer text-xs font-black uppercase tracking-widest"
          >
            <Plus size={13} strokeWidth={3} /> Novo Advisor
          </button>
        </div>
      </div>

      {/* Recent chat history */}
      <div className="px-4 sm:px-6 md:px-10 pb-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <History size={14} strokeWidth={2.5} className="text-black/70" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">
            Conversas Recentes
          </span>
          <div className="h-[2px] flex-1 bg-black/10" />
        </div>

        {recentSessions.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border-2 border-dashed border-black/30 p-8 text-center bg-white/50">
            <Clock
              size={20}
              strokeWidth={2.5}
              className="text-black/40 mx-auto mb-2"
            />
            <p className="text-sm font-bold text-black/60">
              Nenhuma conversa ainda.
            </p>
            <p className="text-xs text-black/40 mt-1 font-medium">
              Escolha um advisor e comece seu primeiro papo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentSessions.map((s) => {
              const persona = personaById[s.personaId];
              if (!persona) return null;
              return (
                <div
                  key={s.id}
                  className="group relative rounded-md border-2 border-black bg-white shadow-[var(--neo-shadow-hover)] hover:shadow-[var(--neo-shadow)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
                >
                  <button
                    onClick={() => onOpenSession(s)}
                    className="w-full text-left p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-md border-2 border-black flex items-center justify-center shrink-0"
                        style={{
                          background: persona.color,
                          color: persona.textColor,
                        }}
                      >
                        <span className="text-[10px] font-black">
                          {persona.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/70">
                        {persona.name}
                      </span>
                      <span className="text-[9px] font-bold text-black/40 ml-auto">
                        {formatDateShort(s.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-black line-clamp-2 leading-snug">
                      {s.title}
                    </p>
                    <p className="text-[10px] font-medium text-black/40 mt-1.5">
                      {s.messages.length}{" "}
                      {s.messages.length === 1 ? "mensagem" : "mensagens"}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-md border-2 border-black bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity cursor-pointer"
                    title="Excluir"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── History sidebar (chat screen) ──────────────────────────────────────────

function HistorySidebar({
  sessions,
  persona,
  activeSessionId,
  onOpen,
  onNew,
  onDelete,
  onClose,
}: {
  sessions: ChatSession[];
  persona: Persona;
  activeSessionId: string | null;
  onOpen: (s: ChatSession) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const personaSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.personaId === persona.id)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions, persona.id],
  );

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="w-[280px] shrink-0 bg-[var(--main-bg)] border-r-2 border-black flex flex-col h-full"
    >
      <div
        className="px-4 py-3 border-b-2 border-black flex items-center justify-between"
        style={{ background: persona.color, color: persona.textColor }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
          <History size={12} strokeWidth={3} />
          Histórico
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md border-2 border-black bg-white text-black hover:bg-[var(--secondary)] cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          title="Fechar histórico"
        >
          <PanelLeftClose size={12} strokeWidth={3} />
        </button>
      </div>

      <div className="p-3 border-b-2 border-black">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border-2 border-black bg-[var(--primary)] text-[var(--secondary)] text-xs font-black uppercase tracking-widest shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
        >
          <Plus size={13} strokeWidth={3} />
          Nova Conversa
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {personaSessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock
              size={18}
              strokeWidth={2.5}
              className="text-black/30 mx-auto mb-2"
            />
            <p className="text-[11px] font-bold text-black/50">
              Sem conversas com {persona.name}.
            </p>
          </div>
        ) : (
          personaSessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                className={`group relative rounded-md border-2 border-black transition-all ${
                  isActive
                    ? "bg-[var(--secondary)] shadow-none translate-x-[2px] translate-y-[2px]"
                    : "bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
              >
                <button
                  onClick={() => onOpen(s)}
                  className="w-full text-left p-3 cursor-pointer"
                >
                  <p className="text-xs font-bold text-black line-clamp-2 leading-snug pr-5">
                    {s.title}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] font-bold text-black/50">
                      {formatDateShort(s.updatedAt)}
                    </span>
                    <span className="text-[9px] font-bold text-black/40">
                      {s.messages.length} msg
                    </span>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-md border-2 border-black bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity cursor-pointer"
                >
                  <X size={9} strokeWidth={3} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </motion.aside>
  );
}

// ── Chat screen ────────────────────────────────────────────────────────────

function ChatScreen({
  persona,
  sessions,
  activeSessionId,
  messages,
  loading,
  input,
  setInput,
  onSend,
  onBack,
  inputRef,
  historyOpen,
  setHistoryOpen,
  onOpenSession,
  onNewSession,
  onDeleteSession,
}: {
  persona: Persona;
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: (text?: string) => void;
  onBack: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  historyOpen: boolean;
  setHistoryOpen: (b: boolean) => void;
  onOpenSession: (s: ChatSession) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full bg-[var(--main-bg)]"
    >
      <AnimatePresence>
        {historyOpen && (
          <HistorySidebar
            sessions={sessions}
            persona={persona}
            activeSessionId={activeSessionId}
            onOpen={onOpenSession}
            onNew={onNewSession}
            onDelete={onDeleteSession}
            onClose={() => setHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="shrink-0 flex items-center justify-between px-5 md:px-8 py-4 md:py-6 border-b-2 border-black relative overflow-hidden"
          style={{ background: persona.color, color: persona.textColor }}
        >
          {/* Elementos decorativos de fundo */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 opacity-15 pointer-events-none"
            style={{ borderColor: persona.textColor }}
          />
          <div
            className="absolute -bottom-14 right-24 w-28 h-28 rounded-full border-2 opacity-10 pointer-events-none"
            style={{ borderColor: persona.textColor }}
          />

          {/* LADO ESQUERDO: Botões de navegação */}
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={onBack}
              className="p-2.5 rounded-md border-2 border-black bg-white text-black hover:bg-[var(--secondary)] cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              title="Voltar"
            >
              <ArrowLeft size={16} strokeWidth={3} />
            </button>

            {!historyOpen && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="p-2.5 rounded-md border-2 border-black bg-white text-black hover:bg-[var(--secondary)] cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                title="Abrir histórico"
              >
                <PanelLeftOpen size={16} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* LADO DIREITO: Informações do Advisor */}
          <div className="flex items-center gap-4 min-w-0 relative z-10 text-right">
            <div className="min-w-0">
              <p
                className="text-3xl pt-5 md:text-4xl font-black tracking-tight leading-none truncate"
                style={{ fontFamily: "Catchland, sans-serif" }}
              >
                {persona.name}
              </p>
              <p className="text-[11px] md:text-xs font-black uppercase tracking-widest mt-1.5 opacity-85">
                {persona.tagline}
              </p>
            </div>

            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-md border-2 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#000]"
              style={{ background: persona.textColor, color: persona.color }}
            >
              <span className="scale-125">{persona.icon}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4 min-h-0">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full gap-8 text-center max-w-md mx-auto"
              >
                <div>
                  <div
                    className="w-16 h-16 rounded-md border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[var(--neo-shadow)]"
                    style={{
                      background: persona.color,
                      color: persona.textColor,
                    }}
                  >
                    {persona.icon}
                  </div>
                  <h2
                    className="text-3xl text-[var(--primary)] tracking-tight mb-1"
                    style={{ fontFamily: "Catchland, sans-serif" }}
                  >
                    {persona.catchphrase}
                  </h2>
                  <p className="text-sm text-black/60 font-medium">
                    {persona.desc}
                  </p>
                </div>

                {persona.suggestions.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/50 mb-1">
                      Perguntas para começar
                    </p>
                    {persona.suggestions.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                        onClick={() => onSend(s)}
                        className="text-left px-4 py-3 rounded-md border-2 border-black bg-white text-sm font-bold text-black shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                      >
                        <span className="opacity-40 mr-2 font-black">→</span>
                        {s}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
                    >
                      {!isUser && (
                        <div
                          className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: persona.color,
                            color: persona.textColor,
                          }}
                        >
                          <span>{persona.icon}</span>
                        </div>
                      )}
                      <div
                        className="max-w-[75%] px-4 py-3 text-sm font-medium leading-relaxed whitespace-pre-wrap rounded-md border-2 border-black shadow-[var(--neo-shadow-hover)]"
                        style={
                          isUser
                            ? {
                                background: "var(--primary)",
                                color: "#ffffff",
                              }
                            : {
                                background: "#ffffff",
                                color: "#000000",
                              }
                        }
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                })}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center shrink-0"
                      style={{
                        background: persona.color,
                        color: persona.textColor,
                      }}
                    >
                      {persona.icon}
                    </div>
                    <div className="px-5 py-4 rounded-md border-2 border-black bg-white shadow-[var(--neo-shadow-hover)] flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: persona.color }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.1, 0.8],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 md:px-8 py-4 border-t-2 border-black bg-white">
          <div className="flex gap-3 items-end max-w-3xl mx-auto">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={`Pergunte algo para ${persona.name}...`}
              rows={1}
              className="flex-1 px-4 py-3 text-sm font-medium rounded-md text-black placeholder-black/30 focus:outline-none resize-none leading-relaxed disabled:opacity-40 bg-[var(--main-bg)] border-2 border-black shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              style={{ maxHeight: "120px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            <button
              onClick={() => onSend()}
              disabled={!input.trim() || loading}
              className="p-3.5 rounded-md border-2 border-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              style={{ background: persona.color, color: persona.textColor }}
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-[9px] text-black/40 text-center mt-2 font-bold uppercase tracking-widest">
            Enter envia · Shift+Enter quebra linha
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export function Advisors() {
  const [customPersonas, setCustomPersonas] =
    useState<Persona[]>(loadCustomPersonas);
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const allPersonas = useMemo(
    () => [...PRESET_PERSONAS, ...customPersonas],
    [customPersonas],
  );

  const activeMessages = useMemo(() => {
    if (!activeSessionId) return [];
    return sessions.find((s) => s.id === activeSessionId)?.messages ?? [];
  }, [sessions, activeSessionId]);

  useEffect(() => {
    buildFinancialContext().then(setContext);
  }, []);

  const persistSessions = (next: ChatSession[]) => {
    setSessions(next);
    saveSessions(next);
  };

  const handleSelect = (p: Persona, newSession: boolean) => {
    setActivePersona(p);
    setInput("");
    if (newSession) setActiveSessionId(null);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleOpenSession = (s: ChatSession) => {
    const persona = allPersonas.find((p) => p.id === s.personaId);
    if (!persona) return;
    setActivePersona(persona);
    setActiveSessionId(s.id);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBack = () => {
    setActivePersona(null);
    setActiveSessionId(null);
    setHistoryOpen(false);
    setInput("");
  };

  const handleDeleteSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    persistSessions(next);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSend = useCallback(
    async (text?: string) => {
      if (!activePersona) return;
      const content = (text ?? input).trim();
      if (!content || loading) return;

      const userMsg: ChatMessage = { role: "user", content };
      const now = Date.now();

      let sessionId = activeSessionId;
      let history: ChatMessage[];
      let next: ChatSession[];

      if (!sessionId) {
        sessionId = `sess_${now}`;
        const newSession: ChatSession = {
          id: sessionId,
          personaId: activePersona.id,
          title: content.slice(0, 80),
          messages: [userMsg],
          createdAt: now,
          updatedAt: now,
        };
        history = [userMsg];
        next = [newSession, ...sessions];
        setActiveSessionId(sessionId);
      } else {
        const existing = sessions.find((s) => s.id === sessionId);
        history = [...(existing?.messages ?? []), userMsg];
        next = sessions.map((s) =>
          s.id === sessionId ? { ...s, messages: history, updatedAt: now } : s,
        );
      }
      persistSessions(next);
      setInput("");
      setLoading(true);

      try {
        const reply = await chatWithAdvisor(
          activePersona.system,
          history,
          context ?? "Dados financeiros não disponíveis.",
        );
        const assistantMsg: ChatMessage = { role: "assistant", content: reply };
        const withReply = [...history, assistantMsg];
        const after = next.map((s) =>
          s.id === sessionId
            ? { ...s, messages: withReply, updatedAt: Date.now() }
            : s,
        );
        persistSessions(after);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Erro desconhecido";
        const errReply: ChatMessage = {
          role: "assistant",
          content: `Não consegui responder agora. ${errMsg}`,
        };
        const withErr = [...history, errReply];
        const after = next.map((s) =>
          s.id === sessionId
            ? { ...s, messages: withErr, updatedAt: Date.now() }
            : s,
        );
        persistSessions(after);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, loading, activePersona, activeSessionId, sessions, context],
  );

  const handleSaveCustom = (
    data: Omit<Persona, "id" | "icon" | "catchphrase">,
  ) => {
    const newP: Persona = {
      ...data,
      id: editingPersona?.id ?? `custom_${Date.now()}`,
      icon: <User size={22} strokeWidth={2.5} />,
      catchphrase: "O que você quer resolver?",
    };

    const updated = editingPersona
      ? customPersonas.map((p) => (p.id === editingPersona.id ? newP : p))
      : [...customPersonas, newP];

    setCustomPersonas(updated);
    saveCustomPersonas(updated);
    if (!editingPersona) handleSelect(newP, true);
    setModalOpen(false);
    setEditingPersona(null);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customPersonas.filter((p) => p.id !== id);
    setCustomPersonas(updated);
    saveCustomPersonas(updated);
    if (activePersona?.id === id) handleBack();
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[var(--main-bg)]">
      <AnimatePresence>
        {modalOpen && (
          <CustomModal
            key="modal"
            initial={editingPersona ?? undefined}
            onSave={handleSaveCustom}
            onClose={() => {
              setModalOpen(false);
              setEditingPersona(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activePersona ? (
          <ChatScreen
            key={`chat-${activePersona.id}`}
            persona={activePersona}
            sessions={sessions}
            activeSessionId={activeSessionId}
            messages={activeMessages}
            loading={loading}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onBack={handleBack}
            inputRef={inputRef}
            historyOpen={historyOpen}
            setHistoryOpen={setHistoryOpen}
            onOpenSession={handleOpenSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
          />
        ) : (
          <SelectionScreen
            key="select"
            customPersonas={customPersonas}
            sessions={sessions}
            allPersonas={allPersonas}
            onSelect={handleSelect}
            onOpenSession={handleOpenSession}
            onDeleteSession={handleDeleteSession}
            onNewCustom={() => {
              setEditingPersona(null);
              setModalOpen(true);
            }}
            onEditCustom={(p) => {
              setEditingPersona(p);
              setModalOpen(true);
            }}
            onDeleteCustom={handleDeleteCustom}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
