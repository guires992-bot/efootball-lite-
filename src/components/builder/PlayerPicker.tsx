import React, { useState, useMemo } from 'react';
import { PlayerCard, PlayerPosition, PositionCategory } from '../../types';
import { PLAYERS_DATABASE } from '../../data/playersDatabase';
import { Search, Filter, ArrowUpDown, AlertCircle, Check, Info, Eye } from 'lucide-react';

interface PlayerPickerProps {
  targetSlotPosition: PlayerPosition | null;
  targetSlotLabel: string | null;
  alreadyAssignedPlayerIds: Set<string>;
  benchPlayerIds: Set<string>;
  onSelectPlayer: (player: PlayerCard) => void;
  onInspectPlayer: (player: PlayerCard) => void;
  onClose?: () => void;
}

export const PlayerPicker: React.FC<PlayerPickerProps> = ({
  targetSlotPosition,
  targetSlotLabel,
  alreadyAssignedPlayerIds,
  benchPlayerIds,
  onSelectPlayer,
  onInspectPlayer,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PositionCategory>('TOUS');
  const [exactPositionFilter, setExactPositionFilter] = useState<string>('TOUS');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [styleFilter, setStyleFilter] = useState<string>('TOUS');
  const [sortBy, setSortBy] = useState<'overall-desc' | 'overall-asc' | 'name-asc' | 'pace-desc'>('overall-desc');

  // Available unique styles for filter dropdown
  const uniquePlayStyles = useMemo(() => {
    const set = new Set<string>();
    PLAYERS_DATABASE.forEach((p) => set.add(p.playStyle));
    return Array.from(set).sort();
  }, []);

  // Category mapping
  const matchesCategory = (pos: PlayerPosition, cat: PositionCategory): boolean => {
    if (cat === 'TOUS') return true;
    if (cat === 'GARDIENS') return pos === 'GB';
    if (cat === 'DEFENSEURS') return ['DC', 'DG', 'DD'].includes(pos);
    if (cat === 'MILIEUX') return ['MDC', 'MC', 'MO', 'MG', 'MD'].includes(pos);
    if (cat === 'ATTAQUANTS') return ['AC', 'AG', 'AD'].includes(pos);
    return true;
  };

  // Filtered & sorted players
  const filteredPlayers = useMemo(() => {
    return PLAYERS_DATABASE.filter((player) => {
      // Name search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(query) || player.club.toLowerCase().includes(query);
        if (!matchesName) return false;
      }

      // Category filter
      if (!matchesCategory(player.position, categoryFilter)) {
        return false;
      }

      // Exact position filter
      if (exactPositionFilter !== 'TOUS' && player.position !== exactPositionFilter) {
        return false;
      }

      // Rating filter
      if (ratingFilter > 0 && player.overall < ratingFilter) {
        return false;
      }

      // Style filter
      if (styleFilter !== 'TOUS' && player.playStyle !== styleFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'overall-desc') return b.overall - a.overall;
      if (sortBy === 'overall-asc') return a.overall - b.overall;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'pace-desc') return b.keyStats.pace - a.keyStats.pace;
      return 0;
    });
  }, [searchTerm, categoryFilter, exactPositionFilter, ratingFilter, styleFilter, sortBy]);

  return (
    <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col h-full shadow-lg">
      
      {/* Header with active slot indicator */}
      <div className="mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Effectif & Base Joueurs
            </span>
            <h3 className="font-heading text-xl font-bold uppercase text-white">
              {targetSlotPosition ? (
                <span>Sélectionner pour : <span className="text-blue-400">{targetSlotLabel || targetSlotPosition}</span></span>
              ) : (
                <span>Catalogue des Joueurs</span>
              )}
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
            >
              Fermer
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Données de démonstration avec caractéristiques eFootball et styles méta.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-3 mb-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom (Mbappé, Rodri, Haaland...)"
            className="w-full bg-[#080d19] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Pills (Interactive Filter Controls) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['TOUS', 'ATTAQUANTS', 'MILIEUX', 'DEFENSEURS', 'GARDIENS'] as PositionCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setExactPositionFilter('TOUS');
              }}
              className={`cursor-pointer px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Detailed Dropdowns (Position, Rating, Style, Sort) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Exact Position */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Poste exact</label>
            <select
              value={exactPositionFilter}
              onChange={(e) => setExactPositionFilter(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="TOUS">Tous les postes</option>
              <option value="GB">GB (Gardien)</option>
              <option value="DC">DC (Défenseur Central)</option>
              <option value="DD">DD (Défenseur Droit)</option>
              <option value="DG">DG (Défenseur Gauche)</option>
              <option value="MDC">MDC (Milieu Défensif)</option>
              <option value="MC">MC (Milieu Central)</option>
              <option value="MO">MO (Milieu Offensif)</option>
              <option value="MD">MD (Milieu Droit)</option>
              <option value="MG">MG (Milieu Gauche)</option>
              <option value="AD">AD (Ailier Droit)</option>
              <option value="AG">AG (Ailier Gauche)</option>
              <option value="AC">AC (Avant-Centre)</option>
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Note globale</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="0">Toutes les notes</option>
              <option value="90">90 et plus</option>
              <option value="93">93 et plus (Élite)</option>
              <option value="95">95 et plus (Top Tier)</option>
            </select>
          </div>

          {/* Style filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Style de jeu</label>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="TOUS">Tous les styles</option>
              {uniquePlayStyles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="overall-desc">Note la plus haute</option>
              <option value="overall-asc">Note la plus basse</option>
              <option value="name-asc">Nom (A - Z)</option>
              <option value="pace-desc">Vitesse / Accélération</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
        <span>{filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''} trouvé{filteredPlayers.length > 1 ? 's' : ''}</span>
        {targetSlotPosition && (
          <span className="text-emerald-400">Poste ciblé : {targetSlotPosition}</span>
        )}
      </div>

      {/* Players List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[480px]">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Aucun joueur ne correspond à ces critères</p>
            <p className="text-xs text-slate-400 mt-1">Essaie d'élargir tes filtres ou réinitialise la recherche.</p>
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const isAssignedToPitch = alreadyAssignedPlayerIds.has(player.id);
            const isAssignedToBench = benchPlayerIds.has(player.id);
            const isAssigned = isAssignedToPitch || isAssignedToBench;
            const isTargetMatch = targetSlotPosition ? player.position === targetSlotPosition : true;
            const isSecondaryMatch = targetSlotPosition ? player.secondaryPositions.includes(targetSlotPosition) : false;

            return (
              <div
                key={player.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isAssigned
                    ? 'bg-slate-900/60 border-slate-800 opacity-90'
                    : 'bg-[#0e172a] hover:bg-[#13203b] border-slate-800 hover:border-blue-500/50'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-start gap-3">
                  {/* Overall badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-black shrink-0 ${
                      player.overall >= 94
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-blue-600/20 text-blue-300 border border-blue-400/40'
                    }`}
                  >
                    <span className="text-base leading-none tabular-nums">{player.overall}</span>
                    <span className="text-[9px] font-sans font-bold text-slate-300 mt-0.5">{player.position}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-lg font-bold text-white leading-tight">
                        {player.name}
                      </h4>
                      {isAssignedToPitch && (
                        <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-medium">
                          Titulaire
                        </span>
                      )}
                      {isAssignedToBench && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-medium">
                          Banc
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      {player.club} · {player.nationality} · {player.preferredFoot}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-emerald-400 font-medium">{player.playStyle}</span>
                      {player.secondaryPositions.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                          (Polyvalent : {player.secondaryPositions.join(', ')})
                        </span>
                      )}
                    </div>

                    {/* Mismatch warning */}
                    {targetSlotPosition && !isTargetMatch && !isSecondaryMatch && (
                      <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Poste principal {player.position} ≠ {targetSlotPosition}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Mini Stats & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-400 font-mono text-center">
                    <span title="Vitesse">VIT {player.keyStats.pace}</span>
                    <span title="Tir / Finition">TIR {player.keyStats.finishing}</span>
                    <span title="Défense">DÉF {player.keyStats.defending}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Inspect button */}
                    <button
                      onClick={() => onInspectPlayer(player)}
                      title="Voir toutes les statistiques détaillées"
                      className="cursor-pointer p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      aria-label="Fiche détaillée"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Select button */}
                    <button
                      onClick={() => onSelectPlayer(player)}
                      className={`cursor-pointer px-3.5 py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 whitespace-nowrap ${
                        isAssigned
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                      }`}
                    >
                      <span>{isAssigned ? 'Déplacer' : 'Sélectionner'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
