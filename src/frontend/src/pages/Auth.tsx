import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

type AuthMode = "login" | "register";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const payload =
      mode === "login"
        ? { email: formData.email, password: formData.password }
        : formData;

    try {
      const response = await fetch(
        `http://localhost:8000/fundz/user${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.erro || data.error || "Erro inesperado.");
        return;
      }

      // 1. Limpa tudo antes de salvar o novo estado
      localStorage.clear();

      // 2. Salva o novo token
      if (data.token) {
        localStorage.setItem("token", data.token);

        // Opcional: Salvar o nome do user para o AppHeader não precisar de outro fetch
        if (data.user?.fullname) {
          localStorage.setItem("user_name", data.user.fullname);
        }
      }

      toast.success(
        mode === "login"
          ? "Login realizado com sucesso!"
          : "Cadastro realizado com sucesso!",
      );

      // 3. Redireciona
      navigate("/home");
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-manrope overflow-hidden">
      {/* LADO ESQUERDO: Painel Visual Full Screen */}
      <div className="relative hidden md:flex w-[50%] h-[98%] m-auto ml-2 rounded-3xl bg-primary p-16 flex-col justify-between overflow-hidden">
        {/* Focos de luz orgânicos dinâmicos */}
        <div className="absolute bottom-[-50%] w-[90%] h-[70%] bg-secondary rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] bg-[#1B365D] rounded-full blur-[100px] opacity-50" />

        <div className="relative z-10">
          <img src="/yellow-logo.png" alt="Fundz" className="h-20 w-auto" />
        </div>

        <div className="relative z-10 space-y-6 w-full">
          <span className="text-[#FFD100] text-sm font-black uppercase tracking-[0.2em]">
            Sua conta universitária
          </span>
          <h2 className="text-white text-6xl font-black leading-[1.1] tracking-tighter">
            Organize seu dinheiro para o próximo grande{" "}
            <span className="text-secondary">rolê.</span>
          </h2>
          <p className="text-white/70 text-lg font-medium leading-relaxed ">
            Da conta do buteco à sua próxima viagem internacional. Controle seus
            gastos diários e planeje suas metas sem complicação.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Auth Section Full Screen */}
      <div className="w-full md:w-[55%] h-full flex flex-col relative bg-white">
        {/* Botão Voltar Discreto */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-10 right-10 z-50 flex items-center gap-2 text-[#08233E]/40 font-bold text-xs uppercase tracking-widest hover:text-[#08233E] transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar
        </button>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl space-y-10">
            {/* Seletor Estilo Pill */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl relative">
              {(["login", "register"] as AuthMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-2.5 text-[10px] font-black tracking-[0.15em] relative z-10 transition-colors duration-300 ${
                    mode === tab ? "text-[#08233E]" : "text-gray-400"
                  }`}
                >
                  {tab.toUpperCase()}
                  {mode === tab && (
                    <motion.div
                      layoutId="activeTabAuth"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <header className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h1 className="text-4xl font-black text-[#08233E] tracking-tighter mb-3 uppercase">
                    {mode === "login"
                      ? "Bem-vindo de volta"
                      : "Criar sua conta"}
                  </h1>
                  <p className="text-gray-400 text-sm font-medium">
                    {mode === "login"
                      ? "Acesse o dashboard do Fundz para ver seu saldo."
                      : "Comece a organizar suas finanças universitárias hoje."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence initial={false}>
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                      transition: {
                        height: { duration: 0.4 },
                        opacity: { duration: 0.3, delay: 0.1 },
                        y: { type: "spring", stiffness: 200, damping: 20 },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: 10,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 },
                        y: { duration: 0.2 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                      {" "}
                      {/* Container para evitar cortes no padding durante a animação */}
                      <label className="text-[10px] font-black text-[#08233E]/30 uppercase tracking-widest mb-1.5 block ml-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:border-[#FFD100] focus:bg-white outline-none transition-all font-bold text-sm"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black text-[#08233E]/30 uppercase tracking-widest mb-1.5 block ml-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:border-[#FFD100] focus:bg-white outline-none transition-all font-bold text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-[#08233E]/30 uppercase tracking-widest mb-1.5 block ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"} // Alterna o tipo aqui
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:border-[#FFD100] focus:bg-white outline-none transition-all font-bold text-sm pr-14" // pr-14 para dar espaço ao botão
                    placeholder="••••••••"
                  />

                  <button
                    type="button" // Importante: deve ser type="button" para não submeter o form
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#08233E]/30 hover:text-[#08233E] transition-colors p-2"
                  >
                    {showPassword ? (
                      <EyeOff size={20} strokeWidth={2.5} />
                    ) : (
                      <Eye size={20} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#08233E] text-[#FFD100] font-black py-5 rounded-2xl mt-4 shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-tight flex items-center justify-center gap-3"
              >
                {loading
                  ? "Processando..."
                  : mode === "login"
                    ? "Acessar Dashboard"
                    : "Finalizar Cadastro"}
                {!loading && <ChevronRight size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
