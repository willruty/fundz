/**
 * seed.ts — Cria o usuário visitante e dados de demonstração no Supabase.
 *
 * Uso:
 *   npx ts-node -r tsconfig-paths/register prisma/seed.ts
 *   — ou via script npm: npm run db:seed
 *
 * Credenciais do visitante:
 *   email:  visitante@fundz.app
 *   senha:  Visitante@123
 *
 * Idempotente: pode rodar múltiplas vezes sem duplicar dados.
 */

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Clients (inicializados dentro de main para garantir que dotenv já rodou) ─

const prisma = new PrismaClient();
let supabaseAdmin: SupabaseClient;

// ─── Constantes ───────────────────────────────────────────────────────────────

const VISITANTE_EMAIL = 'visitante@fundz.app';
const VISITANTE_PASSWORD = 'Visitante@123';
const VISITANTE_NAME = 'Visitante';

// Datas relativas ao momento da seed (mantém os dados "frescos")
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysAhead(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getOrCreateVisitante(): Promise<string> {
  // Tenta buscar pelo email na lista de usuários do Auth
  const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
  const existing = listData?.users.find((u) => u.email === VISITANTE_EMAIL);

  if (existing) {
    console.log(`✓ Usuário visitante já existe: ${existing.id}`);
    return existing.id;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: VISITANTE_EMAIL,
    password: VISITANTE_PASSWORD,
    email_confirm: true,
    user_metadata: { name: VISITANTE_NAME },
  });

  if (error || !data.user) {
    throw new Error(`Erro ao criar visitante: ${error?.message}`);
  }

  console.log(`✓ Usuário visitante criado: ${data.user.id}`);
  return data.user.id;
}

