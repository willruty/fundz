import CommitmentCard from "../components/CommitmentCard";
import ActiveSubscriptionsCard from "../components/ActiveSubscriptionCard";
import NextBillingCard from "../components/NextBillingCard";
import AnnualSubscriptionChart from "../components/AnualSubscriptionChart";
import SubscriptionTable from "../components/SubscriptionsTable";

// Componente importado conforme solicitado
export function Subscriptions() {
  return (
    <main className="min-h-screen mx-auto space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {/* Ocupa 2 de 4 colunas (50%) no Desktop */}
        <div className="lg:col-span-2">
          <CommitmentCard />
        </div>

        {/* Ocupa 1 de 4 colunas (25%) no Desktop */}
        <div className="lg:col-span-1">
          <ActiveSubscriptionsCard />
        </div>

        {/* Ocupa 1 de 4 colunas (25%) no Desktop */}
        <div className="lg:col-span-1">
          <NextBillingCard />
        </div>
      </section>

      <AnnualSubscriptionChart />
      <SubscriptionTable />
    </main>
  );
}
