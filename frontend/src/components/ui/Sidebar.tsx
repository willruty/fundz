import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  ArrowDownCircle,
  Target,
  CalendarClock,
  ChevronLeft,
  Menu,
  Settings,
  TrendingUp,
  Bot,
} from "lucide-react";

const menuItems = [
  { name: "Home",         path: "/home",         icon: Home },
  { name: "Contas",       path: "/accounts",     icon: Wallet },
  { name: "Despesas",     path: "/expenses",     icon: ArrowDownCircle },
  { name: "Metas",        path: "/goals",        icon: Target },
  { name: "Investimentos",path: "/investments",  icon: TrendingUp },
  { name: "Assinaturas",  path: "/subscriptions",icon: CalendarClock },
  { name: "Advisors",     path: "/advisors",     icon: Bot },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex flex-col h-screen p-4 z-50">
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? "220px" : "80px" }}
        // Removida a borda e suavizada a sombra para deixar a navegação mais leve
        className="h-full bg-[var(--primary)] flex flex-col relative shadow-xl rounded-[24px]"
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

        {/* Botão Toggle (Único elemento com borda dura para servir como puxador físico) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-12 bg-[var(--secondary)] text-[var(--primary)] rounded-full p-1.5 border-2 border-[var(--black)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-20 cursor-pointer"
        >
          {isExpanded ? (
            <ChevronLeft size={16} strokeWidth={3} />
          ) : (
            <Menu size={16} strokeWidth={3} />
          )}
        </button>

        {/* Navegação */}
        <div className="flex flex-col gap-1 px-2 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-[var(--secondary)]" // Fundo sutil ao invés de bordas
                    : "text-[var(--main-bg)] hover:bg-white/5 hover:text-[var(--secondary)]"
                } ${!isExpanded ? "justify-center" : "justify-start px-4"}`}
              >
                {/* Borda Lateral Animada (Mais quadrada para combinar com o tema) */}
                {isActive && (
                  <motion.div
                    layoutId="activeBorder"
                    className="absolute left-0 w-1.5 h-6 bg-[var(--secondary)] rounded-r-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Ícone */}
                <div className="flex items-center justify-center min-w-[22px]">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`${isActive ? "text-[var(--secondary)]" : "text-[var(--secondary)] opacity-70 group-hover:opacity-100 transition-opacity"}`}
                  />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-black text-[10px] uppercase tracking-widest overflow-hidden whitespace-nowrap ml-4 mt-0.5"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip Brutalista (Aparece apenas quando fechado) */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-[var(--secondary)] text-[var(--primary)] px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-[var(--black)] shadow-[var(--neo-shadow)] z-[100] translate-x-2 group-hover:translate-x-4">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer de Perfil / Configurações */}
        <div className="p-2 mt-auto border-t-2 border-white/10 mb-2">
          <button
            onClick={() => navigate("/configs")}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative cursor-pointer hover:bg-white/5 text-[var(--main-bg)] hover:text-[var(--secondary)] ${
              !isExpanded ? "justify-center" : "justify-start px-4"
            }`}
          >
            <div className="flex items-center justify-center min-w-[22px]">
              <Settings
                size={20}
                className="text-[var(--secondary)] opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-black text-[10px] uppercase tracking-widest overflow-hidden whitespace-nowrap ml-4 mt-0.5"
                >
                  Configurações
                </motion.span>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <div className="absolute left-16 bg-[var(--secondary)] text-[var(--primary)] px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 border-2 border-[var(--black)] shadow-[var(--neo-shadow)] z-[100] translate-x-2 group-hover:translate-x-4">
                Configurações
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