// ─── Seed principal ───────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...\n');

  supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // 1. Auth user
  const userId = await getOrCreateVisitante();

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: userId },
    update: { name: VISITANTE_NAME, email: VISITANTE_EMAIL },
    create: { id: userId, email: VISITANTE_EMAIL, name: VISITANTE_NAME },
  });
  console.log('✓ Profile criado/atualizado');

  // 3. Categorias
  const categorias = [
    { name: 'Salário', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investimentos', type: 'income' },
    { name: 'Alimentação', type: 'expense' },
    { name: 'Transporte', type: 'expense' },
    { name: 'Moradia', type: 'expense' },
    { name: 'Saúde', type: 'expense' },
    { name: 'Lazer', type: 'expense' },
    { name: 'Educação', type: 'expense' },
    { name: 'Roupas', type: 'expense' },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categorias) {
    const existing = await prisma.category.findFirst({
      where: { userId, name: cat.name },
    });
    const record = existing
      ? existing
      : await prisma.category.create({ data: { userId, ...cat } });
    catMap[cat.name] = record.id;
  }
  console.log(`✓ ${categorias.length} categorias criadas/verificadas`);

  // 4. Contas
  type AccountSeed = { name: string; type: string; balance: number };
  const contasSeed: AccountSeed[] = [
    { name: 'Conta Corrente', type: 'checking', balance: 4750.0 },
    { name: 'Poupança', type: 'savings', balance: 12300.5 },
    { name: 'Cartão de Crédito', type: 'credit_card', balance: -890.0 },
  ];

  const contaMap: Record<string, string> = {};
  for (const conta of contasSeed) {
    const existing = await prisma.account.findFirst({
      where: { userId, name: conta.name },
    });
    const record = existing
      ? existing
      : await prisma.account.create({ data: { userId, ...conta } });
    contaMap[conta.name] = record.id;
  }
  console.log(`✓ ${contasSeed.length} contas criadas/verificadas`);

  const contaCorrenteId = contaMap['Conta Corrente'];
  const poupancaId = contaMap['Poupança'];
  const cartaoId = contaMap['Cartão de Crédito'];

  // 5. Transações (últimos 60 dias — mix realista de receitas e despesas)
  type TxSeed = {
    accountId: string;
    categoryId: string;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    occurredAt: Date;
  };

  const transacoesSeed: TxSeed[] = [
    // Receitas
    { accountId: contaCorrenteId, categoryId: catMap['Salário'], amount: 6500, type: 'income', description: 'Salário março', occurredAt: daysAgo(42) },
    { accountId: contaCorrenteId, categoryId: catMap['Freelance'], amount: 1200, type: 'income', description: 'Projeto web - cliente A', occurredAt: daysAgo(38) },
    { accountId: contaCorrenteId, categoryId: catMap['Salário'], amount: 6500, type: 'income', description: 'Salário abril', occurredAt: daysAgo(12) },
    { accountId: poupancaId,      categoryId: catMap['Investimentos'], amount: 450, type: 'income', description: 'Rendimento poupança', occurredAt: daysAgo(10) },
    { accountId: contaCorrenteId, categoryId: catMap['Freelance'], amount: 800, type: 'income', description: 'Consultoria - cliente B', occurredAt: daysAgo(5) },
    // Despesas — março
    { accountId: contaCorrenteId, categoryId: catMap['Moradia'], amount: 1800, type: 'expense', description: 'Aluguel março', occurredAt: daysAgo(45) },
    { accountId: cartaoId,        categoryId: catMap['Alimentação'], amount: 320, type: 'expense', description: 'Supermercado', occurredAt: daysAgo(44) },
    { accountId: cartaoId,        categoryId: catMap['Transporte'], amount: 180, type: 'expense', description: 'Combustível', occurredAt: daysAgo(40) },
    { accountId: cartaoId,        categoryId: catMap['Lazer'], amount: 95, type: 'expense', description: 'Cinema + jantar', occurredAt: daysAgo(37) },
    { accountId: contaCorrenteId, categoryId: catMap['Saúde'], amount: 250, type: 'expense', description: 'Consulta médica', occurredAt: daysAgo(35) },
    { accountId: cartaoId,        categoryId: catMap['Alimentação'], amount: 145, type: 'expense', description: 'Restaurante', occurredAt: daysAgo(32) },
    { accountId: contaCorrenteId, categoryId: catMap['Educação'], amount: 380, type: 'expense', description: 'Curso online', occurredAt: daysAgo(30) },
    { accountId: cartaoId,        categoryId: catMap['Roupas'], amount: 220, type: 'expense', description: 'Loja de roupas', occurredAt: daysAgo(28) },
    // Despesas — abril
    { accountId: contaCorrenteId, categoryId: catMap['Moradia'], amount: 1800, type: 'expense', description: 'Aluguel abril', occurredAt: daysAgo(15) },
    { accountId: cartaoId,        categoryId: catMap['Alimentação'], amount: 290, type: 'expense', description: 'Supermercado', occurredAt: daysAgo(14) },
    { accountId: cartaoId,        categoryId: catMap['Transporte'], amount: 75, type: 'expense', description: 'Uber', occurredAt: daysAgo(11) },
    { accountId: cartaoId,        categoryId: catMap['Alimentação'], amount: 68, type: 'expense', description: 'iFood', occurredAt: daysAgo(9) },
    { accountId: contaCorrenteId, categoryId: catMap['Saúde'], amount: 120, type: 'expense', description: 'Farmácia', occurredAt: daysAgo(7) },
    { accountId: cartaoId,        categoryId: catMap['Lazer'], amount: 55, type: 'expense', description: 'Streaming extra', occurredAt: daysAgo(4) },
    { accountId: cartaoId,        categoryId: catMap['Alimentação'], amount: 42, type: 'expense', description: 'Padaria', occurredAt: daysAgo(2) },
  ];

  let txCriadas = 0;
  for (const tx of transacoesSeed) {
    const exists = await prisma.transaction.findFirst({
      where: {
        userId,
        description: tx.description,
        occurredAt: tx.occurredAt,
      },
    });
    if (!exists) {
      await prisma.transaction.create({ data: { userId, ...tx } });
      txCriadas++;
    }
  }
  console.log(`✓ ${txCriadas} transações criadas (${transacoesSeed.length - txCriadas} já existiam)`);

  // 6. Metas
  type GoalSeed = { name: string; targetAmount: number; currentAmount: number; dueDate: Date };
  const metasSeed: GoalSeed[] = [
    {
      name: 'Reserva de Emergência',
      targetAmount: 20000,
      currentAmount: 12300.5,
      dueDate: daysAhead(180),
    },
    {
      name: 'Viagem — Europa',
      targetAmount: 15000,
      currentAmount: 3200,
      dueDate: daysAhead(365),
    },
    {
      name: 'Notebook novo',
      targetAmount: 5500,
      currentAmount: 1800,
      dueDate: daysAhead(90),
    },
  ];

  for (const meta of metasSeed) {
    const exists = await prisma.goal.findFirst({ where: { userId, name: meta.name } });
    if (!exists) await prisma.goal.create({ data: { userId, ...meta } });
  }
  console.log(`✓ ${metasSeed.length} metas criadas/verificadas`);

  // 7. Assinaturas
  type SubSeed = {
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly';
    accountId: string;
    categoryId: string;
    nextBillingDate: Date;
    active: boolean;
  };

  const assinaturasSeed: SubSeed[] = [
    {
      name: 'Netflix',
      amount: 39.9,
      billingCycle: 'monthly',
      accountId: cartaoId,
      categoryId: catMap['Lazer'],
      nextBillingDate: daysAhead(8),
      active: true,
    },
    {
      name: 'Spotify',
      amount: 21.9,
      billingCycle: 'monthly',
      accountId: cartaoId,
      categoryId: catMap['Lazer'],
      nextBillingDate: daysAhead(15),
      active: true,
    },
    {
      name: 'Academia',
      amount: 89.9,
      billingCycle: 'monthly',
      accountId: contaCorrenteId,
      categoryId: catMap['Saúde'],
      nextBillingDate: daysAhead(5),
      active: true,
    },
    {
      name: 'Adobe Creative Cloud',
      amount: 299.88,
      billingCycle: 'yearly',
      accountId: cartaoId,
      categoryId: catMap['Educação'],
      nextBillingDate: daysAhead(210),
      active: true,
    },
    {
      name: 'GitHub Pro',
      amount: 25.0,
      billingCycle: 'monthly',
      accountId: cartaoId,
      categoryId: catMap['Educação'],
      nextBillingDate: daysAhead(20),
      active: false,
    },
  ];

  for (const sub of assinaturasSeed) {
    const exists = await prisma.subscription.findFirst({ where: { userId, name: sub.name } });
    if (!exists) await prisma.subscription.create({ data: { userId, ...sub } });
  }
  console.log(`✓ ${assinaturasSeed.length} assinaturas criadas/verificadas`);

  console.log('\n✅ Seed concluída!');
  console.log('──────────────────────────────────────────');
  console.log(`   Email: ${VISITANTE_EMAIL}`);
  console.log(`   Senha: ${VISITANTE_PASSWORD}`);
  console.log('──────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Erro na seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
