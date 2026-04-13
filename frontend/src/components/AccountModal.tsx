import { useState, useEffect } from "react";
import { X, Wallet, ShieldCheck, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface AccountFormData {
  id?: string;
  name: string;
  type: string;
  balance?: number;
  // read-only stats shown in edit mode
  currentIncome?: number;
  currentExpenses?: number;
}

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AccountFormData) => void;
  initial?: AccountFormData | null;
  saving?: boolean;
}

const emptyAccount: AccountFormData = {
  name: "",
  type: "Conta Corrente",
  balance: undefined,
};

const ACCOUNT_TYPES: { value: string; icon: React.ReactNode; label: string }[] = [
  { value: "Conta Corrente",     icon: <Wallet size={14} strokeWidth={2.5} />,    label: "Corrente" },
  { value: "Conta Poupança",     icon: <ShieldCheck size={14} strokeWidth={2.5} />, label: "Poupança" },
  { value: "Conta Digital",      icon: <CreditCard size={14} strokeWidth={2.5} />,  label: "Digital" },
  { value: "Conta Investimento", icon: <TrendingUp size={14} strokeWidth={2.5} />,  label: "Investimento" },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const inputClass =
  "w-full px-4 py-3 rounded-lg border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none transition-all font-bold text-sm text-[var(--primary)] shadow-[var(--neo-shadow-hover)]";
const labelClass =
  "text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1.5 block";

export default function AccountModal({ open, onClose, onSave, initial, saving }: AccountModalProps) {
  const [form, setForm] = useState<AccountFormData>(emptyAccount);
  const isEditing = !!initial?.id;

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(emptyAccount);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const calculatedBalance =
    (form.balance ?? 0) +
    (form.currentIncome ?? 0) -
    (form.currentExpenses ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[var(--main-bg)] w-full max-w-lg rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary)] border-b-3 border-[var(--black)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[var(--secondary)] uppercase tracking-tight">
            {isEditing ? "Editar conta" : "Nova conta"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nome / Banco */}
          <div>
            <label className={labelClass}>Nome / Banco</label>
            <input
              className={inputClass}
              placeholder="Ex: Nubank, Itaú, Carteira..."
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          {/* Tipo de conta */}
          <div>
            <label className={labelClass}>Tipo de conta</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map((t) => {
                const active = form.type === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setForm({ ...form, type: t.value })}
                    className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 border-[var(--black)] font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      active
                        ? "bg-[var(--primary)] text-[var(--secondary)] shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-white text-[var(--primary)] shadow-[var(--neo-shadow-hover)] hover:bg-[var(--secondary)]"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saldo inicial */}
          <div>
            <label className={labelClass}>
              {isEditing ? "Saldo inicial (base)" : "Saldo atual"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[var(--black-muted)]">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`${inputClass} pl-10`}
                placeholder="0,00"
                value={form.balance ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    balance: e.target.value === "" ? undefined : parseFloat(e.target.value),
                  })
                }
              />
            </div>
            {!isEditing && (
              <p className="text-[10px] font-bold text-[var(--black-muted)] mt-1.5">
                Informe o valor que já está nessa conta. Novas transações serão somadas automaticamente.
              </p>
            )}
          </div>

          {/* Edit mode: financial summary cards */}
          {isEditing && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 p-3 bg-emerald-50 border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight size={13} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Receitas</span>
                </div>
                <span className="text-sm font-black text-[var(--primary)]">
                  {fmt(form.currentIncome ?? 0)}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-red-50 border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                <div className="flex items-center gap-1 text-red-500">
                  <ArrowDownRight size={13} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Despesas</span>
                </div>
                <span className="text-sm font-black text-[var(--primary)]">
                  {fmt(form.currentExpenses ?? 0)}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-[var(--secondary)]/40 border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)]">
                <div className="flex items-center gap-1 text-[var(--primary)]">
                  <Wallet size={13} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Saldo</span>
                </div>
                <span className={`text-sm font-black ${calculatedBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {fmt(calculatedBalance)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-[var(--primary)] text-[var(--secondary)] shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Salvando..." : isEditing ? "Salvar" : "Próximo →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
