import React from 'react';
import { Layers, Users, BookOpen, Trophy, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface FeaturesSectionProps {
  onOpenSquadBuilder: () => void;
  onOpenPlayerGuide: () => void;
  onNavigateAcademy: () => void;
  onNavigateTournaments: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onOpenSquadBuilder,
  onOpenPlayerGuide,
  onNavigateAcademy,
  onNavigateTournaments,
}) => {
  return (
    <section id="features" className="py-20 bg-[#070b14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
            <span>Arsenal Compétitif</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">4 Piliers Clés</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-4">
            TOUT POUR COMPRENDRE ET MAÎTRISER LE JEU
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Une suite d'outils tactiques et d'analyses conçue pour t'aider à progresser, optimiser ton équipe et rivaliser avec les meilleurs joueurs.
          </p>
        </div>

        {/* 4 Grandes Cartes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card A: CONSTRUCTEUR D'ÉQUIPE */}
          <div className="esports-card group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-blue-500/50 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src="/src/assets/images/feature_squad_builder_1792865277901.jpg"
                alt="Constructeur d'équipe eFootball"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tactique & Schéma</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  A. CONSTRUCTEUR D'ÉQUIPE
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Compose ton onze, choisis ta formation et organise tes joueurs.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">4-3-3 · 4-2-1-3 · 5-2-1-2 et plus</span>
                <button
                  onClick={onOpenSquadBuilder}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-emerald-400 transition-colors"
                >
                  <span>Lancer l'aperçu tactique</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Card B: GUIDE DES JOUEURS */}
          <div className="esports-card group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-emerald-500/50 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-900 to-[#070b14] p-6 flex flex-col justify-center">
              {/* Tactical card preview aesthetic */}
              <div className="w-full bg-[#111c30]/90 border border-slate-700/60 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Styles de jeu & Cartes</span>
                  <span className="text-emerald-400 font-semibold">Base de données complète</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-[#0b1220] p-2.5 rounded-lg border border-slate-800">
                    <p className="text-xs text-blue-400 font-bold">Renard des surfaces</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Appels tranchants dans la surface</p>
                  </div>
                  <div className="bg-[#0b1220] p-2.5 rounded-lg border border-slate-800">
                    <p className="text-xs text-emerald-400 font-bold">Sentinelle</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Couvre l'axe défensif sans monter</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-200" />
                <span>Effectif & Stats</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                  B. GUIDE DES JOUEURS
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Découvre les postes, les caractéristiques et les compétences des joueurs.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Stats, rôles & compétences clés</span>
                <button
                  onClick={onOpenPlayerGuide}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 group-hover:text-blue-400 transition-colors"
                >
                  <span>Consulter le guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Card C: ACADÉMIE eFOOTBALL */}
          <div className="esports-card group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-sky-500/50 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src="/src/assets/images/feature_academy_skills_1792865277781.jpg"
                alt="Académie eFootball"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-sky-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-200" />
                <span>Formation & Mécaniques</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 flex items-center gap-2 group-hover:text-sky-400 transition-colors">
                  C. ACADÉMIE eFOOTBALL
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Apprends les commandes, les passes, les tirs, la défense et les tactiques.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">3 Niveaux · Du débutant au pro</span>
                <button
                  onClick={onNavigateAcademy}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 group-hover:text-emerald-400 transition-colors"
                >
                  <span>Accéder à l'académie</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Card D: CLASSEMENTS ET TOURNOIS */}
          <div className="esports-card group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-blue-500/50 overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src="/src/assets/images/feature_tournaments_trophy_1792865277930.jpg"
                alt="Tournois eFootball"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/40 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Compétition</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                  D. CLASSEMENTS ET TOURNOIS
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Découvre les compétitions communautaires et suis les résultats vérifiés.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Matchs homologués & Arbres de tournoi</span>
                <button
                  onClick={onNavigateTournaments}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-emerald-400 transition-colors"
                >
                  <span>Voir les tournois</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
