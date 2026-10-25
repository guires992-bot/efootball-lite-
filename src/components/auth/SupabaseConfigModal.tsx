import React, { useState } from 'react';
import {
  getActiveSupabaseConfig,
  setCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
} from '../../lib/supabaseClient';
import {
  X,
  Settings,
  Database,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getActiveSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) return;
    setCustomSupabaseCredentials(url.trim(), anonKey.trim());
  };

  const handleReset = () => {
    clearCustomSupabaseCredentials();
  };

  const sqlCode = `-- =============================================================================
-- eFootball Elite — MIGRATIONS SUPABASE (PARTIE 5 : COMPTES & SYNCHRONISATION)
-- Collez ce script dans l'onglet "SQL Editor" de votre projet Supabase.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);

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

CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON public.user_challenges(user_id);

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

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_squads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quiz results" ON public.quiz_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenges" ON public.user_challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own or public squads" ON public.saved_squads FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can manage own squads" ON public.saved_squads FOR ALL USING (auth.uid() = user_id);

-- TRIGGER AUTOMATIQUE PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url, xp, level_tier)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'Joueur_' || SUBSTRING(new.id::text, 1, 6)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'avatar-1'),
        0,
        'Espoir en Formation'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0b1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-[#080d19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold uppercase text-white">
                Configuration Supabase (Partie 5)
              </h3>
              <p className="text-xs text-slate-400">
                Statut actuel :{' '}
                {currentConfig.isConfigured ? (
                  <span className="text-emerald-400 font-bold">Connecté à Supabase ✓</span>
                ) : currentConfig.diagnostic.status === 'invalid_url_token' ? (
                  <span className="text-amber-400 font-bold">Jeton détecté au lieu de l'URL</span>
                ) : (
                  <span className="text-amber-400 font-bold">Identifiants en attente</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2 gap-3 text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab('config')}
            className={`cursor-pointer pb-2.5 transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Clés de Connexion
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`cursor-pointer pb-2.5 transition-colors border-b-2 ${
              activeTab === 'sql'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Script SQL & Migrations
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`cursor-pointer pb-2.5 transition-colors border-b-2 ${
              activeTab === 'guide'
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Guide Pas-à-Pas (Netlify / Supabase)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Config Form */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              {/* Diagnostic Box if not valid */}
              {!currentConfig.isConfigured && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Diagnostic de la configuration actuelle</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-100">
                    {currentConfig.diagnostic.message}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 leading-relaxed">
                <strong className="text-white block mb-1">Comment obtenir vos clés publiques ?</strong>
                1. Créez un projet gratuit sur{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline"
                >
                  supabase.com
                </a>
                .<br />
                2. Dans votre tableau de bord Supabase, allez dans <strong className="text-white">Project Settings &gt; API</strong>.<br />
                3. Copiez <strong className="text-white">Project URL</strong> (ex: <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">https://xyz.supabase.co</code>) et la clé <strong className="text-white">anon public</strong> (commençant par <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">eyJ...</code>).
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://xyzcompany.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ⚠️ Utilisez uniquement la clé <strong>anon public</strong> (sans danger pour le navigateur avec RLS activé). N'utilisez JAMAIS la clé service_role.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser</span>
                  </button>

                  <button
                    type="submit"
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  >
                    Sauvegarder & Recharger
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SQL Script */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">
                  Schéma PostgreSQL complet avec RLS & Triggers :
                </span>
                <button
                  onClick={handleCopySql}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le script SQL'}</span>
                </button>
              </div>

              <pre className="bg-[#070b14] p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[50vh] leading-relaxed">
                {sqlCode}
              </pre>
            </div>
          )}

          {/* TAB 3: Netlify & Supabase Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase text-white mb-2">
                  1. Déploiement sur Netlify
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs">
                  <li>Ouvrez votre tableau de bord Netlify sur le site <strong className="text-white">eFootball Elite</strong>.</li>
                  <li>Allez dans <strong className="text-white">Site configuration &gt; Environment variables</strong>.</li>
                  <li>Ajoutez les deux variables suivantes :
                    <ul className="list-disc pl-5 mt-1 font-mono text-[11px] text-blue-300">
                      <li><code>VITE_SUPABASE_URL</code> : l'URL de votre projet Supabase.</li>
                      <li><code>VITE_SUPABASE_ANON_KEY</code> : la clé publique anon de Supabase.</li>
                    </ul>
                  </li>
                  <li>Relancez le déploiement (<strong className="text-white">Trigger deploy</strong>).</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase text-white mb-2">
                  2. Configuration de l'authentification Supabase
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs">
                  <li>Dans Supabase, rendez-vous dans <strong className="text-white">Authentication &gt; URL Configuration</strong>.</li>
                  <li>Renseignez la <strong className="text-white">Site URL</strong> avec votre domaine Netlify ou l'URL locale.</li>
                  <li>Dans <strong className="text-white">Redirect URLs</strong>, ajoutez <code>https://votre-site.netlify.app/#reinitialisation</code> pour le reset de mot de passe.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
