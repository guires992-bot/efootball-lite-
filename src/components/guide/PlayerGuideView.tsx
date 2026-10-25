import React, { useState, useEffect, useMemo } from 'react';
import { PlayerCard, PlayerPosition, PositionCategory } from '../../types';
import { PLAYERS_DATABASE } from '../../data/playersDatabase';
import { PlayerCardItem } from './PlayerCardItem';
import { PlayerDetailModal } from './PlayerDetailModal';
import { PlayerComparator } from './PlayerComparator';
import { SquadAssignmentModal } from './SquadAssignmentModal';
import {
  getFavoritePlayerIds,
  toggleFavorite,
  addRecentComparison,
} from '../../utils/playerGuideUtils';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Star,
  Scale,
  ArrowLeft,
  Layers,
  AlertCircle,
  X,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface PlayerGuideViewProps {
  onBackToHome: () => void;
  onGoToBuilder: () => void;
}

export const PlayerGuideView: React.FC<PlayerGuideViewProps> = ({
  onBackToHome,
  onGoToBuilder,
}) => {
  // Navigation tab inside Guide: 'catalog' | 'favorites' | 'comparator'
  const [activeGuideTab, setActiveGuideTab] = useState<'catalog' | 'favorites' | 'comparator'>('catalog');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PositionCategory>('TOUS');
  const [exactPositionFilter, setExactPositionFilter] = useState<string>('TOUS');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [styleFilter, setStyleFilter] = useState<string>('TOUS');
  const [footFilter, setFootFilter] = useState<'TOUS' | 'Droitier' | 'Gaucher'>('TOUS');
  const [sortBy, setSortBy] = useState<
    'overall-desc' | 'overall-asc' | 'name-asc' | 'speed-desc' | 'finishing-desc' | 'passing-desc' | 'defending-desc'
  >('overall-desc');

  // Favorites state (synced with localStorage)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => getFavoritePlayerIds());

  // Comparison pair state: player1 and player2
  const [comparisonPair, setComparisonPair] = useState<{
    player1: PlayerCard | null;
    player2: PlayerCard | null;
  }>({
    player1: PLAYERS_DATABASE.find((p) => p.id === 'p-mbappe') || PLAYERS_DATABASE[0] || null,
    player2: PLAYERS_DATABASE.find((p) => p.id === 'p-haaland') || PLAYERS_DATABASE[1] || null,
  });

  // Modal states
  const [inspectedPlayer, setInspectedPlayer] = useState<PlayerCard | null>(null);
  const [squadAssignPlayer, setSquadAssignPlayer] = useState<PlayerCard | null>(null);
  const [pickerTargetSlot, setPickerTargetSlot] = useState<1 | 2 | null>(null);

  // Available unique play styles for filter dropdown
  const uniquePlayStyles = useMemo(() => {
    const set = new Set<string>();
    PLAYERS_DATABASE.forEach((p) => set.add(p.playStyle));
    return Array.from(set).sort();
  }, []);

  // Category matching helper
  const matchesCategory = (pos: PlayerPosition, cat: PositionCategory): boolean => {
    if (cat === 'TOUS') return true;
    if (cat === 'GARDIENS') return pos === 'GB';
    if (cat === 'DEFENSEURS') return ['DC', 'DG', 'DD'].includes(pos);
    if (cat === 'MILIEUX') return ['MDC', 'MC', 'MO', 'MG', 'MD'].includes(pos);
    if (cat === 'ATTAQUANTS') return ['AC', 'AG', 'AD'].includes(pos);
    return true;
  };

  // Filtered players list
  const filteredPlayers = useMemo(() => {
    return PLAYERS_DATABASE.filter((player) => {
      // If tab is 'favorites', only show favorite players
      if (activeGuideTab === 'favorites' && !favoriteIds.has(player.id)) {
        return false;
      }

      // Name search
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matches = player.name.toLowerCase().includes(q) || player.club.toLowerCase().includes(q) || player.nationality.toLowerCase().includes(q);
        if (!matches) return false;
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

      // Play style filter
      if (styleFilter !== 'TOUS' && player.playStyle !== styleFilter) {
        return false;
      }

      // Foot filter
      if (footFilter !== 'TOUS' && player.preferredFoot !== footFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'overall-desc') return b.overall - a.overall;
      if (sortBy === 'overall-asc') return a.overall - b.overall;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'speed-desc') {
        const vA = a.granularStats?.speed ?? a.keyStats.pace;
        const vB = b.granularStats?.speed ?? b.keyStats.pace;
        return vB - vA;
      }
      if (sortBy === 'finishing-desc') {
        const fA = a.granularStats?.finishing ?? a.keyStats.finishing;
        const fB = b.granularStats?.finishing ?? b.keyStats.finishing;
        return fB - fA;
      }
      if (sortBy === 'passing-desc') {
        const pA = a.granularStats?.passing ?? a.keyStats.passing;
        const pB = b.granularStats?.passing ?? b.keyStats.passing;
        return pB - pA;
      }
      if (sortBy === 'defending-desc') {
        const dA = a.granularStats?.defending ?? a.keyStats.defending;
        const dB = b.granularStats?.defending ?? b.keyStats.defending;
        return dB - dA;
      }
      return 0;
    });
  }, [
    activeGuideTab,
    favoriteIds,
    searchTerm,
    categoryFilter,
    exactPositionFilter,
    ratingFilter,
    styleFilter,
    footFilter,
    sortBy,
  ]);

  // Toggle favorite with persistence
  const handleToggleFavorite = (playerId: string) => {
    toggleFavorite(playerId);
    setFavoriteIds(getFavoritePlayerIds());
  };

  // Toggle comparison addition/removal
  const handleToggleComparison = (player: PlayerCard) => {
    // If selecting for a specific target slot from modal picker
    if (pickerTargetSlot === 1) {
      setComparisonPair((prev) => ({ ...prev, player1: player }));
      setPickerTargetSlot(null);
      if (comparisonPair.player2) addRecentComparison(player.id, comparisonPair.player2.id);
      setActiveGuideTab('comparator');
      return;
    }
    if (pickerTargetSlot === 2) {
      setComparisonPair((prev) => ({ ...prev, player2: player }));
      setPickerTargetSlot(null);
      if (comparisonPair.player1) addRecentComparison(comparisonPair.player1.id, player.id);
      setActiveGuideTab('comparator');
      return;
    }

    // Default toggle logic:
    // If player is already in comparison, remove them
    if (comparisonPair.player1?.id === player.id) {
      setComparisonPair((prev) => ({ ...prev, player1: null }));
      return;
    }
    if (comparisonPair.player2?.id === player.id) {
      setComparisonPair((prev) => ({ ...prev, player2: null }));
      return;
    }

    // Otherwise, fill slot 1, then slot 2
    if (!comparisonPair.player1) {
      setComparisonPair((prev) => ({ ...prev, player1: player }));
      if (comparisonPair.player2) addRecentComparison(player.id, comparisonPair.player2.id);
    } else if (!comparisonPair.player2) {
      setComparisonPair((prev) => ({ ...prev, player2: player }));
      addRecentComparison(comparisonPair.player1.id, player.id);
    } else {
      // Replace slot 2 by default
      setComparisonPair((prev) => ({ ...prev, player2: player }));
      addRecentComparison(comparisonPair.player1.id, player.id);
    }
  };

  // Invert players in comparison
  const handleSwapComparison = () => {
    setComparisonPair((prev) => ({
      player1: prev.player2,
      player2: prev.player1,
    }));
  };

  // Clear comparison
  const handleClearComparison = () => {
    setComparisonPair({ player1: null, player2: null });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('TOUS');
    setExactPositionFilter('TOUS');
    setRatingFilter(0);
    setStyleFilter('TOUS');
    setFootFilter('TOUS');
    setSortBy('overall-desc');
  };

  const isPlayerInCompare = (id: string) => {
    return comparisonPair.player1?.id === id || comparisonPair.player2?.id === id;
  };

  const compareCount = (comparisonPair.player1 ? 1 : 0) + (comparisonPair.player2 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Retour à l'accueil</span>
          <span className="sm:hidden">Accueil</span>
        </button>

        {/* Center Tabs: Guide vs Favoris vs Comparateur */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0b1322] rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveGuideTab('catalog');
              setPickerTargetSlot(null);
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
              activeGuideTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Guide ({PLAYERS_DATABASE.length})
          </button>

          <button
            onClick={() => {
              setActiveGuideTab('favorites');
              setPickerTargetSlot(null);
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeGuideTab === 'favorites'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoriteIds.size > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favoris ({favoriteIds.size})</span>
          </button>

          <button
            onClick={() => {
              setActiveGuideTab('comparator');
              setPickerTargetSlot(null);
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeGuideTab === 'comparator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comparateur ({compareCount}/2)</span>
          </button>
        </div>

        {/* Link to Squad Builder */}
        <button
          onClick={onGoToBuilder}
          className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Ouvrir le Constructeur</span>
          <span className="md:hidden">Équipe</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full pb-28">
        
        {/* Main Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <span>Base de Données eFootball</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">Analyses Méta & Fiches Techniques</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-2">
            TROUVE LE JOUEUR QUI TE CORRESPOND
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Explore les profils, analyse les caractéristiques et compare les joueurs pour construire une équipe adaptée à ton style.
          </p>
        </div>

        {/* Slot Selection Prompt if User came to pick a replacement */}
        {pickerTargetSlot && (
          <div className="mb-6 p-4 rounded-xl bg-blue-950/60 border border-blue-500 text-xs text-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Mode sélection comparateur :</strong> Cliquez sur « Comparer » sur n'importe quel joueur pour l'assigner à l'emplacement <strong>Joueur {pickerTargetSlot}</strong>.
              </span>
            </div>
            <button
              onClick={() => {
                setPickerTargetSlot(null);
                setActiveGuideTab('comparator');
              }}
              className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
            >
              Annuler
            </button>
          </div>
        )}

        {/* COMPARATOR VIEW */}
        {activeGuideTab === 'comparator' ? (
          <PlayerComparator
            player1={comparisonPair.player1}
            player2={comparisonPair.player2}
            onSwapPlayers={handleSwapComparison}
            onClearComparison={handleClearComparison}
            onSelectForSquad={(p) => setSquadAssignPlayer(p)}
            onOpenPlayerPickerForSlot={(slotNum) => {
              setPickerTargetSlot(slotNum);
              setActiveGuideTab('catalog');
            }}
          />
        ) : (
          /* CATALOG / FAVORITES VIEW */
          <div className="space-y-6">
            
            {/* Search & Filter Bar Container */}
            <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg space-y-4">
              
              {/* Row 1: Search input + Results counter + Reset */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom, club ou nationalité (ex: Mbappé, Madrid, France)..."
                    className="w-full bg-[#080d19] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
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

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className="text-slate-400 font-semibold whitespace-nowrap">
                    {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''} trouvé{filteredPlayers.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleResetFilters}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-slate-400 hover:text-blue-400 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 transition-colors whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Category Segmented Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {(['TOUS', 'ATTAQUANTS', 'MILIEUX', 'DEFENSEURS', 'GARDIENS'] as PositionCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setExactPositionFilter('TOUS');
                    }}
                    className={`cursor-pointer px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Row 3: Dropdowns (Position exact, Rating range, Style de jeu, Pied fort, Tri) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                {/* Poste exact */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Poste exact</label>
                  <select
                    value={exactPositionFilter}
                    onChange={(e) => setExactPositionFilter(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="TOUS">Tous les postes</option>
                    <option value="GB">GB — Gardien de but</option>
                    <option value="DC">DC — Défenseur central</option>
                    <option value="DD">DD — Défenseur droit</option>
                    <option value="DG">DG — Défenseur gauche</option>
                    <option value="MDC">MDC — Milieu défensif</option>
                    <option value="MC">MC — Milieu central</option>
                    <option value="MO">MO — Milieu offensif</option>
                    <option value="MD">MD — Milieu droit</option>
                    <option value="MG">MG — Milieu gauche</option>
                    <option value="AD">AD — Ailier droit</option>
                    <option value="AG">AG — Ailier gauche</option>
                    <option value="AC">AC — Avant-centre</option>
                  </select>
                </div>

                {/* Seuil de note */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Note globale</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="0">Toutes les notes</option>
                    <option value="90">90 et plus</option>
                    <option value="93">93 et plus (Élite)</option>
                    <option value="95">95 et plus (Top Tier)</option>
                  </select>
                </div>

                {/* Style de jeu */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Style de jeu</label>
                  <select
                    value={styleFilter}
                    onChange={(e) => setStyleFilter(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="TOUS">Tous les styles</option>
                    {uniquePlayStyles.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Pied fort */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Pied fort</label>
                  <select
                    value={footFilter}
                    onChange={(e) => setFootFilter(e.target.value as any)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="TOUS">Tous pieds</option>
                    <option value="Droitier">Droitier</option>
                    <option value="Gaucher">Gaucher</option>
                  </select>
                </div>

                {/* Tri */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="overall-desc">Note la plus haute</option>
                    <option value="overall-asc">Note la plus basse</option>
                    <option value="name-asc">Nom (A — Z)</option>
                    <option value="speed-desc">Vitesse / Accélération</option>
                    <option value="finishing-desc">Finition / Tir</option>
                    <option value="passing-desc">Passe</option>
                    <option value="defending-desc">Défense</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Players Cards Grid */}
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-16 bg-[#0b1322] rounded-2xl border border-slate-800 p-8">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                  Aucun joueur ne correspond à tes filtres
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                  Vérifie l'orthographe du nom ou réinitialise tes critères pour découvrir l'ensemble des joueurs disponibles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlayers.map((player) => (
                  <PlayerCardItem
                    key={player.id}
                    player={player}
                    isFavorite={favoriteIds.has(player.id)}
                    isInComparison={isPlayerInCompare(player.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenDetails={(p) => setInspectedPlayer(p)}
                    onToggleComparison={handleToggleComparison}
                    onSelectForSquad={(p) => setSquadAssignPlayer(p)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Comparison Dock at bottom when 1 or 2 players are selected */}
      {compareCount > 0 && activeGuideTab !== 'comparator' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl bg-[#0b1424]/95 backdrop-blur-md border border-blue-500/50 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Comparateur ({compareCount}/2 joueur{compareCount > 1 ? 's' : ''})
              </p>
              <p className="text-[11px] text-slate-300">
                {comparisonPair.player1?.name || 'Joueur 1 vide'} vs {comparisonPair.player2?.name || 'Joueur 2 vide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGuideTab('comparator')}
              className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <span>Voir le duel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClearComparison}
              title="Vider la comparaison"
              className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Player Detailed Modal */}
      <PlayerDetailModal
        player={inspectedPlayer}
        isOpen={inspectedPlayer !== null}
        isInComparison={inspectedPlayer ? isPlayerInCompare(inspectedPlayer.id) : false}
        isFavorite={inspectedPlayer ? favoriteIds.has(inspectedPlayer.id) : false}
        onClose={() => setInspectedPlayer(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleComparison={handleToggleComparison}
        onSelectForSquad={(p) => setSquadAssignPlayer(p)}
      />

      {/* Squad Assignment Modal (Connects Guide to Squad Builder) */}
      <SquadAssignmentModal
        player={squadAssignPlayer}
        isOpen={squadAssignPlayer !== null}
        onClose={() => setSquadAssignPlayer(null)}
        onGoToBuilder={onGoToBuilder}
      />

    </div>
  );
};
