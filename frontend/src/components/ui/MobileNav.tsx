import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  ArrowDownCircle,
  Target,
  CalendarClock,
  TrendingUp,
  Bot,
} from "lucide-react";

const menuItems = [
  { name: "Home",     path: "/home",         icon: Home },
  { name: "Contas",   path: "/accounts",     icon: Wallet },
  { name: "Despesas", path: "/expenses",     icon: ArrowDownCircle },
  { name: "Metas",    path: "/goals",        icon: Target },
  { name: "Invest.",  path: "/investments",  icon: TrendingUp },
  { name: "Assina.",  path: "/subscriptions",icon: CalendarClock },
  { name: "AI",       path: "/advisors",     icon: Bot },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--primary)] border-t-2 border-[var(--black)] shadow-[0_-4px_0px_0px_#000000]">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 cursor-pointer group flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveBg"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={`relative z-10 transition-colors ${
                  isActive
                    ? "text-[var(--secondary)]"
                    : "text-[var(--secondary)] opacity-50 group-hover:opacity-80"
                }`}
              />
              <span
                className={`relative z-10 text-[8px] font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? "text-[var(--secondary)]"
                    : "text-[var(--secondary)] opacity-50 group-hover:opacity-80"
                }`}
              >
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileDot"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--secondary)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
