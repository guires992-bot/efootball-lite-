import React from 'react';
import { Shield, Mail, FileText, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'mentions' | 'privacy' | 'terms') => void;
  onOpenContact: () => void;
  onNavigateHome: () => void;
  onOpenSupabaseConfig?: () => void;
  onNavigateProfile?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenContact,
  onNavigateHome,
  onOpenSupabaseConfig,
  onNavigateProfile,
}) => {
  return (
    <footer className="bg-[#05080f] border-t border-slate-850 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Independent Identity */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wider text-white">
                eFOOTBALL <span className="text-blue-500">ELITE</span>
              </span>
            </button>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plateforme communautaire indépendante dédiée aux passionnés d'eFootball. Constructeur d'équipe, analyses tactiques, académie compétitive et tournois homologués.
            </p>

            {/* Crucial Independence Disclaimer required by prompt */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Avertissement légal :</strong> eFootball Elite est une plateforme indépendante non officielle, créée sans affiliation, approbation ou parrainage de Konami Digital Entertainment Inc.
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#accueil" className="hover:text-blue-400 transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">Constructeur & Tactiques</a>
              </li>
              <li>
                <a href="#apprendre" className="hover:text-blue-400 transition-colors">Académie eFootball</a>
              </li>
              <li>
                <a href="#classements" className="hover:text-blue-400 transition-colors">Classements & Tournois</a>
              </li>
              {onNavigateProfile && (
                <li>
                  <button
                    onClick={onNavigateProfile}
                    className="cursor-pointer hover:text-blue-400 transition-colors text-left"
                  >
                    Mon Profil Compétiteur
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Informations légales & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Ressources & Légal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('mentions')}
                  className="cursor-pointer hover:text-blue-400 transition-colors text-left"
                >
                  À propos du projet
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="cursor-pointer hover:text-blue-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Nous contacter</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="cursor-pointer hover:text-blue-400 transition-colors text-left"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="cursor-pointer hover:text-blue-400 transition-colors text-left"
                >
                  Conditions d'utilisation
                </button>
              </li>
              {onOpenSupabaseConfig && (
                <li className="pt-2 border-t border-slate-850">
                  <button
                    onClick={onOpenSupabaseConfig}
                    className="cursor-pointer text-amber-400/90 hover:text-amber-300 transition-colors text-left font-mono text-[11px] flex items-center gap-1.5"
                  >
                    <span>⚡ Configuration Supabase</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} eFootball Elite — Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>Conçu pour la communauté francophone & internationale d'e-sport</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
