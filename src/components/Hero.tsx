import React from 'react';
import { ArrowRight, BookOpen, Layers, ShieldCheck, Flame, Compass } from 'lucide-react';

interface HeroProps {
  onOpenSquadBuilder: () => void;
  onNavigateAcademy: () => void;
  onNavigatePlayerGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSquadBuilder,
  onNavigateAcademy,
  onNavigatePlayerGuide,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-800/80">
      {/* Background glow and subtle pitch stadium atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-emerald-500/10 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, copy, primary and secondary CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Unboxed clean metadata kicker (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 mb-4">
              <span>Plateforme Communautaire Indépendante</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">Tactiques eFootball 2026</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">100% Compétiteur</span>
            </div>

            {/* Exact requested main title */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-[0.98] mb-6 max-w-2xl text-balance">
              CONSTRUIS TON ÉQUIPE. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                DOMINE LE TERRAIN.
              </span>
            </h1>

            {/* Exact requested description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
              Découvre les meilleures tactiques, améliore ton effectif et apprends à jouer comme un véritable compétiteur.
            </p>

            {/* Exact requested CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenSquadBuilder}
                className="cursor-pointer inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl font-heading text-lg font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-sky-400 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] whitespace-nowrap border border-blue-300/30 group"
              >
                <Layers className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
                <span>Construire mon équipe</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateAcademy}
                className="cursor-pointer inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-heading text-lg font-bold uppercase tracking-wider text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 active:scale-[0.98] transition-all whitespace-nowrap group"
              >
                <BookOpen className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>Apprendre à jouer</span>
              </button>
            </div>

            {/* Concrete Proof and Features Sub-strip */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 w-full grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-heading text-2xl font-bold text-white tabular-nums tracking-wide">3</p>
                <p className="text-xs text-slate-400">Paliers de formation</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-emerald-400 tabular-nums tracking-wide">MÉTA</p>
                <p className="text-xs text-slate-400">Formations décryptées</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-blue-400 tabular-nums tracking-wide">100%</p>
                <p className="text-xs text-slate-400">Non-officiel & Libre</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Digital Football Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.2)] bg-[#0d1424]">
              {/* Media Container with measured fallback scrim */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/src/assets/images/hero_digital_football_1792865277483.jpg"
                  alt="eFootball Arena Digital Match Stadium"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Zero broken image fallback
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-blue-900', 'to-slate-900');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Tactical overlay card teaser */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0a1122]/90 backdrop-blur-md border border-blue-500/30 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Flame className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider">Formation Recommandée</p>
                      <p className="text-xs text-slate-400">4-2-1-3 Contre-Attaque Rapide</p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenSquadBuilder}
                    className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-emerald-300 py-1 px-2.5 rounded bg-blue-950/80 hover:bg-blue-900 transition-colors border border-blue-500/20"
                  >
                    Tester
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle decorative stadium line accents */}
            <div className="absolute -bottom-3 -right-3 w-28 h-28 border-r-2 border-b-2 border-emerald-500/30 rounded-br-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
