import React from 'react';
import { TacticalStyle } from '../../types';
import { TACTICAL_GUIDES } from '../../data/tacticsGuideData';
import { Compass, ShieldCheck, AlertTriangle, Users, CheckCircle2, Flame, Info } from 'lucide-react';

interface TacticsPanelProps {
  currentStyle: TacticalStyle;
  onSelectStyle: (style: TacticalStyle) => void;
  onApplyRecommendedFormation: (formationId: string) => void;
}

export const TacticsPanel: React.FC<TacticsPanelProps> = ({
  currentStyle,
  onSelectStyle,
  onApplyRecommendedFormation,
}) => {
  const guide = TACTICAL_GUIDES[currentStyle] || TACTICAL_GUIDES['Contre-attaque rapide'];

  const stylesList: TacticalStyle[] = [
    'Contre-attaque rapide',
    'Possession',
    'Contre-attaque longue',
    'Jeu sur les ailes',
  ];

  return (
    <div className="bg-[#0b1322] rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col h-full shadow-lg">
      
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Stratégie & Style d'Équipe</span>
        </div>
        <h3 className="font-heading text-xl font-bold uppercase text-white">
          Conseils Tactiques & Synergies
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Sélectionne ton style d'équipe pour adapter les déplacements et profils de joueurs.
        </p>
      </div>

      {/* Style Selector Tabs (Segmented control) */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {stylesList.map((style) => (
          <button
            key={style}
            onClick={() => onSelectStyle(style)}
            className={`cursor-pointer px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all border ${
              currentStyle === style
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Selected Style Detailed Guide */}
      <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-1">
        
        {/* Style Summary Card */}
        <div className="bg-[#0e172a] p-4 rounded-xl border border-slate-800">
          <h4 className="font-heading text-lg font-bold uppercase text-white mb-1">
            {guide.title}
          </h4>
          <p className="text-emerald-400 text-xs font-medium mb-3">{guide.tagline}</p>
          <p className="text-slate-300 leading-relaxed">{guide.generalPrinciples}</p>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold">Formations recommandées :</span>
            {guide.recommendedFormations.map((fId) => (
              <button
                key={fId}
                onClick={() => onApplyRecommendedFormation(fId)}
                className="cursor-pointer px-2.5 py-1 rounded-md bg-blue-950 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-800/60 text-xs font-mono font-bold transition-colors"
                title={`Appliquer la formation ${fId}`}
              >
                {fId} ↗
              </button>
            ))}
          </div>
        </div>

        {/* Strengths & Risks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Strengths */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl">
            <h5 className="font-heading text-sm font-bold uppercase text-emerald-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Points Forts</span>
            </h5>
            <ul className="space-y-1.5 text-slate-300">
              {guide.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-xl">
            <h5 className="font-heading text-sm font-bold uppercase text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Risques & Pièges</span>
            </h5>
            <ul className="space-y-1.5 text-slate-300">
              {guide.mainRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ideal Player Profiles */}
        <div className="bg-[#0e172a] p-4 rounded-xl border border-slate-800">
          <h5 className="font-heading text-sm font-bold uppercase text-sky-400 mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Profils de Joueurs Indispensables</span>
          </h5>
          <div className="space-y-2">
            {guide.idealPlayerTypes.map((pt, idx) => (
              <div key={idx} className="bg-[#090f1d] p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-bold text-white block mb-0.5">{pt.role}</span>
                <span className="text-slate-400 text-xs">{pt.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-[#0e172a] p-4 rounded-xl border border-slate-800">
          <h5 className="font-heading text-sm font-bold uppercase text-rose-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Erreurs Courantes à Éviter</span>
          </h5>
          <ul className="space-y-1.5 text-slate-300">
            {guide.commonMistakes.map((m, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nuance & Reality Notice */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>{guide.metaNuanceNotice}</span>
        </div>

      </div>

    </div>
  );
};
