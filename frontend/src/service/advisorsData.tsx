import { Flame, Crown, Compass, User } from "lucide-react";
import type { ChatMessage } from "./advisors.service";

export type { ChatMessage };

// ── Types ──────────────────────────────────────────────────────────────────

export type Persona = {
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

export type ChatSession = {
  id: string;
  personaId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

// ── Personas ───────────────────────────────────────────────────────────────

export const PRESET_PERSONAS: Persona[] = [
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

export const PERSONAS_KEY = "fundz_custom_personas_v2";
export const SESSIONS_KEY = "fundz_chat_sessions_v1";

export function loadCustomPersonas(): Persona[] {
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

export function saveCustomPersonas(personas: Persona[]) {
  const serializable = personas.map((p) => {
    const copy: Partial<Persona> = { ...p };
    delete copy.icon;
    return copy;
  });
  localStorage.setItem(PERSONAS_KEY, JSON.stringify(serializable));
}

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function formatDateShort(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
