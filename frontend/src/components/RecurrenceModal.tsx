import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type RecurrenceType = "subscription" | "installment";

export interface SubscriptionFormData {
  type: "subscription";
  id?: string;
  name: string;
  amount: string;
  billingCycle: string;
  nextBillingDate: string;
  active: boolean;
}

export interface InstallmentFormData {
  type: "installment";
  id?: string;
  name: string;
  totalAmount: string;
  totalInstallments: string;
  paidInstallments: string;
  startDate: string;
  billingDay: string;
  active: boolean;
}

export type RecurrenceFormData = SubscriptionFormData | InstallmentFormData;

interface RecurrenceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: RecurrenceFormData) => void;
  initial?: RecurrenceFormData | null;
  saving?: boolean;
}

const emptySubscription: SubscriptionFormData = {
  type: "subscription",
  name: "",
  amount: "",
  billingCycle: "monthly",
  nextBillingDate: new Date().toISOString().slice(0, 10),
  active: true,
};

const emptyInstallment: InstallmentFormData = {
  type: "installment",
  name: "",
  totalAmount: "",
  totalInstallments: "12",
  paidInstallments: "0",
  startDate: new Date().toISOString().slice(0, 10),
  billingDay: String(new Date().getDate()),
  active: true,
};

export default function RecurrenceModal({ open, onClose, onSave, initial, saving }: RecurrenceModalProps) {
  const [recType, setRecType] = useState<RecurrenceType>(initial?.type ?? "subscription");
  const [sub, setSub] = useState<SubscriptionFormData>(emptySubscription);
  const [inst, setInst] = useState<InstallmentFormData>(emptyInstallment);

  const isEditing = !!(initial?.id);

  useEffect(() => {
    if (initial) {
      setRecType(initial.type);
      if (initial.type === "subscription") setSub(initial);
      else setInst(initial);
    } else {
      setRecType("subscription");
      setSub(emptySubscription);
      setInst(emptyInstallment);
    }
  }, [initial, open]);

  if (!open) return null;

  const computedInstallmentAmount =
    inst.totalAmount && inst.totalInstallments
      ? (parseFloat(inst.totalAmount) / parseInt(inst.totalInstallments)).toFixed(2)
      : "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recType === "subscription") {
      onSave(sub);
    } else {
      onSave(inst);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none transition-all font-bold text-sm text-[var(--primary)] shadow-[var(--neo-shadow-hover)]";
  const labelClass =
    "text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[var(--main-bg)] w-full max-w-lg rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary)] border-b-3 border-[var(--black)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[var(--secondary)] uppercase tracking-tight">
            {isEditing ? "Editar" : "Novo"} compromisso
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tipo toggle */}
          {!isEditing && (
            <div>
              <label className={labelClass}>Tipo</label>
              <div className="flex gap-2 bg-white p-1.5 rounded-lg border-2 border-[var(--black)]">
                {([
                  { key: "subscription" as const, label: "Assinatura" },
                  { key: "installment" as const, label: "Parcelamento" },
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRecType(key)}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all border-2 cursor-pointer ${
                      recType === key
                        ? key === "subscription"
                          ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                          : "bg-[var(--secondary)] text-[var(--primary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
                        : "bg-transparent text-[var(--black-muted)] border-transparent hover:bg-black/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Subscription fields ── */}
          {recType === "subscription" && (
            <>
              <div>
                <label className={labelClass}>Nome</label>
                <input
                  className={inputClass}
                  placeholder="Ex: Netflix, Spotify..."
                  required
                  value={sub.name}
                  onChange={(e) => setSub({ ...sub, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Valor</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="29.90"
                    required
                    value={sub.amount}
                    onChange={(e) => setSub({ ...sub, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ciclo</label>
                  <select
                    className={inputClass}
                    value={sub.billingCycle}
                    onChange={(e) => setSub({ ...sub, billingCycle: e.target.value })}
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Próxima cobrança</label>
                <input
                  className={inputClass}
                  type="date"
                  required
                  value={sub.nextBillingDate}
                  onChange={(e) => setSub({ ...sub, nextBillingDate: e.target.value })}
                />
              </div>
            </>
          )}

          {/* ── Installment fields ── */}
          {recType === "installment" && (
            <>
              <div>
                <label className={labelClass}>Nome da compra</label>
                <input
                  className={inputClass}
                  placeholder="Ex: iPhone 15, Geladeira..."
                  required
                  value={inst.name}
                  onChange={(e) => setInst({ ...inst, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Valor total</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="5999.00"
                    required
                    value={inst.totalAmount}
                    onChange={(e) => setInst({ ...inst, totalAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nº de parcelas</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    max="120"
                    placeholder="12"
                    required
                    value={inst.totalInstallments}
                    onChange={(e) => setInst({ ...inst, totalInstallments: e.target.value })}
                  />
                </div>
              </div>

              {/* Valor da parcela calculado */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-lg shadow-[var(--neo-shadow-hover)]">
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
                  Valor da parcela:
                </span>
                <span className="text-sm font-black text-[var(--primary)]">
                  R$ {computedInstallmentAmount}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Parcelas pagas</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={inst.paidInstallments}
                    onChange={(e) => setInst({ ...inst, paidInstallments: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data de início</label>
                  <input
                    className={inputClass}
                    type="date"
                    required
                    value={inst.startDate}
                    onChange={(e) => setInst({ ...inst, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Dia vencimento</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    max="31"
                    placeholder="10"
                    required
                    value={inst.billingDay}
                    onChange={(e) => setInst({ ...inst, billingDay: e.target.value })}
                  />
                </div>
              </div>
            </>
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
              {saving ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
