<p align="center">
  <h1 align="center">FUNDZ</h1>
  <p align="center">Plataforma de gestao financeira pessoal para quem quer parar de ser emocional com dinheiro.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white" />
</p>

---

## Sobre

Fundz transforma dados financeiros em decisoes melhores atraves de visualizacao, controle e analise. Focado em jovens que querem enxergar seus numeros de forma clara.

**Funcionalidades:**

- Gerenciar contas e saldos
- Registrar e categorizar transacoes (receitas e despesas)
- Acompanhar metas financeiras
- Controlar assinaturas recorrentes e parcelamentos
- Dashboard com metricas: media diaria, distribuicao por categoria, previsao mensal
- Exportar dados para Excel

---

## Stack

| Camada       | Tecnologias                                                                |
| ------------ | -------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Motion, Lucide Icons |
| **Backend**  | NestJS 11, TypeScript, Prisma 6, Passport JWT                              |
| **Banco**    | Supabase (PostgreSQL) com RLS                                              |
| **Auth**     | Supabase Auth (JWT ES256/HS256)                                            |
| **Deploy**   | Vercel (monorepo)                                                          |

---

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/)
- Conta no [Supabase](https://supabase.com/) com projeto criado

---

## Instalacao

### 1. Clone o repositorio

```bash
git clone https://github.com/seu-usuario/fundz.git
cd fundz
```

### 2. Configure o backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
```

Preencha o `.env` com suas credenciais do Supabase:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_JWT_SECRET=seu-jwt-secret
```

### 3. Configure o frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

Preencha o `.env` do frontend:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:8000/fundz
```

### 4. Rode o projeto

Em terminais separados:

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev
# -> http://localhost:8000

# Terminal 2 - Frontend
cd frontend
npm run dev
# -> http://localhost:5173
```

---

## Estrutura do Projeto

```
fundz/
├── backend/                 # API REST (NestJS)
│   ├── prisma/              # Schema e migrations
│   └── src/
│       ├── accounts/        # CRUD contas
│       ├── auth/            # Guard + estrategia JWT
│       ├── categories/      # CRUD categorias
│       ├── dashboard/       # Dados agregados
│       ├── goals/           # CRUD metas
│       ├── health/          # Health check
│       ├── installments/    # CRUD parcelamentos
│       ├── subscriptions/   # CRUD assinaturas
│       ├── transactions/    # CRUD transacoes
│       ├── users/           # Auth (register/login)
│       ├── prisma/          # Modulo DB
│       ├── supabase/        # Cliente Supabase
│       └── common/          # Decorators, filters, DTOs
│
├── frontend/                # SPA (React + Vite)
│   └── src/
│       ├── pages/           # Paginas por rota
│       ├── components/      # Componentes UI + features
│       ├── service/         # API client + services
│       ├── types/           # Tipos TypeScript
│       └── utils/           # Supabase client
│
├── vercel.json              # Config deploy monorepo
└── package.json             # Scripts raiz
```

---

## API

Todas as rotas sao prefixadas com `/fundz`. Rotas protegidas exigem `Authorization: Bearer <token>`.

| Metodo | Rota                      | Descricao                  |
| ------ | ------------------------- | -------------------------- |
| `GET`  | `/health`                 | Health check               |
| `POST` | `/user/auth/register`     | Criar conta                |
| `POST` | `/user/auth/login`        | Login                      |
| `GET`  | `/user/auth/validate`     | Validar token              |
| `CRUD` | `/account`                | Contas                     |
| `GET`  | `/account/balance/:id`    | Saldo da conta             |
| `CRUD` | `/category`               | Categorias                 |
| `CRUD` | `/transaction`            | Transacoes                 |
| `GET`  | `/transaction/last-month` | Transacoes ultimos 30 dias |
| `CRUD` | `/goal`                   | Metas                      |
| `CRUD` | `/subscription`           | Assinaturas                |
| `CRUD` | `/installment`            | Parcelamentos              |
| `GET`  | `/dashboard/overview`     | Dashboard agregado         |

---

## Scripts

```bash
# Backend
cd backend
npm run start:dev      # Dev com hot reload
npm run build          # Build producao
npm run start:prod     # Rodar build
npm run lint           # Lint
npx prisma studio      # Visualizar banco

# Frontend
cd frontend
npm run dev            # Dev server
npm run build          # Build producao
npm run preview        # Preview do build
npm run lint           # Lint
```

---

## Deploy

O projeto esta configurado para deploy na **Vercel** como monorepo:

- Frontend em `/` (Vite)
- Backend em `/_/backend` (NestJS serverless)

Configure as variaveis de ambiente no dashboard da Vercel para ambos os projetos.

---

## Roadmap

- [x] CRUDs completos (contas, transacoes, categorias, metas, assinaturas, parcelamentos)
- [x] Dashboard com metricas financeiras
- [x] Autenticacao Supabase
- [x] Deploy Vercel
- [x] Card de Saúde Financeira na home (investimentos 'bom', gastos 'atenção', dividas 'baixo')
- [x] Pagina de perfil/configuracoes (deixar 100% funcional pelo menos a parte de perfil)
- [x] CRUD de investimentos
- [x] Separar em páginas diferentes os advisors (seleção e criação de advisor, chat com advisor)
- [x] Criar as tabelas que vão comportar o sistema de advisor
- [ ] Tirar os skeletons
- [ ] Melhorar a sidebar
- [ ] Colocar seleção de icone para advisor personalizado
- [ ] Em cada analise mostrar a opinião entre advisors, mostrar “conflito” entre agentes na mesma situação
  - tipo:
    - Vibe: “vai, experiência vale mais que dinheiro” | Vibe aprova ✅
    - Core: “não faz sentido dentro da tua realidade atual” | Core desaprova ❌
    - Flow: “vai, mas corta X e Y essa semana” | Flow sugere ajuste ⚖️
- [x] Fazer o histórico de chats cair de cima como um dropdown
- [x] Melhorar a página de seleção de advisor
- [x] Colocar efeitos em todos os componentes tirando o skeleton
- [ ] Landing page profissional
- [ ] Página de politica de privacidade
- [ ] Gateway de pagamento
- [ ] Integracao OpenFinance (Pluggy)

---

## Licenca

Projeto privado. Todos os direitos reservados.
