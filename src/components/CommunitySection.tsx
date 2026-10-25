import React, { useState } from 'react';
import { TOURNAMENTS_DEMO_DATA, COMMUNITY_RANKS_DEMO, VERIFIED_RESULTS_DEMO } from '../data/arenaData';
import { TournamentItem } from '../types';
import { Trophy, Calendar, Users, ShieldCheck, Info, ArrowUpRight, CheckCircle, Flame } from 'lucide-react';

interface CommunitySectionProps {
  onRegisterTournament: (tournament: TournamentItem) => void;
  onOpenReportResultModal: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  onRegisterTournament,
  onOpenReportResultModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tournois' | 'classement' | 'resultats'>('tournois');

  return (
    <section id="classements" className="py-20 bg-[#070b14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              <Trophy className="w-4 h-4" />
              <span>Scène Compétitive Communautaire</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              TOURNOIS & RÉSULTATS HOMOLOGUÉS
            </h2>
          </div>

          {/* Interactive filter tabs (segmented control) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0e1728] rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('tournois')}
              className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'tournois'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tournois ({TOURNAMENTS_DEMO_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('classement')}
              className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'classement'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classement Div 1
            </button>
            <button
              onClick={() => setActiveTab('resultats')}
              className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'resultats'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Derniers Matchs
            </button>
          </div>
        </div>

        {/* Explicit Demo Data Notice as requested by prompt */}
        <div className="mb-8 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-white">Note de transparence :</strong> Les tournois, classements et scores ci-dessous sont des <strong className="text-emerald-400">données de démonstration communautaires</strong> conçues pour illustrer le fonctionnement de la future ligue homologuée.
          </span>
        </div>

        {/* Tab 1: Tournois à venir */}
        {activeTab === 'tournois' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOURNAMENTS_DEMO_DATA.map((t) => (
              <div
                key={t.id}
                className="esports-card bg-[#0d1629] rounded-2xl border border-slate-800 hover:border-blue-500/50 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-semibold text-emerald-400">{t.platform}</span>
                    <span className="font-mono">{t.slotsLeft} places dispo</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">{t.name}</h3>
                  <p className="text-xs text-slate-300 mb-4">{t.format}</p>

                  <div className="space-y-2 mb-6 text-xs text-slate-400 bg-[#080d1a] p-3 rounded-lg border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.prizePool}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRegisterTournament(t)}
                  className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                >
                  <span>S'inscrire au tournoi</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Classement Division 1 */}
        {activeTab === 'classement' && (
          <div className="bg-[#0d1629] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold uppercase text-white">Classement Ligue Division 1</h3>
                <p className="text-xs text-slate-400">Simulation de saison compétitive communautaire</p>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Mis à jour en temps réel</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#090f1d] text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Rang</th>
                    <th className="py-3 px-4">Joueur</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4 tabular-nums">Points MMR</th>
                    <th className="py-3 px-4">Ratio V/D</th>
                    <th className="py-3 px-4">Tactique</th>
                    <th className="py-3 px-4">Série</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {COMMUNITY_RANKS_DEMO.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-heading text-lg font-bold">
                        {row.rank === 1 && <span className="text-amber-400">#01</span>}
                        {row.rank === 2 && <span className="text-slate-300">#02</span>}
                        {row.rank === 3 && <span className="text-amber-600">#03</span>}
                        {row.rank > 3 && <span className="text-slate-500">#0{row.rank}</span>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        <span>{row.handle}</span>
                        {row.rank <= 2 && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-emerald-400 font-medium">{row.division}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">{row.rating}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 tabular-nums">{row.winRate}</td>
                      <td className="py-3.5 px-4 text-xs text-sky-400 font-medium">{row.favoriteFormation}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-xs font-mono font-bold border border-emerald-800">
                          {row.streak}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Derniers Résultats Homologués */}
        {activeTab === 'resultats' && (
          <div className="space-y-4">
            {VERIFIED_RESULTS_DEMO.map((res) => (
              <div
                key={res.id}
                className="bg-[#0d1629] rounded-2xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-white">{res.tournament}</span>
                      <span>·</span>
                      <span>{res.date}</span>
                    </div>
                    <p className="text-xs text-emerald-400 mt-0.5">MVP du match : {res.mvp}</p>
                  </div>
                </div>

                {/* Score board */}
                <div className="flex items-center gap-6 bg-[#070b14] px-6 py-2.5 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{res.playerA}</p>
                  </div>
                  <div className="font-mono text-xl font-bold px-3 py-1 bg-blue-950/70 rounded border border-blue-500/30 text-white tabular-nums">
                    {res.scoreA} - {res.scoreB}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{res.playerB}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 text-center">
              <button
                onClick={onOpenReportResultModal}
                className="cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Proposer un match pour homologation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
