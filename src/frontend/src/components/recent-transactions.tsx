import { useState, useEffect } from "react";
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
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: string;
  occurred_at: string;
}

interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const token = localStorage.getItem("token");

  const showToast = (message: string, type: Toast["type"] = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/fundz/transaction/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactions(data.results || []);
    } catch (err) {
      showToast("Erro ao carregar transações", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSave = async () => {
    const isNew = editingId === "new";

    const formattedData = {
      ...editForm,
      occurred_at: editForm.occurred_at
        ? `${editForm.occurred_at}T00:00:00Z`
        : new Date().toISOString(),
      amount: String(editForm.amount),
    };

    try {
      const response = await fetch("http://localhost:8000/fundz/transaction/", {
        method: isNew ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isNew ? formattedData : { ...formattedData, id: editingId },
        ),
      });

      if (response.ok) {
        showToast(isNew ? "Criado com sucesso!" : "Atualizado!", "success");
        setEditingId(null);
        setIsCreating(false);
        fetchTransactions();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || "Erro no servidor", "error");
      }
    } catch (err) {
      showToast("Erro de conexão", "error");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch("http://localhost:8000/fundz/transaction/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editForm, id }),
      });
      if (response.ok) {
        showToast("Alterações salvas!", "success");
        setEditingId(null);
        fetchTransactions();
      }
    } catch (err) {
      showToast("Erro ao atualizar", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/fundz/transaction/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        showToast("Transação removida", "success");
        fetchTransactions();
      }
    } catch (err) {
      showToast("Erro ao deletar", "error");
    }
  };

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentData = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const TransactionTable = ({ data }: { data: Transaction[] }) => (
    <table className="w-full text-left border-collapse">
      <thead>
        {/* Cabeçalho da tabela neutro para dar destaque aos dados */}
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
        {isCreating && (
          <tr className="bg-emerald-50 border-b-2 border-[var(--black)]">
            <td className="p-4 sm:p-5">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                >
                  <Check
                    size={16}
                    strokeWidth={3}
                    className="text-[var(--primary)]"
                  />
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
                className="w-full bg-white border-2 border-[var(--black)] rounded-md px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
              />
            </td>
            <td className="p-4 sm:p-5">
              <input
                placeholder="Ex: Supermercado"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full bg-white border-2 border-[var(--black)] rounded-md px-3 py-1.5 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
                autoFocus
              />
            </td>
            <td className="p-4 sm:p-5 text-right">
              <input
                type="number"
                placeholder="0.00"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="w-24 sm:w-32 bg-white border-2 border-[var(--black)] rounded-md px-3 py-1.5 text-right text-xs font-black outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
              />
            </td>
          </tr>
        )}

        {data.length === 0 && !isCreating ? (
          <tr>
            <td colSpan={4} className="p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                  <FileX
                    size={32}
                    strokeWidth={2}
                    className="text-[var(--black-muted)]"
                  />
                </div>
                <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                  Nenhuma transação
                </p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((t) => (
            <tr
              key={t.id}
              // Aqui aplicamos a leve escurecida no hover: bg-black/5
              className={`border-b-2 border-[var(--black)] transition-colors hover:bg-black/5 ${
                editingId === t.id ? "bg-black/5" : ""
              }`}
            >
              <td className="p-4 sm:p-5">
                <div className="flex gap-2">
                  {editingId === t.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(t.id)}
                        className="bg-emerald-400 p-1.5 rounded border-2 border-[var(--black)] hover:bg-emerald-500 transition-colors shadow-[var(--neo-shadow-hover)]"
                      >
                        <Check
                          size={16}
                          strokeWidth={3}
                          className="text-[var(--primary)]"
                        />
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
                    className="w-full bg-white border-2 border-[var(--black)] rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
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
                    className="w-full bg-white border-2 border-[var(--black)] rounded-md px-3 py-1 outline-none font-black uppercase focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
                  />
                ) : (
                  <span className="text-sm font-black text-[var(--primary)] uppercase tracking-tight">
                    {t.description}
                  </span>
                )}
              </td>
              <td className="p-4 sm:p-5 text-right">
                {editingId === t.id ? (
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="w-24 sm:w-32 bg-white border-2 border-[var(--black)] rounded-md px-3 py-1 text-right outline-none font-black focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
                  />
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
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="w-full relative">
      {/* TOAST SYSTEM */}
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

      <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px]">
        {/* CABEÇALHO AZUL (Restaurando a paleta original) */}
        <header className="p-5 sm:p-6 border-b-2 border-[var(--black)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--primary)]">
          <h2 className="text-[var(--secondary)] font-black text-2xl uppercase tracking-tighter italic flex items-center gap-3">
            Últimas Transações
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchTransactions}
              className={`bg-white text-[var(--primary)] p-2 rounded-md border-2 border-[var(--black)] hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)] ${
                loading ? "animate-spin" : ""
              }`}
            >
              <RefreshCw size={18} strokeWidth={2.5} />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-white text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] text-xs font-black uppercase flex items-center gap-2 hover:bg-[var(--secondary)] transition-colors shadow-[var(--neo-shadow-hover)]"
              >
                <Filter size={14} strokeWidth={2.5} /> Filtros
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
                      {/* Filtros Internos */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest flex items-center gap-2">
                          <Calendar size={12} strokeWidth={3} /> Período
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            className="bg-white border-2 border-[var(--black)] rounded-md p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
                          />
                          <input
                            type="date"
                            className="bg-white border-2 border-[var(--black)] rounded-md p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest">
                          Fluxo
                        </label>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 rounded-md text-[10px] font-black uppercase border-2 border-[var(--black)] bg-white hover:bg-emerald-400 hover:text-[var(--primary)] transition-colors shadow-[var(--neo-shadow-hover)]">
                            Ganhos
                          </button>
                          <button className="flex-1 py-1.5 rounded-md text-[10px] font-black uppercase border-2 border-[var(--black)] bg-white hover:bg-red-400 hover:text-white transition-colors shadow-[var(--neo-shadow-hover)]">
                            Despesas
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--black-muted)] tracking-widest flex items-center gap-2">
                          <ArrowUpDown size={12} strokeWidth={3} /> Ordenar por
                        </label>
                        <select className="w-full bg-white border-2 border-[var(--black)] rounded-md p-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[var(--neo-shadow-hover)]">
                          <option>Data (Recente)</option>
                          <option>Data (Antigo)</option>
                          <option>Valor (Maior)</option>
                          <option>Valor (Menor)</option>
                          <option>Descrição (A-Z)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 pt-2 border-t-2 border-[var(--black)] border-dashed">
                        <button
                          onClick={() => {
                            fetchTransactions();
                            setIsMenuOpen(false);
                            showToast("Filtros aplicados", "success");
                          }}
                          className="w-full bg-[var(--primary)] text-[var(--secondary)] py-2.5 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase tracking-wider hover:bg-[var(--primary-hover)] transition-colors shadow-[var(--neo-shadow-hover)] mt-2"
                        >
                          Aplicar Filtros
                        </button>
                        <button
                          onClick={() => {
                            showToast("Filtros limpos", "info");
                          }}
                          className="w-full py-2 text-[10px] font-black text-[var(--black-muted)] uppercase hover:text-[var(--primary)] transition-colors"
                        >
                          Limpar Filtros
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] transition-all shadow-[var(--neo-shadow-hover)]"
            >
              <Plus size={16} strokeWidth={3} /> Novo
            </button>
          </div>
        </header>

        {/* ÁREA DA TABELA */}
        <div className="overflow-x-auto min-h-[300px]">
          <TransactionTable data={currentData} />
        </div>

        {/* RODAPÉ */}
        <footer className="p-4 sm:p-5 flex justify-between items-center bg-white border-t-2 border-[var(--black)]">
          <p className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-wider">
            Página {currentPage} de {totalPages || 1}
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
