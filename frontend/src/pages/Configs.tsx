import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Settings2,
  Camera,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConfigsSkeleton } from "../components/skeletons/ConfigsSkeleton";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../service/profile.service";
import type { Profile } from "../service/profile.service";

type Tab = "profile" | "account" | "notifications" | "preferences";

export function Configs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // Preferences state
  const [isPrivate, setIsPrivate] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setName(p.name ?? "");
        setAvatarUrl(p.avatar_url ?? "");
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil:", err);
        toast.error("Erro ao carregar perfil");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ConfigsSkeleton />;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({ name, avatar_url: avatarUrl || undefined });
      setProfile(updated);
      localStorage.setItem("user_name", updated.name ?? "");
      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(newPassword);
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Erro ao alterar senha");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "EXCLUIR") return;
    setDeleting(true);
    try {
      await deleteAccount();
      localStorage.clear();
      toast.success("Conta excluída");
      navigate("/auth");
    } catch {
      toast.error("Erro ao excluir conta");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* CABEÇALHO */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--primary)] tracking-tighter uppercase">
          Configurações
        </h1>
        <p className="text-sm font-bold text-[var(--black-muted)] mt-1 uppercase tracking-widest">
          Gerencie suas preferências e os dados da sua conta.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* MENU LATERAL */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            <MenuButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon={<User size={18} strokeWidth={2.5} />}
              label="Perfil Público"
            />
            <MenuButton
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              icon={<Lock size={18} strokeWidth={2.5} />}
              label="Conta e Segurança"
            />
            <MenuButton
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              icon={<Bell size={18} strokeWidth={2.5} />}
              label="Notificações"
            />
            <MenuButton
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              icon={<Settings2 size={18} strokeWidth={2.5} />}
              label="Preferências"
            />
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] p-6 md:p-8 shadow-[var(--neo-shadow)] transition-all">
          {/* ABA: PERFIL */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-black text-[var(--primary)] mb-6 tracking-tighter uppercase">
                Seu Perfil
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-[var(--main-bg)] border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={40}
                        className="text-[var(--black-muted)]"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-transparent group-hover:border-[var(--black)]">
                    <Camera
                      size={24}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-[var(--primary)] uppercase tracking-tight">
                    Foto de perfil
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--black-muted)] mt-1 mb-3 uppercase tracking-wider">
                    JPG, GIF ou PNG. Máx: 5MB.
                  </p>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="URL da imagem de perfil"
                      className="w-full bg-white border-2 border-[var(--black)] rounded-md px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-[var(--neo-shadow-hover)]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Nome Completo"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <InputGroup
                  label="E-mail"
                  value={profile?.email ?? ""}
                  disabled
                  helperText="O e-mail não pode ser alterado."
                />
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[var(--black)] border-dashed flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          )}

          {/* ABA: CONTA E SEGURANÇA */}
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-black text-[var(--primary)] mb-6 tracking-tighter uppercase">
                Conta e Segurança
              </h2>

              <div className="mb-8 pb-8 border-b-2 border-[var(--black)] border-dashed">
                <h3 className="font-black text-[var(--primary)] mb-4 uppercase tracking-tight">
                  Informações da Conta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="E-mail"
                    value={profile?.email ?? ""}
                    disabled
                  />
                  <InputGroup
                    label="Membro desde"
                    value={
                      profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                        : ""
                    }
                    disabled
                  />
                </div>
              </div>

              <h3 className="font-black text-[var(--primary)] mb-4 uppercase tracking-tight">
                Alterar Senha
              </h3>
              <div className="grid grid-cols-1 gap-5 max-w-md">
                <InputGroup
                  label="Nova Senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                />
                <InputGroup
                  label="Confirmar Nova Senha"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[var(--black)] border-dashed flex justify-end">
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? "Alterando..." : "Atualizar Senha"}
                </Button>
              </div>
            </div>
          )}

          {/* ABA: NOTIFICAÇÕES */}
          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-black text-[var(--primary)] mb-6 tracking-tighter uppercase">
                Notificações
              </h2>

              <div className="flex flex-col gap-5">
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
                  description="Alertas sobre novos logins e mudanças. (Obrigatório)"
                  checked={true}
                  onChange={() => {}}
                  disabled
                />
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[var(--black)] border-dashed flex justify-end">
                <Button onClick={() => toast.success("Preferências salvas!")}>
                  Salvar Preferências
                </Button>
              </div>
            </div>
          )}

          {/* ABA: PREFERÊNCIAS */}
          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-black text-[var(--primary)] mb-6 tracking-tighter uppercase">
                Preferências do App
              </h2>

              <div className="mb-8">
                <h3 className="font-black text-xs text-[var(--black-muted)] mb-3 uppercase tracking-widest">
                  Aparência
                </h3>
                <div className="flex gap-4">
                  <button className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-[var(--black)] bg-[var(--secondary)] text-[var(--primary)] shadow-[var(--neo-shadow-hover)] transition-transform hover:-translate-y-0.5">
                    <Sun size={24} strokeWidth={2.5} />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Modo Claro
                    </span>
                  </button>
                  <button className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-[var(--black)] bg-white text-[var(--black-muted)] hover:bg-black/5 transition-colors">
                    <Moon size={24} strokeWidth={2.5} />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Modo Escuro
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-[var(--black)] border-dashed">
                <h3 className="font-black text-xs text-[var(--black-muted)] mb-4 uppercase tracking-widest">
                  Privacidade
                </h3>
                <ToggleRow
                  title="Perfil Privado"
                  description="Apenas seus amigos poderão ver seu apelido e conquistas."
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
              </div>

              {/* Zona de Perigo */}
              <div className="mt-8 pt-8 border-t-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-red-600" strokeWidth={2.5} />
                  <h3 className="font-black text-xl text-red-600 uppercase tracking-tighter">
                    Zona de Perigo
                  </h3>
                </div>
                <p className="text-xs font-bold text-[var(--black-muted)] mb-5">
                  Ao excluir sua conta, todos os seus dados serão apagados
                  permanentemente. Esta ação não tem volta.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-5 py-3 bg-red-500 text-white font-black uppercase tracking-wider rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-red-600 transition-all"
                  >
                    Excluir minha conta
                  </button>
                ) : (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-5 space-y-4">
                    <p className="text-sm font-black text-red-700">
                      Digite <span className="bg-red-200 px-2 py-0.5 rounded">EXCLUIR</span> para confirmar:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="EXCLUIR"
                      className="w-full max-w-xs bg-white border-2 border-red-500 rounded-md px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "EXCLUIR" || deleting}
                        className="px-5 py-3 bg-red-600 text-white font-black uppercase tracking-wider rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? "Excluindo..." : "Confirmar Exclusão"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="px-5 py-3 bg-white text-[var(--primary)] font-black uppercase tracking-wider rounded-md border-2 border-[var(--black)] shadow-[var(--neo-shadow-hover)] hover:bg-black/5 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares ---

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
      className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all whitespace-nowrap md:whitespace-normal
        ${
          active
            ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--black)] shadow-[var(--neo-shadow-hover)]"
            : "bg-transparent text-[var(--black-muted)] border-transparent hover:border-[var(--black)] hover:bg-white"
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
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-[var(--black-muted)] uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-white border-2 border-[var(--black)] rounded-md px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-[var(--neo-shadow-hover)] ${
          disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
        }`}
      />
      {helperText && (
        <span className="text-[10px] font-bold text-[var(--black-light)] mt-1">
          {helperText}
        </span>
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
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-[var(--black)] bg-white shadow-[var(--neo-shadow-hover)] transition-colors ${
        disabled ? "opacity-50 bg-gray-50" : "hover:bg-black/5"
      }`}
    >
      <div>
        <h4 className="font-black text-sm text-[var(--primary)] uppercase tracking-tight">
          {title}
        </h4>
        <p className="text-[10px] font-bold text-[var(--black-muted)] mt-1">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-[var(--black)] transition-colors duration-200 ease-in-out outline-none ${
          checked ? "bg-emerald-400" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none absolute top-0.5 inline-block h-5 w-5 transform rounded-full bg-white border-2 border-[var(--black)] transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-[var(--primary)] text-[var(--secondary)] px-6 py-3 rounded-md border-2 border-[var(--black)] text-xs font-black uppercase tracking-widest shadow-[var(--neo-shadow)] hover:shadow-[var(--neo-shadow-hover)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
