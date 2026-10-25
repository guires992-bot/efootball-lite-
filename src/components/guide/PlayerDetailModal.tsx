import React from 'react';
import { PlayerCard } from '../../types';
import { X, Star, Scale, PlusCircle, Check, ThumbsUp, AlertTriangle, Compass, Info, Sparkles } from 'lucide-react';

interface PlayerDetailModalProps {
  player: PlayerCard | null;
  isOpen: boolean;
  isInComparison: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (playerId: string) => void;
  onToggleComparison: (player: PlayerCard) => void;
  onSelectForSquad: (player: PlayerCard) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  isOpen,
  isInComparison,
  isFavorite,
  onClose,
  onToggleFavorite,
  onToggleComparison,
  onSelectForSquad,
}) => {
  if (!isOpen || !player) return null;

  const g = player.granularStats;

  const detailedMetrics = [
    { label: 'Vitesse', value: g?.speed ?? player.keyStats.pace, color: 'bg-sky-500' },
    { label: 'Accélération', value: g?.acceleration ?? null, color: 'bg-sky-400' },
    { label: 'Finition', value: g?.finishing ?? player.keyStats.finishing, color: 'bg-emerald-500' },
    { label: 'Puissance de tir', value: g?.kickingPower ?? null, color: 'bg-emerald-400' },
    { label: 'Passe (courte & longue)', value: g?.passing ?? player.keyStats.passing, color: 'bg-blue-500' },
    { label: 'Contrôle du ballon', value: g?.ballControl ?? null, color: 'bg-indigo-400' },
    { label: 'Dribble', value: g?.dribbling ?? player.keyStats.dribbling, color: 'bg-amber-500' },
    { label: 'Défense', value: g?.defending ?? player.keyStats.defending, color: 'bg-purple-500' },
    { label: 'Contact physique', value: g?.physicalContact ?? player.keyStats.physical, color: 'bg-rose-500' },
    { label: 'Endurance', value: g?.stamina ?? null, color: 'bg-teal-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0b1324] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 bg-[#070d18] border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black shrink-0 ${
                player.overall >= 94
                  ? 'bg-amber-400/20 text-amber-300 border-2 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-blue-600/20 text-blue-300 border-2 border-blue-400/40'
              }`}
            >
              <span className="text-2xl leading-none tabular-nums">{player.overall}</span>
              <span className="text-xs font-sans font-bold text-slate-300 mt-0.5">{player.position}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {player.club} · {player.nationality}
                </span>
                <button
                  onClick={() => onToggleFavorite(player.id)}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  className="cursor-pointer text-slate-400 hover:text-amber-400 ml-1"
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
                {player.name}
              </h3>
              <p className="text-xs text-blue-400 font-semibold">{player.playStyle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer la fiche joueur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto text-xs text-slate-300">
          
          {/* Section 1: Informations Générales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080e1b] p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Poste principal</span>
              <span className="font-bold text-white text-sm">{player.position}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Postes secondaires</span>
              <span className="font-bold text-slate-200">
                {player.secondaryPositions.length > 0 ? player.secondaryPositions.join(', ') : 'Aucun'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pied préféré</span>
              <span className="font-bold text-white">{player.preferredFoot}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pied faible (Fréq./Préc.)</span>
              <span className="font-bold text-emerald-400">
                {g?.weakFootUsage && g?.weakFootAccuracy
                  ? `${g.weakFootUsage}/4 · ${g.weakFootAccuracy}/4`
                  : 'Non renseigné'}
              </span>
            </div>
          </div>

          {/* Section 2: Caractéristiques Détaillées sous forme de Barres Visuelles Graduées */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Profil Statistique Détaillé</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Échelle 0 — 100</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {detailedMetrics.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{stat.label}</span>
                    {stat.value !== null ? (
                      <span className="font-mono font-bold text-white tabular-nums">{stat.value}</span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Donnée non renseignée</span>
                    )}
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    {stat.value !== null ? (
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(stat.value, 100)}%` }}
                      />
                    ) : (
                      <div className="h-full bg-slate-800 w-full opacity-30" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Analyse Qualités, Limites & Usages Tactiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Qualités */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl">
              <h5 className="font-heading text-sm font-bold uppercase text-emerald-400 mb-2.5 flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4" />
                <span>Principales Qualités</span>
              </h5>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                {player.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limites */}
            <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl">
              <h5 className="font-heading text-sm font-bold uppercase text-amber-400 mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Limites & Points de Vigilance</span>
              </h5>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                {player.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Usages Tactiques Possibles */}
          {player.tacticalUses && player.tacticalUses.length > 0 && (
            <div className="bg-[#0e172a] p-4 rounded-xl border border-slate-800">
              <h5 className="font-heading text-sm font-bold uppercase text-blue-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>Usages Tactiques Recommandés</span>
              </h5>
              <ul className="space-y-1.5 text-slate-300">
                {player.tacticalUses.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">→</span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compétences Spéciales */}
          <div>
            <h5 className="font-heading text-sm font-bold uppercase text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Compétences de Joueur Détectées</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {player.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Origine et transparence des données */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span>
                <strong>Origine des données :</strong> {player.source || 'Données calibrées eFootball Elite'}.
                Dernière vérification : {player.updatedAt || 'Octobre 2026'}. Données étiquetées à but d'analyse tactique indépendante.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-[#070d18] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white order-2 sm:order-1"
          >
            ← Retour au guide
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={() => onToggleComparison(player)}
              className={`cursor-pointer flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                isInComparison
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>{isInComparison ? 'Retirer du comparateur' : 'Ajouter au comparateur'}</span>
            </button>

            <button
              onClick={() => {
                onSelectForSquad(player);
                onClose();
              }}
              className="cursor-pointer flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Choisir pour mon équipe</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
