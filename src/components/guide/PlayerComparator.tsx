import React, { useState } from 'react';
import { PlayerCard, AnalysisRole } from '../../types';
import { ROLE_WEIGHT_RULES } from '../../utils/playerGuideUtils';
import { ArrowLeftRight, RotateCcw, Award, CheckCircle2, AlertCircle, Info, PlusCircle, ArrowRight } from 'lucide-react';

interface PlayerComparatorProps {
  player1: PlayerCard | null;
  player2: PlayerCard | null;
  onSwapPlayers: () => void;
  onClearComparison: () => void;
  onSelectForSquad: (player: PlayerCard) => void;
  onOpenPlayerPickerForSlot: (slotNumber: 1 | 2) => void;
}

export const PlayerComparator: React.FC<PlayerComparatorProps> = ({
  player1,
  player2,
  onSwapPlayers,
  onClearComparison,
  onSelectForSquad,
  onOpenPlayerPickerForSlot,
}) => {
  // Active target role for position suitability analysis
  const [selectedRole, setSelectedRole] = useState<AnalysisRole>('Avant-centre');

  const rolesList: AnalysisRole[] = [
    'Avant-centre',
    'Ailier',
    'Meneur / Milieu offensif',
    'Milieu central / Box-to-box',
    'Sentinelle / Milieu défensif',
    'Défenseur central',
    'Arrière latéral',
    'Gardien de but',
  ];

  const roleRule = ROLE_WEIGHT_RULES[selectedRole];

  // Calculate suitability scores if players are present
  const scoreP1 = player1 ? roleRule.calculateScore(player1) : null;
  const scoreP2 = player2 ? roleRule.calculateScore(player2) : null;

  // Comparison metrics list
  const metricsToCompare = [
    {
      key: 'overall',
      label: 'Note Globale',
      val1: player1?.overall ?? null,
      val2: player2?.overall ?? null,
    },
    {
      key: 'speed',
      label: 'Vitesse de pointe',
      val1: player1?.granularStats?.speed ?? player1?.keyStats.pace ?? null,
      val2: player2?.granularStats?.speed ?? player2?.keyStats.pace ?? null,
    },
    {
      key: 'acceleration',
      label: 'Accélération',
      val1: player1?.granularStats?.acceleration ?? null,
      val2: player2?.granularStats?.acceleration ?? null,
    },
    {
      key: 'finishing',
      label: 'Finition devant le but',
      val1: player1?.granularStats?.finishing ?? player1?.keyStats.finishing ?? null,
      val2: player2?.granularStats?.finishing ?? player2?.keyStats.finishing ?? null,
    },
    {
      key: 'kickingPower',
      label: 'Puissance de frappe',
      val1: player1?.granularStats?.kickingPower ?? null,
      val2: player2?.granularStats?.kickingPower ?? null,
    },
    {
      key: 'passing',
      label: 'Qualité de passe',
      val1: player1?.granularStats?.passing ?? player1?.keyStats.passing ?? null,
      val2: player2?.granularStats?.passing ?? player2?.keyStats.passing ?? null,
    },
    {
      key: 'ballControl',
      label: 'Contrôle du ballon',
      val1: player1?.granularStats?.ballControl ?? null,
      val2: player2?.granularStats?.ballControl ?? null,
    },
    {
      key: 'dribbling',
      label: 'Dribble & Agilité',
      val1: player1?.granularStats?.dribbling ?? player1?.keyStats.dribbling ?? null,
      val2: player2?.granularStats?.dribbling ?? player2?.keyStats.dribbling ?? null,
    },
    {
      key: 'defending',
      label: 'Défense & Interception',
      val1: player1?.granularStats?.defending ?? player1?.keyStats.defending ?? null,
      val2: player2?.granularStats?.defending ?? player2?.keyStats.defending ?? null,
    },
    {
      key: 'physicalContact',
      label: 'Contact physique & Épaule',
      val1: player1?.granularStats?.physicalContact ?? player1?.keyStats.physical ?? null,
      val2: player2?.granularStats?.physicalContact ?? player2?.keyStats.physical ?? null,
    },
    {
      key: 'stamina',
      label: 'Endurance (90 minutes)',
      val1: player1?.granularStats?.stamina ?? null,
      val2: player2?.granularStats?.stamina ?? null,
    },
  ];

  return (
    <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-8">
      
      {/* Comparator Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Duel Statistique & Analyse Méta
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            QUI EST LE MEILLEUR POUR TON ÉQUIPE ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare deux joueurs côte à côte, évalue leurs forces respectives et teste leur compatibilité selon le poste recherché.
          </p>
        </div>

        {/* Global Controls: Invert, Clear */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onSwapPlayers}
            disabled={!player1 || !player2}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Inverser</span>
          </button>

          <button
            onClick={onClearComparison}
            disabled={!player1 && !player2}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Players Header Duel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Slot 1: Player 1 */}
        <div className="bg-[#0e172a] rounded-2xl border border-slate-800 p-4 sm:p-5 relative flex flex-col justify-between">
          {player1 ? (
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black ${
                      player1.overall >= 94
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-blue-600/20 text-blue-300 border border-blue-400/40'
                    }`}
                  >
                    <span className="text-2xl leading-none tabular-nums">{player1.overall}</span>
                    <span className="text-[10px] font-sans font-bold text-slate-300 mt-0.5">{player1.position}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {player1.club} · {player1.nationality}
                    </span>
                    <h3 className="font-heading text-2xl font-bold uppercase text-white leading-tight">
                      {player1.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-semibold">{player1.playStyle}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenPlayerPickerForSlot(1)}
                  className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
                >
                  Changer
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Pied fort : <strong className="text-white">{player1.preferredFoot}</strong></span>
                <button
                  onClick={() => onSelectForSquad(player1)}
                  className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Ajouter au Onze</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 mb-3">Emplacement Joueur 1 vide</span>
              <button
                onClick={() => onOpenPlayerPickerForSlot(1)}
                className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                + Choisir le premier joueur
              </button>
            </div>
          )}
        </div>

        {/* Slot 2: Player 2 */}
        <div className="bg-[#0e172a] rounded-2xl border border-slate-800 p-4 sm:p-5 relative flex flex-col justify-between">
          {player2 ? (
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black ${
                      player2.overall >= 94
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-blue-600/20 text-blue-300 border border-blue-400/40'
                    }`}
                  >
                    <span className="text-2xl leading-none tabular-nums">{player2.overall}</span>
                    <span className="text-[10px] font-sans font-bold text-slate-300 mt-0.5">{player2.position}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {player2.club} · {player2.nationality}
                    </span>
                    <h3 className="font-heading text-2xl font-bold uppercase text-white leading-tight">
                      {player2.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-semibold">{player2.playStyle}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenPlayerPickerForSlot(2)}
                  className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
                >
                  Changer
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Pied fort : <strong className="text-white">{player2.preferredFoot}</strong></span>
                <button
                  onClick={() => onSelectForSquad(player2)}
                  className="cursor-pointer text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Ajouter au Onze</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 mb-3">Emplacement Joueur 2 vide</span>
              <button
                onClick={() => onOpenPlayerPickerForSlot(2)}
                className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                + Choisir le second joueur
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Role-Specific Analysis Selector & Transparent Compatibility Score */}
      <div className="bg-[#09101d] rounded-2xl border border-blue-500/30 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-heading text-lg font-bold uppercase text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Analyse Spécifique Selon le Poste Recherché</span>
            </h4>
            <p className="text-xs text-slate-400">
              Détermine quel joueur répond le mieux aux exigences clés du rôle tactique.
            </p>
          </div>

          {/* Role selector dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as AnalysisRole)}
            className="bg-[#0e172a] border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {rolesList.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Role Description & Key Requirements */}
        <div className="text-xs text-slate-300 bg-[#0c1424] p-3.5 rounded-xl border border-slate-800 space-y-2">
          <p><strong className="text-white">Exigences pour le rôle de {selectedRole} :</strong> {roleRule.description}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-slate-400 font-semibold">Pondération des statistiques :</span>
            {roleRule.keyRequirements.map((req, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-800 text-[11px] font-mono">
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Compatibility Scores Comparison */}
        {player1 && player2 && scoreP1 && scoreP2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Player 1 Role Score */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              scoreP1.score > scoreP2.score
                ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{player1.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{scoreP1.formulaNotice}</p>
              </div>
              <div className="text-right">
                <span className="font-heading text-3xl font-extrabold font-mono tabular-nums text-blue-400">
                  {scoreP1.score}<span className="text-sm text-slate-400">/100</span>
                </span>
                {scoreP1.score > scoreP2.score && (
                  <span className="block text-[10px] font-bold uppercase text-emerald-400">Profil Recommandé</span>
                )}
              </div>
            </div>

            {/* Player 2 Role Score */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              scoreP2.score > scoreP1.score
                ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{player2.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{scoreP2.formulaNotice}</p>
              </div>
              <div className="text-right">
                <span className="font-heading text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
                  {scoreP2.score}<span className="text-sm text-slate-400">/100</span>
                </span>
                {scoreP2.score > scoreP1.score && (
                  <span className="block text-[10px] font-bold uppercase text-emerald-400">Profil Recommandé</span>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-400 italic">
          * Note de transparence : Ce score de compatibilité est un indicateur mathématique créé par le site eFootball Elite pour guider votre choix, et non une statistique officielle de Konami.
        </p>
      </div>

      {/* Side-by-Side Detailed Metrics Bars */}
      <div>
        <h4 className="font-heading text-lg font-bold uppercase text-white mb-4">
          Comparaison Caractéristique par Caractéristique
        </h4>

        <div className="space-y-4">
          {metricsToCompare.map((metric) => {
            const hasVal1 = metric.val1 !== null;
            const hasVal2 = metric.val2 !== null;

            const isTie = hasVal1 && hasVal2 && metric.val1 === metric.val2;
            const p1Wins = hasVal1 && hasVal2 && (metric.val1 as number) > (metric.val2 as number);
            const p2Wins = hasVal1 && hasVal2 && (metric.val2 as number) > (metric.val1 as number);

            return (
              <div
                key={metric.key}
                className="bg-[#0e172a] rounded-xl border border-slate-800/80 p-3 sm:p-4 hover:border-slate-700 transition-colors"
              >
                {/* Metric Label and Winner Tag */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{metric.label}</span>
                    {isTie && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                        Égalité
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono font-bold flex items-center gap-4">
                    <span className={p1Wins ? 'text-blue-400 font-black' : 'text-slate-400'}>
                      {player1 ? (hasVal1 ? metric.val1 : 'Donnée indisponible') : '--'}
                    </span>
                    <span className="text-slate-600">vs</span>
                    <span className={p2Wins ? 'text-emerald-400 font-black' : 'text-slate-400'}>
                      {player2 ? (hasVal2 ? metric.val2 : 'Donnée indisponible') : '--'}
                    </span>
                  </div>
                </div>

                {/* Comparison Visual Double Bar */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  {/* Left Player Bar (inverted right-to-left visual) */}
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex justify-end border border-slate-800">
                    {hasVal1 ? (
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p1Wins
                            ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.min(metric.val1 as number, 100)}%` }}
                      />
                    ) : (
                      <div className="h-full bg-slate-800 w-full opacity-30" />
                    )}
                  </div>

                  {/* Right Player Bar (left-to-right visual) */}
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex justify-start border border-slate-800">
                    {hasVal2 ? (
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p2Wins
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.min(metric.val2 as number, 100)}%` }}
                      />
                    ) : (
                      <div className="h-full bg-slate-800 w-full opacity-30" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
