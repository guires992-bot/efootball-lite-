import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AVATAR_PRESETS, PlayerAvatar } from './AvatarPresets';
import {
  Shield,
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Settings,
} from 'lucide-react';

interface RegisterViewProps {
  onBackToHome: () => void;
  onNavigateLogin: () => void;
  onOpenConfigModal: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onBackToHome,
  onNavigateLogin,
  onOpenConfigModal,
}) => {
  const { signUp, isConfigured, diagnostic } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar-1');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setErrorMessage('Le pseudonyme doit comporter au moins 3 caractères.');
      return;
    }
    if (cleanUsername.length > 24) {
      setErrorMessage('Le pseudonyme ne peut pas dépasser 24 caractères.');
      return;
    }
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(cleanUsername)) {
      setErrorMessage('Le pseudonyme ne peut contenir que des lettres, chiffres, tirets et underscores.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Merci de saisir une adresse e-mail valide.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Tu dois accepter les conditions d\'utilisation pour créer ton compte.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, cleanUsername, selectedAvatarId);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setSuccessNotice(
        'Compte créé avec succès ! Si la confirmation par e-mail est activée sur ton projet Supabase, vérifie ta boîte de réception.'
      );
      setTimeout(() => {
        window.location.hash = '#profil';
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top back shortcut */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 mb-3">
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Retour à l'accueil</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-600 to-sky-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] mb-3">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Créer un Compte Joueur
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rejoins la communauté eFootball Elite et sauvegarde tes tactiques en ligne.
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
                    : 'Configuration Supabase requise'}
                </strong>
                <p className="text-[11px] leading-relaxed mb-2 text-amber-200/90">
                  {diagnostic?.message ||
                    'Pour activer l\'inscription et la base de données PostgreSQL, configure ton URL et ta clé anonyme Supabase.'}
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

          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Choisis ton emblème tactique
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-1">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedAvatarId === preset.id;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => setSelectedAvatarId(preset.id)}
                      className={`cursor-pointer p-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/20 scale-105 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                      title={`${preset.name} (${preset.role})`}
                    >
                      <PlayerAvatar avatarId={preset.id} size="sm" />
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                {AVATAR_PRESETS.find((a) => a.id === selectedAvatarId)?.name} ·{' '}
                <span className="text-emerald-400 font-medium">
                  {AVATAR_PRESETS.find((a) => a.id === selectedAvatarId)?.role}
                </span>
              </div>
            </div>

            {/* Pseudonym */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Pseudonyme compétiteur
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: TacticienPro, Striker99..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                3 à 24 caractères. Visible sur ton profil public.
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Adresse e-mail (privée)
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
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Min. 6 car."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Répéter mot de passe"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>
                  J'accepte de sauvegarder mes compositions et ma progression de jeu sur eFootball Elite.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Création du profil en cours...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte joueur</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="cursor-pointer text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
