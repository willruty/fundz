import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import { Accounts } from "./pages/Accounts";
import { Goals } from "./pages/Goals";
import { Investments } from "./pages/Investments";
import { Expenses } from "./pages/Expenses";
import { Categories } from "./pages/Categories";
import { Subscriptions } from "./pages/Subscriptions";
import { Profile } from "./pages/Profile";
import { Configs } from "./pages/Configs";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./components/ui/sidebar";
import { AppHeader } from "./components/ui/appheader";

function Platform() {
  {
    /*Verificar usando middleware e JWT*/
  }
  const location = useLocation();
  const isProfilePage = ["/profile", "/configs"].includes(location.pathname);

  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/home":
        return {
          title: "Home",
          subtitle:
            "Um panorama completo da sua vida financeira, com números que não mentem e decisões que não podem esperar.",
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

      default:
        return { title: "", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-manrope">
      <Sidebar />

      <main className="flex-1 h-full flex flex-col overflow-y-auto overflow-x-hidden p-8">
        {/* Renderiza o AppHeader apenas se NÃO for a página de perfil */}
        {!isProfilePage && <AppHeader title={title} subtitle={subtitle} />}

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        {/* Rotas sem Sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        {/* Rotas com Sidebar */}
        <Route element={<Platform />}>
          <Route path="/home" element={<Home />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/configs" element={<Configs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
