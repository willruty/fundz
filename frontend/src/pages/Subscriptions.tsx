import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import CommitmentCard from "../components/CommitmentCard";
import ActiveSubscriptionsCard from "../components/ActiveSubscriptionCard";
import NextBillingCard from "../components/NextBillingCard";
import AnnualSubscriptionChart, { type MonthlyCommitment } from "../components/AnualSubscriptionChart";
import SubscriptionTable, { type SubscriptionItem } from "../components/SubscriptionsTable";
import RecurrenceModal, {
  type RecurrenceFormData,
  type SubscriptionFormData,
  type InstallmentFormData,
} from "../components/RecurrenceModal";
import { SubscriptionsSkeleton } from "../components/skeletons/SubscriptionsSkeleton";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  type Subscription,
} from "../service/subscriptions.service";
import {
  getInstallments,
  createInstallment,
  updateInstallment,
  deleteInstallment,
  type Installment,
} from "../service/installments.service";

// ── HELPERS ────────────────────────────────────────────────────────────────────

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function toMonthlyAmount(sub: Subscription): number {
  const amount = parseFloat(sub.amount) || 0;
  if (sub.billingCycle === "yearly") return amount / 12;
  return amount;
}

function installmentBillingDate(inst: Installment, index: number): Date {
  const start = new Date(inst.startDate);
  return new Date(start.getFullYear(), start.getMonth() + index, inst.billingDay);
}

function installmentAmountForMonth(inst: Installment, year: number, month: number): number {
  const amount = parseFloat(inst.installmentAmount) || 0;
  for (let i = 0; i < inst.totalInstallments; i++) {
    const d = installmentBillingDate(inst, i);
    if (d.getFullYear() === year && d.getMonth() === month) return amount;
  }
  return 0;
}

function buildAnnualData(subs: Subscription[], installments: Installment[]): MonthlyCommitment[] {
  const now = new Date();
  const activeSubs = subs.filter((s) => s.active);
  const activeInst = installments.filter((i) => i.active);

  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    let subscriptionsTotal = 0;
    let installmentsTotal = 0;

    for (const sub of activeSubs) {
      const amount = parseFloat(sub.amount) || 0;
      if (sub.billingCycle === "monthly") {
        subscriptionsTotal += amount;
      } else if (sub.billingCycle === "yearly" && sub.nextBillingDate) {
        const billing = new Date(sub.nextBillingDate);
        if (billing.getMonth() === month && billing.getFullYear() === year) {
          subscriptionsTotal += amount;
        }
      }
    }

    for (const inst of activeInst) {
      installmentsTotal += installmentAmountForMonth(inst, year, month);
    }

    return {
      month: MONTHS_PT[month],
      subscriptions: Math.round(subscriptionsTotal),
      installments: Math.round(installmentsTotal),
    };
  });
}

