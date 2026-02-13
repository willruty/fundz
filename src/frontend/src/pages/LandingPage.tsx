import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Beer,
    Car,
    Home,
    TrendingUp,
    Wallet,
    CreditCard
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Dados fictícios para os gráficos
const dataEvolution = [
    { name: 'Jan', saldo: 1200 },
    { name: 'Fev', saldo: 1500 },
    { name: 'Mar', saldo: 1100 },
    { name: 'Abr', saldo: 1800 },
    { name: 'Mai', saldo: 2400 },
    { name: 'Jun', saldo: 3200 },
];

const dataExpenses = [
    { name: 'Rolês', value: 400, color: '#FFD100' }, // Secondary
    { name: 'Carro/Uber', value: 300, color: '#1B365D' }, // Primary
    { name: 'Contas/Aluguel', value: 800, color: '#333333' },
    { name: 'Comida', value: 500, color: '#142a4a' },
];

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark font-manrope text-text-light overflow-x-hidden">
            {/* Background Decorativo Neon */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]" />
                <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            {/* Navbar Glass */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/40 dark:bg-black/20 border border-white/20 p-4 rounded-main shadow-lg">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black text-primary tracking-tighter">Fundz</h1>
                    </div>
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-primary text-white px-6 py-2 rounded-button font-bold text-sm hover:bg-primary-hover transition-all flex items-center gap-2 group"
                    >
                        Entrar
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1 mb-4 text-xs font-bold bg-secondary/30 text-primary border border-secondary/50 rounded-full">
                            FINANÇAS PARA A VIDA REAL
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-primary mb-6 leading-[1.1]">
                            Pague o aluguel sem <br />
                            <span className="text-secondary drop-shadow-md">perder o rolê.</span>
                        </h2>
                        <p className="text-lg text-text-light/70 mb-8 max-w-lg">
                            Gerencie suas contas, manutenção do carro e gastos de festa em um só lugar. Feito para quem está começando agora.
                        </p>
                        <button
                            onClick={() => navigate('/auth')}
                            className="bg-primary text-white px-10 py-4 rounded-button font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Começar a economizar
                        </button>
                    </motion.div>

                    {/* Gráfico no Hero (Visual) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/40 backdrop-blur-xl border border-white/40 p-6 rounded-main shadow-2xl h-[350px]"
                    >
                        <p className="font-bold text-primary mb-4 flex items-center gap-2">
                            <TrendingUp size={20} /> Evolução do seu saldo
                        </p>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={dataEvolution}>
                                <defs>
                                    <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD100" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FFD100" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="saldo" stroke="#FFD100" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </section>

            {/* Seção de Features/Dores */}
            <section className="relative z-10 py-24 px-6 bg-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-primary">Tudo o que você precisa</h2>
                        <p className="text-text-light/60 mt-4">Organização de verdade para quem tem vida social.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureItem
                            icon={<Beer className="text-secondary" />}
                            title="Cota do Rolê"
                            desc="Defina quanto pode gastar no fim de semana sem comprometer a conta de luz."
                        />
                        <FeatureItem
                            icon={<Car className="text-secondary" />}
                            title="Reserva do Carro"
                            desc="Gasolina, IPVA e aquela manutenção surpresa que sempre aparece."
                        />
                        <FeatureItem
                            icon={<Home className="text-secondary" />}
                            title="Morando Só"
                            desc="Controle o aluguel e as compras do mês de forma simples e visual."
                        />
                    </div>
                </div>
            </section>

            {/* Seção Analítica (Gráfico de Pizza) */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="h-[400px] flex items-center justify-center bg-white/20 backdrop-blur-lg rounded-main border border-white/40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataExpenses}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataExpenses.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-xs font-bold text-primary/40 uppercase">Gasto Médio</span>
                            <span className="text-2xl font-black text-primary">R$ 2.000</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-primary mb-6">Pare de se perguntar pra onde foi o seu dinheiro.</h2>
                        <p className="text-lg text-text-light/70 mb-8">
                            Nossos gráficos mostram exatamente onde está o seu maior gargalo. É na balada ou é na revisão do motor? O Fundz te conta a verdade.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"><Wallet size={20} className="text-primary" /></div>
                                <p className="font-bold">Controle de entrada e saída simplificado</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"><CreditCard size={20} className="text-primary" /></div>
                                <p className="font-bold">Aviso de vencimento de boletos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Final */}
            <footer className="relative z-10 py-12 border-t border-primary/10 text-center">
                <p className="font-black text-primary text-xl mb-4">Fundz</p>
                <p className="text-sm text-text-light/50">&copy; 2026 Fundz - Dinheiro no bolso, pé no rolê.</p>
            </footer>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="p-8 bg-white/60 backdrop-blur-md rounded-main border border-white/60 shadow-sm"
        >
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                {icon}
            </div>
            <h3 className="text-xl font-black text-primary mb-3">{title}</h3>
            <p className="text-text-light/60 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}