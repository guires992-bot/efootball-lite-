import React, { useState, useEffect } from 'react';
import { AcademyLesson, AcademyProgressData } from '../../types';
import { ACADEMY_LESSONS } from '../../data/academyLessonsData';
import { loadAcademyProgress } from '../../utils/academyStorage';
import { AcademyDashboard } from './AcademyDashboard';
import { LessonView } from './LessonView';
import { Shield, ArrowLeft, Trophy, Users, Layers } from 'lucide-react';

interface AcademyMainViewProps {
  onBackToHome: () => void;
  onGoToBuilder: (formationId?: string) => void;
  onGoToGuide: () => void;
  initialLessonId?: string | null;
}

export const AcademyMainView: React.FC<AcademyMainViewProps> = ({
  onBackToHome,
  onGoToBuilder,
  onGoToGuide,
  initialLessonId = null,
}) => {
  const [progress, setProgress] = useState<AcademyProgressData>(() => loadAcademyProgress());
  const [activeLessonId, setActiveLessonId] = useState<string | null>(initialLessonId);

  // Sync state if initialLessonId changes
  useEffect(() => {
    if (initialLessonId) {
      setActiveLessonId(initialLessonId);
    }
  }, [initialLessonId]);

  // Keep progress in sync with local storage
  const handleProgressUpdate = (newProgress: AcademyProgressData) => {
    setProgress(newProgress);
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    window.location.hash = `#academie/${lessonId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setActiveLessonId(null);
    window.location.hash = '#academie';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLesson: AcademyLesson | undefined = activeLessonId
    ? ACADEMY_LESSONS.find((l) => l.id === activeLessonId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="cursor-pointer flex items-center gap-2.5 group"
              title="Retour à l'accueil"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <div className="w-full h-full bg-[#070b14] rounded-[7px] flex items-center justify-center text-blue-400 group-hover:text-emerald-400 transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-white whitespace-nowrap leading-none">
                  eFOOTBALL <span className="text-blue-500 group-hover:text-emerald-400 transition-colors">ELITE</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                  Académie Compétitive
                </span>
              </div>
            </button>
          </div>

          {/* Quick Hub Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onGoToBuilder()}
              className="cursor-pointer hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Constructeur</span>
            </button>

            <button
              onClick={onGoToGuide}
              className="cursor-pointer hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guide Joueurs</span>
            </button>

            {/* Total XP pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-xs font-bold text-blue-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{progress.totalXp} XP</span>
            </div>

            <button
              onClick={onBackToHome}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Retour Accueil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        {activeLesson ? (
          <LessonView
            lesson={activeLesson}
            allLessons={ACADEMY_LESSONS}
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onSelectLesson={handleSelectLesson}
            onBackToDashboard={handleBackToDashboard}
            onGoToBuilder={onGoToBuilder}
            onGoToGuide={onGoToGuide}
          />
        ) : (
          <AcademyDashboard
            progress={progress}
            onProgressUpdate={handleProgressUpdate}
            onSelectLesson={handleSelectLesson}
            onGoToBuilder={onGoToBuilder}
            onGoToGuide={onGoToGuide}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-800/80 bg-[#05080f] text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-heading tracking-wider uppercase text-slate-300 font-bold">
            eFootball Elite · Académie Indépendante de Formation Gaming & e-Sport
          </p>
          <p className="text-[11px] text-slate-500">
            Plateforme communautaire non officielle et indépendante de Konami Digital Entertainment Co., Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
};
