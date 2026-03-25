import { useNavigate } from "react-router-dom";
import {
  Beer,
  Plane,
  Briefcase,
  ArrowRight,
  Target,
  Lock,
  ShieldAlert,
  KeyRound,
  BarChart3,
  CreditCard,
  TrendingUp,
  ArrowDownRight,
} from "lucide-react";

// Componente de Card Neo-Brutalista
function RealLifeCard({
  icon,
  title,
  desc,
  highlight,
  badge,
}: {
  icon: any;
  title: string;
  desc: string;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative p-8 rounded-2xl border-4 border-[#08233E] transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(8,35,62,1)] ${
        highlight
          ? "bg-[#FFD100] shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] z-10"
          : "bg-white shadow-[8px_8px_0px_0px_rgba(8,35,62,1)]"
      }`}
    >
      {badge && (
        <span className="absolute -top-4 -right-4 bg-[#08233E] text-[#FFD100] px-4 py-1.5 font-black text-xs uppercase tracking-widest border-2 border-[#08233E] rounded-md rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          {badge}
        </span>
      )}
      <div
        className={`w-16 h-16 rounded-xl border-4 border-[#08233E] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] ${
          highlight ? "bg-white text-[#08233E]" : "bg-[#FFD100] text-[#08233E]"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-[#08233E]">
        {title}
      </h3>
      <p className="text-[#08233E] font-bold leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-manrope text-[#08233E] overflow-x-hidden">
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-8 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white border-4 border-[#08233E] p-3 px-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(8,35,62,1)] pointer-events-auto transition-transform hover:-translate-y-1">
          <div className="flex items-center">
            <img
              src="/blue-logo.png"
              alt="Logo"
              className="h-8 md:h-10 w-auto object-contain cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:block bg-transparent text-[#08233E] px-6 py-2.5 rounded-lg font-black text-sm uppercase tracking-widest border-2 border-transparent hover:border-[#08233E] transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#08233E] text-[#FFD100] px-6 py-2.5 rounded-lg font-black text-sm uppercase tracking-widest border-2 border-[#08233E] shadow-[4px_4px_0px_0px_rgba(255,209,0,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION COMPLEXA */}
      <section className="relative min-h-[95vh] pt-32 pb-20 px-4 sm:px-8 flex items-center bg-[#08233E] overflow-hidden">
        {/* Fundo abstrato brutalista */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD100] border-4 border-[#08233E] opacity-20" />
        <div className="absolute bottom-10 right-[40%] w-64 h-16 bg-emerald-400 rotate-45 border-4 border-[#08233E] opacity-20" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-white rounded-full border-4 border-[#08233E] opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Textos */}
          <div className="space-y-8 text-white z-20">
            <div className="inline-block bg-[#FFD100] text-[#08233E] font-black uppercase tracking-widest text-xs px-4 py-2 border-4 border-[#08233E] rounded-md shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rotate-[-2deg]">
              Gestão financeira sem frescura
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase">
              Seu dinheiro. <br />
              Seu rolê. <br />
              <span className="text-[#FFD100] underline decoration-8 underline-offset-8">
                Seu controle.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-lg font-bold">
              A conta que entende que você tem metas sérias pra bater, mas não
              quer abrir mão da cerveja de sexta com a galera.
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="bg-[#FFD100] text-[#08233E] px-8 sm:px-12 py-5 rounded-xl border-4 border-[#08233E] font-black text-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-[8px] hover:translate-x-[8px] transition-all uppercase tracking-tighter flex items-center gap-4 w-fit"
            >
              Partiu Organizar <ArrowRight strokeWidth={3} />
            </button>
          </div>

          {/* Colagem de Mockups Brutalistas */}
          <div className="relative hidden lg:block h-[600px] w-full">
            {/* Card Principal: Saldo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-3xl border-4 border-[#08233E] shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] p-6 z-20 hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-6 border-b-4 border-[#08233E] pb-4 border-dashed">
                <img src="/blue-logo.png" alt="Logo" className="h-6" />
                <div className="px-3 py-1 bg-[#08233E] text-white text-[10px] font-black uppercase rounded-md">
                  Março 2026
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Saldo disponível
              </p>
              <div className="text-5xl font-black text-[#08233E] tracking-tighter mb-6">
                R$ 1.850<span className="text-2xl text-gray-400">,00</span>
              </div>
              <div className="space-y-3">
                <div className="bg-emerald-100 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-xs uppercase flex items-center gap-2">
                    <span className="text-lg">💰</span> Bolsa Estágio
                  </span>
                  <span className="font-black text-emerald-600 text-sm">
                    + R$ 1300
                  </span>
                </div>
                <div className="bg-red-100 border-2 border-[#08233E] rounded-xl p-3 flex justify-between items-center">
                  <span className="font-black text-xs uppercase flex items-center gap-2">
                    <span className="text-lg">📄</span> DAS MEI
                  </span>
                  <span className="font-black text-red-600 text-sm">
                    - R$ 75
                  </span>
                </div>
              </div>
            </div>

            {/* Card Secundário Flutuante 1: Meta */}
            <div className="absolute top-[10%] right-[5%] w-[240px] bg-[#FFD100] rounded-2xl border-4 border-[#08233E] shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-5 z-30 rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white p-2 rounded-lg border-2 border-[#08233E]">
                  <Plane size={20} className="text-[#08233E]" />
                </div>
                <h4 className="font-black text-sm uppercase leading-tight text-[#08233E]">
                  Eurotrip
                  <br />
                  2026
                </h4>
              </div>
              <div className="w-full h-3 bg-white border-2 border-[#08233E] rounded-full overflow-hidden mb-2">
                <div className="w-[45%] h-full bg-emerald-400 border-r-2 border-[#08233E]"></div>
              </div>
              <p className="text-[10px] font-black uppercase text-[#08233E] text-right">
                45% Concluído
              </p>
            </div>

            {/* Card Secundário Flutuante 2: Gráfico de Barras */}
            <div className="absolute bottom-[15%] left-[0%] w-[200px] bg-white rounded-2xl border-4 border-[#08233E] shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] p-4 z-10 -rotate-6 hover:rotate-0 transition-transform duration-300">
              <h4 className="font-black text-[10px] uppercase text-gray-500 mb-4 tracking-widest">
                Gastos / Mês
              </h4>
              <div className="flex items-end justify-between h-20 gap-2 border-b-2 border-[#08233E] pb-1 border-dashed">
                <div className="w-full bg-[#08233E] h-[80%] border-2 border-[#08233E] rounded-t-md"></div>
                <div className="w-full bg-[#08233E] h-[60%] border-2 border-[#08233E] rounded-t-md"></div>
                <div className="w-full bg-emerald-400 h-[30%] border-2 border-[#08233E] rounded-t-md shadow-[0px_-2px_0px_0px_rgba(0,0,0,1)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAIXA ROTATIVA (MARQUEE) */}
      <div className="w-full bg-[#FFD100] border-y-4 border-[#08233E] py-4 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 items-center text-[#08233E] font-black text-2xl uppercase tracking-widest">
          <span>• CHEGA DE PLANILHA CHATA</span>
          <span>• CONTROLE SEU DINHEIRO</span>
          <span>• FOQUE NO ROLÊ</span>
          <span>• BATA SUAS METAS</span>
          <span>• CHEGA DE PLANILHA CHATA</span>
          <span>• CONTROLE SEU DINHEIRO</span>
          <span>• FOQUE NO ROLÊ</span>
          <span>• BATA SUAS METAS</span>
        </div>
      </div>

      {/* 4. CARDS DE VIDA REAL */}
      <section className="py-24 px-4 sm:px-8 bg-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,35,62,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(8,35,62,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#08233E]">
              Feito para o{" "}
              <span className="text-white bg-[#08233E] px-2 rounded-lg border-4 border-[#FFD100]">
                mundo real
              </span>
            </h2>
            <p className="text-xl font-bold text-gray-600">
              A gente não liga se você investe na bolsa ou compra skin no jogo.
              O Fundz organiza a sua vida do jeito que ela é hoje.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RealLifeCard
              icon={<Plane size={32} strokeWidth={2.5} />}
              title="Eurotrip 2026"
              desc="Planejando a Tomorrowland? Descubra exatamente quanto dos seus R$ 1300 você precisa guardar por mês para chegar aos €3.912 até lá."
              highlight
              badge="Meta"
            />
            <RealLifeCard
              icon={<Briefcase size={32} strokeWidth={2.5} />}
              title="Vida de MEI"
              desc="Abriu seu CNPJ de prestação de serviços? O Fundz te lembra de pagar a DAS em dia para você não se enrolar com a Receita."
            />
            <RealLifeCard
              icon={<Beer size={32} strokeWidth={2.5} />}
              title="Cota do FDS"
              desc="Separou R$ 150 pro fim de semana? A gente manda um alerta quando você estiver chegando no limite pra não precisar pedir PIX."
            />
          </div>
        </div>
      </section>

      {/* 5. ANÁLISE DE METAS (Nova Seção de Gráficos) */}
      <section className="py-24 px-4 sm:px-8 bg-[#08233E] text-white border-y-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Gráfico Brutalista Feito com Divs */}
            <div className="bg-white p-8 rounded-3xl border-4 border-[#FFD100] shadow-[16px_16px_0px_0px_rgba(255,209,0,1)] text-[#08233E]">
              <div className="flex justify-between items-center mb-8 border-b-4 border-[#08233E] pb-4">
                <h3 className="font-black uppercase text-xl flex items-center gap-3">
                  <BarChart3 strokeWidth={3} /> Projeção da Meta
                </h3>
                <span className="bg-emerald-400 text-white px-3 py-1 font-black text-[10px] uppercase border-2 border-[#08233E] rounded-md shadow-[2px_2px_0px_0px_rgba(8,35,62,1)]">
                  No Prazo
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2">
                    <span>Guardado (R$ 4.500)</span>
                    <span className="text-emerald-500">45%</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 border-2 border-[#08233E] rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-emerald-400 border-r-2 border-[#08233E]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black uppercase mb-2">
                    <span>Rendimento (R$ 350)</span>
                    <span className="text-[#FFD100]">Acelerando</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 border-2 border-[#08233E] rounded-full overflow-hidden">
                    <div className="w-[15%] h-full bg-[#FFD100] border-r-2 border-[#08233E]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-[#08233E] border-dashed flex items-center justify-between">
                <span className="font-black uppercase text-xs text-gray-500">
                  Faltam: 15 meses
                </span>
                <span className="font-black uppercase text-lg">
                  Meta: R$ 10.000
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-[#FFD100] leading-none">
              Transforme sonhos em matemática simples.
            </h2>
            <p className="text-xl font-bold text-white/90">
              Não importa se é um PC Gamer novo ou mochilão pela Europa. O Fundz
              analisa sua renda e diz exatamente quanto você precisa guardar por
              mês para chegar lá na data que você escolher.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3 font-black text-white text-lg uppercase">
                <Target
                  size={24}
                  className="text-[#08233E] bg-[#FFD100] rounded-sm p-1"
                />{" "}
                Cálculo automático de prazos
              </li>
              <li className="flex items-center gap-3 font-black text-white text-lg uppercase">
                <TrendingUp
                  size={24}
                  className="text-[#08233E] bg-[#FFD100] rounded-sm p-1"
                />{" "}
                Previsão de rentabilidade
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TRANSAÇÕES E PARCELAMENTOS (Nova Seção de Tabela Brutalista) */}
      <section className="py-24 px-4 sm:px-8 bg-white border-b-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#08233E]">
              Saiba para onde <br /> seu dinheiro foge.
            </h2>
            <p className="text-xl font-bold text-gray-600">
              Diga adeus àquela surpresa na fatura. Monitore suas assinaturas
              que você nem usa mais e os parcelamentos que parecem não ter fim.
            </p>
          </div>

          {/* Tabela Mockada Estilo Dashboard */}
          <div className="w-full max-w-4xl bg-gray-50 border-4 border-[#08233E] rounded-3xl shadow-[16px_16px_0px_0px_rgba(8,35,62,1)] overflow-hidden">
            <div className="bg-[#08233E] text-white p-6 border-b-4 border-[#08233E] flex items-center gap-4">
              <CreditCard size={32} className="text-[#FFD100]" />
              <h3 className="font-black text-2xl uppercase tracking-widest">
                Controle de Fatura
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Item Assinatura */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border-2 border-[#08233E] rounded-xl shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#08233E] text-[#FFD100] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-[#08233E]">
                      Assinatura
                    </span>
                  </div>
                  <p className="font-black text-lg uppercase text-[#08233E]">
                    Netflix Premium
                  </p>
                </div>
                <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                  <span className="font-black text-red-500 text-xl flex items-center gap-1">
                    <ArrowDownRight size={20} /> R$ 59,90
                  </span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Cobrança dia 15
                  </span>
                </div>
              </div>

              {/* Item Parcelamento */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#FFD100] border-2 border-[#08233E] rounded-xl shadow-[4px_4px_0px_0px_rgba(8,35,62,1)] gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white text-[#08233E] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border-2 border-[#08233E]">
                      Parcelamento
                    </span>
                    <span className="text-[10px] font-black text-[#08233E] uppercase bg-white/50 px-2 py-0.5 rounded border border-[#08233E]">
                      3/12
                    </span>
                  </div>
                  <p className="font-black text-lg uppercase text-[#08233E]">
                    Notebook Dell
                  </p>
                </div>
                <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                  <span className="font-black text-[#08233E] text-xl flex items-center gap-1">
                    <ArrowDownRight size={20} /> R$ 320,00
                  </span>
                  <span className="text-[10px] font-black text-[#08233E] uppercase tracking-widest">
                    Faltam 9 parcelas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEGURANÇA (Nova Seção Blindada) */}
      <section className="py-24 px-4 sm:px-8 bg-[#FFD100] border-b-4 border-[#08233E] relative overflow-hidden">
        {/* Marca d'água de cadeado */}
        <Lock
          size={400}
          className="absolute -right-20 -bottom-20 text-[#08233E] opacity-5 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#08233E] leading-[0.9]">
              Fortaleza <br /> Digital.
            </h2>
            <p className="text-xl font-bold text-[#08233E]/80 max-w-lg">
              Nós não vendemos seus dados. Nós não olhamos suas senhas
              bancárias. Sua privacidade é garantida por criptografia de ponta a
              ponta.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white border-2 border-[#08233E] px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                <ShieldAlert size={20} className="text-emerald-500" />
                <span className="font-black text-[10px] uppercase tracking-widest text-[#08233E]">
                  LGPD Compliant
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border-2 border-[#08233E] px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(8,35,62,1)]">
                <KeyRound size={20} className="text-[#FFD100] fill-[#08233E]" />
                <span className="font-black text-[10px] uppercase tracking-widest text-[#08233E]">
                  Criptografia AES-256
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-center">
            <div className="bg-[#08233E] p-10 rounded-[40px] border-4 border-[#08233E] shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center animate-pulse">
              <Lock size={120} className="text-[#FFD100]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL IMPACTANTE */}
      <section className="py-32 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-[#08233E] border-4 border-[#08233E] rounded-3xl p-12 md:p-20 text-center text-white relative shadow-[16px_16px_0px_0px_rgba(255,209,0,1)]">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none uppercase">
            VAI FICAR SÓ <br /> OLHANDO O SALDO?
          </h2>
          <p className="text-xl font-bold mb-10 max-w-2xl mx-auto text-white/80">
            Junte-se a galera que já parou de passar raiva no fim do mês e
            assumiu o controle do próprio dinheiro.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#FFD100] text-[#08233E] px-8 sm:px-16 py-6 rounded-xl border-4 border-[#08233E] font-black text-xl hover:bg-white hover:text-[#08233E] shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-[8px] hover:translate-x-[8px] transition-all uppercase tracking-widest inline-flex"
          >
            Criar Conta Grátis
          </button>
        </div>
      </section>

      {/* 9. FOOTER BRUTALISTA */}
      <footer className="py-12 px-8 bg-white border-t-4 border-[#08233E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img src="/blue-logo.png" alt="Logo" className="h-8" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm font-bold uppercase tracking-widest text-[#08233E] mb-2">
              Dinheiro no bolso, pé no rolê.
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              &copy; 2026 HR Labs. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS para a animação do Letreiro */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
          min-width: 200%;
        }
      `,
        }}
      />
    </div>
  );
}
