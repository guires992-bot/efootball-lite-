import React from 'react';
import { PlayerCard } from '../../types';
import { Star, Eye, Scale, PlusCircle, Check } from 'lucide-react';

interface PlayerCardItemProps {
  player: PlayerCard;
  isFavorite: boolean;
  isInComparison: boolean;
  onToggleFavorite: (playerId: string) => void;
  onOpenDetails: (player: PlayerCard) => void;
  onToggleComparison: (player: PlayerCard) => void;
  onSelectForSquad: (player: PlayerCard) => void;
}

export const PlayerCardItem: React.FC<PlayerCardItemProps> = ({
  player,
  isFavorite,
  isInComparison,
  onToggleFavorite,
  onOpenDetails,
  onToggleComparison,
  onSelectForSquad,
}) => {
  return (
    <div className="esports-card group bg-[#0c1424] rounded-2xl border border-slate-800 hover:border-blue-500/50 p-4 sm:p-5 flex flex-col justify-between shadow-lg relative transition-all">
      
      {/* Top Header Row: Rating Badge, Position, Favorite Star */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Overall rating + Position */}
          <div className="flex items-center gap-2">
            <div
              className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono font-black shrink-0 ${
                player.overall >= 94
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                  : 'bg-blue-600/20 text-blue-300 border border-blue-400/40'
              }`}
            >
              <span className="text-lg leading-none tabular-nums">{player.overall}</span>
              <span className="text-[9px] font-sans font-bold text-slate-300">{player.position}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {player.club}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-white leading-tight group-hover:text-blue-400 transition-colors">
                {player.name}
              </h3>
            </div>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => onToggleFavorite(player.id)}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`cursor-pointer p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            aria-label={`Favori ${player.name}`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Player Secondary Attributes */}
        <div className="text-xs text-slate-400 space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <span>Style de jeu :</span>
            <span className="font-semibold text-white">{player.playStyle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pied fort :</span>
            <span className="text-slate-300">{player.preferredFoot}</span>
          </div>
          {player.secondaryPositions.length > 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span>Postes sec. :</span>
              <span className="text-blue-400">{player.secondaryPositions.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Strengths Pills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {player.strengths.slice(0, 2).map((str, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-950 truncate max-w-[200px]"
                title={str}
              >
                ✓ {str}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Bottom */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Voir la fiche */}
          <button
            onClick={() => onOpenDetails(player)}
            className="cursor-pointer py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Fiche</span>
          </button>

          {/* Comparer */}
          <button
            onClick={() => onToggleComparison(player)}
            className={`cursor-pointer py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              isInComparison
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white'
            }`}
          >
            {isInComparison ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sélectionné</span>
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Comparer</span>
              </>
            )}
          </button>
        </div>

        {/* Choisir pour mon équipe */}
        <button
          onClick={() => onSelectForSquad(player)}
          className="cursor-pointer w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 text-xs font-bold uppercase tracking-wider text-blue-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Choisir pour mon équipe</span>
        </button>
      </div>

    </div>
  );
};
