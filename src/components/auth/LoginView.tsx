import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
  Settings,
  ArrowLeft,
} from 'lucide-react';

interface LoginViewProps {
  onBackToHome: () => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onOpenConfigModal: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onBackToHome,
  onNavigateRegister,
  onNavigateForgotPassword,
  onOpenConfigModal,
}) => {
  const { signIn, isConfigured, diagnostic } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Merci de renseigner votre adresse e-mail et votre mot de passe.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      // Redirect to profile or home
      window.location.hash = '#profil';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle stadium background atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top back shortcut */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Retour à l'accueil</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-500 p-0.5 shadow-[0_0_20px_rgba(37,99,235,0.35)] mb-3">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center text-blue-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-white">
            Connexion Joueur
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Retrouve tes compositions, ta progression de l'Académie et tes points d'XP.
          </p>
        </div>

        {/* Supabase Status Banner if not connected yet */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-1">
                  {diagnostic?.status === 'invalid_url_token'
                    ? 'Format de clé / URL détecté'
                    : 'Configuration Supabase en attente'}
                </strong>
                <p className="text-[11px] leading-relaxed mb-2 text-amber-200/90">
                  {diagnostic?.message ||
                    'Pour activer les vrais comptes et la synchronisation PostgreSQL en ligne, renseigne tes clés Supabase ou colle-les via le panneau de configuration.'}
                </p>
                <button
                  type="button"
                  onClick={onOpenConfigModal}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/40 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Ouvrir l'assistant de configuration</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="bg-[#0b1322] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="cursor-pointer text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-bold transition-colors ml-1"
              >
                Créer un compte compétiteur
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
