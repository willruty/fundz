import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  Plus,
  X,
  Clock,
  History,
  Database,
  AlertTriangle,
  Search,
  MessageSquare,
  SquarePen,
} from "lucide-react";
import {
  PRESET_PERSONAS,
  loadCustomPersonas,
  loadSessions,
  saveSessions,
  formatDateShort,
  type Persona,
  type ChatSession,
} from "../service/advisorsData";
import {
  chatWithAdvisor,
  buildFinancialContext,
  type ChatMessage,
} from "../service/advisors.service";

// ── Markdown renderer (bold, italic, bullets — sem lib externa) ────────────

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2] !== undefined) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else if (m[3] !== undefined) parts.push(<em key={m.index}>{m[3]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function SimpleMarkdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^[-*•]\s/.test(l.trim()) || l.trim() === "");
        if (isList) {
          return (
            <ul key={bi} className="list-none flex flex-col gap-0.5 pl-0">
              {lines.filter((l) => l.trim()).map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="font-black opacity-50 shrink-0">→</span>
                  <span>{parseInline(l.replace(/^[-*•]\s/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className="leading-relaxed">
            {lines.map((l, li) => (
              <span key={li}>
                {parseInline(l)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// ── History panel ──────────────────────────────────────────────────────────

function groupByTime(sessions: ChatSession[]): {
  label: string;
  items: ChatSession[];
}[] {
  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday); startOfWeek.setDate(startOfToday.getDate() - 7);
  const startOfMonth = new Date(startOfToday); startOfMonth.setDate(startOfToday.getDate() - 30);

  const buckets: Record<string, ChatSession[]> = {
    "Hoje": [],
    "Esta semana": [],
    "Este mês": [],
    "Mais antigo": [],
  };

  for (const s of sessions) {
    const d = new Date(s.updatedAt);
    if (d >= startOfToday) buckets["Hoje"].push(s);
    else if (d >= startOfWeek) buckets["Esta semana"].push(s);
    else if (d >= startOfMonth) buckets["Este mês"].push(s);
    else buckets["Mais antigo"].push(s);
  }

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

function HistoryPanel({
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
  const [search, setSearch] = useState("");

  const personaSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.personaId === persona.id)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions, persona.id],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? personaSessions.filter((s) => s.title.toLowerCase().includes(q))
      : personaSessions;
  }, [personaSessions, search]);

  const groups = useMemo(() => groupByTime(filtered), [filtered]);

  const totalCount = personaSessions.length;

  return (
    <motion.div
      initial={{ x: "-110%" }}
      animate={{ x: 0 }}
      exit={{ x: "-110%" }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      className="absolute top-0 left-0 bottom-0 z-50 w-[300px] md:w-[360px] flex flex-col border-r-2 border-black shadow-[6px_0px_0px_0px_rgba(0,0,0,1)] bg-[var(--main-bg)] overflow-hidden"
    >
      {/* Header */}
      <div
        className="shrink-0 px-5 py-4 border-b-2 border-black flex items-center justify-between"
        style={{ background: persona.color, color: persona.textColor }}
      >
        <div className="flex items-center gap-2">
          <History size={13} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Histórico
          </span>
          {totalCount > 0 && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded border border-current opacity-60"
            >
              {totalCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md border-2 border-black bg-white text-black cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          title="Fechar histórico"
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>

      {/* Nova conversa + busca */}
      <div className="shrink-0 p-3 border-b-2 border-black bg-white flex flex-col gap-2">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border-2 border-black bg-[var(--main-bg)] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Plus size={11} strokeWidth={3} /> Nova conversa
        </button>

        {totalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border-2 border-black bg-[var(--main-bg)] shadow-[2px_2px_0px_0px_#000] focus-within:shadow-none focus-within:translate-x-[2px] focus-within:translate-y-[2px] transition-all">
            <Search size={11} strokeWidth={3} className="text-black/40 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="flex-1 bg-transparent text-[11px] font-bold text-black placeholder-black/30 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-black/40 hover:text-black cursor-pointer">
                <X size={10} strokeWidth={3} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lista agrupada */}
      <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Clock size={20} strokeWidth={2} className="text-black/30" />
            <p className="text-xs font-bold text-black/50 text-center px-4">
              {search ? `Nenhuma conversa com "${search}".` : `Sem conversas com ${persona.name} ainda.`}
            </p>
          </div>
        ) : (
          groups.map(({ label, items }) => (
            <div key={label} className="flex flex-col gap-1.5">
              {/* Group label */}
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 px-1 pb-0.5 border-b border-black/10">
                {label}
              </p>

              {items.map((s) => {
                const isActive = s.id === activeSessionId;
                const lastAssistant = [...s.messages].reverse().find((m) => m.role === "assistant");
                const preview = lastAssistant?.content.slice(0, 72).replace(/\*\*/g, "").replace(/\n/g, " ");

                return (
                  <div
                    key={s.id}
                    className={`group relative rounded-md border-2 border-black transition-all overflow-hidden ${
                      isActive
                        ? "shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    }`}
                    style={isActive ? { background: `${persona.color}18` } : {}}
                  >
                    {isActive && (
                      <div className="h-[3px] w-full" style={{ background: persona.color }} />
                    )}
                    <button
                      onClick={() => onOpen(s)}
                      className="w-full text-left px-3 py-2.5 cursor-pointer"
                    >
                      <p className="text-xs font-bold text-black line-clamp-1 leading-snug pr-5">
                        {s.title}
                      </p>
                      {preview && (
                        <p className="text-[10px] text-black/40 font-medium line-clamp-1 mt-0.5 pr-5">
                          {preview}
                          {(lastAssistant?.content.length ?? 0) > 72 ? "…" : ""}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-bold text-black/40">
                          {formatDateShort(s.updatedAt)}
                        </span>
                        <span className="text-[9px] font-bold text-black/30 flex items-center gap-0.5">
                          <MessageSquare size={8} strokeWidth={3} />
                          {s.messages.length}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                      className="absolute top-2 right-2 p-1 rounded-md border-2 border-black bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity cursor-pointer"
                    >
                      <X size={9} strokeWidth={3} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Main chat page ─────────────────────────────────────────────────────────

export function AdvisorsChat() {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSessionId =
    (location.state as { sessionId?: string } | null)?.sessionId ?? null;

  const allPersonas = useMemo(
    () => [...PRESET_PERSONAS, ...loadCustomPersonas()],
    [],
  );

  const persona = useMemo(
    () => allPersonas.find((p) => p.id === personaId) ?? null,
    [allPersonas, personaId],
  );

  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId,
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!persona) navigate("/advisors", { replace: true });
  }, [persona, navigate]);

  useEffect(() => {
    buildFinancialContext().then((ctx) => {
      setContext(ctx);
      setContextLoading(false);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const activeMessages = useMemo<ChatMessage[]>(() => {
    if (!activeSessionId) return [];
    return sessions.find((s) => s.id === activeSessionId)?.messages ?? [];
  }, [sessions, activeSessionId]);

  const persistSessions = (next: ChatSession[]) => {
    setSessions(next);
    saveSessions(next);
  };

  const handleOpenSession = (s: ChatSession) => {
    setActiveSessionId(s.id);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDeleteSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    persistSessions(next);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSend = useCallback(
    async (text?: string) => {
      if (!persona) return;
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
          personaId: persona.id,
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
          persona.system,
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
    [input, loading, persona, activeSessionId, sessions, context],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!persona) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[var(--main-bg)]"
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-5 md:px-8 py-4 md:py-6 border-b-2 border-black relative overflow-hidden"
        style={{ background: persona.color, color: persona.textColor }}
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 opacity-15 pointer-events-none"
          style={{ borderColor: persona.textColor }}
        />
        <div
          className="absolute -bottom-14 right-24 w-28 h-28 rounded-full border-2 opacity-10 pointer-events-none"
          style={{ borderColor: persona.textColor }}
        />

        {/* Left: navigation + histórico */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate("/advisors")}
            className="p-2.5 rounded-md border-2 border-black bg-white text-black hover:bg-[var(--secondary)] cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            title="Voltar"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>

          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-md border-2 border-black bg-white text-black cursor-pointer transition-all ${
              historyOpen
                ? "shadow-none translate-x-[3px] translate-y-[3px]"
                : "shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            }`}
            title={historyOpen ? "Fechar histórico" : "Abrir histórico"}
          >
            <History size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">
              Histórico
            </span>
          </button>

          <button
            onClick={handleNewSession}
            disabled={!activeSessionId}
            className="p-2.5 rounded-md border-2 border-black bg-white text-black cursor-pointer shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[3px_3px_0px_0px_#000]"
            title="Nova conversa"
          >
            <SquarePen size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right: persona info */}
        <div className="flex items-center gap-4 min-w-0 relative z-10 text-right">
          <div className="min-w-0">
            <p
              className="text-3xl pt-5 pr-2 md:text-4xl font-black tracking-tight leading-none truncate"
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

      {/* Messages + dropdown wrapper */}
      <div className="flex-1 relative overflow-hidden min-h-0">

        {/* Scrollable messages */}
        <div className="h-full overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {activeMessages.length === 0 ? (
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

                {/* Context status + disclaimer */}
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border-2 border-black bg-white text-[10px] font-bold text-black/60">
                    <Database size={11} strokeWidth={3} className={contextLoading ? "animate-pulse text-black/30" : "text-green-600"} />
                    {contextLoading
                      ? "Carregando seus dados financeiros..."
                      : "Análise baseada nos seus dados cadastrados"}
                  </div>
                  <div className="flex items-start gap-2 px-3 py-2 rounded-md border-2 border-black bg-yellow-50 text-[10px] font-bold text-black/70 leading-snug">
                    <AlertTriangle size={11} strokeWidth={3} className="shrink-0 mt-0.5 text-yellow-600" />
                    Sugestões baseadas nos seus dados. Não substituem orientação financeira profissional. Verifique antes de agir.
                  </div>
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
                        onClick={() => handleSend(s)}
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
                {activeMessages.map((msg, i) => {
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
                      <div className="max-w-[75%] flex flex-col gap-1">
                        <div
                          className="px-4 py-3 text-sm font-medium rounded-md border-2 border-black shadow-[var(--neo-shadow-hover)]"
                          style={
                            isUser
                              ? { background: "var(--primary)", color: "#ffffff" }
                              : { background: "#ffffff", color: "#000000" }
                          }
                        >
                          {isUser
                            ? <span className="whitespace-pre-wrap leading-relaxed">{msg.content}</span>
                            : <SimpleMarkdown content={msg.content} />}
                        </div>
                        {!isUser && (
                          <div className="flex items-center gap-1 px-1">
                            <Database size={9} strokeWidth={3} className="text-black/30" />
                            <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">
                              baseado nos seus dados
                            </span>
                          </div>
                        )}
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
                    <div className="px-5 py-4 rounded-md border-2 border-black bg-white shadow-[var(--neo-shadow-hover)] flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
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
                      <span className="text-[9px] font-black uppercase tracking-widest text-black/40">
                        Analisando seus dados...
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Backdrop + history panel vertical */}
        <AnimatePresence>
          {historyOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-black/20"
                onClick={() => setHistoryOpen(false)}
              />
              <HistoryPanel
                sessions={sessions}
                persona={persona}
                activeSessionId={activeSessionId}
                onOpen={(s) => { handleOpenSession(s); setHistoryOpen(false); }}
                onNew={() => { handleNewSession(); setHistoryOpen(false); }}
                onDelete={handleDeleteSession}
                onClose={() => setHistoryOpen(false)}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 md:px-8 py-4 border-t-2 border-black bg-white">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <button
            disabled
            title="Em breve: anexar arquivos para contexto"
            className="p-3.5 rounded-md border-2 border-black bg-[var(--main-bg)] text-black opacity-30 cursor-not-allowed flex items-center justify-center shadow-[2px_2px_0px_0px_#000] shrink-0"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
          <textarea
            ref={inputRef}
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
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3.5 rounded-md border-2 border-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            style={{ background: persona.color, color: persona.textColor }}
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-0.5">
          <span className="text-[9px] text-black/40 font-bold uppercase tracking-widest">
            Enter envia · Shift+Enter quebra linha
          </span>
          <span className="text-[9px] text-black/40 font-bold flex items-center gap-1">
            <AlertTriangle size={9} strokeWidth={3} />
            Verifique antes de agir
          </span>
        </div>
      </div>
    </motion.div>
  );
}
