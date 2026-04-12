-- Migration: migrate_users_to_profiles
--
-- Removes the legacy public.users table (Go backend) and makes public.profiles
-- the canonical user record, linked to auth.users (Supabase Auth).
--
-- Steps:
--   1. Add `email` column to profiles
--   2. Upsert profiles from users (preserve all legacy data)
--   3. Remove profiles órfãos (sem auth.users correspondente)
--   4. Add DB-level FK: profiles.id → auth.users.id (ON DELETE CASCADE)
--   5. Drop FK constraints on feature tables (currently point to users)
--   6. Re-create FK constraints pointing to profiles
--   7. Drop the users table

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add email column to profiles
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email VARCHAR UNIQUE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Copy / upsert data from public.users → public.profiles
--    - Update existing profiles with email from users (same UUID)
--    - Insert profiles for users that have no profile yet
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.profiles p
SET
  email      = u.email,
  name       = COALESCE(p.name, u.name),
  updated_at = NOW()
FROM public.users u
WHERE p.id = u.id;

INSERT INTO public.profiles (id, email, name, created_at, updated_at)
SELECT
  u.id,
  u.email,
  u.name,
  u.created_at,
  u.updated_at
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Remover profiles órfãos (id não existe em auth.users)
--    Cascata manual: limpa dados dependentes antes de deletar o profile.
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM public.transactions
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
);

DELETE FROM public.subscriptions
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
);

DELETE FROM public.goals
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
);

DELETE FROM public.categories
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
);

DELETE FROM public.accounts
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
);

DELETE FROM public.profiles
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = profiles.id
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. FK: profiles.id → auth.users.id (ON DELETE CASCADE)
--    Supabase creates auth.users; we just add the referential constraint.
--    Skip if it already exists (idempotent).
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
      AND table_schema    = 'public'
      AND table_name      = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Drop old FK constraints (pointing to public.users)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.accounts      DROP CONSTRAINT IF EXISTS fk_accounts_user;
ALTER TABLE public.categories    DROP CONSTRAINT IF EXISTS fk_categories_user;
ALTER TABLE public.goals         DROP CONSTRAINT IF EXISTS fk_goals_user;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS fk_subscriptions_user;
ALTER TABLE public.transactions  DROP CONSTRAINT IF EXISTS fk_transactions_user;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Re-create FK constraints pointing to public.profiles
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.accounts
  ADD CONSTRAINT fk_accounts_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.categories
  ADD CONSTRAINT fk_categories_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.goals
  ADD CONSTRAINT fk_goals_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT fk_subscriptions_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.transactions
  ADD CONSTRAINT fk_transactions_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Drop the legacy users table
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.users;
