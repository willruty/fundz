import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  FileX,
  Upload,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpDown,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../service/transaction.service";
import type { Category } from "../service/categories.service";
import type { ApiAccount } from "../service/accounts.service";
import { CategoryDropdown } from "./CategoryDropdown";

export type TransactionKind = "expense" | "income";
export type TableMode = "expense" | "income" | "all";

export interface ExpenseTransaction {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  accountId?: string;
  date: string;        // "dd/mm/yyyy"
  isoDate: string;     // "yyyy-mm-dd"
  amount: number;
  type?: TransactionKind;
}

interface TransactionTableCardProps {
  transactions: ExpenseTransaction[];
  categories: Category[];
  accounts: ApiAccount[];
  onMutate: () => Promise<void> | void;
  mode?: TableMode;
  title?: string;
  subtitle?: string;
  hideImport?: boolean;
}

type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc" | "desc_az";
type TypeFilter = "" | "expense" | "income";

const CATEGORY_COLORS: Record<string, string> = {
  Viagem: "#1A6BFF",
  Alimentação: "#22c55e",
  Transporte: "#f97316",
  Vícios: "#FF3B3B",
  Saúde: "#a855f7",
};

const CAT_PALETTE = ["#1A6BFF", "#22c55e", "#a855f7", "#f97316", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899"];

function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLORS[name] ?? CAT_PALETTE[index % CAT_PALETTE.length];
}

const ITEMS_PER_PAGE = 8;

interface EditForm {
  description: string;
  amount: string;
  occurred_at: string;
  category_id: string;
  account_id: string;
  type: TransactionKind;
}

const buildEmptyForm = (defaultType: TransactionKind): EditForm => ({
  description: "",
  amount: "",
  occurred_at: new Date().toISOString().slice(0, 10),
  category_id: "",
  account_id: "",
  type: defaultType,
});

// ─── Import Modal ─────────────────────────────────────────────────────────────

interface ImportRow {
  description: string;
  amount: string;
  occurred_at: string;
  type?: TransactionKind;
}

interface ImportModalProps {
  onClose: () => void;
  onImport: (rows: ImportRow[]) => Promise<void>;
  defaultType: TransactionKind;
  allowTypePerRow: boolean;
}

