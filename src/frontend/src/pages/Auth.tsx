import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

type AuthMode = 'login' | 'register';

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode === 'login'
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:8000/fundz/user${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`${mode === 'login' ? 'Login' : 'Cadastro'} realizado com sucesso!`);
        navigate('/home');
      } else {
        console.log('Erro na requisição. Verifique os dados.');
      }

    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4 font-manrope">
      {/* Background Decorativo usando variáveis */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary opacity-10 blur-[120px]" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 
             bg-secondary/15 backdrop-blur-md border border-white/10 
             text-primary dark:text-text-dark font-bold text-sm
             rounded-button shadow-sm transition-all duration-500
             hover:bg-secondary/30 hover:border-secondary/20 active:scale-95 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        <span className="tracking-tight">Voltar</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md bg-white dark:bg-bg-dark rounded-main shadow-[0_20px_50px_rgba(27,54,93,0.15)] border border-white/10 overflow-hidden"
      >
        {/* Header / Toggle com Variáveis do Tema */}
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1.5 m-6 rounded-button relative">
          {(['login', 'register'] as AuthMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-2 text-xs font-extrabold tracking-widest relative isolate  hover:cursor-pointer transition-colors duration-500 ${mode === tab ? 'text-primary' : 'text-primary/40 dark:text-text-dark/40'
                }`}
            >
              {tab.toUpperCase()}

              {mode === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-secondary rounded-[6px] shadow-sm z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="px-8 pb-10 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight mb-2">
                {mode === 'login' ? 'Acesse sua conta' : 'Crie seu perfil'}
              </h1>
              <p className="text-text-light dark:text-text-dark text-sm font-medium">
                {mode === 'login' ? 'Informe seus dados de acesso.' : 'Preencha os campos para se cadastrar.'}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence initial={false}>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="flex flex-col overflow-hidden"
                >
                  <label className="text-[10px] font-extrabold text-primary dark:text-secondary uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    required={mode === 'register'}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-button border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-text-light dark:text-text-dark outline-none focus:border-secondary transition-all"
                    placeholder="Ex: João Silva"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col">
              <label className="text-[10px] font-extrabold text-primary dark:text-secondary uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-button border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-text-light dark:text-text-dark outline-none focus:border-secondary transition-all"
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-extrabold text-primary dark:text-secondary uppercase tracking-widest mb-1.5 ml-1">Senha</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-button border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-text-light dark:text-text-dark outline-none focus:border-secondary transition-all"
                placeholder="••••••••"
              />
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <a href="#" className="text-xs font-bold text-primary dark:text-secondary hover:underline underline-offset-4">
                  Esqueceu a senha?
                </a>
              </div>
            )}

            <motion.button
              layout
              whileHover={{ scale: 1.01, backgroundColor: "var(--color-secondary-hover)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-primary font-extrabold py-4 rounded-button mt-4 shadow-lg shadow-secondary/20 transition-colors disabled:opacity-50"
            >
              {loading ? 'CARREGANDO...' : mode === 'login' ? 'ENTRAR' : 'FINALIZAR CADASTRO'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
