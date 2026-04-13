-- Migration: create_investments
-- Creates the investments table to track user investment positions.

CREATE TABLE IF NOT EXISTS public.investments (
  id          UUID         NOT NULL DEFAULT uuid_generate_v4(),
  user_id     UUID         NOT NULL,
  name        VARCHAR      NOT NULL,
  category    VARCHAR      NOT NULL,
  amount      DECIMAL      NOT NULL,
  annual_rate DECIMAL      NOT NULL,
  start_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
  notes       VARCHAR,
  created_at  TIMESTAMP(6) DEFAULT NOW(),
  updated_at  TIMESTAMP(6) DEFAULT NOW(),

  CONSTRAINT investments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_investments_user
    FOREIGN KEY (user_id) REFERENCES public.profiles(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);
