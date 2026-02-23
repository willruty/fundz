import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Check,
  Pencil,
  Trash2,
  FileX,
  Download,
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
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
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

  // Handlers CRUD
  const handleSave = async () => {
    const isNew = editingId === "new";

    // Prepara os dados para o Go
    const formattedData = {
      ...editForm,
      // Converte "2026-02-27" para "2026-02-27T00:00:00Z"
      occurred_at: editForm.occurred_at
        ? `${editForm.occurred_at}T00:00:00Z`
        : new Date().toISOString(),
      amount: String(editForm.amount), // Garante que o amount vá como string se o Go pedir assim
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
        showToast(isNew ? "Criado!" : "Atualizado!", "success");
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

  // Reutilização da Tabela para o Modal Fullscreen
  const TransactionTable = ({ data }: { data: Transaction[] }) => (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-off-white border-b border-black/5">
          <th className="p-6 text-[10px] font-black uppercase text-black-light tracking-widest w-24">
            Ações
          </th>
          <th className="p-6 text-[10px] font-black uppercase text-black-light tracking-widest">
            Data
          </th>
          <th className="p-6 text-[10px] font-black uppercase text-black-light tracking-widest">
            Descrição
          </th>
          <th className="p-6 text-[10px] font-black uppercase text-black-light tracking-widest text-right">
            Valor
          </th>
        </tr>
      </thead>
      <tbody>
        {isCreating && (
          <tr className="bg-emerald-50/50 border-b border-emerald-100 italic">
            <td className="p-6">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="text-emerald-600 hover:scale-110"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="text-red-500 hover:scale-110"
                >
                  <X size={18} />
                </button>
              </div>
            </td>
            <td className="p-6">
              <input
                type="date"
                value={editForm.occurred_at}
                onChange={(e) =>
                  setEditForm({ ...editForm, occurred_at: e.target.value })
                }
                className="bg-white border border-black/10 rounded-lg px-2 py-1 text-[10px] font-black outline-none"
              />
            </td>
            <td className="p-6">
              <input
                placeholder="Descrição da nova transação..."
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full bg-white border border-black/10 rounded-lg px-3 py-1 text-sm font-black uppercase outline-none"
                autoFocus
              />
            </td>
            <td className="p-6 text-right">
              <input
                type="number"
                placeholder="0.00"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="w-24 bg-white border border-black/10 rounded-lg px-3 py-1 text-right text-sm font-black outline-none"
              />
            </td>
          </tr>
        )}
        {data.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <FileX size={40} className="text-black/10" />
                <p className="text-sm font-black text-primary uppercase">
                  Nenhuma transação encontrada
                </p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((t) => (
            <tr
              key={t.id}
              className={`border-b border-black/5 transition-colors ${editingId === t.id ? "bg-secondary/10" : "hover:bg-off-white"}`}
            >
              <td className="p-6">
                <div className="flex gap-3">
                  {editingId === t.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(t.id)}
                        className="text-emerald-600"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(t.id);
                          setEditForm(t);
                        }}
                        className="text-black/20 hover:text-primary transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Deseja deletar?"))
                            handleDelete(t.id);
                        }}
                        className="text-black/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
              <td className="p-6 text-xs font-bold text-black/40">
                {editingId === t.id ? (
                  <input
                    type="date"
                    value={editForm.occurred_at?.split("T")[0]}
                    onChange={(e) =>
                      setEditForm({ ...editForm, occurred_at: e.target.value })
                    }
                    className="bg-white border border-black/10 rounded px-2 py-1 outline-none"
                  />
                ) : (
                  new Date(t.occurred_at).toLocaleDateString("pt-BR")
                )}
              </td>
              <td className="p-6">
                {editingId === t.id ? (
                  <input
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full bg-white border border-black/10 rounded px-3 py-1 outline-none font-black uppercase"
                  />
                ) : (
                  <span className="text-sm font-black text-primary uppercase">
                    {t.description}
                  </span>
                )}
              </td>
              <td
                className={`p-6 text-sm font-black text-right ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}
              >
                {editingId === t.id ? (
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: e.target.value })
                    }
                    className="w-24 bg-white border border-black/10 rounded px-3 py-1 text-right outline-none"
                  />
                ) : (
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(t.amount))
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
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full border-2 border-blackzão font-black text-[10px] uppercase shadow-neo ${toast.type === "success" ? "bg-emerald-500 text-white" : toast.type === "error" ? "bg-red-500 text-white" : "bg-secondary text-primary"}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-black/5 rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        <header className="bg-primary p-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-secondary font-black text-2xl uppercase tracking-tighter italic flex items-center gap-3">
            Últimas Transações
          </h2>

          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-full border border-white/10">
            <button
              onClick={fetchTransactions}
              className={`text-white/60 hover:text-secondary p-2.5 ${loading ? "animate-spin" : ""}`}
            >
              <RefreshCw size={18} />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-off-white text-primary px-5 py-2.5 rounded-full text-[11px] font-black uppercase flex items-center gap-2"
              >
                <Filter size={14} /> Filtros
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
                      className="absolute right-0 mt-4 w-80 bg-white border border-black/5 rounded-[24px] shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        {/* Período de Datas */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-black/30 tracking-widest flex items-center gap-2">
                            <Calendar size={12} /> Período
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              className="bg-off-white border-none rounded-xl p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-secondary/50"
                            />
                            <input
                              type="date"
                              className="bg-off-white border-none rounded-xl p-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-secondary/50"
                            />
                          </div>
                        </div>

                        {/* Tipo de Transação */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-black/30 tracking-widest">
                            Categoria de Fluxo
                          </label>
                          <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase border border-black/5 hover:bg-off-white transition-colors">
                              Ganhos
                            </button>
                            <button className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase border border-black/5 hover:bg-off-white transition-colors">
                              Despesas
                            </button>
                          </div>
                        </div>

                        {/* Ordenação por Campos */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-black/30 tracking-widest flex items-center gap-2">
                            <ArrowUpDown size={12} /> Ordenar por
                          </label>
                          <select className="w-full bg-off-white border-none rounded-xl p-2 text-[10px] font-black uppercase outline-none">
                            <option>Data (Recente)</option>
                            <option>Data (Antigo)</option>
                            <option>Valor (Maior)</option>
                            <option>Valor (Menor)</option>
                            <option>Descrição (A-Z)</option>
                          </select>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={() => {
                              fetchTransactions();
                              setIsMenuOpen(false);
                              showToast("Filtros aplicados", "success");
                            }}
                            className="w-full bg-primary text-secondary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-hover transition-colors shadow-lg"
                          >
                            Aplicar Filtros
                          </button>
                          <button
                            onClick={() => {
                              // Lógica para resetar estados de filtro aqui
                              showToast("Filtros limpos", "info");
                            }}
                            className="w-full py-2 text-[9px] font-black text-black/30 uppercase hover:text-black transition-colors"
                          >
                            Limpar Filtros
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setIsCreating(true); // Ativa a linha vazia no topo
                setEditingId("new"); // Define o ID como "novo" para o formulário
                setEditForm({
                  description: "",
                  amount: "",
                  type: "expense",
                  occurred_at: new Date().toISOString().split("T")[0],
                });
                // Opcional: rolar para o topo para ver a nova linha
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
            </button>

            <button
              onClick={() => setIsFullViewOpen(true)}
              className="bg-secondary text-primary p-2.5 rounded-full shadow-neo"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </header>

        <div className="overflow-x-auto min-h-[400px]">
          <TransactionTable data={currentData} />
        </div>

        <footer className="p-6 flex justify-between items-center bg-off-white/30">
          <p className="text-[10px] font-black text-black/30 uppercase">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="text-primary disabled:opacity-20"
            >
              <ChevronLeft />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="text-primary disabled:opacity-20"
            >
              <ChevronRight />
            </button>
          </div>
        </footer>
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {isFullViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-primary/95 backdrop-blur-md p-6 md:p-12 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
              <header className="p-10 border-b border-black/5 flex justify-between items-center bg-primary">
                <h2 className="text-secondary font-black text-4xl uppercase tracking-tighter italic">
                  Relatório Geral
                </h2>
                <div className="flex gap-4">
                  <button className="bg-white/10 text-white p-4 rounded-full hover:bg-secondary hover:text-primary transition-all">
                    <Download size={24} />
                  </button>
                  <button
                    onClick={() => setIsFullViewOpen(false)}
                    className="bg-off-white p-4 rounded-full hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </header>
              <div className="p-6">
                <TransactionTable data={transactions} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
