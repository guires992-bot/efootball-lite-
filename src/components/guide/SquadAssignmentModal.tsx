import React, { useState } from 'react';
import { PlayerCard, SavedSquad } from '../../types';
import { loadAllSquads, saveAllSquads, CURRENT_SQUAD_ID_KEY } from '../../utils/squadStorage';
import { PLAYERS_DATABASE } from '../../data/playersDatabase';
import { X, Check, AlertTriangle, ArrowRight, Layers, UserPlus } from 'lucide-react';

interface SquadAssignmentModalProps {
  player: PlayerCard | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToBuilder: () => void;
}

export const SquadAssignmentModal: React.FC<SquadAssignmentModalProps> = ({
  player,
  isOpen,
  onClose,
  onGoToBuilder,
}) => {
  if (!isOpen || !player) return null;

  const allSquads = loadAllSquads();
  const currentActiveId = localStorage.getItem(CURRENT_SQUAD_ID_KEY);
  const [selectedSquadId, setSelectedSquadId] = useState<string>(
    allSquads.find((s) => s.id === currentActiveId)?.id || allSquads[0]?.id || ''
  );

  const activeSquad = allSquads.find((s) => s.id === selectedSquadId) || allSquads[0];

  // Target destination selection: slotId (e.g. 'pos-ac') or 'bench-0', 'bench-1', etc.
  const [targetDestination, setTargetDestination] = useState<string>(() => {
    // Default to natural position slot if exists
    if (!activeSquad) return '';
    const matchSlot = activeSquad.slots.find((s) => s.position === player.position);
    return matchSlot ? matchSlot.slotId : activeSquad.slots[0]?.slotId || '';
  });

  const [confirmReplace, setConfirmReplace] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!activeSquad) {
    return null;
  }

  // Check if player is already in this squad
  const existingPitchSlot = activeSquad.slots.find((s) => s.playerId === player.id);
  const existingBenchIdx = activeSquad.bench.findIndex((bId) => bId === player.id);
  const isAlreadyInSquad = Boolean(existingPitchSlot || existingBenchIdx !== -1);

  // Check who currently occupies the target destination
  const isBenchTarget = targetDestination.startsWith('bench-');
  const benchTargetIndex = isBenchTarget ? parseInt(targetDestination.replace('bench-', ''), 10) : -1;
  const targetPitchSlot = !isBenchTarget ? activeSquad.slots.find((s) => s.slotId === targetDestination) : null;

  const currentOccupantId = isBenchTarget
    ? activeSquad.bench[benchTargetIndex]
    : targetPitchSlot?.playerId || null;

  const currentOccupant = currentOccupantId ? PLAYERS_DATABASE.find((p) => p.id === currentOccupantId) : null;

  const handleConfirmAssignment = () => {
    // If destination is occupied by someone else and user hasn't confirmed replacement yet, ask confirmation
    if (currentOccupant && currentOccupant.id !== player.id && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }

    // Build new squad state
    let newSlots = [...activeSquad.slots];
    let newBench = [...activeSquad.bench];

    // Remove player from existing position if already in squad
    if (existingPitchSlot) {
      newSlots = newSlots.map((s) => (s.slotId === existingPitchSlot.slotId ? { ...s, playerId: null } : s));
    }
    if (existingBenchIdx !== -1) {
      newBench[existingBenchIdx] = null;
    }

    // Assign to target
    if (isBenchTarget) {
      newBench[benchTargetIndex] = player.id;
    } else if (targetPitchSlot) {
      newSlots = newSlots.map((s) => (s.slotId === targetPitchSlot.slotId ? { ...s, playerId: player.id } : s));
    }

    const updatedSquad: SavedSquad = {
      ...activeSquad,
      slots: newSlots,
      bench: newBench,
      updatedAt: new Date().toISOString(),
    };

    const updatedAllSquads = allSquads.map((s) => (s.id === updatedSquad.id ? updatedSquad : s));
    saveAllSquads(updatedAllSquads);
    localStorage.setItem(CURRENT_SQUAD_ID_KEY, updatedSquad.id);

    setSuccessMessage(
      `${player.name} a bien été assigné à la composition « ${updatedSquad.name} » !`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0b1322] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#070d18] border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Connexion Constructeur d'équipe
            </span>
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              Ajouter {player.name} à une composition
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-slate-300">
          {successMessage ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-2xl font-bold uppercase text-white">Affectation Réussie !</h4>
              <p className="text-slate-300 max-w-xs mx-auto">{successMessage}</p>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                >
                  Rester dans le guide
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onGoToBuilder();
                  }}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  <span>Aller au Constructeur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Squad Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  1. Choisir la composition de destination
                </label>
                <select
                  value={selectedSquadId}
                  onChange={(e) => {
                    setSelectedSquadId(e.target.value);
                    setConfirmReplace(false);
                  }}
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-500 text-xs"
                >
                  {allSquads.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.formationId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Slot Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  2. Choisir l'emplacement sur le terrain ou sur le banc
                </label>
                <select
                  value={targetDestination}
                  onChange={(e) => {
                    setTargetDestination(e.target.value);
                    setConfirmReplace(false);
                  }}
                  className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-500 text-xs"
                >
                  <optgroup label="Onze Titulaire">
                    {activeSquad.slots.map((s) => {
                      const occ = s.playerId ? PLAYERS_DATABASE.find((p) => p.id === s.playerId)?.name : 'Vide';
                      return (
                        <option key={s.slotId} value={s.slotId}>
                          {s.position} — Actuellement : {occ}
                        </option>
                      );
                    })}
                  </optgroup>
                  <optgroup label="Banc des Remplaçants (7 places)">
                    {activeSquad.bench.map((bId, idx) => {
                      const occ = bId ? PLAYERS_DATABASE.find((p) => p.id === bId)?.name : 'Vide';
                      return (
                        <option key={`bench-${idx}`} value={`bench-${idx}`}>
                          Remplaçant #{idx + 1} — Actuellement : {occ}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
              </div>

              {/* Warnings / Replacement Notices */}
              {isAlreadyInSquad && (
                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-[11px] text-blue-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    {player.name} est déjà présent dans cette composition (
                    {existingPitchSlot ? `Titulaire en ${existingPitchSlot.position}` : 'Sur le banc'}). Il sera automatiquement déplacé vers le nouvel emplacement.
                  </span>
                </div>
              )}

              {currentOccupant && currentOccupant.id !== player.id && (
                <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
                  confirmReplace
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Emplacement actuellement occupé :</strong>
                    <span>
                      Cet emplacement est occupé par <strong>{currentOccupant.name}</strong> ({currentOccupant.position} · Note {currentOccupant.overall}).
                    </span>
                    {confirmReplace && (
                      <span className="block text-amber-300 font-bold mt-1">
                        Cliquez à nouveau pour confirmer le remplacement de {currentOccupant.name} par {player.name}.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold uppercase tracking-wider text-xs"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  className={`cursor-pointer px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-white transition-all shadow ${
                    confirmReplace
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  {confirmReplace ? 'Confirmer le remplacement' : 'Valider l\'affectation'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
