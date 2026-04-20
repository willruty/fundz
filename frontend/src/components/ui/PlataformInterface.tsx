import { useLocation, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";

function Platform() {
  const location = useLocation();
  const isProfilePage       = ["/profile", "/configs"].includes(location.pathname);
  const isAdvisorsPage      = location.pathname.startsWith("/advisors");
  const isAdvisorsChat      = location.pathname.startsWith("/advisors/chat");
  const isVisualPlanningPage = location.pathname === "/visual-planning";

  // Busca o nome do usuário do LocalStorage
  const userName = localStorage.getItem("user_name") || "";
  const firstName = userName.split(" ")[0];

  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/home":
        return {
          title: (
            <div
              className="flex items-center gap-2"
              style={{
                fontFamily: "Catchland, sans-serif",
                fontSize: "1.2em",
                lineHeight: "1",
              }}
            >
              <span>
                Eae <span className="text-secondary">{firstName}? {" "}</span> 
                O que temos para hoje?
              </span>
            </div>
          ),
          subtitle: "",
        };

      case "/accounts":
        return {
          title: "Minhas Contas",
          subtitle:
            "Visualize e gerencie todos os seus bancos, carteiras e saldos em um só lugar. Organização é o primeiro passo para controle real.",
        };

      case "/goals":
        return {
          title: "Metas",
          subtitle:
            "Defina, acompanhe e ajuste seus objetivos financeiros. Sonho sem acompanhamento vira só intenção.",
        };

      case "/investments":
        return {
          title: "Investimentos",
          subtitle:
            "Simule cenários, projete seus rendimentos e pare de perder para a inflação.",
        };

      case "/expenses":
        return {
          title: "Despesas",
          subtitle:
            "Acompanhe para onde cada centavo está indo e identifique padrões antes que eles controlem seu orçamento.",
        };

      case "/categories":
        return {
          title: "Categorias",
          subtitle:
            "Estruture seus gastos por tipo e transforme bagunça financeira em dados organizados e estratégicos.",
        };

      case "/subscriptions":
        return {
          title: "Assinaturas",
          subtitle:
            "Controle seus serviços recorrentes, evite cobranças esquecidas e elimine vazamentos silenciosos do seu orçamento.",
        };

      case "/visual-planning":
        return {
          title: "Planejamento Visual",
          subtitle: "Distribua sua receita entre categorias e veja o dinheiro fluir em tempo real.",
        };

      default:
        return { title: "", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div
      className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-manrope"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.10) 2px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {!isAdvisorsChat && <Sidebar />}

      <main className={`flex-1 h-full flex flex-col overflow-hidden ${
        isAdvisorsPage || isVisualPlanningPage
          ? "pb-[4.5rem] md:pb-0"
          : "overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 pb-24 md:pb-8"
      }`}>
        {!isProfilePage && !isAdvisorsPage && !isVisualPlanningPage && (
          <AppHeader title={title} subtitle={subtitle} />
        )}

        <div className={isAdvisorsPage || isVisualPlanningPage ? "flex-1 h-full overflow-hidden" : "flex-1"}>
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

export default Platform;
