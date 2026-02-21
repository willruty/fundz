import { useNavigate } from "react-router-dom";
import { Beer, ShieldCheck, Gamepad2, Plane } from "lucide-react";

function RealLifeCard({
  icon,
  title,
  desc,
  highlight,
}: {
  icon: any;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-10 rounded-[40px] border transition-all ${highlight ? "bg-white shadow-2xl border-white scale-105 z-10" : "bg-transparent border-black/5 hover:bg-white/50"}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${highlight ? "bg-[#08233E] text-[#FFD100]" : "bg-white shadow-sm text-[#08233E]"}`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
        {title}
      </h3>
      <p className="opacity-60 text-sm font-bold leading-relaxed">{desc}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-manrope text-[#08233E]">
      {/* 1. NAVBAR COM CTA PRIORITÁRIO */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-lg bg-white/20 border border-white/20 p-4 rounded-full shadow-sm">
          <div className="flex items-center">
            <img
              src="/yellow-logo.png"
              alt="Logo Fundz"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Fiel à imagem com Polígono Azul) */}
      <section className="relative h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          {/* Agora o Azul é o polígono à esquerda */}
          <div
            className="absolute inset-0 bg-primary"
            style={{ clipPath: "polygon(0 0, 100% 0, 40% 100%, 0% 100%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full grid lg:grid-cols-2 px-8 items-center">
          <div className="space-y-6 text-white">
            <img
              src="/yellow-logo.png"
              alt="Logo Fundz"
              className="h-24 w-auto object-contain"
            />
            <h2 className="text-6xl md:text-8xl font-extrabold leading-[0.9] tracking-tighter">
              Seu dinheiro.
              <br />
              Seu rolê.
              <br />
              <span className="text-secondary">Seu controle.</span>
            </h2>
            <p className="text-xl text-white/80 max-w-md font-medium">
              A conta que entende que você tem um intercâmbio pra planejar, mas
              não quer abrir mão da cerveja de sexta.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#FFD100] text-[#08233E] px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-tight"
            >
              PARTIU ORGANIZAR
            </button>
          </div>

          {/* Mockup flutuante estilo Glassmorphism */}
          <div className="relative hidden lg:flex justify-end items-center h-full">
            <div className="relative w-[320px] h-[580px] bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[10px] border-black overflow-hidden translate-x-10">
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-[#FFD100] rounded-full" />
                  <div className="w-12 h-2 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold opacity-30 uppercase">
                    Saldo disponível
                  </p>
                  <div className="text-4xl font-black text-[#08233E]">
                    R$ 1.250,00
                  </div>
                </div>
                <div className="pt-4 space-y-4">
                  <div className="h-14 bg-gray-50 rounded-2xl flex items-center px-4 justify-between border border-gray-100">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 bg-secondary/20 rounded-xl flex items-center justify-center text-lg">
                        🍺
                      </div>
                      <div className="w-20 h-2 bg-gray-300 rounded" />
                    </div>
                    <div className="w-12 h-2 bg-red-400 rounded" />
                  </div>
                  <div className="h-14 bg-gray-50 rounded-2xl flex items-center px-4 justify-between border border-gray-100">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-lg">
                        🚗
                      </div>
                      <div className="w-20 h-2 bg-gray-300 rounded" />
                    </div>
                    <div className="w-12 h-2 bg-red-400 rounded" />
                  </div>
                </div>
              </div>
            </div>
            {/* Camada de vidro atrás */}
            <div className="absolute translate-x-[-20%] w-[350px] h-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] -z-10 shadow-2xl" />
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO DE TEXTO DIRETO (Sem vibe IA) */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
            DINHEIRO NÃO É SOBRE PLANILHA CHATA. <br />
            <span className="text-gray-300">
              É SOBRE PODER DIZER SIM PRO ROLÊ.
            </span>
          </h3>
          <p className="text-xl font-medium opacity-60 max-w-2xl leading-relaxed">
            A gente sabe que ninguém quer ficar horas anotando gasto por gasto.
            O Fundz automatiza a parte chata pra você focar no que importa:
            bater a meta do intercâmbio ou dar entrada no seu primeiro carro.
          </p>
        </div>
      </section>

      {/* 4. CARDS DE VIDA REAL */}
      <section className="py-24 px-8 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <RealLifeCard
            icon={<Beer size={28} />}
            title="Cota da Cerveja"
            desc="Separou R$ 100 pro fim de semana? A gente avisa quando você estiver chegando no limite pra não precisar pedir PIX pra mãe."
          />
          <RealLifeCard
            icon={<Plane size={28} />}
            title="Eurotrip 2026"
            desc="Planejando a Tomorrowland na Bélgica? Calculamos quanto você precisa guardar hoje pra estar lá em julho de 2026."
            highlight
          />
          <RealLifeCard
            icon={<Gamepad2 size={28} />}
            title="Setup de Respeito"
            desc="Quer trocar o notebook pra jogar ou trampar? Organize suas assinaturas e veja o que dá pra cortar pra acelerar o processo."
          />
        </div>
      </section>

      {/* 5. SEÇÃO DE ASSINATURAS (Focado no seu projeto) */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tighter">
              CADÊ OS R$ 40 QUE ESTAVAM AQUI?
            </h2>
            <p className="text-lg opacity-70">
              Sabe aquela assinatura do streaming que você nem usa mais? Ou
              aquele teste grátis que virou cobrança no cartão? O Fundz lista
              tudo pra você cancelar em segundos.
            </p>
            <div className="pt-4 flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  📉
                </div>
                <span className="font-bold">
                  Total em assinaturas: R$ 189,90/mês
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#08233E] p-10 rounded-[48px] shadow-2xl rotate-2">
            <h4 className="text-[#FFD100] font-black text-2xl mb-6">
              FUNDZ ANALYTICS
            </h4>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 bg-white/10 rounded-full w-full overflow-hidden"
                >
                  <div
                    className="bg-[#FFD100] h-full"
                    style={{ width: `${Math.random() * 80}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEGURANÇA SEM ENROLAÇÃO */}
      <section className="py-24 px-8 border-y border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block p-4 bg-[#08233E] text-[#FFD100] rounded-3xl">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Seu dinheiro tá seguro. Ponto.
          </h2>
          <p className="font-medium opacity-60">
            Usamos criptografia de ponta e não vendemos seus dados pra ninguém.
            Nossa missão é só fazer você parar de passar vergonha com cartão
            recusado.
          </p>
        </div>
      </section>

      {/* 7. CTA FINAL IMPACTANTE */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto bg-[#08233E] rounded-[60px] p-16 text-center text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(8,35,62,0.4)]">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFD100] blur-[150px] opacity-10" />
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none uppercase">
            VAI FICAR SÓ <br /> OLHANDO O SALDO?
          </h2>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#FFD100] text-[#08233E] px-16 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-xl"
          >
            CRIAR MINHA CONTA AGORA
          </button>
        </div>
      </section>

      {/* 8. FOOTER LIMPO */}
      <footer className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-2 text-center md:text-left">
            <p className="font-black text-3xl tracking-tighter">Fundz</p>
            <p className="text-sm opacity-40 font-bold uppercase tracking-widest">
              Dinheiro no bolso, pé no rolê.
            </p>
          </div>
          <p className="text-xs opacity-30 font-bold">
            &copy; 2026 HR Labs. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
