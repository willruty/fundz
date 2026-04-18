import { useState, useMemo } from "react";
import { useIsGuest } from "../hooks/useIsGuest";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Check,
  Pencil,
  Trash2,
  User,
  Clock,
  MessageSquare,
  History,
} from "lucide-react";

import {
  PRESET_PERSONAS,
  loadCustomPersonas,
  saveCustomPersonas,
  loadSessions,
  saveSessions,
  formatDateShort,
  type Persona,
  type ChatSession,
} from "../service/advisorsData";

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

// ── Persona card ───────────────────────────────────────────────────────────

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

// ── Main page ──────────────────────────────────────────────────────────────

export function Advisors() {
  const navigate = useNavigate();
  const isGuest = useIsGuest();
  const [customPersonas, setCustomPersonas] =
    useState<Persona[]>(loadCustomPersonas);
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const allPersonas = useMemo(
    () => [...PRESET_PERSONAS, ...customPersonas],
    [customPersonas],
  );

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

  const handleDeleteSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    saveSessions(next);
  };

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

    if (!editingPersona) {
      navigate(`/advisors/chat/${newP.id}`);
    }

    setModalOpen(false);
    setEditingPersona(null);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customPersonas.filter((p) => p.id !== id);
    setCustomPersonas(updated);
    saveCustomPersonas(updated);
  };

  return (
    <div className="h-full w-full overflow-hidden">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full overflow-y-auto bg-[var(--main-bg)]"
      >
        {/* Header */}
        <div className="sm:px-6 pt-10 md:pt-14 pb-8 mx-auto w-full text-center">
          <h1
            className="text-5xl md:text-7xl text-[var(--primary)] leading-[0.9] mb-8"
            style={{ fontFamily: "Catchland, sans-serif" }}
          >
            Com <span className="text-[var(--secondary)]">quem</span> quer conversar hoje?
          </h1>
          <p className="text-sm md:text-base text-black/50 font-medium max-w-xl mx-auto">
            Três personalidades, três formas de olhar pro seu dinheiro. Escolha
            o tom e comece um papo — ou volte em uma conversa anterior.
          </p>
        </div>

        {/* Persona cards */}
        <div className=" sm:px-6 pb-8 mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRESET_PERSONAS.map((persona, i) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                index={i}
                sessionCount={sessionCountByPersona[persona.id] ?? 0}
                onSelect={() => navigate(`/advisors/chat/${persona.id}`)}
              />
            ))}
          </div>

          {/* Group chat coming soon badge */}
          <div className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-md border-2 border-dashed border-black/30 bg-white/40 w-fit text-[10px] font-black uppercase tracking-widest text-black/50">
            <span>🔒 Em breve:</span>
            <div className="flex gap-1.5">
              {PRESET_PERSONAS.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="w-5 h-5 rounded border border-black/20 flex items-center justify-center text-[8px]"
                  style={{
                    background: p.color,
                    color: p.textColor,
                    opacity: 0.6,
                  }}
                >
                  {p.icon}
                </div>
              ))}
            </div>
            <span>Conselho em Grupo</span>
          </div>
        </div>

        {/* Custom personas */}
        <div className="sm:px-6 md:px-10 pb-6  mx-auto w-full">
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
                  onClick={() => navigate(`/advisors/chat/${p.id}`)}
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
                {!isGuest && (
                  <div className="flex gap-1 ml-1">
                    <button
                      onClick={() => {
                        setEditingPersona(p);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-md border-2 border-black bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] cursor-pointer"
                      title="Editar"
                    >
                      <Pencil size={10} strokeWidth={3} className="text-black" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustom(p.id)}
                      className="p-1.5 rounded-md border-2 border-black bg-red-500 hover:bg-red-600 cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 size={10} strokeWidth={3} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {!isGuest && (
              <button
                onClick={() => {
                  setEditingPersona(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-black/40 bg-transparent text-black/50 hover:text-black hover:border-black hover:bg-white transition-all cursor-pointer text-xs font-black uppercase tracking-widest"
              >
                <Plus size={13} strokeWidth={3} /> Novo Advisor
              </button>
            )}
          </div>
        </div>

        {/* Recent chat history */}
        <div className="px-4 sm:px-6 md:px-10 pb-10  mx-auto w-full">
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
                    className="group relative rounded-[var(--radius-card)] border-2 border-black shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden"
                    style={{ background: `${persona.color}18` }}
                  >
                    {/* Faixa colorida no topo */}
                    <div
                      className="h-1.5 w-full"
                      style={{ background: persona.color }}
                    />

                    <button
                      onClick={() =>
                        navigate(`/advisors/chat/${s.personaId}`, {
                          state: { sessionId: s.id },
                        })
                      }
                      className="w-full text-left p-4 cursor-pointer"
                    >
                      {/* Header: ícone + nome + data */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]"
                          style={{
                            background: persona.color,
                            color: persona.textColor,
                          }}
                        >
                          {persona.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-black uppercase tracking-widest leading-none"
                            style={{ color: persona.color }}
                          >
                            {persona.name}
                          </p>
                          <p className="text-[9px] font-bold text-black/40 mt-0.5">
                            {formatDateShort(s.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Título da conversa */}
                      <p className="text-xs font-bold text-black line-clamp-2 leading-snug">
                        {s.title}
                      </p>

                      {/* Rodapé */}
                      <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-black/10">
                        <MessageSquare
                          size={10}
                          strokeWidth={2.5}
                          className="text-black/40"
                        />
                        <p className="text-[10px] font-medium text-black/40">
                          {s.messages.length}{" "}
                          {s.messages.length === 1 ? "mensagem" : "mensagens"}
                        </p>
                      </div>
                    </button>

                    {!isGuest && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(s.id);
                        }}
                        className="absolute top-3 right-3 p-1 rounded-md border-2 border-black bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity cursor-pointer"
                        title="Excluir"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
