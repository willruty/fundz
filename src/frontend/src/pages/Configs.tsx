import { useState } from "react";
import { User, Lock, Bell, Settings2, Camera, Moon, Sun } from "lucide-react";

type Tab = "profile" | "account" | "notifications" | "preferences";

export function Configs() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Estados mockados apenas para a UI interagir
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie suas preferências e os dados da sua conta.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* MENU LATERAL */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0">
            <MenuButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon={<User size={18} />}
              label="Perfil Público"
            />
            <MenuButton
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              icon={<Lock size={18} />}
              label="Conta e Segurança"
            />
            <MenuButton
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              icon={<Bell size={18} />}
              label="Notificações"
            />
            <MenuButton
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              icon={<Settings2 size={18} />}
              label="Preferências"
            />
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
          {/* ABA: PERFIL */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Seu Perfil
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {/* Placeholder da Imagem */}
                    <User size={40} className="text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Foto de perfil</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-3">
                    JPG, GIF ou PNG. Tamanho máximo de 5MB.
                  </p>
                  <button className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                    Alterar foto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Nome Completo"
                  placeholder="Ex: João Silva"
                />
                <InputGroup
                  label="Apelido / Username"
                  placeholder="Ex: joaosilva99"
                  helperText="Como a galera vai te ver no app."
                />
                <div className="md:col-span-2">
                  <InputGroup
                    label="Bio"
                    placeholder="Escreva um pouco sobre você..."
                    isTextarea
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          )}

          {/* ABA: CONTA */}
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Conta e Segurança
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
                <InputGroup
                  label="E-mail"
                  type="email"
                  placeholder="joao@exemplo.com"
                />
                <InputGroup
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <h3 className="font-bold text-gray-900 mb-4">Alterar Senha</h3>
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <InputGroup
                  label="Senha Atual"
                  type="password"
                  placeholder="••••••••"
                />
                <InputGroup
                  label="Nova Senha"
                  type="password"
                  placeholder="••••••••"
                />
                <InputGroup
                  label="Confirmar Nova Senha"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="mt-8 flex justify-end">
                <Button>Atualizar Segurança</Button>
              </div>
            </div>
          )}

          {/* ABA: NOTIFICAÇÕES */}
          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Notificações
              </h2>

              <div className="flex flex-col gap-6">
                <ToggleRow
                  title="Notificações Push"
                  description="Receba alertas no seu celular ou navegador sobre novidades."
                  checked={pushEnabled}
                  onChange={() => setPushEnabled(!pushEnabled)}
                />
                <ToggleRow
                  title="E-mails de Resumo"
                  description="Receba um resumo semanal das suas atividades e finanças."
                  checked={emailEnabled}
                  onChange={() => setEmailEnabled(!emailEnabled)}
                />
                <ToggleRow
                  title="Avisos de Segurança"
                  description="Alertas sobre novos logins e mudanças na conta. (Obrigatório)"
                  checked={true}
                  onChange={() => {}}
                  disabled
                />
              </div>

              <div className="mt-8 flex justify-end">
                <Button>Salvar Preferências</Button>
              </div>
            </div>
          )}

          {/* ABA: PREFERÊNCIAS */}
          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Preferências do App
              </h2>

              <div className="mb-8">
                <h3 className="font-bold text-sm text-gray-700 mb-3">
                  Aparência
                </h3>
                <div className="flex gap-4">
                  <button className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-primary bg-primary/5 text-primary">
                    <Sun size={24} />
                    <span className="text-sm font-bold">Modo Claro</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <Moon size={24} />
                    <span className="text-sm font-bold">Modo Escuro</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-sm text-gray-700 mb-4">
                  Privacidade
                </h3>
                <ToggleRow
                  title="Perfil Privado"
                  description="Apenas seus amigos aprovados poderão ver seu apelido e conquistas."
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
              </div>

              <div className="mt-8 pt-8 border-t border-red-100">
                <h3 className="font-bold text-red-600 mb-2">Zona de Perigo</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Ao excluir sua conta, todos os seus dados serão apagados
                  permanentemente.
                </p>
                <button className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">
                  Excluir minha conta
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares para manter o código limpo ---

function MenuButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap md:whitespace-normal
        ${
          active
            ? "bg-gray-900 text-white shadow-md"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InputGroup({
  label,
  placeholder,
  type = "text",
  helperText,
  isTextarea = false,
}: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      )}
      {helperText && (
        <span className="text-[10px] text-gray-400">{helperText}</span>
      )}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: any) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 ${disabled ? "opacity-50" : "hover:bg-gray-50 transition-colors"}`}
    >
      <div>
        <h4 className="font-bold text-sm text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? "bg-primary" : "bg-gray-200"}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:translate-y-0">
      {children}
    </button>
  );
}