function ImportModal({ onClose, onImport, defaultType, allowTypePerRow }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizeRow = (row: Record<string, unknown>): ImportRow | null => {
    const getKey = (keys: string[]): string => {
      for (const k of keys) {
        const hit = Object.keys(row).find((rk) => rk.toLowerCase().trim() === k);
        if (hit) return String(row[hit] ?? "").trim();
      }
      return "";
    };
    const description = getKey(["description", "descricao", "descrição", "desc"]);
    const amountRaw = getKey(["amount", "valor"]);
    const dateRaw = getKey(["date", "data", "occurred_at"]);
    if (!description) return null;

    const amount = amountRaw.replace(/[^\d.,-]/g, "").replace(",", ".");

    let occurred_at = dateRaw;
    if (dateRaw && /^\d{2}\/\d{2}\/\d{4}$/.test(dateRaw)) {
      const [d, m, y] = dateRaw.split("/");
      occurred_at = `${y}-${m}-${d}`;
    } else if (!dateRaw) {
      occurred_at = new Date().toISOString().slice(0, 10);
    }

    let type: TransactionKind = defaultType;
    if (allowTypePerRow) {
      const typeRaw = getKey(["type", "tipo"]).toLowerCase();
      if (typeRaw === "income" || typeRaw === "entrada" || typeRaw === "receita") type = "income";
      else if (typeRaw === "expense" || typeRaw === "saída" || typeRaw === "saida" || typeRaw === "despesa") type = "expense";
    }

    return { description, amount: amount || "0", occurred_at, type };
  };

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, "").toLowerCase());
    return lines.slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
        return normalizeRow(row);
      })
      .filter((r): r is ImportRow => r !== null);
  };

  const parseExcel = async (f: File): Promise<ImportRow[]> => {
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { raw: false });
    return json.map(normalizeRow).filter((r): r is ImportRow => r !== null);
  };

  const handleFile = async (f: File) => {
    setFile(f);
    try {
      const ext = f.name.toLowerCase().split(".").pop();
      if (ext === "csv") {
        const text = await f.text();
        setPreview(parseCSV(text));
      } else if (ext === "xlsx" || ext === "xls") {
        const rows = await parseExcel(f);
        setPreview(rows);
      } else {
        toast.error("Formato inválido. Use .csv, .xlsx ou .xls");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao ler arquivo");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleImport = async () => {
    if (!preview.length) return;
    setImporting(true);
    try {
      await onImport(preview);
      onClose();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white border-2 border-[var(--black)] rounded-2xl shadow-[8px_8px_0px_0px_#000] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden z-10"
      >
        <div className="flex items-center justify-between p-5 border-b-2 border-[var(--black)] bg-[var(--primary)]">
          <h3 className="text-[var(--secondary)] font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <Upload size={18} strokeWidth={3} /> Importar Transações
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded border-2 border-white/30 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.01]"
                : "border-[var(--black)] hover:border-[var(--primary)] hover:bg-black/5"
            }`}
          >
            <Upload size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--black-muted)]" />
            <p className="font-black text-sm text-[var(--primary)] uppercase">
              {file ? file.name : "Arraste um arquivo aqui ou clique para selecionar"}
            </p>
            <p className="text-[10px] text-[var(--black-muted)] font-bold mt-1 uppercase tracking-wider">
              Formatos: CSV, XLSX, XLS
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <div className="bg-[var(--secondary)]/20 border-2 border-[var(--black)] rounded-xl p-4">
            <p className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-2">
              Colunas aceitas
            </p>
            <p className="text-[11px] text-[var(--black-muted)] leading-relaxed">
              <strong>date/data</strong>, <strong>description/descricao</strong>, <strong>amount/valor</strong>
              {allowTypePerRow && <>, <strong>type/tipo</strong> (income/expense)</>}
              <br />
              Ex: <code className="text-xs font-mono">2024-01-15,Supermercado,150.00</code>
            </p>
          </div>

          {preview.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-2">
                Preview — {preview.length} linha{preview.length === 1 ? "" : "s"}
              </p>
              <div className="overflow-x-auto border-2 border-[var(--black)] rounded-xl max-h-[220px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--primary)]/10 border-b-2 border-[var(--black)] sticky top-0">
                    <tr>
                      <th className="p-3 text-left font-black uppercase text-[var(--black-muted)] tracking-widest">Data</th>
                      <th className="p-3 text-left font-black uppercase text-[var(--black-muted)] tracking-widest">Descrição</th>
                      {allowTypePerRow && (
                        <th className="p-3 text-left font-black uppercase text-[var(--black-muted)] tracking-widest">Tipo</th>
                      )}
                      <th className="p-3 text-right font-black uppercase text-[var(--black-muted)] tracking-widest">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="p-3 text-[var(--black-muted)] font-bold">{row.occurred_at}</td>
                        <td className="p-3 font-black text-[var(--primary)] uppercase">{row.description}</td>
                        {allowTypePerRow && (
                          <td className="p-3 text-[10px] font-black uppercase">
                            {row.type === "income" ? "Entrada" : "Saída"}
                          </td>
                        )}
                        <td className="p-3 text-right">
                          <span
                            className={`font-black px-2 py-0.5 rounded border border-[var(--black)] ${
                              row.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            R$ {Number(row.amount).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t-2 border-[var(--black)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--black)] font-black text-xs uppercase text-[var(--black-muted)] hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!preview.length || importing}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--black)] bg-[var(--primary)] text-[var(--secondary)] font-black text-xs uppercase shadow-[var(--neo-shadow-hover)] hover:translate-y-[1px] hover:translate-x-[1px] transition-all disabled:opacity-50 cursor-pointer"
          >
            {importing ? "Importando..." : `Importar ${preview.length}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TransactionTableCard({
  transactions,
  categories,
  accounts,
  onMutate,
  mode = "expense",
  title,
  subtitle,
  hideImport = false,
}: TransactionTableCardProps) {
  const defaultType: TransactionKind = mode === "income" ? "income" : "expense";
  const isAllMode = mode === "all";

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(buildEmptyForm(defaultType));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseTransaction | null>(null);

  // Inline category change loading state (per row)
  const [inlineUpdatingId, setInlineUpdatingId] = useState<string | null>(null);

  // Import modal
  const [importOpen, setImportOpen] = useState(false);

  // Filters
  const [filterSearch, setFilterSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState<TypeFilter>("");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Reload helper
  const [reloading, setReloading] = useState(false);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const filteredData = useMemo(() => {
    let result = [...transactions];

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (filterDateFrom) result = result.filter((t) => t.isoDate >= filterDateFrom);
    if (filterDateTo) result = result.filter((t) => t.isoDate <= filterDateTo);
    if (filterCategory) result = result.filter((t) => t.category === filterCategory);
    if (isAllMode && filterType) result = result.filter((t) => (t.type ?? "expense") === filterType);

    result.sort((a, b) => {
      switch (sortBy) {
        case "date_desc": return b.isoDate.localeCompare(a.isoDate);
        case "date_asc":  return a.isoDate.localeCompare(b.isoDate);
        case "amount_desc": return b.amount - a.amount;
        case "amount_asc":  return a.amount - b.amount;
        case "desc_az": return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [transactions, filterSearch, filterDateFrom, filterDateTo, filterCategory, filterType, sortBy, isAllMode]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const currentData = filteredData.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const activeFilterCount = [
    filterDateFrom,
    filterDateTo,
    filterCategory,
    filterType,
    sortBy !== "date_desc" ? sortBy : "",
  ].filter(Boolean).length;

  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filtered category total (respects type if in all mode with a type filter)
  const totalIncome = filteredData
    .filter((t) => (t.type ?? "expense") === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredData
    .filter((t) => (t.type ?? "expense") === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const totalAmount = isAllMode
    ? totalIncome - totalExpense
    : filteredData.reduce((s, t) => s + t.amount, 0);

  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCategory("");
    setFilterType("");
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  // Category list for create/edit selectors based on the row's type
  const categoriesFor = (txType: TransactionKind): Category[] => {
    const matching = categories.filter((c) => c.type === txType || c.type === "both");
    return matching.length > 0 ? matching : categories;
  };

  const startCreate = () => {
    if (accounts.length === 0) {
      toast.error("Nenhuma conta disponível. Crie uma conta primeiro.");
      return;
    }
    const type = defaultType;
    const available = categoriesFor(type);
    setIsCreating(true);
    setEditingId("new");
    setEditForm({
      description: "",
      amount: "",
      occurred_at: new Date().toISOString().slice(0, 10),
      category_id: available[0]?.id ?? "",
      account_id: accounts[0]?.id ?? "",
      type,
    });
  };

  const startEdit = (t: ExpenseTransaction) => {
    setIsCreating(false);
    setEditingId(t.id);
    setEditForm({
      description: t.title,
      amount: String(t.amount),
      occurred_at: t.isoDate,
      category_id: t.categoryId ?? "",
      account_id: t.accountId ?? accounts[0]?.id ?? "",
      type: t.type ?? defaultType,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm(buildEmptyForm(defaultType));
  };

  const handleSave = async () => {
    if (!editForm.description.trim()) {
      toast.error("Descrição obrigatória");
      return;
    }
    if (!editForm.account_id) {
      toast.error("Selecione uma conta");
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        await createTransaction({
          description: editForm.description,
          amount: editForm.amount || "0",
          type: editForm.type,
          occurred_at: editForm.occurred_at,
          account_id: editForm.account_id,
          category_id: editForm.category_id || undefined,
        });
        toast.success("Transação criada!");
      } else if (editingId) {
        await updateTransaction({
          id: editingId,
          description: editForm.description,
          amount: editForm.amount || "0",
          type: editForm.type,
          occurred_at: editForm.occurred_at,
          account_id: editForm.account_id,
          category_id: editForm.category_id || undefined,
        });
        toast.success("Transação atualizada!");
      }
      cancelEdit();
      await onMutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleInlineCategoryChange = async (tx: ExpenseTransaction, newCategoryId: string | null) => {
    setInlineUpdatingId(tx.id);
    try {
      await updateTransaction({
        id: tx.id,
        category_id: newCategoryId ?? undefined,
      });
      toast.success("Categoria atualizada!");
      await onMutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar categoria");
    } finally {
      setInlineUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget.id);
      toast.success("Transação removida!");
      setDeleteTarget(null);
      await onMutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao deletar");
    }
  };

  const handleImport = async (rows: ImportRow[]) => {
    const defaultAccount = accounts[0]?.id;
    if (!defaultAccount) {
      toast.error("Crie uma conta antes de importar");
      return;
    }
    let success = 0;
    let fail = 0;
    for (const row of rows) {
      try {
        await createTransaction({
          description: row.description,
          amount: row.amount,
          type: row.type ?? defaultType,
          occurred_at: row.occurred_at,
          account_id: defaultAccount,
        });
        success++;
      } catch {
        fail++;
      }
    }
    toast[fail === 0 ? "success" : "error"](
      fail === 0
        ? `${success} transação${success === 1 ? "" : "ões"} importada${success === 1 ? "" : "s"}!`
        : `${success} importadas, ${fail} falharam`,
    );
    await onMutate();
  };

  const handleRefresh = async () => {
    setReloading(true);
    try {
      await onMutate();
    } finally {
      setReloading(false);
    }
  };

  const inputClass =
    "bg-white border-2 border-[var(--black)] rounded-md outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]";

  // Header labels
  const headerSubtitle = subtitle ?? (
    mode === "income" ? "Entradas" : mode === "all" ? "Movimentações" : "Despesas"
  );
  const headerTitle = title ?? (
    mode === "income" ? "Receitas do Mês" : mode === "all" ? "Transações" : "Transações do Mês"
  );
  const subtitleColor = mode === "income" ? "text-emerald-400" : mode === "all" ? "text-[var(--secondary)]" : "text-[#FF3B3B]";

  // Determine total color
  const totalColor =
    isAllMode
      ? (totalAmount >= 0 ? "text-emerald-400" : "text-[#FF3B3B]")
      : mode === "income"
        ? "text-emerald-400"
        : "text-[#FF3B3B]";

  const colCount = isAllMode ? 7 : 6;

  return (
    <div className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 relative">

      {/* Import modal */}
      <AnimatePresence>
        {importOpen && (
          <ImportModal
            onClose={() => setImportOpen(false)}
            onImport={handleImport}
            defaultType={defaultType}
            allowTypePerRow={isAllMode}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Confirmar exclusão</h3>
            <p className="text-sm font-bold text-[var(--black-muted)]">
              Remover <span className="text-[var(--primary)]">{deleteTarget.title}</span>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-red-500 text-white shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className={`text-[10px] font-extrabold tracking-widest ${subtitleColor} uppercase mb-1`}>
              {headerSubtitle}
            </h3>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter m-0">
              {headerTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Total */}
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-[var(--main-bg)] opacity-60 uppercase tracking-wider">
                {isAllMode ? "Saldo filtrado" : "Total filtrado"}
              </span>
              <span className={`text-lg font-black ${totalColor} tracking-tight`}>
                {isAllMode && totalAmount >= 0 ? "+" : ""}{fmt(totalAmount)}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--black-muted)]" />
              <input
                value={filterSearch}
                onChange={(e) => { setFilterSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Pesquisar..."
                className="bg-white text-[var(--primary)] pl-8 pr-3 py-2 rounded-md border-2 border-[var(--black)] text-xs font-bold w-40 outline-none focus:ring-2 focus:ring-[var(--secondary)] shadow-[var(--neo-shadow-hover)]"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className={`bg-white text-[var(--primary)] p-2 rounded-md border-2 border-[var(--black)] hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer ${reloading ? "animate-spin" : ""}`}
            >
              <RefreshCw size={18} strokeWidth={2.5} />
            </button>

            {/* Filter menu */}
            <div className="relative">
              <button
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="bg-white text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] text-xs font-black uppercase flex items-center gap-2 hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
              >
                <Filter size={14} strokeWidth={2.5} />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-[var(--primary)] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {filterMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setFilterMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 sm:w-80 bg-white border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow)] z-50 p-5 space-y-5"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest flex items-center gap-2">
                          <Calendar size={12} strokeWidth={3} /> Período
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={filterDateFrom}
                            onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                            className={`${inputClass} p-2 text-[10px] font-bold w-full`}
                          />
                          <input
                            type="date"
                            value={filterDateTo}
                            onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                            className={`${inputClass} p-2 text-[10px] font-bold w-full`}
                          />
                        </div>
                      </div>

                      {isAllMode && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Tipo</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "", label: "Todos" },
                              { val: "income", label: "Entrada" },
                              { val: "expense", label: "Saída" },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => { setFilterType(opt.val as TypeFilter); setCurrentPage(1); }}
                                className={`py-2 rounded-md border-2 border-[var(--black)] text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                                  filterType === opt.val
                                    ? "bg-[var(--primary)] text-[var(--secondary)]"
                                    : "bg-white text-[var(--primary)] shadow-[var(--neo-shadow-hover)] hover:bg-[var(--secondary)]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Categoria</label>
                        <select
                          value={filterCategory}
                          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                          className={`w-full ${inputClass} p-2 text-[10px] font-black uppercase`}
                        >
                          <option value="">Todas</option>
                          {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest flex items-center gap-2">
                          <ArrowUpDown size={12} strokeWidth={3} /> Ordenar por
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                          className={`w-full ${inputClass} p-2 text-[10px] font-black uppercase`}
                        >
                          <option value="date_desc">Data (Recente)</option>
                          <option value="date_asc">Data (Antigo)</option>
                          <option value="amount_desc">Valor (Maior)</option>
                          <option value="amount_asc">Valor (Menor)</option>
                          <option value="desc_az">Descrição (A → Z)</option>
                        </select>
                      </div>

                      <button
                        onClick={() => { clearFilters(); setFilterMenuOpen(false); }}
                        className="w-full py-2 text-[10px] font-black text-[var(--black-muted)] uppercase hover:text-[var(--primary)] transition-colors border-t-2 border-dashed border-[var(--black)] pt-3 cursor-pointer"
                      >
                        Limpar Filtros
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={startCreate}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Nova
            </button>

            {!hideImport && (
              <button
                onClick={() => setImportOpen(true)}
                className="bg-white text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
              >
                <Upload size={14} strokeWidth={2.5} /> Importar
              </button>
            )}
          </div>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filterDateFrom && (
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                De: {filterDateFrom}
                <button onClick={() => setFilterDateFrom("")}><X size={10} strokeWidth={3} /></button>
              </span>
            )}
            {filterDateTo && (
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                Até: {filterDateTo}
                <button onClick={() => setFilterDateTo("")}><X size={10} strokeWidth={3} /></button>
              </span>
            )}
            {filterCategory && (
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                {filterCategory}
                <button onClick={() => setFilterCategory("")}><X size={10} strokeWidth={3} /></button>
              </span>
            )}
            {isAllMode && filterType && (
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                {filterType === "income" ? "Entradas" : "Saídas"}
                <button onClick={() => setFilterType("")}><X size={10} strokeWidth={3} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--black)] bg-white">
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest w-10" />
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Data</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Descrição</th>
              {isAllMode && (
                <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Tipo</th>
              )}
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">Categoria</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-right">Valor</th>
              <th className="p-4 text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {/* New row */}
            {isCreating && (
              <tr className="bg-emerald-50 border-b-2 border-[var(--black)]">
                <td className="p-4 w-2" />
                <td className="p-4">
                  <input
                    type="date"
                    value={editForm.occurred_at}
                    onChange={(e) => setEditForm({ ...editForm, occurred_at: e.target.value })}
                    className={`w-full ${inputClass} px-2 py-1.5 text-xs font-bold`}
                  />
                </td>
                <td className="p-4">
                  <input
                    placeholder="Ex: Supermercado"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`w-full ${inputClass} px-3 py-1.5 text-xs font-black uppercase`}
                    autoFocus
                  />
                </td>
                {isAllMode && (
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, type: "income" })}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border-2 border-[var(--black)] text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                          editForm.type === "income"
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-[var(--black-muted)]"
                        }`}
                      >
                        <TrendingUp size={10} strokeWidth={3} /> In
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, type: "expense" })}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border-2 border-[var(--black)] text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                          editForm.type === "expense"
                            ? "bg-red-500 text-white"
                            : "bg-white text-[var(--black-muted)]"
                        }`}
                      >
                        <TrendingDown size={10} strokeWidth={3} /> Out
                      </button>
                    </div>
                  </td>
                )}
                <td className="p-4">
                  <CategoryDropdown
                    value={editForm.category_id || undefined}
                    categories={categoriesFor(editForm.type)}
                    transactionType={editForm.type}
                    onChange={(catId) => setEditForm({ ...editForm, category_id: catId ?? "" })}
                    onCategoriesChange={onMutate}
                  />
                </td>
                <td className="p-4 text-right">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className={`w-28 ${inputClass} px-3 py-1.5 text-right text-xs font-black`}
                  />
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)] disabled:opacity-50 cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={3} className="text-[var(--primary)]" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-red-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-red-500 transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
                    >
                      <X size={14} strokeWidth={3} className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {filteredData.length === 0 && !isCreating ? (
              <tr>
                <td colSpan={colCount} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                      <FileX size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
                    </div>
                    <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                      {transactions.length > 0 ? "Nenhuma com esses filtros" : "Nenhuma transação"}
                    </p>
                    {transactions.length > 0 && activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-black uppercase text-[var(--black-muted)] hover:text-[var(--primary)] cursor-pointer"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((t) => {
                const rowType = t.type ?? "expense";
                const isEditingThis = editingId === t.id;
                const amountTextClass =
                  rowType === "income" ? "text-emerald-700 bg-emerald-50" : "text-[#FF3B3B] bg-red-50";
                const amountSign = rowType === "income" ? "+" : "-";
                return (
                  <tr
                    key={t.id}
                    className={`border-b-2 border-[var(--black)] transition-all group ${
                      isEditingThis ? "bg-[var(--secondary)]/20" : "hover:bg-black/[0.03]"
                    } ${inlineUpdatingId === t.id ? "opacity-60" : ""}`}
                  >
                    <td className="p-4 w-2" />

                    <td className="p-4 text-xs font-bold text-[var(--black-muted)] whitespace-nowrap">
                      {isEditingThis ? (
                        <input
                          type="date"
                          value={editForm.occurred_at}
                          onChange={(e) => setEditForm({ ...editForm, occurred_at: e.target.value })}
                          className={`${inputClass} px-2 py-1 text-xs font-bold`}
                        />
                      ) : (
                        t.date
                      )}
                    </td>

                    <td className="p-4">
                      {isEditingThis ? (
                        <input
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className={`w-full ${inputClass} px-3 py-1 text-xs font-black uppercase`}
                        />
                      ) : (
                        <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                          {t.title}
                        </span>
                      )}
                    </td>

                    {isAllMode && (
                      <td className="p-4">
                        {isEditingThis ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, type: "income" })}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md border-2 border-[var(--black)] text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                                editForm.type === "income"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white text-[var(--black-muted)]"
                              }`}
                            >
                              <TrendingUp size={10} strokeWidth={3} /> In
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, type: "expense" })}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md border-2 border-[var(--black)] text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                                editForm.type === "expense"
                                  ? "bg-red-500 text-white"
                                  : "bg-white text-[var(--black-muted)]"
                              }`}
                            >
                              <TrendingDown size={10} strokeWidth={3} /> Out
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${
                              rowType === "income" ? "text-emerald-600" : "text-[#FF3B3B]"
                            }`}
                          >
                            {rowType === "income"
                              ? <TrendingUp size={13} strokeWidth={3} />
                              : <TrendingDown size={13} strokeWidth={3} />}
                            {rowType === "income" ? "Entrada" : "Saída"}
                          </span>
                        )}
                      </td>
                    )}

                    <td className="p-4">
                      {isEditingThis ? (
                        <CategoryDropdown
                          value={editForm.category_id || undefined}
                          categories={categoriesFor(editForm.type)}
                          transactionType={editForm.type}
                          onChange={(catId) => setEditForm({ ...editForm, category_id: catId ?? "" })}
                          onCategoriesChange={onMutate}
                        />
                      ) : (
                        <CategoryDropdown
                          value={t.categoryId}
                          categories={categoriesFor(rowType)}
                          transactionType={rowType}
                          onChange={(catId) => handleInlineCategoryChange(t, catId)}
                          onCategoriesChange={onMutate}
                          getColor={getCategoryColor}
                        />
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {isEditingThis ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className={`w-28 ${inputClass} px-3 py-1 text-right text-xs font-black`}
                        />
                      ) : (
                        <span className={`text-sm font-black px-2 py-1 rounded border-2 border-[var(--black)] ${amountTextClass}`}>
                          {isAllMode && amountSign}{fmt(t.amount)}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {isEditingThis ? (
                          <>
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)] disabled:opacity-50 cursor-pointer"
                            >
                              <Plus size={14} strokeWidth={3} className="text-[var(--primary)]" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-red-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-red-500 transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
                            >
                              <X size={14} strokeWidth={3} className="text-white" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(t)}
                              className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-[var(--primary)] cursor-pointer"
                            >
                              <Pencil size={15} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(t)}
                              className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 size={15} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 bg-white border-t-2 border-[var(--black)] border-dashed flex justify-between items-center gap-3">
        <span className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
          {filteredData.length > 0
            ? `${filteredData.length} resultado${filteredData.length !== 1 ? "s" : ""} • Página ${safePage} de ${totalPages}`
            : "Sem resultados"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-2.5 py-1 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
            {isAllMode && totalAmount >= 0 ? "+" : ""}{fmt(totalAmount)} total
          </span>
          <button
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="bg-white text-[var(--primary)] p-1.5 rounded-md border-2 border-[var(--black)] hover:bg-black/5 disabled:opacity-50 transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
          >
            <ChevronLeft strokeWidth={3} size={16} />
          </button>
          <button
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="bg-white text-[var(--primary)] p-1.5 rounded-md border-2 border-[var(--black)] hover:bg-black/5 disabled:opacity-50 transition-colors shadow-[var(--neo-shadow-hover)] cursor-pointer"
          >
            <ChevronRight strokeWidth={3} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
