import React, { useState, useMemo } from 'react';
import {
  AcademyLesson,
  AcademyProgressData,
  LessonLevel,
  LessonTheme,
  TrainingChallenge,
} from '../../types';
import {
  ACADEMY_LESSONS,
  ACADEMY_LEVEL_SUMMARIES,
  TRAINING_CHALLENGES,
} from '../../data/academyLessonsData';
import {
  completeChallengeAction,
  resetAcademyProgress,
} from '../../utils/academyStorage';
import { useAuth } from '../../contexts/AuthContext';
import { syncSingleChallengeOnline } from '../../services/syncService';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Gamepad2,
  Zap,
  Award,
  Search,
  Filter,
  ArrowRight,
  Flame,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Layers,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface AcademyDashboardProps {
  progress: AcademyProgressData;
  onProgressUpdate: (newProgress: AcademyProgressData) => void;
  onSelectLesson: (lessonId: string) => void;
  onGoToBuilder: (formationId?: string) => void;
  onGoToGuide: () => void;
}

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  progress,
  onProgressUpdate,
  onSelectLesson,
  onGoToBuilder,
  onGoToGuide,
}) => {
  const { user } = useAuth();

  // Filters state
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<LessonTheme | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset modal state
  const [showResetModal, setShowResetModal] = useState(false);

  // Active theme list
  const themes: LessonTheme[] = [
    'Commandes',
    'Tactique',
    'Attaque',
    'Défense',
    'Progression',
    'Mental & Compétition',
  ];

  // Derived progress statistics
  const totalLessonsCount = ACADEMY_LESSONS.length; // 30
  const completedLessonsCount = progress.completedLessonIds.length;
  const globalPercentage = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  const getLevelProgress = (lvl: LessonLevel) => {
    const levelLessons = ACADEMY_LESSONS.filter((l) => l.level === lvl);
    const completedInLevel = levelLessons.filter((l) =>
      progress.completedLessonIds.includes(l.id)
    ).length;
    const percentage = Math.round((completedInLevel / levelLessons.length) * 100);
    return { completed: completedInLevel, total: levelLessons.length, percentage };
  };

  const debutantProgress = getLevelProgress('debutant');
  const intermediaireProgress = getLevelProgress('intermediaire');
  const avanceProgress = getLevelProgress('avance');

  // Quizzes stats
  const passedQuizzesCount = Object.values(progress.quizScores).filter(
    (q) => q.isPassed
  ).length;

  // XP Tier rank
  const getXpRank = (xp: number) => {
    if (xp >= 1500) return { title: 'Maître de l\'Arène', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' };
    if (xp >= 800) return { title: 'Tacticien Élite', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' };
    if (xp >= 350) return { title: 'Compétiteur Confirmé', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' };
    return { title: 'Espoir en Formation', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' };
  };

  const rank = getXpRank(progress.totalXp);

  // Identify next suggested lesson to resume
  const nextSuggestedLesson = useMemo(() => {
    if (progress.lastViewedLessonId) {
      const last = ACADEMY_LESSONS.find((l) => l.id === progress.lastViewedLessonId);
      if (last && !progress.completedLessonIds.includes(last.id)) return last;
    }
    // Otherwise first uncompleted
    const firstUnfinished = ACADEMY_LESSONS.find(
      (l) => !progress.completedLessonIds.includes(l.id)
    );
    return firstUnfinished || ACADEMY_LESSONS[0];
  }, [progress]);

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((lesson) => {
      // Level filter
      if (selectedLevel !== 'all' && lesson.level !== selectedLevel) return false;
      // Theme filter
      if (selectedTheme !== 'all' && lesson.theme !== selectedTheme) return false;
      // Status filter
      const isDone = progress.completedLessonIds.includes(lesson.id);
      if (statusFilter === 'done' && !isDone) return false;
      if (statusFilter === 'todo' && isDone) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = lesson.title.toLowerCase().includes(q);
        const matchSub = lesson.subtitle.toLowerCase().includes(q);
        const matchTheme = lesson.theme.toLowerCase().includes(q);
        const matchObj = lesson.objective.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchTheme && !matchObj) return false;
      }
      return true;
    });
  }, [selectedLevel, selectedTheme, statusFilter, searchQuery, progress.completedLessonIds]);

  // Handle Challenge completion
  const handleClaimChallenge = (challenge: TrainingChallenge) => {
    const { updated } = completeChallengeAction(challenge.id, challenge.xpReward);
    onProgressUpdate(updated);

    if (user) {
      syncSingleChallengeOnline(user.id, challenge.id);
    }
  };

  // Handle Full Reset
  const handleConfirmReset = () => {
    const reset = resetAcademyProgress();
    onProgressUpdate(reset);
    setShowResetModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070d1c] via-[#0c172e] to-[#081224] border border-blue-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Académie eFootball Arena · 30 Leçons Didactiques</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-3">
              DEVIENS MEILLEUR À <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">CHAQUE MATCH</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Mécaniques de base, dribbles fins, gestion du bloc défensif et mental compétitif. Suis notre cursus par étapes, valide les quiz et débloque des points d'expérience.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectLesson(nextSuggestedLesson.id)}
                className="cursor-pointer inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Reprendre mon apprentissage</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('challenges-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Défis en Match</span>
              </button>
            </div>
          </div>

          {/* User Rank Card */}
          <div className="bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-6 min-w-[280px] lg:w-80 shrink-0 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Statut Compétiteur
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${rank.bg} ${rank.color}`}>
                {rank.title}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-heading text-4xl font-black text-white">{progress.totalXp}</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">XP Cumulés</span>
            </div>

            {/* Quick stats mini-grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-2.5 rounded-lg bg-slate-900/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Leçons Validées</span>
                <span className="text-base font-bold text-white font-mono">
                  {completedLessonsCount} <span className="text-xs text-slate-500">/ 30</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Quiz Réussis</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {passedQuizzesCount} <span className="text-xs text-slate-500">/ 30</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Global Progress Dashboard & 3 Levels Summary */}
      <section className="space-y-6">
        <div className="bg-[#0a1120] border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Progression Globale de l'Académie
              </span>
              <h2 className="font-heading text-2xl font-bold uppercase text-white">
                {globalPercentage}% du cursus accompli ({completedLessonsCount} / {totalLessonsCount} leçons)
              </h2>
            </div>
            <span className="font-mono text-sm font-semibold text-slate-400">
              {30 - completedLessonsCount} leçons restantes
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden relative mb-6">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${globalPercentage}%` }}
            />
          </div>

          {/* 3 Level Mini-Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Débutant */}
            <div
              onClick={() => setSelectedLevel('debutant')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedLevel === 'debutant'
                  ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-sky-400" />
                  <span className="font-heading text-lg font-bold uppercase text-white">Débutant</span>
                </div>
                <span className="text-xs font-mono font-semibold text-sky-400">
                  {debutantProgress.completed} / {debutantProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all"
                  style={{ width: `${debutantProgress.percentage}%` }}
                />
              </div>
            </div>

            {/* Intermédiaire */}
            <div
              onClick={() => setSelectedLevel('intermediaire')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedLevel === 'intermediaire'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="font-heading text-lg font-bold uppercase text-white">Intermédiaire</span>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  {intermediaireProgress.completed} / {intermediaireProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${intermediaireProgress.percentage}%` }}
                />
              </div>
            </div>

            {/* Avancé */}
            <div
              onClick={() => setSelectedLevel('avance')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedLevel === 'avance'
                  ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span className="font-heading text-lg font-bold uppercase text-white">Avancé</span>
                </div>
                <span className="text-xs font-mono font-semibold text-blue-400">
                  {avanceProgress.completed} / {avanceProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${avanceProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filters & Search Section */}
      <section className="space-y-4">
        {/* Level Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedLevel === 'all'
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Toutes les leçons (30)
          </button>
          <button
            onClick={() => setSelectedLevel('debutant')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedLevel === 'debutant'
                ? 'bg-sky-500 text-slate-950 font-black shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Niveau 1 · Débutant (10)
          </button>
          <button
            onClick={() => setSelectedLevel('intermediaire')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedLevel === 'intermediaire'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Niveau 2 · Intermédiaire (10)
          </button>
          <button
            onClick={() => setSelectedLevel('avance')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedLevel === 'avance'
                ? 'bg-blue-600 text-white font-black shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Niveau 3 · Avancé (10)
          </button>
        </div>

        {/* Search, Themes & Status */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par concept (dribble, pressing, 4-2-1-3...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1322] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Statut :</span>
            <div className="inline-flex rounded-lg bg-slate-900/80 border border-slate-800 p-0.5 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter('todo')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'todo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                À faire
              </button>
              <button
                onClick={() => setStatusFilter('done')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'done' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Terminées
              </button>
            </div>
          </div>
        </div>

        {/* Theme Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-medium mr-2">Thème :</span>
          <button
            onClick={() => setSelectedTheme('all')}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedTheme === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous les thèmes
          </button>
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedTheme === theme
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Lessons Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{filteredLessons.length} leçons affichées</span>
          {(selectedLevel !== 'all' || selectedTheme !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedTheme('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="cursor-pointer text-blue-400 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {filteredLessons.length === 0 ? (
          <div className="p-12 text-center bg-[#0a1120] border border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">Aucune leçon ne correspond aux critères</p>
            <p className="text-xs text-slate-400">Modifie les filtres ou la recherche pour explorer les modules.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => {
              const isDone = progress.completedLessonIds.includes(lesson.id);
              const isStarted = progress.startedLessonIds.includes(lesson.id);
              const quizInfo = progress.quizScores[lesson.id];

              let statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                  Non commencée
                </span>
              );

              if (isDone) {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Terminée
                  </span>
                );
              } else if (isStarted) {
                statusBadge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    En cours
                  </span>
                );
              }

              return (
                <div
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`group esports-card bg-[#0b1322] rounded-2xl border transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between cursor-pointer ${
                    isDone
                      ? 'border-emerald-500/30 hover:border-emerald-500/60'
                      : 'border-slate-800 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    {/* Header: Level & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        lesson.level === 'debutant'
                          ? 'bg-sky-500/15 text-sky-400'
                          : lesson.level === 'intermediaire'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        #{lesson.order} · {lesson.level}
                      </span>
                      {statusBadge}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-heading text-xl font-bold uppercase text-white group-hover:text-blue-400 transition-colors mb-1.5 leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                      {lesson.subtitle}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {lesson.duration}
                      </span>
                      <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                        {lesson.theme}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Ouvrir</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. In-Game Training Challenges */}
      <section id="challenges-section" className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
              <span>Mise en Pratique en Match</span>
            </div>
            <h2 className="font-heading text-3xl font-black uppercase text-white">
              Défis d'Entraînement & Objectifs de Session
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Réalise ces défis dans tes matchs de division PvP ou d'événement IA pour valider ton apprentissage et remporter des bonus d'XP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TRAINING_CHALLENGES.map((challenge) => {
            const isCompleted = progress.completedChallengeIds.includes(challenge.id);
            return (
              <div
                key={challenge.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-[#0a1120] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      {challenge.duration} · Récompense +{challenge.xpReward} XP
                    </span>
                    <h3 className="font-heading text-xl font-bold uppercase text-white">
                      {challenge.title}
                    </h3>
                  </div>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/40 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Validé
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-4">
                  <strong className="text-white">Objectif : </strong>
                  {challenge.objective}
                </p>

                <div className="space-y-1.5 mb-5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Consignes d'exécution :
                  </span>
                  {challenge.instructions.map((inst, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Critère : {challenge.successCriteria}
                  </span>

                  <button
                    onClick={() => handleClaimChallenge(challenge)}
                    disabled={isCompleted}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      isCompleted
                        ? 'bg-slate-800/60 text-slate-500 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    }`}
                  >
                    {isCompleted ? 'Défi accompli ✓' : `Valider (+${challenge.xpReward} XP)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Bridge to Squad Builder & Player Guide */}
      <section className="bg-gradient-to-r from-blue-950/30 via-[#0a1224] to-emerald-950/20 border border-blue-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Écosystème eFootball Elite
          </span>
          <h2 className="font-heading text-2xl font-black uppercase text-white mb-2">
            Mets en pratique tes acquis sur les autres outils
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Teste les formations expliquées dans nos leçons avec le Constructeur d'Équipe interactif ou trouve les joueurs adaptés à ton style de jeu dans le Guide & Comparateur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onGoToBuilder()}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <span>Constructeur d'Équipe</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onGoToGuide}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>Guide des Joueurs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 7. Reset Progress Section (with Safety Modal) */}
      <section className="p-6 rounded-2xl bg-[#070b14] border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">
            Gestion des Données Locales de l'Académie
          </h3>
          <p className="text-xs text-slate-400">
            Tes leçons validées, scores de quiz et points d'XP sont sauvegardés dans ton navigateur. Tu peux repartir de zéro à tout moment.
          </p>
        </div>

        <button
          onClick={() => setShowResetModal(true)}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-500/20 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser ma progression</span>
        </button>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-heading text-xl font-bold uppercase text-white">
                Confirmer la réinitialisation ?
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Cette action remettra à zéro tes {completedLessonsCount} leçons validées, tes {passedQuizzesCount} quiz réussis et tes {progress.totalXp} XP. Cette action est irréversible.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="cursor-pointer px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReset}
                className="cursor-pointer px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Oui, tout réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
