# FUNDZ

## Descrição

Projeto pessoal de gestão financeira focado em ajudar jovens em início de vida, carreira e organização financeira a visualizar e controlar seu dinheiro de forma clara.

O sistema permite acompanhar contas, registrar transações, categorizar gastos e visualizar métricas financeiras em dashboards analíticos.

Objetivo principal do projeto:  
Criar um sistema próprio de controle financeiro com dashboard analítico, permitindo visualizar contas, movimentações e indicadores financeiros de forma clara e simples.

---

## Status

Estado atual do projeto:  
MVP em desenvolvimento.

Última vez que trabalhei nele:  
04/03/2026

Situação atual:  
CRUDs principais já implementados (users, accounts, transactions, categories).

Iniciando criação de **endpoints agregados para páginas**, começando pelo endpoint de **Home/Overview**, responsável por retornar múltiplas métricas consolidadas para o dashboard inicial.

---

## Stack

### Frontend

- React
- TypeScript
- TailwindCSS
- Componentes UI customizados
- Recharts para gráficos
- Estrutura baseada em páginas

### Backend

- Go
- API REST
- Arquitetura baseada em services
- Controllers responsáveis pelas rotas HTTP
- DTOs para comunicação entre camadas

### Database

- Supabase (PostgreSQL)
- ORM: Gorm

### Infra / serviços

- Backend rodando localmente (ambiente de desenvolvimento)
- Postman para testes de endpoints
- Supabase para banco e gerenciamento inicial

---

## Arquitetura geral

Fluxo principal do sistema:

Usuário  
↓  
Frontend (React Dashboard)  
↓  
Backend API (Go)  
↓  
Database (Supabase/PostgreSQL)  
↓  
Resposta com dados financeiros

### Camadas principais

Frontend → responsável pela interface e visualização dos dados

Controller → recebe requisições HTTP e valida inputs

Service → contém regras de negócio e orquestra queries

DAO → acesso ao banco de dados

Database → armazenamento persistente

---

## Funcionalidades principais

- Dashboard financeiro com indicadores principais
- Gestão de contas financeiras
- Registro e visualização de transações
- Organização por categorias
- Visualização consolidada de saldo e gastos
- Controle de assinaturas recorrentes
- Definição de metas financeiras

---

## Fluxos principais

### Fluxo principal

Usuário acessa dashboard  
↓  
Frontend requisita endpoint de overview  
↓  
Backend agrega dados de contas e transações  
↓  
Banco retorna dados consolidados  
↓  
Frontend renderiza métricas e gráficos

### Fluxo secundário

Usuário registra uma nova transação  
↓  
Frontend envia requisição  
↓  
Backend valida dados e categoria  
↓  
Banco salva transação  
↓  
Frontend atualiza estado financeiro

---

## Estrutura do projeto

```
src
├── backend
│ ├── cmd
│ │ └── fundz
│ └── internal
│  ├── config
│  ├── controller
│  ├── database
│  ├── middleware
│  ├── model
│  │ ├── dao
│  │ ├── dto
│  │ └── entity
│  ├── router
│  ├── service
│  └── util
│
└── frontend
├── public
└── src
    ├── assets
    ├── components
    │ └── ui
    └── pages
        ├── Accounts.tsx
        ├── Auth.tsx
        ├── Categories.tsx
        ├── Configs.tsx
        ├── Expenses.tsx
        ├── Goals.tsx
        ├── Home.tsx
        ├── Investments.tsx
        ├── LandingPage.tsx
        ├── Profile.tsx
        └── Subscriptions.tsx
```

