import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

interface AppHeaderProps {
  title: ReactNode;
  subtitle: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Simulação de dados do usuário
  const userName = localStorage.getItem("user_name") || "Usuário";

  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      {/* LADO ESQUERDO: Títulos */}
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--primary)] tracking-tighter leading-none">
          {title}
        </h1>

        {subtitle && (
          <p className="text-[10px] md:text-xs font-black text-[var(--black-muted)] tracking-widest mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* LADO DIREITO: Notificação e Perfil Pilled */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* Data Atual (Adesivo Brutalista) */}
        <span className="hidden sm:block text-[10px] font-black text-[var(--primary)] bg-[var(--secondary)] px-3 py-1.5 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] uppercase tracking-wider">
          {currentDate}
        </span>

        {/* Botão Notificação */}
        <button className="relative p-2.5 bg-white border-2 border-[var(--black)] rounded-xl shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer group">
          <Bell size={22} strokeWidth={2.5} className="text-[var(--primary)]" />
          {/* Bolinha de Alerta Neo-brutalista */}
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-[var(--black)] rounded-full animate-bounce" />
        </button>

        {/* Perfil Pilled */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-white border-2 border-[var(--black)] p-1.5 pr-4 rounded-full shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer relative z-40"
          >
            {/* Foto Redonda */}
            <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center overflow-hidden border-2 border-[var(--black)] shrink-0">
              {/* Quando tiver a URL da foto, pode substituir o ícone pela tag <img> */}
              <User
                size={20}
                className="text-[var(--primary)]"
                strokeWidth={2.5}
              />
            </div>

            {/* Texto de Boas-vindas */}
            <div className="text-left hidden md:block mt-0.5">
              <p className="text-[8px] font-black text-[var(--black-muted)] uppercase tracking-widest leading-none">
                Bem-vindo de volta
              </p>
              <p className="text-xs font-black text-[var(--primary)] uppercase truncate max-w-[120px] mt-0.5">
                {userName}
              </p>
            </div>

            {/* Ícone com rotação animada */}
            <motion.div
              animate={{ rotate: isProfileOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown
                size={20}
                strokeWidth={3}
                className="text-[var(--primary)]"
              />
            </motion.div>
          </button>

          {/* Toggle de Perfil (Dropdown Neo-Brutalista) */}
          <AnimatePresence>
            {isProfileOpen && (
              <>
                {/* Overlay invisível para fechar ao clicar fora (opcional mas melhora a UX) */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: {
                      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.25 },
                      y: { type: "spring", stiffness: 300, damping: 25 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -10,
                    transition: {
                      height: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                    },
                  }}
                  style={{ originY: 0 }}
                  className="absolute right-0 mt-3 w-56 bg-white border-2 border-[var(--black)] rounded-2xl shadow-[var(--neo-shadow)] z-40 overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        navigate("/configs");
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 w-full rounded-lg border-2 border-transparent hover:border-[var(--black)] hover:bg-[var(--secondary)] transition-all text-xs font-black uppercase tracking-wider text-[var(--primary)] group cursor-pointer"
                    >
                      <Settings
                        size={18}
                        strokeWidth={2.5}
                        className="text-[var(--black-muted)] group-hover:text-[var(--primary)] transition-colors"
                      />
                      Configurações
                    </button>

                    {/* Divisória Brutalista (Tracejada) */}
                    <div className="border-t-2 border-[var(--black)] border-dashed my-1 mx-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 w-full rounded-lg border-2 border-transparent hover:border-[var(--black)] hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-wider text-red-600 group cursor-pointer"
                    >
                      <LogOut
                        size={18}
                        strokeWidth={2.5}
                        className="text-red-500 group-hover:text-white transition-colors"
                      />
                      Sair da Conta
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
