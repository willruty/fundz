import { useState, useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lock, Wallet, TrendingUp, Target, Bot,
  ArrowRight, BarChart2, Activity, Zap, Shield,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const GUEST_EMAIL = "visitante@fundz.app";

// ── Page transition ────────────────────────────────────────────────────────────

const pageSlide = {
  initial: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.97,
  }),
  animate: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.97,
  }),
};

const pageSpring = { type: "spring" as const, stiffness: 280, damping: 30 };

// ── List stagger ───────────────────────────────────────────────────────────────

const staggerList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};

const staggerCard = {
  hidden: { opacity: 0, x: 80, y: 16, rotate: 2 },
  show: {
    opacity: 1, x: 0, y: 0, rotate: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
};

const staggerUp = {
  hidden: { opacity: 0, y: 56, scale: 0.92 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

// ── SplitText ─────────────────────────────────────────────────────────────────

function SplitText({
  text,
  className,
  baseDelay = 0,
  charDelay = 0.034,
}: {
  text: string;
  className: string;
  baseDelay?: number;
  charDelay?: number;
}) {
  return (
    <span className={className} style={{ perspective: "600px" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 56, rotateX: -80 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 20,
            delay: baseDelay + i * charDelay,
          }}
          style={{
            display: char === " " ? "inline" : "inline-block",
            transformOrigin: "bottom center",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ── FloatCard (background ghost element) ─────────────────────────────────────

function FloatCard({
  children,
  left, top, bottom, right,
  rotation = 0,
  delay = 0,
  floatY = 14,
  floatDur = 4,
  opacity = 0.09,
}: {
  children: ReactNode;
  left?: string; top?: string; bottom?: string; right?: string;
  rotation?: number;
  delay?: number;
  floatY?: number;
  floatDur?: number;
  opacity?: number;
}) {
  const pos: CSSProperties = { position: "absolute", pointerEvents: "none" };
  if (left) pos.left = left;
  if (top) pos.top = top;
  if (bottom) pos.bottom = bottom;
  if (right) pos.right = right;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 24 }}
      animate={{
        opacity,
        scale: 1,
        rotate: rotation,
        y: [0, -floatY, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.7, ease: "easeOut" },
        scale: { delay, duration: 0.7, ease: "easeOut" },
        rotate: { delay, duration: 0.4 },
        y: {
          delay: delay + 0.5,
          duration: floatDur,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={pos}
    >
      {children}
    </motion.div>
  );
}

// ── NeoBtn ────────────────────────────────────────────────────────────────────

function NeoBtn({
  label,
  onClick,
  variant = "yellow",
}: {
  label: string;
  onClick: () => void;
  variant?: "yellow" | "dark" | "white";
}) {
  const styles = {
    yellow: "bg-[var(--secondary)] text-black border-black shadow-[4px_4px_0_0_#000]",
    dark:   "bg-black text-[var(--secondary)] border-black shadow-[4px_4px_0_0_rgba(255,209,0,0.4)]",
    white:  "bg-white text-black border-black shadow-[4px_4px_0_0_#000]",
  };
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, boxShadow: "7px 7px 0 0 rgba(0,0,0,0.85)" }}
      whileTap={{ y: 1, boxShadow: "2px 2px 0 0 rgba(0,0,0,0.85)" }}
      className={`px-8 py-3.5 font-black text-base rounded-xl border-4 transition-shadow ${styles[variant]}`}
    >
      {label}
    </motion.button>
  );
}

// ── GUEST STEP 0 ─ Modo Visitante ─────────────────────────────────────────────

function GuestHero({ onNext }: { onNext: () => void }) {
  return (
    <div className="h-full w-full bg-[var(--primary)] flex items-center justify-center relative overflow-hidden px-8">

      {/* Background geometry */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-14%] right-[-12%] w-80 h-80 bg-[var(--secondary)] rounded-full border-4 border-black opacity-[0.11] pointer-events-none" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[28rem] h-[28rem] bg-emerald-400 rounded-full border-4 border-black opacity-[0.07] pointer-events-none" />
      <motion.div animate={{ rotate: 180 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[18%] left-[6%] w-20 h-20 bg-[var(--secondary)] border-4 border-white/15 rounded-2xl opacity-[0.1] pointer-events-none" />
      <motion.div animate={{ rotate: -180 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[8%] w-14 h-14 bg-white border-4 border-white/10 rounded-xl opacity-[0.06] pointer-events-none" />

      {/* Floating ghost stat cards */}
      <FloatCard top="10%" right="7%" rotation={4} delay={1.1} floatDur={3.6} opacity={0.1}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/5 min-w-[120px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <BarChart2 size={9} /> Dashboard
          </p>
          <p className="text-white font-black text-lg leading-none">R$ 12.450</p>
        </div>
      </FloatCard>

      <FloatCard top="28%" left="3%" rotation={-5} delay={1.3} floatDur={4.8} floatY={10} opacity={0.1}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/5 min-w-[108px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Target size={9} /> Metas
          </p>
          <p className="text-white font-black text-lg leading-none">3 ativas</p>
        </div>
      </FloatCard>

      <FloatCard bottom="24%" right="5%" rotation={3} delay={1.5} floatDur={5.2} opacity={0.1}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/5 min-w-[138px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <TrendingUp size={9} /> Investimentos
          </p>
          <p className="text-white font-black text-lg leading-none">+8,4% a.a.</p>
        </div>
      </FloatCard>

      <FloatCard bottom="32%" left="4%" rotation={-3} delay={1.7} floatDur={3.9} floatY={18} opacity={0.1}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/5 min-w-[108px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Activity size={9} /> Saúde
          </p>
          <p className="text-white font-black text-lg leading-none">78%</p>
        </div>
      </FloatCard>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <div className="space-y-1">
          <div className="overflow-hidden leading-none">
            <SplitText
              text="MODO"
              className="text-[clamp(3.5rem,10vw,7rem)] font-black text-white leading-none tracking-tight block"
              baseDelay={0.1}
            />
          </div>
          <div className="overflow-hidden leading-none">
            <SplitText
              text="VISITANTE"
              className="text-[clamp(3.5rem,10vw,7rem)] font-black text-[var(--secondary)] leading-none tracking-tight block"
              baseDelay={0.3}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ type: "spring", stiffness: 420, damping: 17, delay: 0.7 }}
          className="inline-flex items-center gap-2 border-4 border-[var(--secondary)] rounded-xl px-6 py-2 mx-auto"
        >
          <Lock size={13} className="text-[var(--secondary)]" />
          <span className="text-[var(--secondary)] font-black text-sm uppercase tracking-widest">
            Acesso Limitado
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.88 }}
          className="text-white/60 text-lg leading-relaxed max-w-md mx-auto"
        >
          Você está explorando com dados de demonstração. As funcionalidades de escrita estão desabilitadas.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
          <NeoBtn label="Entendido →" onClick={onNext} />
        </motion.div>
      </div>
    </div>
  );
}

// ── GUEST STEP 1 ─ O que está bloqueado ──────────────────────────────────────

function GuestLocked({ onNext }: { onNext: () => void }) {
  const items = [
    { icon: Wallet,     label: "Criar transações",  desc: "Registrar entradas e saídas" },
    { icon: TrendingUp, label: "Adicionar contas",   desc: "Conectar contas bancárias" },
    { icon: Target,     label: "Definir metas",      desc: "Criar objetivos financeiros" },
    { icon: Bot,        label: "Usar Advisors",      desc: "Chat com personas de IA" },
  ];

  return (
    <div className="h-full w-full bg-[var(--main-bg)] flex items-center justify-center relative px-8 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-[var(--secondary)] border-l-4 border-b-4 border-black rounded-bl-[4rem] opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-[var(--primary)] border-r-4 border-t-4 border-black rounded-tr-[3rem] opacity-70 pointer-events-none" />

      {/* Floating ghost lock icons */}
      <FloatCard top="14%" left="8%" rotation={12} delay={0.8} floatDur={4.5} floatY={10} opacity={0.07}>
        <div className="w-16 h-16 bg-black border-4 border-black rounded-2xl flex items-center justify-center">
          <Lock size={28} className="text-white" />
        </div>
      </FloatCard>
      <FloatCard bottom="18%" right="7%" rotation={-8} delay={1.0} floatDur={3.8} floatY={12} opacity={0.07}>
        <div className="w-12 h-12 bg-black border-4 border-black rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
      </FloatCard>
      <FloatCard top="45%" right="4%" rotation={6} delay={1.2} floatDur={5} floatY={8} opacity={0.05}>
        <div className="border-4 border-black rounded-2xl px-4 py-2 bg-black">
          <p className="text-white font-black text-xs">BLOQUEADO</p>
        </div>
      </FloatCard>

      <div className="relative z-10 max-w-lg w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">Modo visitante</p>
          <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-black text-black leading-tight">
            O que está<br />
            <span className="text-red-500">bloqueado</span>
          </h1>
        </motion.div>

        <motion.div variants={staggerList} initial="hidden" animate="show" className="space-y-3">
          {items.map(({ icon: Icon, label, desc }) => (
            <motion.div
              key={label}
              variants={staggerCard}
              className="flex items-center gap-4 bg-white border-4 border-black rounded-xl px-5 py-4 shadow-[4px_4px_0_0_#000] opacity-50"
            >
              <div className="w-10 h-10 bg-black/[0.07] rounded-lg flex items-center justify-center shrink-0">
                <Icon size={17} className="text-black/40" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-black/50 line-through text-sm">{label}</p>
                <p className="text-xs text-black/30">{desc}</p>
              </div>
              <Lock size={13} className="text-black/25 shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-between pt-1"
        >
          <p className="text-sm text-black/40 font-semibold">Tudo disponível na sua conta</p>
          <NeoBtn label="Ver mais →" onClick={onNext} variant="dark" />
        </motion.div>
      </div>
    </div>
  );
}

// ── GUEST STEP 2 ─ CTA criação de conta ──────────────────────────────────────

function GuestCTA({ onRegister, onSkip }: { onRegister: () => void; onSkip: () => void }) {
  return (
    <div className="h-full w-full bg-[var(--secondary)] flex items-center justify-center relative px-8 overflow-hidden">

      {/* Large watermark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.045 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="absolute font-black text-black pointer-events-none select-none leading-none"
        style={{
          fontSize: "clamp(8rem, 22vw, 18rem)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
      >
        FUNDZ
      </motion.p>

      {/* Geometry */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-12%] right-[-12%] w-80 h-80 bg-white rounded-full border-4 border-black opacity-[0.07] pointer-events-none" />
      <motion.div animate={{ rotate: -180 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-8%] left-[-6%] w-52 h-52 bg-black border-4 border-black rounded-3xl opacity-[0.06] pointer-events-none" />
      <div className="absolute bottom-14 right-10 w-20 h-20 bg-black rounded-2xl border-4 border-black rotate-12 opacity-[0.09] pointer-events-none" />
      <div className="absolute top-14 left-10 w-10 h-10 bg-black rounded-full border-4 border-black opacity-[0.09] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-6 h-6 bg-black border-4 border-black rotate-45 opacity-[0.09] pointer-events-none" />

      {/* Floating ghost stat cards (faded on yellow) */}
      <FloatCard top="10%" left="6%" rotation={-4} delay={0.9} floatDur={4} floatY={12} opacity={0.12}>
        <div className="border-4 border-black rounded-xl px-4 py-3 bg-black/10 min-w-[110px]">
          <p className="text-black/50 text-[9px] font-black uppercase tracking-wider mb-0.5">Contas</p>
          <p className="text-black font-black text-lg leading-none">2 ativas</p>
        </div>
      </FloatCard>
      <FloatCard bottom="14%" right="6%" rotation={5} delay={1.1} floatDur={5} floatY={16} opacity={0.12}>
        <div className="border-4 border-black rounded-xl px-4 py-3 bg-black/10 min-w-[120px]">
          <p className="text-black/50 text-[9px] font-black uppercase tracking-wider mb-0.5">Assinaturas</p>
          <p className="text-black font-black text-lg leading-none">R$ 89/mês</p>
        </div>
      </FloatCard>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div className="space-y-0 leading-none">
          <div className="overflow-hidden">
            <SplitText
              text="QUER"
              className="text-[clamp(3.5rem,10vw,7rem)] font-black text-black leading-none tracking-tight block"
              baseDelay={0.1}
            />
          </div>
          <div className="overflow-hidden">
            <SplitText
              text="O SEU?"
              className="text-[clamp(3.5rem,10vw,7rem)] font-black text-black leading-none tracking-tight block"
              baseDelay={0.3}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-black/60 text-lg leading-relaxed max-w-sm mx-auto font-medium"
        >
          Crie sua conta grátis e comece a controlar suas finanças de verdade — sem limitações.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <NeoBtn label="Criar conta grátis" onClick={onRegister} variant="white" />
          <button
            onClick={onSkip}
            className="text-black/50 font-bold text-sm underline underline-offset-4 hover:text-black transition-colors"
          >
            Explorar assim mesmo
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── USER STEP 0 ─ Welcome ─────────────────────────────────────────────────────

function UserWelcome({ name, onNext }: { name: string; onNext: () => void }) {
  return (
    <div className="h-full w-full bg-[var(--primary)] flex items-center justify-center relative overflow-hidden px-8">

      {/* Background geometry */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-14%] right-[-12%] w-80 h-80 bg-[var(--secondary)] rounded-full border-4 border-black opacity-[0.11] pointer-events-none" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[28rem] h-[28rem] bg-emerald-400 rounded-full border-4 border-black opacity-[0.07] pointer-events-none" />
      <motion.div animate={{ rotate: 180 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] left-[6%] w-20 h-20 bg-[var(--secondary)] border-4 border-white/10 rounded-2xl opacity-[0.09] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] right-[7%] w-8 h-8 bg-[var(--secondary)] border-4 border-white/15 rotate-45 opacity-[0.12] pointer-events-none" />

      {/* Floating platform stat cards */}
      <FloatCard top="9%" right="6%" rotation={4} delay={1.0} floatDur={3.8} opacity={0.11}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/6 min-w-[120px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <BarChart2 size={9} /> Saldo total
          </p>
          <p className="text-white font-black text-lg leading-none">R$ 12.450</p>
        </div>
      </FloatCard>

      <FloatCard top="26%" left="3%" rotation={-5} delay={1.2} floatDur={4.9} floatY={11} opacity={0.11}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/6 min-w-[108px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Target size={9} /> Metas
          </p>
          <p className="text-white font-black text-lg leading-none">3 ativas</p>
        </div>
      </FloatCard>

      <FloatCard bottom="22%" right="5%" rotation={3} delay={1.4} floatDur={5.3} opacity={0.11}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/6 min-w-[138px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <TrendingUp size={9} /> Investimentos
          </p>
          <p className="text-white font-black text-lg leading-none">+8,4% a.a.</p>
        </div>
      </FloatCard>

      <FloatCard bottom="30%" left="4%" rotation={-4} delay={1.6} floatDur={4.1} floatY={18} opacity={0.11}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/6 min-w-[108px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Activity size={9} /> Saúde
          </p>
          <p className="text-white font-black text-lg leading-none">78%</p>
        </div>
      </FloatCard>

      <FloatCard top="52%" left="2%" rotation={6} delay={1.8} floatDur={6} floatY={8} opacity={0.08}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-3 bg-white/6 min-w-[116px]">
          <p className="text-white/50 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-0.5">
            <Zap size={9} /> Assinaturas
          </p>
          <p className="text-white font-black text-lg leading-none">R$ 89/mês</p>
        </div>
      </FloatCard>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -44, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.05 }}
          className="inline-block p-3 rounded-xl border-2 border-white/20"
        >
          <img src="/yellow-logo.png" alt="Fundz" className="h-14 w-auto mx-auto" />
        </motion.div>

        <div className="space-y-1">
          <div className="overflow-hidden leading-none">
            <SplitText
              text="OLÁ,"
              className="text-[clamp(3rem,9vw,6rem)] font-black text-white leading-none tracking-tight block"
              baseDelay={0.2}
            />
          </div>
          <div className="overflow-hidden leading-none">
            <SplitText
              text={`${name.toUpperCase()}!`}
              className="text-[clamp(3rem,9vw,6rem)] font-black text-[var(--secondary)] leading-none tracking-tight block"
              baseDelay={0.38}
              charDelay={0.04}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
          className="text-white/60 text-lg leading-relaxed max-w-md mx-auto"
        >
          Seu painel de finanças pessoais está pronto. Tudo em um lugar, sem enrolação.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <NeoBtn label="Começar →" onClick={onNext} />
        </motion.div>
      </div>
    </div>
  );
}

// ── USER STEP 1 ─ 3 primeiros passos ─────────────────────────────────────────

function UserStart({
  onSelect,
  onNext,
}: {
  onSelect: (path: string) => void;
  onNext: () => void;
}) {
  const actions = [
    { icon: Wallet,     label: "Adicionar uma conta",       desc: "Registre suas contas e carteiras", path: "/accounts" },
    { icon: TrendingUp, label: "Registrar uma transação",   desc: "Controle entradas e saídas",       path: "/expenses" },
    { icon: Target,     label: "Criar uma meta",            desc: "Defina objetivos financeiros",     path: "/goals" },
  ];

  return (
    <div className="h-full w-full bg-[var(--main-bg)] flex items-center justify-center relative px-8 overflow-hidden">

      {/* Background blocks */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary)] border-r-4 border-b-4 border-black rounded-br-[4rem] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-44 h-44 bg-[var(--secondary)] border-l-4 border-t-4 border-black rounded-tl-[3rem] opacity-70 pointer-events-none" />

      {/* Floating mini shapes */}
      <FloatCard top="14%" right="8%" rotation={10} delay={0.7} floatDur={4.2} floatY={10} opacity={0.12}>
        <div className="w-14 h-14 bg-[var(--secondary)] border-4 border-black rounded-2xl flex items-center justify-center">
          <Wallet size={22} className="text-black" />
        </div>
      </FloatCard>
      <FloatCard bottom="20%" left="7%" rotation={-7} delay={0.9} floatDur={5} floatY={14} opacity={0.1}>
        <div className="w-12 h-12 bg-[var(--primary)] border-4 border-black rounded-xl flex items-center justify-center">
          <Target size={18} className="text-white" />
        </div>
      </FloatCard>
      <FloatCard top="50%" right="5%" rotation={4} delay={1.1} floatDur={3.7} floatY={8} opacity={0.08}>
        <div className="border-4 border-black rounded-2xl px-3 py-2 bg-black">
          <p className="text-white font-black text-[10px] uppercase tracking-wide">Metas</p>
        </div>
      </FloatCard>

      <div className="relative z-10 max-w-lg w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">Por onde começar</p>
          <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-black text-black leading-tight">
            3 primeiros<br />
            <span className="text-[var(--primary)]">passos</span>
          </h1>
        </motion.div>

        <motion.div variants={staggerList} initial="hidden" animate="show" className="space-y-3">
          {actions.map(({ icon: Icon, label, desc, path }) => (
            <motion.button
              key={path}
              variants={staggerUp}
              onClick={() => onSelect(path)}
              whileHover={{ x: -4, y: -4, boxShadow: "8px 8px 0 0 #000" }}
              whileTap={{ x: 0, y: 0, boxShadow: "2px 2px 0 0 #000" }}
              className="w-full flex items-center gap-4 bg-white border-4 border-black rounded-xl px-5 py-4 shadow-[4px_4px_0_0_#000] text-left transition-shadow"
            >
              <div className="w-10 h-10 bg-[var(--secondary)] border-2 border-black rounded-lg flex items-center justify-center shrink-0">
                <Icon size={17} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-black text-sm">{label}</p>
                <p className="text-xs text-black/50">{desc}</p>
              </div>
              <ArrowRight size={14} className="text-black/30 shrink-0" />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.88 }}
          className="flex items-center justify-between pt-1"
        >
          <p className="text-sm text-black/40 font-semibold">Você pode fazer depois também</p>
          <NeoBtn label="Próximo →" onClick={onNext} variant="dark" />
        </motion.div>
      </div>
    </div>
  );
}

// ── USER STEP 2 ─ Advisors ────────────────────────────────────────────────────

function UserAdvisors({ onGo, onSkip }: { onGo: () => void; onSkip: () => void }) {
  const personas = [
    { name: "Vibe", desc: "Estilo descontraído", color: "#a78bfa" },
    { name: "Core", desc: "Fundamentos sólidos", color: "#34d399" },
    { name: "Flow", desc: "Equilíbrio e foco",   color: "#60a5fa" },
  ];

  return (
    <div className="h-full w-full bg-[var(--primary)] flex items-center justify-center relative px-8 overflow-hidden">

      {/* Background geometry */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-12%] right-[-12%] w-80 h-80 bg-[var(--secondary)] rounded-full border-4 border-black opacity-[0.1] pointer-events-none" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-8%] w-64 h-64 bg-emerald-400 rounded-full border-4 border-black opacity-[0.07] pointer-events-none" />
      <motion.div animate={{ rotate: 180 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[8%] w-16 h-16 bg-[var(--secondary)] border-4 border-white/10 rounded-2xl opacity-[0.09] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[28%] left-[5%] w-7 h-7 bg-[var(--secondary)] border-4 border-white/15 rotate-45 opacity-[0.12] pointer-events-none" />

      {/* Floating persona color blobs */}
      <FloatCard top="10%" left="7%" rotation={-6} delay={0.8} floatDur={4.5} floatY={14} opacity={0.12}>
        <div className="w-16 h-16 rounded-full border-4 border-white/20" style={{ backgroundColor: "#a78bfa" }} />
      </FloatCard>
      <FloatCard bottom="16%" right="6%" rotation={8} delay={1.0} floatDur={5.2} floatY={10} opacity={0.1}>
        <div className="w-12 h-12 rounded-full border-4 border-white/20" style={{ backgroundColor: "#34d399" }} />
      </FloatCard>
      <FloatCard top="55%" right="4%" rotation={-4} delay={1.2} floatDur={3.9} floatY={18} opacity={0.08}>
        <div className="w-10 h-10 rounded-full border-4 border-white/20" style={{ backgroundColor: "#60a5fa" }} />
      </FloatCard>

      {/* Floating ghost label */}
      <FloatCard top="18%" right="9%" rotation={5} delay={1.4} floatDur={4.8} floatY={8} opacity={0.1}>
        <div className="border-2 border-white/20 rounded-xl px-4 py-2 bg-white/6">
          <p className="text-white/60 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Bot size={10} /> IA Financeira
          </p>
        </div>
      </FloatCard>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
            className="text-xl font-black text-white/50 uppercase tracking-widest mb-1"
          >
            Conheça os
          </motion.p>
          <div className="overflow-hidden leading-none">
            <SplitText
              text="ADVISORS"
              className="text-[clamp(3.5rem,10vw,7rem)] font-black text-[var(--secondary)] leading-none tracking-tight block"
              baseDelay={0.25}
              charDelay={0.045}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-white/55 text-base leading-relaxed max-w-sm mx-auto"
        >
          Três personas de IA criadas para te dar clareza financeira — sem jargão, sem enrolação.
        </motion.p>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.7 } } }}
          initial="hidden"
          animate="show"
          className="flex gap-3 justify-center"
        >
          {personas.map(({ name, desc, color }) => (
            <motion.div
              key={name}
              variants={staggerUp}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="flex-1 max-w-[148px] bg-white/[0.07] border-2 border-white/20 rounded-2xl p-5 text-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.8 }}
                className="w-12 h-12 rounded-full border-2 border-white/30 mx-auto mb-3"
                style={{ backgroundColor: color }}
              />
              <p className="font-black text-white text-sm">{name}</p>
              <p className="text-white/40 text-xs mt-0.5 leading-tight">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="flex flex-col items-center gap-4"
        >
          <NeoBtn label="Conhecer agora" onClick={onGo} />
          <button
            onClick={onSkip}
            className="text-white/40 font-bold text-sm underline underline-offset-4 hover:text-white/70 transition-colors"
          >
            Explorar depois
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function Onboarding() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"guest" | "user" | null>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!session) {
        navigate("/auth");
        return;
      }
      const isGuest = session.user.email === GUEST_EMAIL;
      setFlow(isGuest ? "guest" : "user");
      setUserName(
        localStorage.getItem("user_name") ||
          session.user.email?.split("@")[0] ||
          ""
      );
    });
  }, [navigate]);

  function advance() {
    setDirection(1);
    if (step < 2) setStep((s) => s + 1);
    else complete("/home");
  }

  function complete(target = "/home") {
    if (flow === "guest") localStorage.setItem("fundz_guest_onboarded", "1");
    else localStorage.setItem("fundz_onboarded", "1");
    navigate(target);
  }

  if (!flow) return <div className="h-screen bg-[var(--primary)]" />;

  const guestSteps = [
    <GuestHero key="g0" onNext={advance} />,
    <GuestLocked key="g1" onNext={advance} />,
    <GuestCTA
      key="g2"
      onRegister={() => {
        localStorage.setItem("fundz_guest_onboarded", "1");
        navigate("/auth", { state: { mode: "register" } });
      }}
      onSkip={() => complete()}
    />,
  ];

  const userSteps = [
    <UserWelcome key="u0" name={userName} onNext={advance} />,
    <UserStart key="u1" onSelect={(path) => complete(path)} onNext={advance} />,
    <UserAdvisors key="u2" onGo={() => complete("/advisors")} onSkip={() => complete()} />,
  ];

  const steps = flow === "guest" ? guestSteps : userSteps;

  // Light bg steps need dark indicator color
  const isLightStep = step === 1;

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${flow}-${step}`}
          custom={direction}
          variants={pageSlide}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageSpring}
          className="absolute inset-0"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {/* Step indicator — top right */}
      <div className="absolute top-6 right-8 flex gap-2 z-50">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 28 : 10,
              backgroundColor:
                i === step
                  ? "#FFD100"
                  : i < step
                  ? isLightStep ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)"
                  : isLightStep ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.18)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-2.5 rounded-full"
            style={{ border: isLightStep ? "2px solid rgba(0,0,0,0.2)" : "2px solid rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>

      {/* Skip — top left (hidden on final step) */}
      {step < 2 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => complete()}
          className={`absolute top-5 left-8 z-50 text-xs font-black uppercase tracking-widest transition-colors ${
            isLightStep ? "text-black/30 hover:text-black/60" : "text-white/25 hover:text-white/55"
          }`}
        >
          Pular
        </motion.button>
      )}
    </div>
  );
}
