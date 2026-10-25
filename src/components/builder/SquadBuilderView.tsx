import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SavedSquad,
  SquadSlot,
  PlayerCard,
  TacticalStyle,
} from '../../types';
import { FORMATIONS_LIST } from '../../data/formationsData';
import { PLAYERS_DATABASE } from '../../data/playersDatabase';
import {
  loadAllSquads,
  saveAllSquads,
  createDefaultSquad,
  applyFormationToSquad,
  exportSquadToJsonFile,
  validateAndParseSquadJson,
  CURRENT_SQUAD_ID_KEY,
} from '../../utils/squadStorage';
import { useAuth } from '../../contexts/AuthContext';
import { syncSingleSquadOnline, deleteSquadOnline } from '../../services/syncService';
import { FootballPitch } from './FootballPitch';
import { BenchSection } from './BenchSection';
import { PlayerPicker } from './PlayerPicker';
import { PlayerDetailCard } from './PlayerDetailCard';
import { TacticsPanel } from './TacticsPanel';
import {
  ArrowLeft,
  Save,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SquadBuilderViewProps {
  onBackToHome: () => void;
  onGoToGuide?: () => void;
}

export const SquadBuilderView: React.FC<SquadBuilderViewProps> = ({ onBackToHome, onGoToGuide }) => {
  const { user } = useAuth();

  // All saved squads and active squad
  const [squads, setSquads] = useState<SavedSquad[]>([]);
  const [activeSquadId, setActiveSquadId] = useState<string>('');

  // Currently selected slot on pitch for replacement/assignment
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  // Currently selected bench index (0-6)
  const [selectedBenchIndex, setSelectedBenchIndex] = useState<number | null>(null);

  // Inspected player for detail modal
  const [inspectedPlayer, setInspectedPlayer] = useState<PlayerCard | null>(null);

  // Mobile active tab view: 'pitch' | 'players' | 'tactics' | 'manager'
  const [mobileTab, setMobileTab] = useState<'pitch' | 'players' | 'tactics' | 'manager'>('pitch');

  // Feedback toast message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Rename modal
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  // Hidden file input for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map of players by ID for fast lookup
  const playersMap = useMemo(() => {
    const map = new Map<string, PlayerCard>();
    PLAYERS_DATABASE.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Initialize squads from localStorage on mount
  useEffect(() => {
    const loaded = loadAllSquads();
    setSquads(loaded);

    const savedActiveId = localStorage.getItem(CURRENT_SQUAD_ID_KEY);
    const initialActive = loaded.find((s) => s.id === savedActiveId) || loaded[0];
    if (initialActive) {
      setActiveSquadId(initialActive.id);
    }
  }, []);

  // Active squad object
  const activeSquad = useMemo(() => {
    return squads.find((s) => s.id === activeSquadId) || squads[0] || null;
  }, [squads, activeSquadId]);

  // Set of assigned player IDs on pitch
  const pitchAssignedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    if (!activeSquad) return set;
    activeSquad.slots.forEach((s) => {
      if (s.playerId) set.add(s.playerId);
    });
    return set;
  }, [activeSquad]);

  // Set of assigned player IDs on bench
  const benchAssignedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    if (!activeSquad) return set;
    activeSquad.bench.forEach((id) => {
      if (id) set.add(id);
    });
    return set;
  }, [activeSquad]);

  // Trigger temporary toast
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update squad in state and localStorage
  const updateActiveSquad = (updated: SavedSquad) => {
    const newSquads = squads.map((s) => (s.id === updated.id ? updated : s));
    setSquads(newSquads);
    saveAllSquads(newSquads);
    localStorage.setItem(CURRENT_SQUAD_ID_KEY, updated.id);

    if (user) {
      syncSingleSquadOnline(user.id, updated);
    }
  };

  // Switch Active Squad
  const handleSelectSquad = (squadId: string) => {
    setActiveSquadId(squadId);
    setSelectedSlotId(null);
    setSelectedBenchIndex(null);
    localStorage.setItem(CURRENT_SQUAD_ID_KEY, squadId);
  };

  // 1. Formation Change with Intelligent Player Preservation
  const handleFormationChange = (targetFormationId: string) => {
    if (!activeSquad || activeSquad.formationId === targetFormationId) return;

    const assignedCount = activeSquad.slots.filter((s) => s.playerId !== null).length;
    
    // If players are assigned, perform intelligent migration
    const { updatedSquad, reallocatedCount, benchedCount } = applyFormationToSquad(activeSquad, targetFormationId);
    updateActiveSquad(updatedSquad);

    let msg = `Formation changée en ${targetFormationId}.`;
    if (assignedCount > 0) {
      msg += ` ${reallocatedCount} joueurs réaffectés.`;
      if (benchedCount > 0) msg += ` ${benchedCount} déplacé(s) sur le banc.`;
    }
    showToast(msg, 'info');
  };

  // 2. Select Slot on Pitch
  const handleSelectPitchSlot = (slot: SquadSlot) => {
    // If a bench player was selected, swap them immediately!
    if (selectedBenchIndex !== null) {
      handleSwapBenchWithPitch(selectedBenchIndex, slot.slotId);
      setSelectedBenchIndex(null);
      return;
    }

    setSelectedSlotId(slot.slotId);
    setSelectedBenchIndex(null);
    // Switch to players tab on mobile automatically
    setMobileTab('players');
  };

  // 3. Remove Player from Pitch Slot
  const handleRemovePlayerFromSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSquad) return;

    const slot = activeSquad.slots.find((s) => s.slotId === slotId);
    const playerName = slot?.playerId ? playersMap.get(slot.playerId)?.name : 'Joueur';

    const newSlots = activeSquad.slots.map((s) => (s.slotId === slotId ? { ...s, playerId: null } : s));
    const updated = { ...activeSquad, slots: newSlots, updatedAt: new Date().toISOString() };
    updateActiveSquad(updated);
    showToast(`${playerName} retiré du terrain.`, 'info');
  };

  // 4. Select Player from Picker into Target Slot or Bench
  const handleAssignPlayer = (player: PlayerCard) => {
    if (!activeSquad) return;

    // Check if player is already assigned on pitch
    const existingPitchSlot = activeSquad.slots.find((s) => s.playerId === player.id);
    const existingBenchIdx = activeSquad.bench.findIndex((bId) => bId === player.id);

    // Case A: Target is a pitch slot
    if (selectedSlotId) {
      // If player is already on the exact target slot, nothing to do
      if (existingPitchSlot && existingPitchSlot.slotId === selectedSlotId) {
        showToast(`${player.name} est déjà titulaire à ce poste.`, 'info');
        return;
      }

      // If player is already on another pitch slot: move or swap!
      if (existingPitchSlot) {
        const targetSlot = activeSquad.slots.find((s) => s.slotId === selectedSlotId);
        const currentPlayerOnTarget = targetSlot?.playerId;

        const newSlots = activeSquad.slots.map((s) => {
          if (s.slotId === selectedSlotId) {
            return { ...s, playerId: player.id };
          }
          if (s.slotId === existingPitchSlot.slotId) {
            return { ...s, playerId: currentPlayerOnTarget || null };
          }
          return s;
        });

        const updated = { ...activeSquad, slots: newSlots, updatedAt: new Date().toISOString() };
        updateActiveSquad(updated);
        showToast(`${player.name} déplacé au poste ${targetSlot?.position}.`, 'success');
        setSelectedSlotId(null);
        setMobileTab('pitch');
        return;
      }

      // If player is currently on the bench: promote to pitch!
      if (existingBenchIdx !== -1) {
        const targetSlot = activeSquad.slots.find((s) => s.slotId === selectedSlotId);
        const currentPlayerOnTarget = targetSlot?.playerId;

        const newBench = [...activeSquad.bench];
        newBench[existingBenchIdx] = currentPlayerOnTarget || null;

        const newSlots = activeSquad.slots.map((s) =>
          s.slotId === selectedSlotId ? { ...s, playerId: player.id } : s
        );

        const updated = {
          ...activeSquad,
          slots: newSlots,
          bench: newBench,
          updatedAt: new Date().toISOString(),
        };
        updateActiveSquad(updated);
        showToast(`${player.name} passe du banc au onze titulaire !`, 'success');
        setSelectedSlotId(null);
        setMobileTab('pitch');
        return;
      }

      // Fresh assignment to pitch slot
      const newSlots = activeSquad.slots.map((s) =>
        s.slotId === selectedSlotId ? { ...s, playerId: player.id } : s
      );
      const updated = { ...activeSquad, slots: newSlots, updatedAt: new Date().toISOString() };
      updateActiveSquad(updated);
      showToast(`${player.name} assigné au poste.`, 'success');
      setSelectedSlotId(null);
      setMobileTab('pitch');
      return;
    }

    // Case B: Target is a bench slot
    if (selectedBenchIndex !== null) {
      // If player is already on pitch, swap with bench!
      if (existingPitchSlot) {
        const currentBenchPlayerId = activeSquad.bench[selectedBenchIndex];

        const newSlots = activeSquad.slots.map((s) =>
          s.slotId === existingPitchSlot.slotId ? { ...s, playerId: currentBenchPlayerId || null } : s
        );

        const newBench = [...activeSquad.bench];
        newBench[selectedBenchIndex] = player.id;

        const updated = {
          ...activeSquad,
          slots: newSlots,
          bench: newBench,
          updatedAt: new Date().toISOString(),
        };
        updateActiveSquad(updated);
        showToast(`${player.name} envoyé sur le banc.`, 'success');
        setSelectedBenchIndex(null);
        setMobileTab('pitch');
        return;
      }

      // Add to bench
      const newBench = [...activeSquad.bench];
      newBench[selectedBenchIndex] = player.id;
      const updated = { ...activeSquad, bench: newBench, updatedAt: new Date().toISOString() };
      updateActiveSquad(updated);
      showToast(`${player.name} ajouté aux remplaçants.`, 'success');
      setSelectedBenchIndex(null);
      setMobileTab('pitch');
      return;
    }

    // Default: If no slot was explicitly active, find first empty pitch slot or bench slot
    const firstEmptyPitchSlot = activeSquad.slots.find((s) => s.playerId === null);
    if (firstEmptyPitchSlot) {
      const newSlots = activeSquad.slots.map((s) =>
        s.slotId === firstEmptyPitchSlot.slotId ? { ...s, playerId: player.id } : s
      );
      updateActiveSquad({ ...activeSquad, slots: newSlots, updatedAt: new Date().toISOString() });
      showToast(`${player.name} placé en ${firstEmptyPitchSlot.position}.`, 'success');
      return;
    }

    const firstEmptyBenchIndex = activeSquad.bench.findIndex((b) => b === null);
    if (firstEmptyBenchIndex !== -1) {
      const newBench = [...activeSquad.bench];
      newBench[firstEmptyBenchIndex] = player.id;
      updateActiveSquad({ ...activeSquad, bench: newBench, updatedAt: new Date().toISOString() });
      showToast(`${player.name} ajouté au banc (Onze titulaire complet).`, 'info');
      return;
    }

    showToast('Le onze de départ et le banc sont complets.', 'error');
  };

  // 5. Swap Bench Player with Pitch Slot
  const handleSwapBenchWithPitch = (benchIndex: number, pitchSlotId?: string) => {
    if (!activeSquad) return;
    const targetPitchSlotId = pitchSlotId || selectedSlotId;
    if (!targetPitchSlotId) {
      setSelectedBenchIndex(benchIndex);
      showToast('Sélectionnez maintenant un joueur titulaire sur le terrain pour intervertir.', 'info');
      return;
    }

    const pitchSlot = activeSquad.slots.find((s) => s.slotId === targetPitchSlotId);
    const pitchPlayerId = pitchSlot?.playerId || null;
    const benchPlayerId = activeSquad.bench[benchIndex] || null;

    if (!pitchPlayerId && !benchPlayerId) return;

    const newSlots = activeSquad.slots.map((s) =>
      s.slotId === targetPitchSlotId ? { ...s, playerId: benchPlayerId } : s
    );

    const newBench = [...activeSquad.bench];
    newBench[benchIndex] = pitchPlayerId;

    const updated = { ...activeSquad, slots: newSlots, bench: newBench, updatedAt: new Date().toISOString() };
    updateActiveSquad(updated);

    const bName = benchPlayerId ? playersMap.get(benchPlayerId)?.name : 'Emplacement vide';
    const pName = pitchPlayerId ? playersMap.get(pitchPlayerId)?.name : 'Emplacement vide';
    showToast(`Remplacement effectué : ${bName} ⇄ ${pName}`, 'success');
    setSelectedSlotId(null);
    setSelectedBenchIndex(null);
  };

  // 6. Remove Bench Player
  const handleRemoveBenchPlayer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSquad) return;
    const player = activeSquad.bench[index] ? playersMap.get(activeSquad.bench[index] as string) : null;
    const newBench = [...activeSquad.bench];
    newBench[index] = null;
    updateActiveSquad({ ...activeSquad, bench: newBench, updatedAt: new Date().toISOString() });
    showToast(`${player ? player.name : 'Remplaçant'} retiré du banc.`, 'info');
  };

  // 7. Tactical Style Change
  const handleSelectTacticalStyle = (style: TacticalStyle) => {
    if (!activeSquad) return;
    updateActiveSquad({ ...activeSquad, playstyle: style, updatedAt: new Date().toISOString() });
    showToast(`Style d'équipe configuré sur : ${style}.`, 'success');
  };

  // 8. Management Actions: New, Rename, Duplicate, Delete, Reset
  const handleCreateNewSquad = () => {
    const newName = `Compo ${squads.length + 1}`;
    const newSquad = createDefaultSquad(`squad-${Date.now()}`, newName, activeSquad?.formationId || '4-2-1-3');
    const newSquads = [...squads, newSquad];
    setSquads(newSquads);
    saveAllSquads(newSquads);
    setActiveSquadId(newSquad.id);
    showToast(`Nouvelle composition « ${newName} » créée !`, 'success');
  };

  const handleDuplicateSquad = () => {
    if (!activeSquad) return;
    const dupSquad: SavedSquad = {
      ...activeSquad,
      id: `squad-${Date.now()}`,
      name: `${activeSquad.name} (Copie)`,
      updatedAt: new Date().toISOString(),
    };
    const newSquads = [...squads, dupSquad];
    setSquads(newSquads);
    saveAllSquads(newSquads);
    setActiveSquadId(dupSquad.id);
    showToast(`Composition dupliquée avec succès.`, 'success');
  };

  const handleDeleteSquad = () => {
    if (!activeSquad) return;
    if (squads.length <= 1) {
      showToast('Impossible de supprimer la seule composition restante.', 'error');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Confirmer la suppression',
      message: `Êtes-vous certain de vouloir supprimer définitivement la composition « ${activeSquad.name} » ?`,
      onConfirm: () => {
        const deletedId = activeSquad.id;
        const remaining = squads.filter((s) => s.id !== deletedId);
        setSquads(remaining);
        saveAllSquads(remaining);
        setActiveSquadId(remaining[0].id);
        setConfirmDialog(null);

        if (user) {
          deleteSquadOnline(user.id, deletedId);
        }

        showToast('Composition supprimée.', 'info');
      },
    });
  };

  const handleResetCurrentSquad = () => {
    if (!activeSquad) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Réinitialiser le onze et le banc ?',
      message: 'Cette action videra les 11 postes du terrain et les 7 remplaçants de cette composition.',
      onConfirm: () => {
        const clearedSlots = activeSquad.slots.map((s) => ({ ...s, playerId: null }));
        const clearedBench = [null, null, null, null, null, null, null];
        const updated = { ...activeSquad, slots: clearedSlots, bench: clearedBench, updatedAt: new Date().toISOString() };
        updateActiveSquad(updated);
        setConfirmDialog(null);
        showToast('Composition réinitialisée.', 'info');
      },
    });
  };

  const handleSaveRename = () => {
    if (!activeSquad || !renameInput.trim()) return;
    updateActiveSquad({ ...activeSquad, name: renameInput.trim(), updatedAt: new Date().toISOString() });
    setRenameModalOpen(false);
    showToast(`Composition renommée en « ${renameInput.trim()} ».`, 'success');
  };

  // 9. Export & Import JSON
  const handleExportJSON = () => {
    if (!activeSquad) return;
    exportSquadToJsonFile(activeSquad);
    showToast('Fichier JSON téléchargé !', 'success');
  };

  const handleImportJSONClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateAndParseSquadJson(content);
      if (result.success && result.squad) {
        const newSquads = [...squads, result.squad];
        setSquads(newSquads);
        saveAllSquads(newSquads);
        setActiveSquadId(result.squad.id);
        showToast(`Composition « ${result.squad.name} » importée avec succès !`, 'success');
      } else {
        showToast(result.error || 'Erreur lors de l\'importation.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Active target slot details for PlayerPicker
  const activeTargetSlot = useMemo(() => {
    if (!activeSquad || !selectedSlotId) return null;
    return activeSquad.slots.find((s) => s.slotId === selectedSlotId) || null;
  }, [activeSquad, selectedSlotId]);

  // Overall average rating calculation
  const averageStartingRating = useMemo(() => {
    if (!activeSquad) return 0;
    const filledPlayers = activeSquad.slots
      .map((s) => (s.playerId ? playersMap.get(s.playerId) : null))
      .filter((p): p is PlayerCard => p !== null);

    if (filledPlayers.length === 0) return 0;
    const sum = filledPlayers.reduce((acc, curr) => acc + curr.overall, 0);
    return Math.round(sum / filledPlayers.length);
  }, [activeSquad, playersMap]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
      
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Top Bar for Builder */}
      <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Retour à l'accueil eFootball Elite</span>
          <span className="sm:hidden">Accueil</span>
        </button>

        {/* Squad Quick Switcher Dropdown */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-center">
          <label className="text-[11px] text-slate-400 uppercase font-semibold hidden md:inline">Composition :</label>
          <select
            value={activeSquadId}
            onChange={(e) => handleSelectSquad(e.target.value)}
            className="bg-[#0b1322] border border-blue-500/40 text-white text-xs sm:text-sm rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-blue-400 max-w-[200px] sm:max-w-[260px] truncate"
          >
            {squads.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.formationId})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setRenameInput(activeSquad?.name || '');
              setRenameModalOpen(true);
            }}
            title="Renommer la composition"
            className="cursor-pointer p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons: Export / Import / New */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleExportJSON}
            title="Exporter la composition au format JSON"
            className="cursor-pointer p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Exporter</span>
          </button>

          <button
            onClick={handleImportJSONClick}
            title="Importer une composition JSON"
            className="cursor-pointer p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Importer</span>
          </button>

          {onGoToGuide && (
            <button
              onClick={onGoToGuide}
              title="Consulter le Guide des Joueurs et Comparateur"
              className="cursor-pointer p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Guide & Comparateur</span>
            </button>
          )}

          <button
            onClick={handleCreateNewSquad}
            title="Créer une nouvelle composition"
            className="cursor-pointer px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouvelle</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Page Title & Subtitle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <span>Constructeur Tactique</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">Sauvegarde Navigateur Active</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            CONSTRUIS TON ÉQUIPE IDÉALE
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-1">
            Choisis ta formation, sélectionne tes joueurs et prépare ta stratégie.
          </p>
        </div>

        {/* Global Statistics & Formation Strip */}
        <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          {/* A. Sélecteur de Formation (The 7 required formations) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider whitespace-nowrap mr-1">
              Formation :
            </span>
            {FORMATIONS_LIST.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFormationChange(f.id)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl font-heading text-xs font-bold tracking-wider transition-all whitespace-nowrap border ${
                  activeSquad?.formationId === f.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics (Overall Average + Tactical Style) */}
          <div className="flex items-center gap-4 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Note Moyenne :</span>
              <span className="font-mono text-base font-extrabold text-white tabular-nums bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {averageStartingRating > 0 ? averageStartingRating : '--'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Style :</span>
              <span className="text-emerald-400 font-bold whitespace-nowrap">
                {activeSquad?.playstyle}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Switcher (Visible only on small viewports) */}
        <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6 text-xs">
          <button
            onClick={() => setMobileTab('pitch')}
            className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
              mobileTab === 'pitch' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚽ Terrain & Banc
          </button>
          <button
            onClick={() => setMobileTab('players')}
            className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
              mobileTab === 'players' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 Joueurs ({PLAYERS_DATABASE.length})
          </button>
          <button
            onClick={() => setMobileTab('tactics')}
            className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
              mobileTab === 'tactics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            💡 Stratégie
          </button>
          <button
            onClick={() => setMobileTab('manager')}
            className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
              mobileTab === 'manager' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Gestion
          </button>
        </div>

        {/* Main Grid: Desktop Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT / CENTER: Pitch + Bench (Col 7 on Desktop) */}
          <div className={`lg:col-span-7 space-y-6 ${mobileTab !== 'pitch' ? 'hidden lg:block' : 'block'}`}>
            {/* Interactive Football Pitch */}
            {activeSquad && (
              <FootballPitch
                slots={activeSquad.slots}
                selectedSlotId={selectedSlotId}
                playersMap={playersMap}
                onSelectSlot={handleSelectPitchSlot}
                onRemovePlayerFromSlot={handleRemovePlayerFromSlot}
                onInspectPlayer={(p, e) => {
                  e.stopPropagation();
                  setInspectedPlayer(p);
                }}
              />
            )}

            {/* Bench Section */}
            {activeSquad && (
              <BenchSection
                bench={activeSquad.bench}
                playersMap={playersMap}
                selectedBenchIndex={selectedBenchIndex}
                onSelectBenchSlot={(idx) => {
                  setSelectedBenchIndex(idx);
                  setSelectedSlotId(null);
                  setMobileTab('players');
                }}
                onRemoveBenchPlayer={handleRemoveBenchPlayer}
                onSwapWithPitch={(benchIdx) => handleSwapBenchWithPitch(benchIdx)}
                onInspectPlayer={(p) => setInspectedPlayer(p)}
                selectedPitchSlotPlayerId={
                  selectedSlotId
                    ? activeSquad.slots.find((s) => s.slotId === selectedSlotId)?.playerId || null
                    : null
                }
              />
            )}
          </div>

          {/* RIGHT COLUMN: Player Picker & Tactics & Management (Col 5 on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Desktop Tabs Header between Player Picker & Tactics Guide */}
            <div className="hidden lg:flex items-center gap-2 bg-[#0b1322] p-1.5 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setMobileTab('players')}
                className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
                  mobileTab === 'players' || mobileTab === 'pitch'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Liste des Joueurs
              </button>
              <button
                onClick={() => setMobileTab('tactics')}
                className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
                  mobileTab === 'tactics'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Conseils Tactiques
              </button>
              <button
                onClick={() => setMobileTab('manager')}
                className={`cursor-pointer flex-1 py-2 font-bold uppercase tracking-wider rounded-lg text-center transition-colors ${
                  mobileTab === 'manager'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gestion Compo
              </button>
            </div>

            {/* Section C: Player Picker */}
            {(mobileTab === 'players' || (mobileTab === 'pitch' && typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <PlayerPicker
                targetSlotPosition={activeTargetSlot ? activeTargetSlot.position : null}
                targetSlotLabel={activeTargetSlot ? activeTargetSlot.position : null}
                alreadyAssignedPlayerIds={pitchAssignedPlayerIds}
                benchPlayerIds={benchAssignedPlayerIds}
                onSelectPlayer={handleAssignPlayer}
                onInspectPlayer={(p) => setInspectedPlayer(p)}
                onClose={selectedSlotId ? () => setSelectedSlotId(null) : undefined}
              />
            )}

            {/* Section G: Tactics Panel */}
            {mobileTab === 'tactics' && activeSquad && (
              <TacticsPanel
                currentStyle={activeSquad.playstyle}
                onSelectStyle={handleSelectTacticalStyle}
                onApplyRecommendedFormation={handleFormationChange}
              />
            )}

            {/* Section F: Management Panel */}
            {mobileTab === 'manager' && activeSquad && (
              <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-5 shadow-lg space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                    Gestion de la Composition
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gère tes schémas, sauvegarde dans ton navigateur et partage via export JSON.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setRenameInput(activeSquad.name);
                      setRenameModalOpen(true);
                    }}
                    className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between"
                  >
                    <span>Renommer la composition</span>
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleDuplicateSquad}
                    className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between"
                  >
                    <span>Dupliquer cette équipe</span>
                    <Copy className="w-4 h-4 text-blue-400" />
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between"
                  >
                    <span>Exporter le fichier JSON</span>
                    <Download className="w-4 h-4 text-sky-400" />
                  </button>

                  <button
                    onClick={handleImportJSONClick}
                    className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between"
                  >
                    <span>Importer un fichier JSON</span>
                    <Upload className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={handleResetCurrentSquad}
                    className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between"
                  >
                    <span>Vider le terrain et le banc</span>
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                  </button>

                  {squads.length > 1 && (
                    <button
                      onClick={handleDeleteSquad}
                      className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-bold uppercase tracking-wider text-red-300 flex items-center justify-between"
                    >
                      <span>Supprimer cette composition</span>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>

                <div className="p-3 bg-[#080d19] rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-white block mb-0.5">Sauvegarde Locale Active :</strong>
                  Toutes les modifications sont automatiquement conservées dans le localStorage de votre navigateur ({squads.length} composition{squads.length > 1 ? 's' : ''} enregistrée{squads.length > 1 ? 's' : ''}). Elle ne synchronise pas avec un autre appareil sans export JSON.
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Toast notification banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border ${
            toastMessage.type === 'error'
              ? 'bg-red-950 border-red-700 text-white'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 border-blue-500 text-blue-200'
              : 'bg-[#0b1c16] border-emerald-500 text-emerald-200'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Inspected Player Detailed Modal */}
      <PlayerDetailCard
        player={inspectedPlayer}
        isOpen={inspectedPlayer !== null}
        onClose={() => setInspectedPlayer(null)}
        onAssignPlayer={handleAssignPlayer}
      />

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b1322] border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h4 className="font-heading text-xl font-bold uppercase text-white">Renommer la composition</h4>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="Ex: Mon Onze Méta"
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRenameModalOpen(false)}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveRename}
                className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b1322] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h4 className="font-heading text-xl font-bold uppercase text-white">{confirmDialog.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="cursor-pointer px-4 py-2 rounded-xl bg-red-600 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
