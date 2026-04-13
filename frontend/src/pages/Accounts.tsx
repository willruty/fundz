import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Eye,
  EyeOff,
  Wallet,
  CreditCard,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { AccountsSkeleton } from "../components/skeletons/AccountsSkeleton";
import AccountModal, { type AccountFormData } from "../components/AccountModal";
import { TransactionTableCard, type ExpenseTransaction } from "../components/ExpensesTableCard";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  type ApiAccount,
} from "../service/accounts.service";
import {
  getTransactions,
  type Transaction as ApiTransaction,
} from "../service/transaction.service";
import { getCategories, type Category } from "../service/categories.service";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Account {
  id: string;
  name: string;
  initials: string;
  type: string;
  balance: number;
  income: number;
  expenses: number;
  color: string;
  textColor: string;
  transactionCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCT_COLORS = ["#820AD1", "#003399", "#F9D100", "#111111", "#1A6BFF", "#22c55e", "#FF3B3B", "#f97316"];
const ACCT_TEXT = ["#ffffff", "#ffffff", "#1a1a1a", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Conta Corrente":     <Wallet size={13} strokeWidth={2.5} />,
  "Conta Poupança":     <ShieldCheck size={13} strokeWidth={2.5} />,
  "Conta Digital":      <CreditCard size={13} strokeWidth={2.5} />,
  "Conta Investimento": <TrendingUp size={13} strokeWidth={2.5} />,
};

function mapAccount(a: ApiAccount, idx: number, txs: ApiTransaction[]): Account {
  const acctTxs = txs.filter((t) => ((t as any).accountId ?? t.accountId) === a.id);
  const income = acctTxs
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
  const expenses = acctTxs
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
  const initialBalance = a.balance ? parseFloat(a.balance) : 0;
  return {
    id: a.id,
    name: a.name,
    initials: a.name.slice(0, 2).toUpperCase(),
    type: a.type,
    balance: initialBalance + income - expenses,
    income,
    expenses,
    color: ACCT_COLORS[idx % ACCT_COLORS.length],
    textColor: ACCT_TEXT[idx % ACCT_TEXT.length],
    transactionCount: acctTxs.length,
  };
}

function txDate(tx: ApiTransaction): string {
  return (tx as any).occurredAt || tx.occurred_at || "";
}

// ─── BankCard ────────────────────────────────────────────────────────────────

interface BankCardProps {
  account: Account;
  hidden: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function BankCard({ account, hidden, onEdit, onDelete }: BankCardProps) {
  const isLight = account.color === "#F9D100";

  return (
    <div
      className="group relative flex flex-col justify-between p-6 rounded-[var(--radius-card)] border-2 border-[var(--black)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 overflow-hidden min-h-[200px] cursor-default"
      style={{ background: account.color, color: account.textColor }}
    >
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 opacity-10"
        style={{ borderColor: account.textColor }}
      />
      <div
        className="absolute -bottom-10 -right-4 w-24 h-24 rounded-full border-2 opacity-10"
        style={{ borderColor: account.textColor }}
      />

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 rounded-md border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-[var(--secondary)] shadow-[var(--neo-shadow-hover)] cursor-pointer"
          title="Editar"
        >
          <Pencil size={12} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-md border-2 border-[var(--black)] bg-red-500 text-white hover:bg-red-600 shadow-[var(--neo-shadow-hover)] cursor-pointer"
          title="Excluir"
        >
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md border-2 flex items-center justify-center font-black text-sm"
            style={{
              borderColor: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
              background: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)",
            }}
          >
            {account.initials}
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">{account.name}</p>
            <div
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider mt-0.5"
              style={{ opacity: 0.7 }}
            >
              {TYPE_ICONS[account.type] ?? <Wallet size={13} strokeWidth={2.5} />}
              {account.type}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <p
          className="text-[9px] font-black uppercase tracking-widest mb-1"
          style={{ opacity: 0.65 }}
        >
          Saldo atual
        </p>
        <p className="text-3xl font-black tracking-tighter">
          {hidden ? "R$ ••••••" : fmt(account.balance)}
        </p>
        <p
          className="text-[9px] font-bold mt-1"
          style={{ opacity: 0.55 }}
        >
          {account.transactionCount} transaç{account.transactionCount === 1 ? "ão" : "ões"}
        </p>
      </div>

      <div className="flex justify-between items-end relative z-10 mt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" style={{ opacity: 0.85 }}>
            <ArrowUpRight size={12} strokeWidth={3} />
            <span className="text-[10px] font-black">{hidden ? "••••" : fmt(account.income)}</span>
          </div>
          <div className="flex items-center gap-1" style={{ opacity: 0.85 }}>
            <ArrowDownRight size={12} strokeWidth={3} />
            <span className="text-[10px] font-black">{hidden ? "••••" : fmt(account.expenses)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function Accounts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [rawAccounts, setRawAccounts] = useState<ApiAccount[]>([]);
  const [rawTransactions, setRawTransactions] = useState<ApiTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountFormData | null>(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [showInvestNudge, setShowInvestNudge] = useState(false);

  const fetchData = useCallback(() => {
    return Promise.all([getAccounts(), getTransactions(), getCategories()])
      .then(([rawAccs, rawTxs, cats]) => {
        setRawAccounts(rawAccs);
        setRawTransactions(rawTxs);
        setCategories(cats);
        setAccounts(rawAccs.map((a, i) => mapAccount(a, i, rawTxs)));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar dados");
      });
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  if (loading) return <AccountsSkeleton />;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleNew = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (acc: Account) => {
    const raw = rawAccounts.find((r) => r.id === acc.id);
    setEditingAccount({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: raw?.balance ? parseFloat(raw.balance) : 0,
      currentIncome: acc.income,
      currentExpenses: acc.expenses,
    });
    setModalOpen(true);
  };

  const handleSave = async (data: AccountFormData) => {
    setSavingAccount(true);
    try {
      if (data.id) {
        await updateAccount({ id: data.id, name: data.name, type: data.type, balance: data.balance });
        toast.success("Conta atualizada!");
        setModalOpen(false);
        setEditingAccount(null);
      } else {
        await createAccount({ name: data.name, type: data.type, balance: data.balance });
        toast.success("Conta criada!");
        setModalOpen(false);
        setEditingAccount(null);
        setShowInvestNudge(true);
      }
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar conta");
    } finally {
      setSavingAccount(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAccount(deleteTarget.id);
      toast.success("Conta removida!");
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao deletar conta");
    }
  };

  // ─── Derived data for the transactions table ─────────────────────────────

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const tableData: ExpenseTransaction[] = rawTransactions.map((tx) => {
    const catId = (tx as any).categoryId ?? tx.categoryId;
    const accId = (tx as any).accountId ?? tx.accountId;
    const iso = txDate(tx).slice(0, 10);
    return {
      id: tx.id,
      title: tx.description || "Sem descrição",
      category: catId ? (catMap.get(catId) ?? "Outros") : "Sem categoria",
      categoryId: catId,
      accountId: accId,
      date: new Date(txDate(tx)).toLocaleDateString("pt-BR"),
      isoDate: iso,
      amount: Math.abs(parseFloat(tx.amount)),
      type: tx.type as "income" | "expense",
    };
  });

  return (
    <main className="flex flex-col gap-6 bg-[var(--main-bg)] min-h-screen">

      {/* Account modal */}
      <AccountModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingAccount(null); }}
        onSave={handleSave}
        initial={editingAccount}
        saving={savingAccount}
      />

      {/* Investment nudge modal */}
      {showInvestNudge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowInvestNudge(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} strokeWidth={2.5} className="text-[var(--secondary)]" />
                <span className="text-sm font-black text-[var(--secondary)] uppercase tracking-tight">
                  Você investe?
                </span>
              </div>
              <button
                onClick={() => setShowInvestNudge(false)}
                className="p-1 rounded-md border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm font-bold text-[var(--black-muted)] leading-relaxed">
                Conta criada com sucesso! Você possui investimentos? Acompanhe rendimentos, taxas e projeções na área de investimentos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvestNudge(false)}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 transition-all cursor-pointer"
                >
                  Dispensar
                </button>
                <button
                  onClick={() => { setShowInvestNudge(false); navigate("/investments"); }}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-[var(--primary)] text-[var(--secondary)] shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Ver investimentos
                  <TrendingUp size={13} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Excluir conta</h3>
            <p className="text-sm font-bold text-[var(--black-muted)]">
              Remover <span className="text-[var(--primary)]">{deleteTarget.name}</span>?
              {deleteTarget.transactionCount > 0 && (
                <span className="block mt-2 text-[11px] text-red-600">
                  Esta conta possui {deleteTarget.transactionCount} transaç{deleteTarget.transactionCount === 1 ? "ão" : "ões"} vinculada{deleteTarget.transactionCount === 1 ? "" : "s"}.
                </span>
              )}
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

      {/* ── SECTION 1: Bank Cards ────────────────────────────────────────────── */}
      <div className="flex flex-col bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
        <div className="bg-[var(--primary)] border-b-2 border-[var(--black)] px-6 py-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-[10px] font-extrabold tracking-widest text-[var(--secondary)] uppercase mb-1">
              Contas
            </h3>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Minhas Contas
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHidden((h) => !h)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 border-2 border-white/20 rounded-md text-[10px] font-black text-white uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
            >
              {hidden ? <EyeOff size={13} strokeWidth={2.5} /> : <Eye size={13} strokeWidth={2.5} />}
              {hidden ? "Mostrar" : "Ocultar"}
            </button>
            <button
              onClick={handleNew}
              className="bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 hover:bg-[var(--secondary-hover)] shadow-[var(--neo-shadow-hover)] transition-all cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} /> Nova Conta
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {accounts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
              <div className="p-4 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-full shadow-[var(--neo-shadow)]">
                <Wallet size={32} strokeWidth={2} className="text-[var(--black-muted)]" />
              </div>
              <p className="text-sm font-black text-[var(--primary)] uppercase tracking-wider">
                Nenhuma conta cadastrada
              </p>
              <button
                onClick={handleNew}
                className="bg-[var(--primary)] text-[var(--secondary)] px-5 py-2.5 rounded-md border-2 border-[var(--black)] font-black text-xs uppercase flex items-center gap-2 shadow-[var(--neo-shadow-hover)] hover:translate-y-[1px] hover:translate-x-[1px] transition-all cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} /> Criar primeira conta
              </button>
            </div>
          ) : (
            accounts.map((account) => (
              <BankCard
                key={account.id}
                account={account}
                hidden={hidden}
                onEdit={() => handleEdit(account)}
                onDelete={() => setDeleteTarget(account)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── SECTION 2: Transactions Table ────────────────────────────────────── */}
      <TransactionTableCard
        transactions={tableData}
        categories={categories}
        accounts={rawAccounts}
        onMutate={fetchData}
        mode="all"
        title="Todas as Transações"
        subtitle="Movimentações"
      />
    </main>
  );
}
