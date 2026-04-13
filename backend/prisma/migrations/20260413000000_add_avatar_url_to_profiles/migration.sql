-- Migration: add_avatar_url_to_profiles
-- Adds the avatar_url column that was defined in the Prisma schema
-- but never added to the database.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url VARCHAR;