function fmtNextBilling(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function mapSubToTableItem(sub: Subscription): SubscriptionItem {
  const cycle = sub.billingCycle === "monthly" ? "Mensal" : sub.billingCycle === "yearly" ? "Anual" : sub.billingCycle;
  return {
    id: sub.id,
    name: sub.name,
    type: "subscription",
    value: parseFloat(sub.amount) || 0,
    recurrence: cycle,
    nextBilling: fmtNextBilling(sub.nextBillingDate),
    totalPaid: 0,
    status: sub.active ? "active" : "finished",
  };
}

function mapInstToTableItem(inst: Installment): SubscriptionItem {
  const remaining = inst.totalInstallments - inst.paidInstallments;
  const isFinished = remaining <= 0;

  let nextBilling = "—";
  if (!isFinished) {
    const nextDate = installmentBillingDate(inst, inst.paidInstallments);
    nextBilling = nextDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  const totalPaid = inst.paidInstallments * (parseFloat(inst.installmentAmount) || 0);

  return {
    id: inst.id,
    name: inst.name,
    type: "installment",
    value: parseFloat(inst.installmentAmount) || 0,
    recurrence: "Mensal",
    installmentCurrent: inst.paidInstallments,
    installmentTotal: inst.totalInstallments,
    nextBilling,
    totalPaid: Math.round(totalPaid),
    status: isFinished ? "finished" : "active",
  };
}

// ── Build modal initial data from raw DB items ────────────────────────────────

function subToFormData(sub: Subscription): SubscriptionFormData {
  return {
    type: "subscription",
    id: sub.id,
    name: sub.name,
    amount: String(parseFloat(sub.amount) || 0),
    billingCycle: sub.billingCycle,
    nextBillingDate: sub.nextBillingDate ? sub.nextBillingDate.slice(0, 10) : "",
    active: !!sub.active,
  };
}

function instToFormData(inst: Installment): InstallmentFormData {
  return {
    type: "installment",
    id: inst.id,
    name: inst.name,
    totalAmount: String(parseFloat(inst.totalAmount) || 0),
    totalInstallments: String(inst.totalInstallments),
    paidInstallments: String(inst.paidInstallments),
    startDate: inst.startDate ? inst.startDate.slice(0, 10) : "",
    billingDay: String(inst.billingDay),
    active: !!inst.active,
  };
}

// ── PAGE ───────────────────────────────────────────────────────────────────────

export function Subscriptions() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<RecurrenceFormData | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionItem | null>(null);

  const fetchData = useCallback(() => {
    return Promise.all([getSubscriptions(), getInstallments()])
      .then(([subs, insts]) => {
        setSubscriptions(subs);
        setInstallments(insts);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  const handleNew = () => {
    setModalInitial(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SubscriptionItem) => {
    if (item.type === "subscription") {
      const sub = subscriptions.find((s) => s.id === item.id);
      if (sub) {
        setModalInitial(subToFormData(sub));
        setModalOpen(true);
      }
    } else {
      const inst = installments.find((i) => i.id === item.id);
      if (inst) {
        setModalInitial(instToFormData(inst));
        setModalOpen(true);
      }
    }
  };

  const handleSave = async (data: RecurrenceFormData) => {
    setSaving(true);
    try {
      if (data.type === "subscription") {
        const payload = {
          name: data.name,
          amount: parseFloat(data.amount) || 0,
          billing_cycle: data.billingCycle,
          next_billing_date: data.nextBillingDate || undefined,
          active: data.active,
        };
        if (data.id) {
          await updateSubscription({ id: data.id, ...payload });
          toast.success("Assinatura atualizada!");
        } else {
          await createSubscription(payload);
          toast.success("Assinatura criada!");
        }
      } else {
        const totalAmt = parseFloat(data.totalAmount) || 0;
        const totalInst = parseInt(data.totalInstallments) || 1;
        const payload = {
          name: data.name,
          total_amount: totalAmt,
          installment_amount: parseFloat((totalAmt / totalInst).toFixed(2)),
          total_installments: totalInst,
          paid_installments: parseInt(data.paidInstallments) || 0,
          start_date: data.startDate,
          billing_day: parseInt(data.billingDay) || 1,
          active: data.active,
        };
        if (data.id) {
          await updateInstallment({ id: data.id, ...payload });
          toast.success("Parcelamento atualizado!");
        } else {
          await createInstallment(payload);
          toast.success("Parcelamento criado!");
        }
      }
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (item: SubscriptionItem) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "subscription") {
        await deleteSubscription(deleteTarget.id);
        toast.success("Assinatura removida!");
      } else {
        await deleteInstallment(deleteTarget.id);
        toast.success("Parcelamento removido!");
      }
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao deletar";
      toast.error(msg);
    }
  };

  if (loading) return <SubscriptionsSkeleton />;

  // ── COMPUTED VALUES ─────────────────────────────────────────────────────────

  const activeSubs = subscriptions.filter((s) => s.active);
  const activeInst = installments.filter((i) => i.active && i.paidInstallments < i.totalInstallments);

  const totalActive = activeSubs.length + activeInst.length;

  const subsMonthly = activeSubs.reduce((sum, s) => sum + toMonthlyAmount(s), 0);
  const instMonthly = activeInst.reduce((sum, i) => sum + (parseFloat(i.installmentAmount) || 0), 0);
  const averageMonthly = Math.round(subsMonthly + instMonthly);

  const subscriptionsPct = averageMonthly > 0 ? Math.round((subsMonthly / averageMonthly) * 100) : 0;
  const parcelmentsPct = averageMonthly > 0 ? 100 - subscriptionsPct : 0;

  const now = new Date();
  type NextItem = { name: string; amount: number; date: Date; cycle: string };
  const upcomingItems: NextItem[] = [];

  for (const sub of activeSubs) {
    if (sub.nextBillingDate) {
      upcomingItems.push({
        name: sub.name,
        amount: parseFloat(sub.amount) || 0,
        date: new Date(sub.nextBillingDate),
        cycle: sub.billingCycle,
      });
    }
  }

  for (const inst of activeInst) {
    const nextDate = installmentBillingDate(inst, inst.paidInstallments);
    upcomingItems.push({
      name: inst.name,
      amount: parseFloat(inst.installmentAmount) || 0,
      date: nextDate,
      cycle: "installment",
    });
  }

  const nextItem = upcomingItems
    .filter((item) => item.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const annualData = buildAnnualData(subscriptions, installments);

  const tableItems: SubscriptionItem[] = [
    ...subscriptions.map(mapSubToTableItem),
    ...installments.map(mapInstToTableItem),
  ];

  return (
    <main className="min-h-screen mx-auto space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        <div className="lg:col-span-2">
          <CommitmentCard
            averageMonthlyCommitment={averageMonthly}
            subscriptionsPct={subscriptionsPct}
            parcelmentsPct={parcelmentsPct}
            subscriptionsAmount={Math.round(subsMonthly)}
            parcelmentsAmount={Math.round(instMonthly)}
          />
        </div>

        <div className="lg:col-span-1">
          <ActiveSubscriptionsCard
            total={totalActive}
            subscriptionsCount={activeSubs.length}
            installmentsCount={activeInst.length}
          />
        </div>

        <div className="lg:col-span-1">
          {nextItem ? (
            <NextBillingCard
              name={nextItem.name}
              value={nextItem.amount}
              nextBillingDate={nextItem.date.toISOString()}
              billingCycle={nextItem.cycle}
            />
          ) : (
            <div className="flex flex-col w-full h-full p-6 bg-[var(--primary)] border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)]">
              <h2 className="text-xs font-black text-[var(--main-bg)] opacity-80 uppercase tracking-widest mb-4">
                Próxima cobrança
              </h2>
              <div className="flex-grow flex items-center justify-center">
                <p className="text-sm font-bold text-[var(--main-bg)] opacity-60 uppercase tracking-wider">
                  Nenhuma cobrança agendada
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <AnnualSubscriptionChart data={annualData} />

      <SubscriptionTable
        items={tableItems}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {/* Modal de criação/edição */}
      <RecurrenceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={modalInitial}
        saving={saving}
      />

      {/* Confirm delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl border-3 border-[var(--black)] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">
              Confirmar exclusão
            </h3>
            <p className="text-sm font-bold text-[var(--black-muted)]">
              Tem certeza que deseja remover <span className="text-[var(--primary)]">{deleteTarget.name}</span>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-white text-[var(--primary)] hover:bg-black/5 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-[var(--black)] bg-red-500 text-white shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
