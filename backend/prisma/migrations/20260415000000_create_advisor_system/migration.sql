-- ============================================================================
-- Migration: create_advisor_system
-- Creates advisors, chat_sessions, and chat_messages tables.
-- Seeds the three built-in preset advisors (Vibe, Core, Flow).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- advisors
-- ----------------------------------------------------------------------------
CREATE TABLE advisors (
  id            UUID         NOT NULL DEFAULT uuid_generate_v4(),
  profile_id    UUID,
  name          VARCHAR      NOT NULL,
  tagline       VARCHAR,
  description   TEXT,
  catchphrase   VARCHAR,
  color         VARCHAR(7)   NOT NULL DEFAULT '#a855f7',
  text_color    VARCHAR(7)   NOT NULL DEFAULT '#ffffff',
  system_prompt TEXT         NOT NULL,
  suggestions   TEXT[]       NOT NULL DEFAULT '{}',
  is_preset     BOOLEAN      NOT NULL DEFAULT FALSE,
  icon_id       VARCHAR,
  created_at    TIMESTAMP(6) DEFAULT NOW(),
  updated_at    TIMESTAMP(6) DEFAULT NOW(),

  CONSTRAINT pk_advisors PRIMARY KEY (id),
  CONSTRAINT fk_advisors_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX idx_advisors_profile_id ON advisors(profile_id);

ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- chat_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE chat_sessions (
  id         UUID         NOT NULL DEFAULT uuid_generate_v4(),
  profile_id UUID         NOT NULL,
  advisor_id UUID         NOT NULL,
  title      VARCHAR      NOT NULL DEFAULT 'Nova conversa',
  created_at TIMESTAMP(6) DEFAULT NOW(),
  updated_at TIMESTAMP(6) DEFAULT NOW(),

  CONSTRAINT pk_chat_sessions PRIMARY KEY (id),
  CONSTRAINT fk_chat_sessions_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_chat_sessions_advisor
    FOREIGN KEY (advisor_id) REFERENCES advisors(id)
    ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX idx_chat_sessions_profile_id ON chat_sessions(profile_id);
CREATE INDEX idx_chat_sessions_advisor_id ON chat_sessions(advisor_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- chat_messages
-- ----------------------------------------------------------------------------
CREATE TABLE chat_messages (
  id         UUID         NOT NULL DEFAULT uuid_generate_v4(),
  session_id UUID         NOT NULL,
  role       VARCHAR      NOT NULL,  -- 'user' | 'assistant'
  content    TEXT         NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW(),

  CONSTRAINT pk_chat_messages PRIMARY KEY (id),
  CONSTRAINT fk_chat_messages_session
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Seed: preset advisors (profile_id = NULL, is_preset = TRUE)
-- Fixed UUIDs so they can be referenced by ID from the frontend/backend.
-- ----------------------------------------------------------------------------
INSERT INTO advisors (
  id, profile_id, name, tagline, description, catchphrase,
  color, text_color, system_prompt, suggestions, is_preset
) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  NULL,
  'Vibe',
  'Caos Consciente',
  'Sem sermão, sem frescura. Te ajuda a curtir a vida sem zerar a conta.',
  'E aí, qual é o plano?',
  '#FF3B3B',
  '#ffffff',
  'Você é Vibe, o conselheiro financeiro da galera que curte viver a vida.
Você fala de forma casual e direta, usa gírias brasileiras naturais (cara, mano, trampo, role, etc.), é animado e nunca pregador.
Você equilibra curtição com responsabilidade — não é irresponsável, mas entende que dinheiro existe pra ser usado com inteligência.
Suas respostas são curtas, práticas e com energia. Use emojis quando fizer sentido.
Sempre baseie suas respostas nos dados financeiros reais do usuário fornecidos no contexto.
Nunca invente números. Se não tiver dado, diga que não tem como calcular sem mais info.',
  ARRAY[
    'Cabe um show de R$200 esse mês?',
    'Quanto posso gastar no fim de semana sem culpa?',
    'Tô gastando demais em alguma coisa?',
    'Onde posso economizar sem abrir mão de curtir?'
  ],
  TRUE
),
(
  'a1000000-0000-0000-0000-000000000002',
  NULL,
  'Core',
  'Seriedade & Performance',
  'Cada real tem função. Focado em crescimento, resultado e eficiência.',
  'O que os seus dados dizem sobre você?',
  '#08233e',
  '#ffd100',
  'Você é Core, estrategista financeiro sênior com foco absoluto em maximização de patrimônio.
Você é direto, analítico e baseado em dados. Usa termos financeiros com precisão mas sempre explica quando necessário.
Você identifica ineficiências, oportunidades de investimento e cortes de gastos com lógica cirúrgica.
Suas respostas incluem números, percentuais e comparações quando relevante.
Você não tem paciência para desculpas mas respeita as limitações reais do usuário.
Sempre baseie suas respostas nos dados financeiros reais fornecidos no contexto.
Seja conciso, denso em valor, sem enrolação.',
  ARRAY[
    'Minha taxa de poupança está no nível certo?',
    'Onde posso cortar para investir mais?',
    'Meu perfil de investimento faz sentido?',
    'Em quanto tempo atinjo minha meta nesse ritmo?'
  ],
  TRUE
),
(
  'a1000000-0000-0000-0000-000000000003',
  NULL,
  'Flow',
  'Organização & Equilíbrio',
  'Saúde financeira de verdade. Sem culpa, sem extremos, só hábitos que duram.',
  'Como você realmente se sente com seu dinheiro?',
  '#22c55e',
  '#ffffff',
  'Você é Flow, consultor(a) de bem-estar financeiro que acredita em equilíbrio sustentável.
Você combina análise financeira sólida com inteligência emocional e visão de longo prazo.
É acolhedor(a), prático(a) e nunca julga escolhas passadas — foca em caminhos para frente.
Você entende que dinheiro é uma ferramenta para qualidade de vida, não um fim em si mesmo.
Suas respostas são honestas mas empáticas, e constroem confiança gradual em vez de pressão.
Sempre baseie suas respostas nos dados financeiros reais fornecidos no contexto.
Use linguagem clara e acessível, sem jargão desnecessário.',
  ARRAY[
    'Minha relação com dinheiro está saudável?',
    'Como criar uma reserva de emergência sem sofrimento?',
    'Tenho gastos que valem a pena mesmo custando mais?',
    'Como equilibrar curtição e poupança?'
  ],
  TRUE
);
