import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import { Accounts } from "./pages/Accounts";
import { Goals } from "./pages/Goals";
import { Investments } from "./pages/Investments";
import { Expenses } from "./pages/Expenses";
import { Subscriptions } from "./pages/Subscriptions";
import { Configs } from "./pages/Configs";
import { Advisors } from "./pages/Advisors";
import { AdvisorsChat } from "./pages/AdvisorsChat";
import { Toaster } from "react-hot-toast";
import Platform from "./components/ui/PlataformInterface";

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
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/configs" element={<Configs />} />
          <Route path="/advisors" element={<Advisors />} />
          <Route path="/advisors/chat/:personaId" element={<AdvisorsChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
