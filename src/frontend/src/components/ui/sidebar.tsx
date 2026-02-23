import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  Tag,
  ArrowDownCircle,
  Target,
  CalendarClock,
  ChevronLeft,
  Menu,
  Settings,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Contas", path: "/accounts", icon: Wallet },
  { name: "Categorias", path: "/categories", icon: Tag },
  { name: "Despesas", path: "/expenses", icon: ArrowDownCircle },
  { name: "Metas", path: "/goals", icon: Target },
  { name: "Investimentos", path: "/investments", icon: TrendingUp },
  { name: "Assinaturas", path: "/subscriptions", icon: CalendarClock },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-screen p-4 flex flex-col z-50">
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? "280px" : "80px" }}
        className="h-full bg-primary flex flex-col relative shadow-[0_20px_50px_rgba(8,35,62,0.3)] rounded-[20px]"
      >
        {/* Header - Logos */}
        <div className="h-24 flex items-center px-8 mb-4 relative">
          <motion.div
            animate={{
              opacity: isExpanded ? 1 : 0,
              scale: isExpanded ? 1.1 : 0.8,
            }}
            className={isExpanded ? "block" : "hidden"}
          >
            <img
              src="/yellow-logo.png"
              alt="Fundz"
              className="h-14 w-auto mt-6 object-contain"
            />
          </motion.div>

          <motion.div
            animate={{
              opacity: !isExpanded ? 1 : 0,
              scale: !isExpanded ? 1 : 0.8,
            }}
            className={!isExpanded ? "absolute left-6" : "hidden"}
          >
            <img
              src="/icon-logo.png"
              alt="Fundz Icon"
              className="h-8 mt-6 w-8"
            />
          </motion.div>
        </div>

        {/* Botão Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-0 top-12 translate-x-1/2 bg-secondary text-[#08233E] rounded-full p-1.5 shadow-xl hover:scale-110 transition-transform z-20 cursor-pointer"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>

        {/* Navegação */}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center p-3.5 rounded-2xl transition-colors duration-300 group relative cursor-pointer ${
                isActive
                  ? "text-[#FFD100]"
                  : "text-[#FFFAF0] hover:text-[#FFD100]/80"
              } ${!isExpanded ? "justify-center" : "justify-start px-6"}`} // Centraliza se fechado, padding lateral se aberto
            >
              {/* Borda Lateral Animada */}
              {isActive && (
                <motion.div
                  layoutId="activeBorder"
                  className="absolute left-0 w-1.5 h-8 bg-[#FFD100] rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Ícone centralizado */}
              <div className="flex items-center justify-center min-w-[22px]">
                <item.icon
                  size={22}
                  className={`${isActive ? "text-[#FFD100]" : "text-[#FFD100] opacity-70 group-hover:opacity-100"}`}
                />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-bold text-sm tracking-tight overflow-hidden whitespace-nowrap ml-4"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip */}
              {!isExpanded && (
                <div className="absolute left-20 bg-[#08233E] text-[#FFFAF0] px-4 py-2 rounded-xl text-xs font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border border-white/10 shadow-2xl z-[100] translate-x-2 group-hover:translate-x-4 uppercase tracking-widest">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}

        {/* Footer de Perfil */}
        <div className="p-4 mt-auto border-t border-white/5">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/configs")}
            className={`w-full flex items-center p-3.5 rounded-2xl transition-all duration-300 group relative cursor-pointer ${
              !isExpanded ? "justify-center" : "justify-start px-6 gap-4"
            }`}
          >
            {/* Ícone de Engrenagem - Mesma estilização dos outros itens */}
            <div className="flex items-center justify-center min-w-[22px]">
              <Settings
                size={22}
                className="text-[#FFD100] opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Texto com Animação Fluida */}
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#FFFAF0] text-sm font-bold tracking-tight overflow-hidden whitespace-nowrap"
                >
                  Configurações
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip para o estado encolhido */}
            {!isExpanded && (
              <div className="absolute left-20 bg-[#08233E] text-[#FFFAF0] px-4 py-2 rounded-xl text-xs font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border border-white/10 shadow-2xl uppercase tracking-widest z-[100] translate-x-2 group-hover:translate-x-4">
                Configurações
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
