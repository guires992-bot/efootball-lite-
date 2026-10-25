-- =============================================================================
-- eFootball Elite — MIGRATIONS SUPABASE (PARTIE 5 : COMPTES & SYNCHRONISATION)
-- PostgreSQL & Supabase Database Schema with Row Level Security (RLS)
-- =============================================================================

-- 1. Extension pour génération d'UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table des Profils Joueurs (liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT 'avatar-1',
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    level_tier TEXT NOT NULL DEFAULT 'Espoir en Formation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 24)
);

-- Index pour recherche de profil par pseudo
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 3. Table de Progression des Leçons
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);

-- 4. Table des Résultats de Quiz
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    attempts INTEGER NOT NULL DEFAULT 1 CHECK (attempts >= 1),
    selected_answer INTEGER NOT NULL,
    is_passed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_quiz UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON public.quiz_results(user_id);

-- 5. Table des Défis d'Entraînement en Match
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON public.user_challenges(user_id);

-- 6. Table des Compositions d'Équipe Sauvegardées
CREATE TABLE IF NOT EXISTS public.saved_squads (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    formation_id TEXT NOT NULL,
    tactical_style TEXT NOT NULL,
    starting_eleven JSONB NOT NULL DEFAULT '[]'::jsonb,
    bench JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_saved_squads_user ON public.saved_squads(user_id);

-- =============================================================================
-- POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_squads ENABLE ROW LEVEL SECURITY;

-- 1. Politiques pour `profiles`
-- N'importe qui peut lire les données publiques d'un profil (pseudo, avatar, xp, tier)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- L'utilisateur ne peut mettre à jour que son propre profil
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Insertion automatique ou directe de son propre profil
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Politiques pour `lesson_progress`
CREATE POLICY "Users can read own lesson progress" 
ON public.lesson_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" 
ON public.lesson_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" 
ON public.lesson_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson progress" 
ON public.lesson_progress FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Politiques pour `quiz_results`
CREATE POLICY "Users can read own quiz results" 
ON public.quiz_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" 
ON public.quiz_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz results" 
ON public.quiz_results FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Politiques pour `user_challenges`
CREATE POLICY "Users can read own challenges" 
ON public.user_challenges FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" 
ON public.user_challenges FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Politiques pour `saved_squads`
-- Lecture : ses propres compositions OU les compositions marquées publiques
CREATE POLICY "Users can view own or public squads" 
ON public.saved_squads FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);

-- Écriture / Modification / Suppression : uniquement ses propres compositions
CREATE POLICY "Users can insert own squads" 
ON public.saved_squads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own squads" 
ON public.saved_squads FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own squads" 
ON public.saved_squads FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGER AUTOMATIQUE À L'INSCRIPTION (AUTH.USERS -> PROFILES)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    chosen_username TEXT;
BEGIN
    chosen_username := COALESCE(
        new.raw_user_meta_data->>'username',
        'Joueur_' || SUBSTRING(new.id::text, 1, 6)
    );

    INSERT INTO public.profiles (id, username, avatar_url, xp, level_tier)
    VALUES (
        new.id,
        chosen_username,
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'avatar-1'),
        0,
        'Espoir en Formation'
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger automatique pour `updated_at` sur profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
