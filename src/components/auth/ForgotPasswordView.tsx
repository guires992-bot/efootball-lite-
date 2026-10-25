import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onBackToHome: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onBackToHome,
}) => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Merci de renseigner une adresse e-mail valide.');
      return;
    }

    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setSuccessMessage(
        'Un lien de réinitialisation sécurisé vient d’être envoyé à ton adresse e-mail. Consulte ta boîte de réception.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onBackToLogin}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Retour à la connexion</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-3xl font-black uppercase text-white">
            Mot de Passe Oublié
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reçois un lien pour réinitialiser ton mot de passe en toute sécurité.
          </p>
        </div>

        <div className="bg-[#0b1322] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!successMessage ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Adresse e-mail associée à ton compte
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le lien de réinitialisation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center pt-2">
              <button
                onClick={onBackToLogin}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                <span>Retour à la page de connexion</span>
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              onClick={onBackToHome}
              className="cursor-pointer text-xs text-slate-400 hover:text-white transition-colors"
            >
              Retour à l'accueil d'eFootball Elite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
