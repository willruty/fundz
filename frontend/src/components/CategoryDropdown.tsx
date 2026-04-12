import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { createCategory, type Category } from "../service/categories.service";

interface CategoryDropdownProps {
  value?: string; // categoryId
  categories: Category[];
  transactionType?: string; // "expense" | "income" | "both" (used when creating a new category)
  onChange: (categoryId: string | null) => void | Promise<void>;
  onCategoriesChange?: () => void | Promise<void>; // called after a new category is created
  getColor?: (name: string, index: number) => string;
  compact?: boolean;
}

const DEFAULT_PALETTE = ["#1A6BFF", "#22c55e", "#a855f7", "#f97316", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899"];

function defaultColor(name: string, index: number): string {
  const fixed: Record<string, string> = {
    Viagem: "#1A6BFF",
    Alimentação: "#22c55e",
    Transporte: "#f97316",
    Vícios: "#FF3B3B",
    Saúde: "#a855f7",
  };
  return fixed[name] ?? DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}

export function CategoryDropdown({
  value,
  categories,
  transactionType = "expense",
  onChange,
  onCategoriesChange,
  getColor = defaultColor,
  compact = false,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (creating) newInputRef.current?.focus();
  }, [creating]);

  const selected = categories.find((c) => c.id === value);
  const selectedColor = selected
    ? getColor(selected.name, categories.indexOf(selected))
    : "#9ca3af";

  const handleSelect = async (catId: string | null) => {
    setOpen(false);
    setCreating(false);
    await onChange(catId);
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setSavingNew(true);
    try {
      const created = await createCategory({ name, type: transactionType });
      toast.success("Categoria criada!");
      setNewName("");
      setCreating(false);
      setOpen(false);
      if (onCategoriesChange) await onCategoriesChange();
      await onChange(created.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar categoria");
    } finally {
      setSavingNew(false);
    }
  };

  const triggerPadding = compact ? "px-2 py-1" : "px-2.5 py-1";
  const triggerText = compact ? "text-[10px]" : "text-[9px]";

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`${triggerText} ${triggerPadding} font-black rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider flex items-center gap-1.5 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all cursor-pointer whitespace-nowrap`}
        style={{
          background: selected ? selectedColor : "#f3f4f6",
          color: selected ? (selectedColor === "#F9D100" || selectedColor === "#ffd100" ? "#1a1a1a" : "#ffffff") : "#6b7280",
        }}
      >
        <span className="max-w-[120px] truncate">{selected?.name ?? "Sem categoria"}</span>
        <ChevronDown size={11} strokeWidth={3} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 z-30 w-52 bg-white border-2 border-[var(--black)] rounded-lg shadow-[4px_4px_0px_0px_#000] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--black-muted)] hover:bg-black/5 flex items-center justify-between border-b border-dashed border-[var(--black)]/30 cursor-pointer"
              >
                Sem categoria
                {!value && <Check size={12} strokeWidth={3} className="text-[var(--primary)]" />}
              </button>

              {categories.length === 0 && !creating && (
                <div className="px-3 py-3 text-[10px] font-bold text-[var(--black-muted)] text-center">
                  Nenhuma categoria
                </div>
              )}

              {categories.map((cat, i) => {
                const color = getColor(cat.name, i);
                const isActive = value === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-black/5 flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className="w-3 h-3 rounded-sm border border-[var(--black)] flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="flex-1 truncate text-[var(--primary)]">{cat.name}</span>
                    {isActive && <Check size={12} strokeWidth={3} className="text-[var(--primary)]" />}
                  </button>
                );
              })}
            </div>

            <div className="border-t-2 border-[var(--black)] bg-[var(--secondary)]/30">
              {creating ? (
                <div className="p-2 flex items-center gap-1.5">
                  <input
                    ref={newInputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreate();
                      } else if (e.key === "Escape") {
                        setCreating(false);
                        setNewName("");
                      }
                    }}
                    placeholder="Nome da categoria"
                    className="flex-1 min-w-0 px-2 py-1.5 text-[10px] font-bold border-2 border-[var(--black)] rounded-md outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={savingNew || !newName.trim()}
                    className="p-1.5 rounded-md border-2 border-[var(--black)] bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 shadow-[var(--neo-shadow-hover)] cursor-pointer"
                  >
                    <Check size={12} strokeWidth={3} className="text-[var(--primary)]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreating(false); setNewName(""); }}
                    className="p-1.5 rounded-md border-2 border-[var(--black)] bg-red-400 hover:bg-red-500 shadow-[var(--neo-shadow-hover)] cursor-pointer"
                  >
                    <X size={12} strokeWidth={3} className="text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="w-full px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--primary)] hover:bg-[var(--secondary)] flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={12} strokeWidth={3} />
                  Nova categoria
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
