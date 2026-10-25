import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AVATAR_PRESETS, PlayerAvatar } from './AvatarPresets';
import { getLocalMigrationSummary } from '../../services/syncService';
import { loadAllSquads, STORAGE_KEY as SQUADS_KEY } from '../../utils/squadStorage';
import { loadAcademyProgress } from '../../utils/academyStorage';
import { ACADEMY_LESSONS } from '../../data/academyLessonsData';
import { SavedSquad } from '../../types';
import {
  Shield,
  User,
  Trophy,
  BookOpen,
  Layers,
  Sparkles,
  Calendar,
  LogOut,
  Edit2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  UploadCloud,
  Check,
} from 'lucide-react';

interface PlayerProfileViewProps {
  onBackToHome: () => void;
  onGoToAcademy: (lessonId?: string) => void;
  onGoToBuilder: (squadId?: string) => void;
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({
  onBackToHome,
  onGoToAcademy,
  onGoToBuilder,
}) => {
  const {
    user,
    profile,
    signOut,
    updateUserProfile,
    updateUserPassword,
    syncStatus,
    syncError,
    triggerSync,
    importLocalData,
  } = useAuth();

  // Active tab in profile
  const [activeTab, setActiveTab] = useState<'dashboard' | 'squads' | 'edit' | 'security'>('dashboard');

  // Edit form state
  const [editUsername, setEditUsername] = useState(profile?.username || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile?.avatar_url || 'avatar-1');
  const [editLoading, setEditLoading] = useState(false);
  const [editFeedback, setEditFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password form state
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Local storage migration banner
  const [migrationSummary, setMigrationSummary] = useState(() => getLocalMigrationSummary());
  const [migrating, setMigrating] = useState(false);
  const [migrationFeedback, setMigrationFeedback] = useState<string | null>(null);

  // Saved squads list
  const [squads, setSquads] = useState<SavedSquad[]>(() => loadAllSquads());

  // Academy local progress
  const academyProgress = loadAcademyProgress();
  const completedLessons = academyProgress.completedLessonIds.length;
  const passedQuizzes = Object.values(academyProgress.quizScores).filter((q) => q.isPassed).length;
  const completedChallenges = academyProgress.completedChallengeIds.length;
  const academyPercent = Math.round((completedLessons / 30) * 100);

  // Last viewed lesson
  const lastLesson = academyProgress.lastViewedLessonId
    ? ACADEMY_LESSONS.find((l) => l.id === academyProgress.lastViewedLessonId)
    : null;

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username);
      setSelectedAvatarId(profile.avatar_url || 'avatar-1');
    }
  }, [profile]);

  // Handle Edit Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditFeedback(null);

    const clean = editUsername.trim();
    if (clean.length < 3 || clean.length > 24) {
      setEditFeedback({ type: 'error', message: 'Le pseudonyme doit comporter entre 3 et 24 caractères.' });
      return;
    }

    setEditLoading(true);
    const { error } = await updateUserProfile(clean, selectedAvatarId);
    setEditLoading(false);

    if (error) {
      setEditFeedback({ type: 'error', message: error });
    } else {
      setEditFeedback({ type: 'success', message: 'Profil mis à jour avec succès !' });
      setTimeout(() => setEditFeedback(null), 3000);
    }
  };

  // Handle Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'Le mot de passe doit comporter au moins 6 caractères.' });
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordFeedback({ type: 'error', message: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }

    setPasswordLoading(true);
    const { error } = await updateUserPassword(newPassword);
    setPasswordLoading(false);

    if (error) {
      setPasswordFeedback({ type: 'error', message: error });
    } else {
      setPasswordFeedback({ type: 'success', message: 'Mot de passe modifié avec succès.' });
      setNewPassword('');
      setNewPasswordConfirm('');
      setTimeout(() => setPasswordFeedback(null), 3000);
    }
  };

  // Handle Local Data Migration
  const handleImportLocal = async () => {
    setMigrating(true);
    const res = await importLocalData();
    setMigrating(false);
    setMigrationFeedback(res.message);
    setMigrationSummary(getLocalMigrationSummary());
    setSquads(loadAllSquads());
  };

  const handleSignOut = async () => {
    await signOut();
    onBackToHome();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Récemment';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Récemment';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="cursor-pointer inline-flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <div className="w-full h-full bg-[#070b14] rounded-[7px] flex items-center justify-center text-blue-400 group-hover:text-emerald-400 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading text-xl font-bold tracking-wider text-white leading-none">
                eFOOTBALL <span className="text-blue-500">ELITE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                Espace Compétiteur
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerSync}
              title="Synchroniser mes données en ligne"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Synchroniser</span>
            </button>

            <button
              onClick={handleSignOut}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Profile Hero Header Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1322] via-[#0d172e] to-[#0a1224] border border-blue-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <PlayerAvatar avatarId={profile?.avatar_url || 'avatar-1'} size="xl" />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
                    {profile?.username || 'Compétiteur'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {profile?.level_tier || 'Espoir en Formation'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    ID : <strong className="text-slate-300">{user?.id?.slice(0, 8)}</strong>...
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Membre depuis le {formatDate(profile?.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sync status indicator */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {syncStatus === 'synced' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synchronisé en ligne (Supabase)
                  </span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synchronisation en cours...
                  </span>
                )}
                {syncStatus === 'error' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Erreur de synchronisation
                  </span>
                )}
                {syncStatus === 'idle' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    Prêt
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="font-heading text-3xl font-black text-amber-400 font-mono">
                  {profile?.xp ?? academyProgress.totalXp}
                </span>
                <span className="text-xs text-slate-400 uppercase font-semibold ml-1.5">XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Local Storage Migration Banner (if applicable) */}
        {migrationSummary.hasLocalData && (
          <section className="bg-gradient-to-r from-amber-950/40 via-[#181a24] to-blue-950/40 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <UploadCloud className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-white">
                    Données de navigation locale détectées
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Nous avons trouvé <strong className="text-white">{migrationSummary.localLessonsCount} leçons</strong>,{' '}
                    <strong className="text-white">{migrationSummary.localQuizzesCount} quiz</strong> et{' '}
                    <strong className="text-white">{migrationSummary.localSquadsCount} compositions</strong> sur cet appareil. Tu peux les importer dans ton compte Supabase pour les synchroniser partout.
                  </p>
                </div>
              </div>

              <button
                onClick={handleImportLocal}
                disabled={migrating}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0 disabled:opacity-60"
              >
                {migrating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Importation...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Importer dans mon compte</span>
                  </>
                )}
              </button>
            </div>

            {migrationFeedback && (
              <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{migrationFeedback}</span>
              </div>
            )}
          </section>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-t-lg relative whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-blue-400 bg-slate-900/60 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tableau de Bord
          </button>

          <button
            onClick={() => setActiveTab('squads')}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-t-lg relative whitespace-nowrap ${
              activeTab === 'squads'
                ? 'text-blue-400 bg-slate-900/60 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mes Compositions ({squads.length})
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-t-lg relative whitespace-nowrap ${
              activeTab === 'edit'
                ? 'text-blue-400 bg-slate-900/60 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modifier mon Profil
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`cursor-pointer px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-t-lg relative whitespace-nowrap ${
              activeTab === 'security'
                ? 'text-blue-400 bg-slate-900/60 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sécurité & Compte
          </button>
        </div>

        {/* TAB 1: Tableau de Bord Personnel */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Académie</span>
                  <BookOpen className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-heading text-3xl font-black text-white">
                  {completedLessons} <span className="text-xs text-slate-500 font-sans">/ 30</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300"
                    style={{ width: `${academyPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">{academyPercent}% accompli</span>
              </div>

              <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Quiz Réussis</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-heading text-3xl font-black text-emerald-400">
                  {passedQuizzes} <span className="text-xs text-slate-500 font-sans">/ 30</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-4 block">Succès validés</span>
              </div>

              <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Défis en Match</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-heading text-3xl font-black text-amber-400">
                  {completedChallenges} <span className="text-xs text-slate-500 font-sans">/ 4</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-4 block">Missions complétées</span>
              </div>

              <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Compositions</span>
                  <Layers className="w-4 h-4 text-blue-400" />
                </div>
                <div className="font-heading text-3xl font-black text-white">
                  {squads.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-4 block">Sauvegardées</span>
              </div>
            </div>

            {/* Last Viewed Lesson Card */}
            {lastLesson ? (
              <div className="bg-gradient-to-r from-blue-950/40 via-[#0b1528] to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
                    Dernière leçon consultée
                  </span>
                  <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                    {lastLesson.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {lastLesson.subtitle} · Niveau {lastLesson.level}
                  </p>
                </div>

                <button
                  onClick={() => onGoToAcademy(lastLesson.id)}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0"
                >
                  <span>Continuer la leçon</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                    Lance ton entraînement dans l'Académie
                  </h3>
                  <p className="text-xs text-slate-400">
                    30 leçons interactives du niveau débutant au niveau compétiteur avancé.
                  </p>
                </div>
                <button
                  onClick={() => onGoToAcademy()}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  <span>Explorer l'Académie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Mes Compositions Synchronisées */}
        {activeTab === 'squads' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading text-xl font-bold uppercase text-white">
                Compositions Synchronisées
              </h2>
              <button
                onClick={() => onGoToBuilder()}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <span>Créer un Onze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {squads.length === 0 ? (
              <div className="p-12 text-center bg-[#0b1322] border border-slate-800 rounded-2xl">
                <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-white font-semibold">Aucune composition enregistrée</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Crée ton premier onze sur le terrain interactif.</p>
                <button
                  onClick={() => onGoToBuilder()}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase"
                >
                  Ouvrir le constructeur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {squads.map((squad) => (
                  <div
                    key={squad.id}
                    className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {squad.formationId}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {formatDate(squad.updatedAt)}
                        </span>
                      </div>

                      <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                        {squad.name}
                      </h3>

                      <p className="text-xs text-slate-400 mb-4">
                        Style : <strong className="text-slate-300">{squad.playstyle}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {squad.slots.filter((s) => s.playerId !== null).length} / 11 joueurs
                      </span>

                      <button
                        onClick={() => onGoToBuilder(squad.id)}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold transition-all"
                      >
                        <span>Charger</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Modifier mon Profil */}
        {activeTab === 'edit' && (
          <div className="max-w-2xl bg-[#0b1322] border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in duration-150">
            <h2 className="font-heading text-2xl font-bold uppercase text-white mb-6">
              Personnalisation du Profil Joueur
            </h2>

            {editFeedback && (
              <div
                className={`mb-6 p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
                  editFeedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                {editFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{editFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Emblème Tactique
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = selectedAvatarId === preset.id;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setSelectedAvatarId(preset.id)}
                        className={`cursor-pointer p-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-blue-400 bg-blue-500/20 scale-105 shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <PlayerAvatar avatarId={preset.id} size="sm" />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">
                  {AVATAR_PRESETS.find((a) => a.id === selectedAvatarId)?.name}
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Pseudonyme Joueur
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Ce pseudonyme sera visible sur les classements et le profil public.
                </span>
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-60"
              >
                {editLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Sécurité & Compte */}
        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
            <div className="bg-[#0b1322] border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="font-heading text-2xl font-bold uppercase text-white mb-4">
                Changer de Mot de Passe
              </h2>

              {passwordFeedback && (
                <div
                  className={`mb-5 p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
                    passwordFeedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  <span>{passwordFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 caractères"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Répéter le mot de passe"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                >
                  {passwordLoading ? 'Mise à jour...' : 'Mettre à jour mon mot de passe'}
                </button>
              </form>
            </div>

            {/* Logout box */}
            <div className="bg-[#0b1322] border border-red-500/20 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold uppercase text-white">
                  Déconnexion de la Session
                </h3>
                <p className="text-xs text-slate-400">
                  Déconnecte cet appareil de ton compte eFootball Elite.
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <LogOut className="w-4 h-4" />
                <span>Me Déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
