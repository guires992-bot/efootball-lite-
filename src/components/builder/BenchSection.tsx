import React from 'react';
import { PlayerCard } from '../../types';
import { Users, X, ArrowLeftRight, UserPlus, Info } from 'lucide-react';

interface BenchSectionProps {
  bench: (string | null)[];
  playersMap: Map<string, PlayerCard>;
  selectedBenchIndex: number | null;
  onSelectBenchSlot: (index: number) => void;
  onRemoveBenchPlayer: (index: number, e: React.MouseEvent) => void;
  onSwapWithPitch: (benchIndex: number) => void;
  onInspectPlayer: (player: PlayerCard) => void;
  selectedPitchSlotPlayerId: string | null;
}

export const BenchSection: React.FC<BenchSectionProps> = ({
  bench,
  playersMap,
  selectedBenchIndex,
  onSelectBenchSlot,
  onRemoveBenchPlayer,
  onSwapWithPitch,
  onInspectPlayer,
  selectedPitchSlotPlayerId,
}) => {
  const activePitchPlayer = selectedPitchSlotPlayerId ? playersMap.get(selectedPitchSlotPlayerId) : null;

  return (
    <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold uppercase text-white tracking-wide">
              Banc des Remplaçants
            </h4>
            <p className="text-xs text-slate-400">7 remplaçants maximum pour tes ajustements tactiques</p>
          </div>
        </div>

        {activePitchPlayer && (
          <div className="text-xs text-blue-300 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40 flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              Titulaire sélectionné : <strong className="text-white">{activePitchPlayer.name}</strong>. Cliquez sur un remplaçant pour intervertir.
            </span>
          </div>
        )}
      </div>

      {/* 7 Bench Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {bench.map((playerId, index) => {
          const player = playerId ? playersMap.get(playerId) : null;
          const isSelected = selectedBenchIndex === index;

          return (
            <div
              key={index}
              onClick={() => onSelectBenchSlot(index)}
              className={`group relative rounded-xl p-2.5 transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                isSelected
                  ? 'bg-blue-900/60 border-2 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : player
                  ? 'bg-[#0e192e] border border-slate-700/80 hover:border-slate-500'
                  : 'bg-slate-900/40 border border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              {player ? (
                <>
                  {/* Remove Button */}
                  <button
                    onClick={(e) => onRemoveBenchPlayer(index, e)}
                    title="Retirer du banc"
                    className="cursor-pointer absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-500 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 shadow transition-opacity"
                    aria-label={`Retirer ${player.name} du banc`}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1 rounded">
                        {player.position}
                      </span>
                      <span className="font-mono text-xs font-bold text-white tabular-nums">
                        {player.overall}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white truncate" title={player.name}>
                      {player.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{player.playStyle}</p>
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectPlayer(player);
                      }}
                      className="cursor-pointer text-[9px] text-slate-400 hover:text-white"
                    >
                      Détails
                    </button>

                    {activePitchPlayer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSwapWithPitch(index);
                        }}
                        className="cursor-pointer text-[9px] font-bold uppercase text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                      >
                        <ArrowLeftRight className="w-2.5 h-2.5" />
                        <span>Échanger</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-2 text-slate-400 group-hover:text-slate-200">
                  <UserPlus className="w-4 h-4 mb-1 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="text-[10px] font-semibold text-center">Remplaçant #{index + 1}</span>
                  <span className="text-[8px] text-slate-400 mt-0.5">+ Ajouter</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
