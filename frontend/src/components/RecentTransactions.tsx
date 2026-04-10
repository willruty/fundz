import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Check,
  Pencil,
  Trash2,
  FileX,
  Upload,
  Search,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../service/transaction.service";
import type { Transaction } from "../service/transaction.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

type SortOption =
  | "date_desc"
  | "date_asc"
  | "amount_desc"
  | "amount_asc"
  | "desc_az";

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b-2 border-[var(--black)] animate-pulse">
      <td className="p-4 sm:p-5">
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-gray-200 rounded border-2 border-gray-300" />
          <div className="w-7 h-7 bg-gray-200 rounded border-2 border-gray-300" />
        </div>
      </td>
      <td className="p-4 sm:p-5">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      <td className="p-4 sm:p-5">
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </td>
      <td className="p-4 sm:p-5 text-right">
        <div className="h-6 w-24 bg-gray-200 rounded ml-auto" />
      </td>
    </tr>
  );
}

// ─── CSV Import Modal ─────────────────────────────────────────────────────────

interface CsvModalProps {
  onClose: () => void;
  onImport: (rows: Partial<Transaction>[]) => Promise<void>;
}

function CsvImportModal({ onClose, onImport }: CsvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<Transaction>[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): Partial<Transaction>[] => {
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0]
      .toLowerCase()
      .split(",")
      .map((h) => h.trim().replace(/"/g, ""));

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] ?? "";
        });

        const date =
          row.date ||
          row.data ||
          row.occurred_at ||
          new Date().toISOString().split("T")[0];
        const rawType = (row.type || row.tipo || "expense").toLowerCase();

        return {
          description: row.description || row.descricao || row.desc || "",
          amount: row.amount || row.valor || "0",
          type:
            rawType === "entrada" || rawType === "income" ? "income" : "expense",
          occurred_at: date,
        };
      })
      .filter((r) => r.description);
  };

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setPreview(parseCSV(text));
    };
    reader.readAsText(f, "UTF-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".csv")) handleFile(dropped);
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white border-2 border-[var(--black)] rounded-2xl shadow-[var(--neo-shadow)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden z-10"
      >
        <div className="flex items-center justify-between p-5 border-b-2 border-[var(--black)] bg-[var(--primary)]">
          <h3 className="text-[var(--secondary)] font-black text-lg uppercase tracking-tight flex items-center gap-2">
            <Upload size={18} strokeWidth={3} /> Importar CSV
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded border-2 border-transparent hover:border-white/50 hover:bg-white/20 text-white transition-all"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.01]"
                : "border-[var(--black)] hover:border-[var(--primary)] hover:bg-black/5"
            }`}
          >
            <Upload
              size={32}
              strokeWidth={1.5}
              className="mx-auto mb-3 text-[var(--black-muted)]"
            />
            <p className="font-black text-sm text-[var(--primary)] uppercase">
              {file
                ? file.name
                : "Arraste o CSV aqui ou clique para selecionar"}
            </p>
            <p className="text-[10px] text-[var(--black-muted)] font-bold mt-1 uppercase tracking-wider">
              Formato: date, description, amount, type
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
          </div>

          <div className="bg-[var(--secondary)]/20 border-2 border-[var(--black)] rounded-xl p-4">
            <p className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-2">
              Exemplo de CSV aceito
            </p>
            <code className="text-xs font-mono text-[var(--primary)] block whitespace-pre">
              {`date,description,amount,type\n2024-01-15,Supermercado,150.00,expense\n2024-01-16,Salário,3000.00,income`}
            </code>
            <p className="text-[10px] text-[var(--black-muted)] mt-2">
              Colunas aceitas:{" "}
              <strong>date/data</strong>, <strong>description/descricao</strong>
              , <strong>amount/valor</strong>, <strong>type/tipo</strong>{" "}
              (income/expense ou entrada/despesa)
            </p>
          </div>

          {preview.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest mb-2">
                Preview — {preview.length} transaç
                {preview.length === 1 ? "ão" : "ões"} encontradas
              </p>
              <div className="overflow-x-auto border-2 border-[var(--black)] rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--primary)]/10 border-b-2 border-[var(--black)]">
                    <tr>
                      <th className="p-3 text-left font-black uppercase text-[var(--black-muted)] tracking-widest">
                        Data
                      </th>
                      <th className="p-3 text-left font-black uppercase text-[var(--black-muted)] tracking-widest">
                        Descrição
                      </th>
                      <th className="p-3 text-right font-black uppercase text-[var(--black-muted)] tracking-widest">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="p-3 text-[var(--black-muted)] font-bold">
                          {row.occurred_at}
                        </td>
                        <td className="p-3 font-black text-[var(--primary)] uppercase">
                          {row.description}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`font-black px-2 py-0.5 rounded border border-[var(--black)] ${
                              row.type === "income"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            R$ {Number(row.amount).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-3 text-center text-[10px] font-black text-[var(--black-muted)] uppercase"
                        >
                          + {preview.length - 5} linha(s) oculta(s)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t-2 border-[var(--black)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--black)] font-black text-xs uppercase text-[var(--black-muted)] hover:bg-black/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!preview.length || importing}
            className="flex-1 py-3 rounded-xl border-2 border-[var(--black)] bg-[var(--primary)] text-[var(--secondary)] font-black text-xs uppercase shadow-[var(--neo-shadow-hover)] hover:translate-y-[1px] hover:translate-x-[1px] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:translate-x-0"
          >
            {importing
              ? "Importando..."
              : `Importar ${preview.length} transaç${preview.length === 1 ? "ão" : "ões"}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const [filterSearch, setFilterSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterType, setFilterType] = useState<"" | "income" | "expense">("");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const inputClass =
    "bg-white border-2 border-[var(--black)] rounded-md outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]";

  const showToast = (message: string, type: Toast["type"] = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch {
      showToast("Erro ao carregar transações", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...transactions];

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(q));
    }

    if (filterDateFrom)
      result = result.filter((t) => t.occurred_at.slice(0, 10) >= filterDateFrom);

    if (filterDateTo)
      result = result.filter((t) => t.occurred_at.slice(0, 10) <= filterDateTo);

    if (filterType) result = result.filter((t) => t.type === filterType);

    result.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime();
        case "date_asc":
          return new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime();
        case "amount_desc":
          return Number(b.amount) - Number(a.amount);
        case "amount_asc":
          return Number(a.amount) - Number(b.amount);
        case "desc_az":
          return a.description.localeCompare(b.description);
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, filterSearch, filterDateFrom, filterDateTo, filterType, sortBy]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const activeFilterCount = [
    filterDateFrom,
    filterDateTo,
    filterType,
    sortBy !== "date_desc" ? sortBy : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterType("");
    setSortBy("date_desc");
    setCurrentPage(1);
    showToast("Filtros limpos", "info");
  };

  const handleSave = async () => {
    const isNew = editingId === "new";
    try {
      if (isNew) {
        await createTransaction({
          description: editForm.description ?? "",
          amount: String(editForm.amount ?? "0"),
          type: editForm.type ?? "expense",
          occurred_at: editForm.occurred_at ?? new Date().toISOString().split("T")[0],
        });
        showToast("Criado com sucesso!", "success");
      } else {
        await updateTransaction({
          id: editingId!,
          description: editForm.description ?? "",
          amount: String(editForm.amount ?? "0"),
          type: editForm.type ?? "expense",
          occurred_at: editForm.occurred_at ?? new Date().toISOString().split("T")[0],
        });
        showToast("Atualizado!", "success");
      }
      setEditingId(null);
      setIsCreating(false);
      fetchTransactions();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro no servidor", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      showToast("Transação removida", "success");
      fetchTransactions();
    } catch {
      showToast("Erro ao deletar", "error");
    }
  };

  const handleCsvImport = async (rows: Partial<Transaction>[]) => {
    let success = 0;
    let fail = 0;
    for (const row of rows) {
      try {
        await createTransaction({
          description: row.description ?? "",
          amount: String(row.amount ?? "0"),
          type: row.type ?? "expense",
          occurred_at: row.occurred_at ?? new Date().toISOString().split("T")[0],
        });
        success++;
      } catch {
        fail++;
      }
    }
    showToast(
      fail === 0
        ? `${success} transaç${success === 1 ? "ão importada" : "ões importadas"}!`
        : `${success} importadas, ${fail} falharam`,
      fail === 0 ? "success" : "error",
    );
    fetchTransactions();
  };

  return (
    <div className="w-full relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-lg border-2 border-[var(--black)] font-black text-xs uppercase shadow-[var(--neo-shadow)] ${
              toast.type === "success"
                ? "bg-emerald-400 text-[var(--primary)]"
                : toast.type === "error"
                  ? "bg-red-400 text-white"
                  : "bg-[var(--secondary)] text-[var(--primary)]"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Modal */}
      <AnimatePresence>
        {isCsvModalOpen && (
          <CsvImportModal
            onClose={() => setIsCsvModalOpen(false)}
            onImport={handleCsvImport}
          />
        )}
      </AnimatePresence>

      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
        {/* Header */}
        <header className="p-5 sm:p-6 border-b-2 border-[var(--black)] flex flex-col gap-4 bg-[var(--primary)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-[var(--secondary)] font-black text-2xl uppercase tracking-tighter italic">
              Últimas Transações
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  strokeWidth={3}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--black-muted)]"
                />
                <input
                  value={filterSearch}
                  onChange={(e) => {
                    setFilterSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Pesquisar..."
                  className="bg-white text-[var(--primary)] pl-8 pr-3 py-2 rounded-md border-2 border-[var(--black)] text-xs font-bold w-40 outline-none focus:ring-2 focus:ring-[var(--secondary)] shadow-[var(--neo-shadow-hover)]"
                />
              </div>

              {/* Refresh */}
              <button
                onClick={fetchTransactions}
                className={`bg-white text-[var(--primary)] p-2 rounded-md border-2 border-[var(--black)] hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)] ${loading ? "animate-spin" : ""}`}
              >
                <RefreshCw size={18} strokeWidth={2.5} />
              </button>

              {/* Filters */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-white text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] text-xs font-black uppercase flex items-center gap-2 hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)]"
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
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
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
                              onChange={(e) => {
                                setFilterDateFrom(e.target.value);
                                setCurrentPage(1);
                              }}
                              className={`${inputClass} p-2 text-[10px] font-bold w-full`}
                            />
                            <input
                              type="date"
                              value={filterDateTo}
                              onChange={(e) => {
                                setFilterDateTo(e.target.value);
                                setCurrentPage(1);
                              }}
                              className={`${inputClass} p-2 text-[10px] font-bold w-full`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                            Fluxo
                          </label>
                          <div className="flex gap-2">
                            {(
                              [
                                { value: "", label: "Todos" },
                                { value: "income", label: "Ganhos" },
                                { value: "expense", label: "Despesas" },
                              ] as {
                                value: "" | "income" | "expense";
                                label: string;
                              }[]
                            ).map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  setFilterType(opt.value);
                                  setCurrentPage(1);
                                }}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase border-2 border-[var(--black)] transition-colors shadow-[var(--neo-shadow-hover)] ${
                                  filterType === opt.value
                                    ? opt.value === "income"
                                      ? "bg-emerald-400 text-[var(--primary)]"
                                      : opt.value === "expense"
                                        ? "bg-red-400 text-white"
                                        : "bg-[var(--secondary)] text-[var(--primary)]"
                                    : "bg-white hover:bg-black/5"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest flex items-center gap-2">
                            <ArrowUpDown size={12} strokeWidth={3} /> Ordenar
                            por
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => {
                              setSortBy(e.target.value as SortOption);
                              setCurrentPage(1);
                            }}
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
                          onClick={() => {
                            clearFilters();
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-2 text-[10px] font-black text-[var(--black-muted)] uppercase hover:text-[var(--primary)] transition-colors border-t-2 border-dashed border-[var(--black)] pt-3"
                        >
                          Limpar Filtros
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* New */}
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingId("new");
                  setEditForm({
                    description: "",
                    amount: "",
                    type: "expense",
                    occurred_at: new Date().toISOString().split("T")[0],
                  });
                }}
                className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] transition-all shadow-[var(--neo-shadow-hover)]"
              >
                <Plus size={16} strokeWidth={3} /> Novo
              </button>

              {/* CSV */}
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="bg-white text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)]"
              >
                <Upload size={14} strokeWidth={2.5} /> CSV
              </button>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filterDateFrom && (
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                  De: {filterDateFrom}
                  <button onClick={() => setFilterDateFrom("")}>
                    <X size={10} strokeWidth={3} />
                  </button>
                </span>
              )}
              {filterDateTo && (
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                  Até: {filterDateTo}
                  <button onClick={() => setFilterDateTo("")}>
                    <X size={10} strokeWidth={3} />
                  </button>
                </span>
              )}
              {filterType && (
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/50 flex items-center gap-1">
                  {filterType === "income" ? (
                    <TrendingUp size={10} strokeWidth={3} />
                  ) : (
                    <TrendingDown size={10} strokeWidth={3} />
                  )}
                  {filterType === "income" ? "Ganhos" : "Despesas"}
                  <button onClick={() => setFilterType("")}>
                    <X size={10} strokeWidth={3} />
                  </button>
                </span>
              )}
            </div>
          )}
        </header>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b-2 border-[var(--black)]">
                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-light)] tracking-widest w-24">
                  Ações
                </th>
                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-light)] tracking-widest whitespace-nowrap">
                  Data
                </th>
                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-light)] tracking-widest">
                  Descrição
                </th>
                <th className="p-4 sm:p-5 text-[10px] font-black uppercase text-[var(--black-light)] tracking-widest text-right">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* New row */}
              {isCreating && (
                <tr className="bg-emerald-50 border-b-2 border-[var(--black)]">
                  <td className="p-4 sm:p-5">
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                      >
                        <Check size={16} strokeWidth={3} className="text-[var(--primary)]" />
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setEditingId(null);
                        }}
                        className="bg-red-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-red-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                      >
                        <X size={16} strokeWidth={3} className="text-white" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5">
                    <input
                      type="date"
                      value={editForm.occurred_at}
                      onChange={(e) =>
                        setEditForm({ ...editForm, occurred_at: e.target.value })
                      }
                      className={`w-full ${inputClass} px-2 py-1.5 text-xs font-bold`}
                    />
                  </td>
                  <td className="p-4 sm:p-5">
                    <input
                      placeholder="Ex: Supermercado"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className={`w-full ${inputClass} px-3 py-1.5 text-xs font-black uppercase`}
                      autoFocus
                    />
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        className={`${inputClass} px-2 py-1.5 text-xs font-black`}
                      >
                        <option value="expense">Despesa</option>
                        <option value="income">Ganho</option>
                      </select>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        className={`w-24 sm:w-32 ${inputClass} px-3 py-1.5 text-right text-xs font-black`}
                      />
                    </div>
                  </td>
                </tr>
              )}

              {/* Skeletons */}
              {loading &&
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!loading && currentData.length === 0 && !isCreating && (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-white border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                        <FileX size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
                      </div>
                      <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                        {filterSearch || filterType || filterDateFrom || filterDateTo
                          ? "Nenhuma transação com esses filtros"
                          : "Nenhuma transação"}
                      </p>
                      {(filterSearch || filterType || filterDateFrom || filterDateTo) && (
                        <button
                          onClick={clearFilters}
                          className="text-xs font-black uppercase text-[var(--black-muted)] hover:text-[var(--primary)] transition-colors"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                currentData.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b-2 border-[var(--black)] transition-colors hover:bg-black/5 ${
                      editingId === t.id ? "bg-black/5" : ""
                    }`}
                  >
                    <td className="p-4 sm:p-5">
                      <div className="flex gap-2">
                        {editingId === t.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                            >
                              <Check size={16} strokeWidth={3} className="text-[var(--primary)]" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-red-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-red-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                            >
                              <X size={16} strokeWidth={3} className="text-white" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(t.id);
                                setEditForm(t);
                              }}
                              className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-[var(--primary)]"
                            >
                              <Pencil size={16} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Deseja deletar esta transação?"))
                                  handleDelete(t.id);
                              }}
                              className="p-1.5 rounded border-2 border-transparent hover:border-[var(--black)] hover:bg-white transition-all hover:shadow-[var(--neo-shadow-hover)] text-[var(--black-light)] hover:text-red-500"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 text-xs font-bold text-[var(--black-muted)] whitespace-nowrap">
                      {editingId === t.id ? (
                        <input
                          type="date"
                          value={editForm.occurred_at?.split("T")[0]}
                          onChange={(e) =>
                            setEditForm({ ...editForm, occurred_at: e.target.value })
                          }
                          className={`w-full ${inputClass} px-2 py-1`}
                        />
                      ) : (
                        new Date(t.occurred_at).toLocaleDateString("pt-BR")
                      )}
                    </td>

                    <td className="p-4 sm:p-5">
                      {editingId === t.id ? (
                        <input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className={`w-full ${inputClass} px-3 py-1 font-black uppercase`}
                        />
                      ) : (
                        <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                          {t.description}
                        </span>
                      )}
                    </td>

                    <td className="p-4 sm:p-5 text-right">
                      {editingId === t.id ? (
                        <div className="flex gap-2 justify-end items-center">
                          <select
                            value={editForm.type}
                            onChange={(e) =>
                              setEditForm({ ...editForm, type: e.target.value })
                            }
                            className={`${inputClass} px-2 py-1 text-xs font-black`}
                          >
                            <option value="expense">Despesa</option>
                            <option value="income">Ganho</option>
                          </select>
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({ ...editForm, amount: e.target.value })
                            }
                            className={`w-24 sm:w-32 ${inputClass} px-3 py-1 text-right font-black`}
                          />
                        </div>
                      ) : (
                        <span
                          className={`text-sm font-black px-2 py-1 rounded-md border-2 border-[var(--black)] ${
                            t.type === "income"
                              ? "bg-emerald-400 text-[var(--primary)]"
                              : "bg-red-400 text-white"
                          }`}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(t.amount))}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="p-4 sm:p-5 flex justify-between items-center bg-white border-t-2 border-[var(--black)]">
          <p className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
            {filteredData.length > 0
              ? `${filteredData.length} resultado${filteredData.length !== 1 ? "s" : ""} • Página ${currentPage} de ${totalPages}`
              : "Sem resultados"}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="bg-white text-[var(--primary)] p-1.5 rounded-md border-2 border-[var(--black)] hover:bg-black/5 disabled:opacity-50 transition-colors shadow-[var(--neo-shadow-hover)]"
            >
              <ChevronLeft strokeWidth={3} size={18} />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="bg-white text-[var(--primary)] p-1.5 rounded-md border-2 border-[var(--black)] hover:bg-black/5 disabled:opacity-50 transition-colors shadow-[var(--neo-shadow-hover)]"
            >
              <ChevronRight strokeWidth={3} size={18} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
