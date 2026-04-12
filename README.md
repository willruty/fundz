# FUNDZ

## Descrição

Fundz é uma plataforma de gestão financeira pessoal focada em jovens que querem parar de ser emocional com dinheiro e começar a enxergar números de forma clara.

A proposta é simples: transformar dados financeiros em decisões melhores através de visualização, controle e análise.

O sistema permite:

- Gerenciar contas
- Registrar e categorizar transações
- Visualizar métricas financeiras
- Controlar assinaturas e metas
- (em breve) analisar comportamento financeiro com IA

---

## Status do Projeto

MVP em fase final (menos de 1 semana para deploy).

Situação atual:

- Backend com CRUDs principais funcionando (users, accounts, transactions, categories, goals, subscriptions)
- Frontend funcional com páginas principais
- Integração com banco (Supabase) ativa
- Parte do dashboard já estruturada

Foco atual:

- Ajustes finais de produto
- Persistência de dados faltantes
- Melhorias visuais
- Preparação para deploy
- Estrutura para monetização futura

---

## Stack

### Frontend

- React
- TypeScript
- TailwindCSS
- Recharts

### Backend

- Node e Nest
- API REST
- Arquitetura em módulos (controller, service, module)

### Database

- Supabase (PostgreSQL)
- Gorm

---

## TODO (PRIORIDADE MVP)

### Core / Dados

- [ ] Ao criar uma account:
  - [ ] Definir saldo inicial
  - [ ] Adicionar campos de controle financeiro relevantes (ex: saldo atual, etc)

- [ ] Impedir repetição de cores nos cards de account

- [ ] Persistir o card de gasto impulsivo no banco de dados

---

### Investimentos

- [ ] Criar CRUD completo de investimentos
- [ ] Associar investimentos a uma account

---

### Frontend / UX

- [ ] Melhorar layout da primeira linha da página de assinaturas

- [ ] Criar página de Profile / Configurações:
  - [ ] Upload de foto
  - [ ] Alterar nome
  - [ ] Alterar senha
  - [ ] Deletar conta

- [ ] Melhorar landing page:
  - [ ] Layout mais profissional
  - [ ] Componentes mais chamativos
  - [ ] Imagens da plataforma
  - [ ] Animações
  - [ ] Transições mais fluidas

---

### Controle de Acesso / Monetização

- [ ] Restringir acesso a páginas específicas (ex: investimentos)
  - [ ] Liberar apenas via chave de acesso

- [ ] Implementar gateway de pagamento
  - [ ] Liberar funcionalidades baseado em pagamento

---

### Inteligência / Diferencial

- [ ] Implementar IA para análise de dados financeiros
  - (insights, padrões de gasto, comportamento)

---

### Integrações

- [ ] Pesquisar integração com OpenFinance
  - [ ] Puxar extratos automaticamente
  - OU
  - [ ] Permitir upload de extratos bancários

---

## Próximos Passos (Estratégico)

1. Finalizar consistência de dados (accounts, saldo, impulsivo)
2. Garantir persistência completa no banco
3. Ajustar UX mínima (profile + assinaturas)
4. Implementar restrição por chave de acesso
5. Deploy do MVP
6. Evoluções pós-MVP:
   - Pagamento
   - IA
   - OpenFinance

---

## Objetivo do MVP

- Rodar de forma estável
- Resolver um problema real
- Ser utilizável
- Criar base para monetização

---

## Diretrizes de Desenvolvimento

- Priorizar velocidade com qualidade suficiente
- Evitar overengineering
- Pensar como produto, não apenas como código
- Toda feature deve ter impacto real
