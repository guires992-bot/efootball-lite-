import React from 'react';
import { SquadSlot, PlayerCard } from '../../types';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

interface FootballPitchProps {
  slots: SquadSlot[];
  selectedSlotId: string | null;
  playersMap: Map<string, PlayerCard>;
  onSelectSlot: (slot: SquadSlot) => void;
  onRemovePlayerFromSlot: (slotId: string, e: React.MouseEvent) => void;
  onInspectPlayer: (player: PlayerCard, e: React.MouseEvent) => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  slots,
  selectedSlotId,
  playersMap,
  onSelectSlot,
  onRemovePlayerFromSlot,
  onInspectPlayer,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.7)] bg-[#07130f] select-none">
      
      {/* Top Banner indicating opponent half */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/60 bg-black/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Attaque / But Adverse ↑
        </span>
      </div>

      {/* SVG Pitch Canvas with standard football pitch markings */}
      <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full min-h-[460px] sm:min-h-[540px]">
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Lawn stripes pattern */}
            <pattern id="pitch-stripes" width="800" height="60" patternUnits="userSpaceOnUse">
              <rect width="800" height="30" fill="#081813" />
              <rect y="30" width="800" height="30" fill="#0b1f19" />
            </pattern>
            {/* Field lines stroke style */}
            <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Grass background */}
          <rect width="800" height="600" fill="url(#pitch-stripes)" />

          {/* Outer Boundary line */}
          <rect
            x="30"
            y="25"
            width="740"
            height="550"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="2.5"
            rx="6"
          />

          {/* Halfway line */}
          <line
            x1="30"
            y1="300"
            x2="770"
            y2="300"
            stroke="url(#line-glow)"
            strokeWidth="2"
          />

          {/* Center Circle */}
          <circle
            cx="400"
            cy="300"
            r="70"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="2"
          />
          {/* Center Spot */}
          <circle cx="400" cy="300" r="3.5" fill="#34d399" opacity="0.6" />

          {/* Top Penalty Box (Opponent Goal) */}
          <rect
            x="240"
            y="25"
            width="320"
            height="110"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="2"
          />
          {/* Top 6-yard Box */}
          <rect
            x="320"
            y="25"
            width="160"
            height="40"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="1.8"
          />
          {/* Top Penalty Spot */}
          <circle cx="400" cy="90" r="3" fill="#34d399" opacity="0.6" />
          {/* Top Penalty Arc */}
          <path
            d="M 340 135 A 65 65 0 0 0 460 135"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="1.8"
          />
          {/* Top Goal Net */}
          <rect
            x="340"
            y="12"
            width="120"
            height="13"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Bottom Penalty Box (Our Goal) */}
          <rect
            x="240"
            y="465"
            width="320"
            height="110"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="2"
          />
          {/* Bottom 6-yard Box */}
          <rect
            x="320"
            y="535"
            width="160"
            height="40"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="1.8"
          />
          {/* Bottom Penalty Spot */}
          <circle cx="400" cy="510" r="3" fill="#34d399" opacity="0.6" />
          {/* Bottom Penalty Arc */}
          <path
            d="M 340 465 A 65 65 0 0 1 460 465"
            fill="none"
            stroke="url(#line-glow)"
            strokeWidth="1.8"
          />
          {/* Bottom Goal Net */}
          <rect
            x="340"
            y="575"
            width="120"
            height="13"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Corner Arcs */}
          <path d="M 30 40 A 15 15 0 0 0 45 25" fill="none" stroke="url(#line-glow)" strokeWidth="1.5" />
          <path d="M 755 25 A 15 15 0 0 0 770 40" fill="none" stroke="url(#line-glow)" strokeWidth="1.5" />
          <path d="M 30 560 A 15 15 0 0 1 45 575" fill="none" stroke="url(#line-glow)" strokeWidth="1.5" />
          <path d="M 755 575 A 15 15 0 0 1 770 560" fill="none" stroke="url(#line-glow)" strokeWidth="1.5" />
        </svg>

        {/* 11 Player Placement Nodes */}
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.slotId;
          const player = slot.playerId ? playersMap.get(slot.playerId) : null;
          const isOutOfPosition = player && player.position !== slot.position && !player.secondaryPositions.includes(slot.position);

          return (
            <div
              key={slot.slotId}
              onClick={() => onSelectSlot(slot)}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
              }`}
            >
              {player ? (
                /* Assigned Player Card node */
                <div
                  className={`group relative flex flex-col items-center rounded-xl p-1.5 transition-all ${
                    isSelected
                      ? 'bg-blue-900/95 ring-2 ring-blue-400 ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(56,189,248,0.7)]'
                      : 'bg-[#0b1424]/90 hover:bg-[#101d36] border border-blue-500/40 shadow-lg'
                  }`}
                >
                  {/* Quick Remove Button (X) */}
                  <button
                    onClick={(e) => onRemovePlayerFromSlot(slot.slotId, e)}
                    title="Retirer ce joueur"
                    className="cursor-pointer absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 shadow-md transition-opacity z-20"
                    aria-label={`Retirer ${player.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Rating + Position Badge */}
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 w-full justify-between">
                    <span
                      className={`font-mono text-xs font-black tabular-nums px-1.5 py-0.2 rounded ${
                        player.overall >= 94
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-blue-500/20 text-sky-300 border border-blue-400/30'
                      }`}
                    >
                      {player.overall}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                      {slot.position}
                    </span>
                  </div>

                  {/* Player Name */}
                  <div className="mt-0.5 px-1 text-center max-w-[85px] sm:max-w-[100px]">
                    <p className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight">
                      {player.name}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {player.playStyle}
                    </p>
                  </div>

                  {/* Out of position warning icon if playing unsuited role */}
                  {isOutOfPosition && (
                    <div
                      title={`Avertissement : ${player.name} est ${player.position} et joue en ${slot.position}`}
                      className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center shadow"
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                    </div>
                  )}

                  {/* Inspect info trigger */}
                  <button
                    onClick={(e) => onInspectPlayer(player, e)}
                    className="cursor-pointer text-[8px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Fiche info
                  </button>
                </div>
              ) : (
                /* Empty Slot Node */
                <div
                  className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all ${
                    isSelected
                      ? 'bg-blue-600/30 border-2 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                      : 'bg-black/60 hover:bg-black/80 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400'
                  }`}
                >
                  <span className="font-heading text-xs sm:text-sm font-bold text-emerald-300">
                    {slot.position}
                  </span>
                  <div className="flex items-center gap-0.5 text-[9px] text-slate-300 font-medium">
                    <UserPlus className="w-2.5 h-2.5 text-blue-400" />
                    <span>Choisir</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Pitch Legend */}
      <div className="bg-[#050e0b] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Poste assigné</span>
          <span className="text-slate-600">·</span>
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-500" />
          <span>Emplacement vide</span>
        </div>
        <span className="text-[11px] text-slate-400">Cliquez sur un joueur pour le remplacer ou consulter sa fiche</span>
      </div>

    </div>
  );
};
