import { getDashboardOverview } from "./dashboard.service";
import { getInvestments } from "./investments.service";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ── Financial context builder ──────────────────────────────────────────────

export async function buildFinancialContext(): Promise<string> {
  try {
    const [dashboard, investments] = await Promise.all([
      getDashboardOverview(),
      getInvestments(),
    ]);

    const accounts   = dashboard.accounts ?? [];
    const txs        = dashboard.last_month_transactions ?? [];
    const goal       = dashboard.goal;
    const health     = dashboard.financial_health;
    const dist       = dashboard.categories?.distribution ?? [];

    const totalBalance  = accounts.reduce((s, a) => s + Number(a.balance), 0);
    const totalIncome   = txs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.value), 0);
    const totalExpenses = txs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.value), 0);
    const savingsRate   = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    const totalInvested = investments.reduce((s, i) => s + parseFloat(i.amount), 0);

    const fmtBRL = (v: number) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

    const catLines = dist
      .slice(0, 5)
      .map((c) => `  - ${c.name}: ${fmtBRL(Number(c.amount))} (${c.percentage}%)`)
      .join("\n");

    return `
=== DADOS FINANCEIROS DO USUÁRIO (contexto atual) ===
Saldo total nas contas: ${fmtBRL(totalBalance)}
Receitas (último mês): ${fmtBRL(totalIncome)}
Despesas (último mês): ${fmtBRL(totalExpenses)}
Taxa de poupança: ${savingsRate}%
Total investido: ${fmtBRL(totalInvested)}
Número de contas: ${accounts.length}
${goal ? `Próxima meta: "${goal.name}" — ${fmtBRL(Number(goal.current))} de ${fmtBRL(Number(goal.target))} (${goal.percentage}%)` : "Sem meta ativa"}

Saúde financeira:
  - Gastos: ${health?.gastos?.level ?? "sem dados"} (${health?.gastos?.value ?? "—"})
  - Dívidas: ${health?.dividas?.level ?? "sem dados"} (${health?.dividas?.value ?? "—"})
  - Investimentos: ${health?.investimentos?.level ?? "sem dados"} (${health?.investimentos?.value ?? "—"})

Top categorias de despesa:
${catLines || "  Sem dados de categorias"}
=== FIM DO CONTEXTO ===
`.trim();
  } catch {
    return "=== Dados financeiros não disponíveis no momento ===";
  }
}

// ── Anthropic API call ─────────────────────────────────────────────────────

export async function chatWithAdvisor(
  systemPrompt: string,
  messages: ChatMessage[],
  financialContext: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      "Chave da API não configurada. Adicione VITE_ANTHROPIC_API_KEY no seu arquivo .env"
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `${systemPrompt}\n\n${financialContext}`,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message ?? `Erro HTTP ${response.status}`);
  }

  const data = await response.json() as { content: { text: string }[] };
  return data.content[0].text;
}
