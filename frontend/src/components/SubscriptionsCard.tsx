import { Calendar, Repeat } from "lucide-react";
import type { SubscriptionSummary } from "../types/dashboard";

const PALETTE = [
  "#e50914",
  "#1db954",
  "#0071e3",
  "#a855f7",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

interface Props {
  subscriptions: SubscriptionSummary[];
}

export function SubscriptionsCard({ subscriptions = [] }: Props) {
  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const total = subscriptions.reduce(
    (sum, s) => sum + parseFloat(s.monthlyAmount),
    0,
  );

  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-4 w-full h-full shadow-[var(--neo-shadow)] flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[12px] font-black uppercase text-[var(--black-muted)] tracking-widest block mb-1">
            Assinaturas
          </span>
          <div className="flex items-center gap-1.5">
            <Repeat
              size={12}
              strokeWidth={3}
              className="text-[var(--primary)]"
            />
            <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
              {fmt(total)}
              <span className="text-[12px] font-bold text-[var(--black-muted)]">
                /mês
              </span>
            </span>
          </div>
        </div>
        <span className="text-[12px] font-black px-2.5 py-1 bg-[var(--primary)] text-[var(--secondary)] border-2 border-[var(--black)] rounded-md shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
          {subscriptions.length} ativas
        </span>
      </div>

      {/* List */}
      {subscriptions.length === 0 ? (
        <p className="text-[12px] font-bold text-[var(--black-muted)] uppercase tracking-wider m-auto">
          Nenhuma assinatura ativa
        </p>
      ) : (
        <div className="flex flex-col gap-0 flex-1 overflow-y-auto max-h-[240px] pr-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--black)] [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-[1px] [&::-webkit-scrollbar-thumb]:border-[var(--black)]">
          {subscriptions.map((sub, i) => {
            const day = sub.nextBillingDate
              ? new Date(sub.nextBillingDate).getUTCDate()
              : null;
            return (
              <div
                key={sub.name + i}
                className={`flex items-center justify-between py-2.5 ${
                  i < subscriptions.length - 1
                    ? "border-b-2 border-dashed border-[var(--black)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 border-2 border-[var(--black)] rounded-md shadow-[2px_2px_0_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0 text-white text-[12px] font-black"
                    style={{ backgroundColor: colorFor(sub.name) }}
                  >
                    {sub.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase text-[var(--primary)] tracking-wide leading-none">
                      {sub.name}
                    </span>
                    <span className="text-[12px] font-bold text-[var(--black-muted)] uppercase tracking-wider mt-0.5">
                      {sub.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[12px] font-black text-[var(--primary)]">
                    {fmt(parseFloat(sub.monthlyAmount))}
                  </span>
                  {day !== null && (
                    <div className="flex items-center gap-0.5 text-[12px] font-bold text-[var(--black-muted)]">
                      <Calendar size={8} strokeWidth={2.5} />
                      dia {day}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
