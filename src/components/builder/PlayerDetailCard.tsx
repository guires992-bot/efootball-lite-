import React from 'react';
import { PlayerCard } from '../../types';
import { X, Shield, Star, Footprints, ThumbsUp, AlertCircle, Sparkles } from 'lucide-react';

interface PlayerDetailCardProps {
  player: PlayerCard | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignPlayer?: (player: PlayerCard) => void;
}

export const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({
  player,
  isOpen,
  onClose,
  onAssignPlayer,
}) => {
  if (!isOpen || !player) return null;

  const statItems = [
    { label: 'Vitesse / Accélération', value: player.keyStats.pace, color: 'bg-sky-500' },
    { label: 'Tir / Finition', value: player.keyStats.finishing, color: 'bg-emerald-500' },
    { label: 'Passe (courte & longue)', value: player.keyStats.passing, color: 'bg-blue-500' },
    { label: 'Dribble / Contrôle', value: player.keyStats.dribbling, color: 'bg-amber-500' },
    { label: 'Défense / Interception', value: player.keyStats.defending, color: 'bg-purple-500' },
    { label: 'Physique / Équilibre', value: player.keyStats.physical, color: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0b1322] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between p-5 bg-[#070d18] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black ${
                player.overall >= 94
                  ? 'bg-amber-400/20 text-amber-300 border-2 border-amber-400/40'
                  : 'bg-blue-600/20 text-blue-300 border-2 border-blue-400/40'
              }`}
            >
              <span className="text-2xl leading-none tabular-nums">{player.overall}</span>
              <span className="text-[10px] font-sans font-bold text-slate-300 mt-0.5">{player.position}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {player.club} · {player.nationality}
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                  Donnée démo
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold uppercase text-white leading-tight">
                {player.name}
              </h3>
              <p className="text-xs text-blue-400 font-semibold">{player.playStyle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
          
          {/* Postes & Pied préféré */}
          <div className="grid grid-cols-2 gap-3 bg-[#080e1a] p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block mb-0.5">Poste principal :</span>
              <span className="font-bold text-white text-sm">{player.position}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Postes secondaires :</span>
              <span className="font-bold text-slate-200">
                {player.secondaryPositions.length > 0 ? player.secondaryPositions.join(', ') : 'Aucun'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Pied de prédilection :</span>
              <span className="font-bold text-white">{player.preferredFoot}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Style de joueur :</span>
              <span className="font-bold text-emerald-400">{player.playStyle}</span>
            </div>
          </div>

          {/* Graphical Attribute Bars */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Caractéristiques Clés (Sur 100)</span>
            </h4>
            <div className="space-y-2.5">
              {statItems.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{stat.label}</span>
                    <span className="font-mono font-bold text-white tabular-nums">{stat.value}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points forts */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" />
              <span>Points Forts</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {player.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limites éventuelles */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Limites & Vigilances</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {player.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compétences de joueur */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Compétences Spéciales eFootball</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {player.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        {onAssignPlayer && (
          <div className="p-4 bg-[#070d18] border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Prêt pour l'incorporer dans ton onze ?</span>
            <button
              onClick={() => {
                onAssignPlayer(player);
                onClose();
              }}
              className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Assigner à l'emplacement
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
