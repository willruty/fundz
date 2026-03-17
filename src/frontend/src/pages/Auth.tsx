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

      localStorage.clear();

      if (data.token) {
        localStorage.setItem("token", data.token);

        if (data.full_name) {
          localStorage.setItem("user_name", data.full_name);
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
    <div className="h-screen w-full flex bg-[var(--main-bg)] overflow-hidden">
      {/* LADO ESQUERDO: Painel Visual Neo-Brutalista */}
      <div className="relative hidden md:flex w-[45%] h-[96%] m-auto ml-4 rounded-[var(--radius-card)] bg-[var(--primary)] border-4 border-[var(--black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 lg:p-16 flex-col justify-between overflow-hidden">
        {/* Formas Geométricas Sólidas (Substituindo os blurs) */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[60%] bg-[var(--secondary)] rounded-full border-4 border-[var(--black)]" />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-emerald-400 rounded-full border-4 border-[var(--black)]" />

        <div className="relative z-10 bg-none w-fit p-3 rounded-xl border-2 border-[var(--black)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Caso tenha uma versão preta da logo, ficaria ideal aqui. Mantendo a original por precaução */}
          <img src="/yellow-logo.png" alt="Fundz" className="h-20 w-auto" />
        </div>

        <div className="relative z-10 space-y-6 w-full mt-auto bg-[var(--primary)]/90 p-6 rounded-2xl border-2 border-[var(--black)] backdrop-blur-sm">
          <span className="text-[var(--secondary)] text-xs font-black uppercase tracking-widest border-b-2 border-[var(--secondary)] pb-1 inline-block">
            Sua conta universitária
          </span>
          <h2 className="text-[var(--main-bg)] text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter uppercase">
            Organize seu dinheiro para o próximo grande{" "}
            <span className="text-[var(--secondary)] bg-[var(--black)] px-2 rounded-md border-2 border-[var(--black)] inline-block -rotate-2">
              rolê.
            </span>
          </h2>
          <p className="text-[var(--main-bg)] opacity-90 text-sm xl:text-base font-bold leading-relaxed tracking-wide">
            Da conta do buteco à sua próxima viagem internacional.
            <br />
            Controle seus gastos diários e planeje suas metas sem complicação.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Auth Section */}
      <div className="w-full md:w-[55%] h-full flex flex-col relative bg-[var(--main-bg)]">
        {/* Botão Voltar Brutalista */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 bg-white text-[var(--primary)] font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
        >
          <ArrowLeft
            size={14}
            strokeWidth={3}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar
        </button>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-lg space-y-10">
            {/* Seletor Estilo Pill Brutalista */}
            <div className="flex bg-white p-1.5 rounded-xl border-2 border-[var(--black)] shadow-[var(--neo-shadow)] relative">
              {(["login", "register"] as AuthMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase relative z-10 transition-colors duration-300 ${
                    mode === tab
                      ? "text-[var(--primary)]"
                      : "text-[var(--black-muted)] hover:text-[var(--primary)]"
                  }`}
                >
                  {tab === "login" ? "Entrar" : "Criar Conta"}
                  {mode === tab && (
                    <motion.div
                      layoutId="activeTabAuth"
                      className="absolute inset-0 bg-[var(--secondary)] border-2 border-[var(--black)] rounded-lg z-[-1]"
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
                  <h1 className="text-4xl sm:text-5xl font-black text-[var(--primary)] tracking-tighter mb-2 uppercase">
                    {mode === "login"
                      ? "Bem-vindo de volta"
                      : "Criar sua conta"}
                  </h1>
                  <p className="text-[var(--black-muted)] text-sm font-bold tracking-wide uppercase">
                    {mode === "login"
                      ? "Acesse o dashboard do Fundz para ver seu saldo."
                      : "Comece a organizar suas finanças universitárias hoje."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div className="pb-1">
                      <label className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-2 block ml-1">
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
                        className="w-full px-5 py-4 rounded-xl border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none transition-all font-black text-sm shadow-[var(--neo-shadow-hover)] text-[var(--primary)]"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-2 block ml-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-xl border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none transition-all font-black text-sm shadow-[var(--neo-shadow-hover)] text-[var(--primary)]"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest mb-2 block ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-xl border-2 border-[var(--black)] bg-white focus:ring-4 focus:ring-[var(--secondary)] outline-none transition-all font-black text-sm shadow-[var(--neo-shadow-hover)] text-[var(--primary)] pr-14"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--main-bg)] border-2 border-[var(--black)] rounded-md text-[var(--primary)] hover:bg-[var(--secondary)] transition-colors p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={3} />
                    ) : (
                      <Eye size={16} strokeWidth={3} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] text-[var(--secondary)] font-black py-4 rounded-xl mt-6 border-2 border-[var(--black)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[var(--neo-shadow)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
              >
                {loading
                  ? "Processando..."
                  : mode === "login"
                    ? "Acessar Dashboard"
                    : "Finalizar Cadastro"}
                {!loading && <ChevronRight size={18} strokeWidth={3} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
