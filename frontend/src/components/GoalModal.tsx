import { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface GoalFormData {
  id?: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  dueDate: string;
}

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: GoalFormData) => void;
  initial?: GoalFormData | null;
  saving?: boolean;
}

const emptyGoal: GoalFormData = {
  name: "",
  targetAmount: "",
  currentAmount: "0",
  dueDate: "",
};

export default function GoalModal({ open, onClose, onSave, initial, saving }: GoalModalProps) {
  const [form, setForm] = useState<GoalFormData>(emptyGoal);

  const isEditing = !!initial?.id;

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm(emptyGoal);
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const remaining =
    form.targetAmount && form.currentAmount
      ? Math.max(0, parseFloat(form.targetAmount) - parseFloat(form.currentAmount))
      : 0;

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
            {isEditing ? "Editar" : "Nova"} meta
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Nome da meta</label>
            <input
              className={inputClass}
              placeholder="Ex: Viagem, Reserva de emergência..."
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Valor alvo</label>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                min="0"
                placeholder="10000.00"
                required
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Valor acumulado</label>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.currentAmount}
                onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
              />
            </div>
          </div>

          {/* Remaining display */}
          {form.targetAmount && (
            <div className="flex items-center gap-3 px-4 py-3 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-lg shadow-[var(--neo-shadow-hover)]">
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">
                Falta:
              </span>
              <span className="text-sm font-black text-[var(--primary)]">
                R$ {remaining.toFixed(2)}
              </span>
            </div>
          )}

          <div>
            <label className={labelClass}>Prazo (opcional)</label>
            <input
              className={inputClass}
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

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
