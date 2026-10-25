import React from 'react';
import { ACADEMY_LEVELS } from '../data/arenaData';
import { AcademyLevel } from '../types';
import { Sparkles, Gamepad2, Zap, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AcademySectionProps {
  onSelectLevel: (level: AcademyLevel) => void;
  onOpenAcademyView?: () => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ onSelectLevel, onOpenAcademyView }) => {
  const getLevelIcon = (id: string) => {
    switch (id) {
      case 'debutant':
        return <Gamepad2 className="w-5 h-5 text-sky-400" />;
      case 'intermediaire':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'avance':
      default:
        return <Award className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="apprendre" className="py-20 bg-[#090f1d] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              <span>Académie eFootball</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">Programme Pédagogique Interactif</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              DEVIENS MEILLEUR À CHAQUE MATCH
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-slate-300 text-sm max-w-md">
              Chaque palier cible des mécaniques concrètes pour éliminer tes erreurs récurrentes et convertir tes temps forts en victoires.
            </p>
            {onOpenAcademyView && (
              <button
                onClick={onOpenAcademyView}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Ouvrir l'Académie</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Niveaux Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {ACADEMY_LEVELS.map((level, idx) => (
            <div
              key={level.id}
              className="esports-card bg-[#0d1527] rounded-2xl border border-slate-800 hover:border-blue-500/50 p-6 sm:p-8 flex flex-col justify-between relative group"
            >
              {/* Top Bar inside card */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getLevelIcon(level.id)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Niveau 0{idx + 1}</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {level.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 font-medium">
                  {level.tagline}
                </p>

                {/* Modules list preview */}
                <div className="space-y-3 mb-8">
                  {level.modules.slice(0, 3).map((mod, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{mod.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button linking to curriculum modal or direct academy */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{level.duration}</span>
                <button
                  onClick={() => onSelectLevel(level)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner to Full Interactive Academy */}
        {onOpenAcademyView && (
          <div className="bg-gradient-to-r from-blue-950/50 via-[#0e1933] to-emerald-950/40 border border-blue-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white mb-1">
                  Accède aux 30 Leçons Didactiques Complètes
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Exercices interactifs, quiz validés avec XP, simulations de scénarios tactiques et suivi de ta progression.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAcademyView}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-[0_0_20px_rgba(37,99,235,0.35)] shrink-0"
            >
              <span>Entrer dans l'Académie</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
