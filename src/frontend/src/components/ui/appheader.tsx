import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Simulação de dados do usuário (Pode vir do Context ou Store)
  const user = {
    fullname: "HR Labs",
    avatar: "/icon-logo.png",
  };

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
    <header className="w-full flex justify-between items-center mb-10">
      {/* LADO ESQUERDO: Títulos */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-primary tracking-tighter leading-none">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-400 text-sm font-bold mt-1">{subtitle}</p>
        )}
      </div>

      {/* LADO DIREITO: Notificação e Perfil Pilled */}
      <div className="flex items-center gap-4">

        {/* Data Atual */}
        <span className="text-m font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-300 m-auto">
          {currentDate}
        </span>

        {/* Botão Notificação */}
        <button className="relative p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <Bell
            size={24}
            className="text-primary opacity-60 group-hover:opacity-100"
          />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary border-2 border-white rounded-full" />
        </button>

        {/* Perfil Pilled */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 bg-white border border-gray-100 p-2 pr-5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer relative z-30"
          >
            {/* Foto Redonda */}
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-gray-50">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto de Boas-vindas */}
            <div className="text-left hidden md:block">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
                Bem-vindo de volta
              </p>
              <p className="text-xs font-black text-primary truncate max-w-[120px]">
                {user.fullname}
              </p>
            </div>

            {/* Ícone com rotação animada via motion para ser mais fluido */}
            <motion.div
              animate={{ rotate: isProfileOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown size={20} className="text-primary" />
            </motion.div>
          </button>

          {/* Toggle de Perfil (Dropdown) */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                // O segredo do Dropdown: começar com altura zero e expandir
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
                className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 overflow-hidden"
              >
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      navigate("/configs");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-primary group cursor-pointer"
                  >
                    <Settings
                      size={18}
                      className="text-gray-300 group-hover:text-primary transition-colors"
                    />
                    Configurações
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-primary group cursor-pointer"
                  >
                    <User
                      size={18}
                      className="text-gray-300 group-hover:text-primary transition-colors"
                    />
                    Meu Perfil
                  </button>

                  <div className="h-px bg-gray-100 my-1 mx-2" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 transition-colors text-sm font-bold text-red-500 group cursor-pointer"
                  >
                    <LogOut
                      size={18}
                      className="text-red-300 group-hover:text-red-500 transition-colors"
                    />
                    Sair da Conta
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