**backend/**  
API em Go contendo rotas, services e lógica de negócio.

**ENDPOINTS**

```
GET    /fundz/heath              --> fundz/internal/controller.GetHealth
POST   /fundz/user/auth/register --> fundz/internal/controller.Register
POST   /fundz/user/auth/login    --> fundz/internal/controller.Login
GET    /fundz/user/auth/validate --> fundz/internal/controller.ValidateToken
GET    /fundz/account/           --> fundz/internal/controller.GetAllAccounts
GET    /fundz/account/:id        --> fundz/internal/controller.GetAccountById
GET    /fundz/account/balance/:id --> fundz/internal/controller.GetCurrentBalance
POST   /fundz/account/           --> fundz/internal/controller.CreateAccount
PUT    /fundz/account/           --> fundz/internal/controller.UpdateAccountById
DELETE /fundz/account/:id        --> fundz/internal/controller.DeleteAccountById
GET    /fundz/transaction/       --> fundz/internal/controller.GetAllTransactions
GET    /fundz/transaction/last-month --> fundz/internal/controller.GetLastMonthTransactions
GET    /fundz/transaction/:id    --> fundz/internal/controller.GetTransactionById
POST   /fundz/transaction/       --> fundz/internal/controller.CreateTransaction
PUT    /fundz/transaction/       --> fundz/internal/controller.UpdateTransactionById
DELETE /fundz/transaction/:id    --> fundz/internal/controller.DeleteTransactionById
GET    /fundz/category/          --> fundz/internal/controller.GetAllCategories
GET    /fundz/category/:id       --> fundz/internal/controller.GetCategoryById
POST   /fundz/category/          --> fundz/internal/controller.CreateCategory
PUT    /fundz/category/          --> fundz/internal/controller.UpdateCategoryById
DELETE /fundz/category/:id       --> fundz/internal/controller.DeleteCategoryById
GET    /fundz/goal/              --> fundz/internal/controller.GetAllGoals
GET    /fundz/goal/next          --> fundz/internal/controller.GetNextGoal
GET    /fundz/goal/:id           --> fundz/internal/controller.GetGoalById
POST   /fundz/goal/              --> fundz/internal/controller.CreateGoal
PUT    /fundz/goal/              --> fundz/internal/controller.UpdateGoalById
DELETE /fundz/goal/:id           --> fundz/internal/controller.DeleteGoalById
GET    /fundz/subscription/      --> fundz/internal/controller.GetAllSubscriptions
GET    /fundz/subscription/:id   --> fundz/internal/controller.GetSubscriptionById
POST   /fundz/subscription/      --> fundz/internal/controller.CreateSubscription
PUT    /fundz/subscription/      --> fundz/internal/controller.UpdateSubscriptionById
DELETE /fundz/subscription/:id   --> fundz/internal/controller.DeleteSubscriptionById
```

**frontend/**  
Aplicação React responsável pela interface e visualização dos dados.

**database/**  
Definição de models, migrations e conexão com PostgreSQL.

**services/**  
Lógica de domínio isolada do resto da aplicação.

---

## Database

Tipo: Supabase

Principais entidades:

- users
- accounts
- transactions
- categories
- goals
- subscription

---

## Decisões técnicas

- Backend em Go para melhor performance e simplicidade da API.
- Uso do Gorm para facilitar manipulação do banco.
- Frontend separado do backend para permitir escalabilidade futura.
- Estrutura baseada em service layer para manter lógica desacoplada das rotas.

---

## TODO

- Database:
  - [ ] Criar a coluna de icon na tabela de accounts
  - [ ] Criar a coluna de cor na tabela de accounts
  - [ ] Configurar o S3 do supabase para armazenar as fotos de perfil de cada user
    - [ ] Criar a coluna de account_id nas tabelas que precisam ser divididas por conta (transactions, goals, subscriptions)
- Backend:
  - [X] Implementar o endpoint GET dashboard/overview/ que retorna as informações gerais para a página de dashboard
  - [X] Terminar a estrutura da service no banco de dados
    - [X] Implementar e melhorar as funções a seguir:
      - GetAccountsSummary()
      - GetMostUsedCategory()
      - GetCategoryDistribution()
      - FilterNextGoal()
      - GetGoalsSummary()
      - GetLastMonthTransactions()
- Frontend:
  - [ ] Fazer o crud de transação funcionar de cabo a rabo usando a tabela de overview ou da página de transações (mesmo endpoint, páginas diferentes)
  - [ ] Criar a página de configuração de perfil que dá pra mudar nome, foto de perfil, apagar conta...
  - [ ] Colocar um fetch geral na página Home e passar as informações para os componentes secundários como parâmetros
  - [ ] Refazer o layout da Landing page para acompanhar o restante do projeto
  - [ ] Refazer a estilização da página de login e colocar efeito de transição/loading para dentro do sistema
  - [ ] Criar um MVP da página Home
    - [ ] Tabela de últimas transações: Filtro por período, Filtro por tipo, Busca por texto
    - [ ] Maior gasto do mês
    - [ ] Média diária de gasto
    - [ ] Projeção de fim do mês (com base na média diária)

---

## Problemas conhecidos

- Arquitetura backend ainda em reorganização.
- Alguns endpoints ainda não implementados.
- Estrutura de services ainda sendo refinada.
- Parte do frontend usando dados mockados do DB que ainda não está em estado final.

---

## Próximos passos

Quando voltar no projeto, começar por:

1. Implementar novas colunas no banco de dados para separação de contas.
2. Validar integração com banco de dados.
3. Implementar endpoints principais para alimentar o frontend.
