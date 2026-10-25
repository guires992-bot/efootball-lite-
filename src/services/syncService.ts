import { getSupabaseClient } from '../lib/supabaseClient';
import { UserProfile, UserStatsSummary, LocalMigrationSummary } from '../types/auth';
import {
  loadAcademyProgress,
  saveAcademyProgress,
  DEFAULT_ACADEMY_PROGRESS,
} from '../utils/academyStorage';
import {
  loadAllSquads,
  saveAllSquads,
  STORAGE_KEY as SQUADS_STORAGE_KEY,
} from '../utils/squadStorage';
import { SavedSquad } from '../types';

// Calculate rank title from XP
export function calculateTierFromXp(xp: number): string {
  if (xp >= 1500) return 'Maître de l\'Arène';
  if (xp >= 800) return 'Tacticien Élite';
  if (xp >= 350) return 'Compétiteur Confirmé';
  return 'Espoir en Formation';
}

// 1. Fetch complete online user profile & statistics
export async function fetchOnlineUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Error fetching profile from Supabase:', error.message);
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.error('Failed to fetch online user profile:', err);
    return null;
  }
}

// 2. Full Two-Way Sync on Login
export async function syncOnlineDataToLocal(userId: string): Promise<{ success: boolean; stats: UserStatsSummary | null; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, stats: null, error: 'Supabase non configuré' };
  }

  try {
    // A. Fetch lessons
    const { data: onlineLessons, error: lessonsErr } = await supabase
      .from('lesson_progress')
      .select('lesson_id, is_completed')
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (lessonsErr) throw lessonsErr;

    // B. Fetch quizzes
    const { data: onlineQuizzes, error: quizErr } = await supabase
      .from('quiz_results')
      .select('lesson_id, score, attempts, selected_answer, is_passed')
      .eq('user_id', userId);

    if (quizErr) throw quizErr;

    // C. Fetch challenges
    const { data: onlineChallenges, error: chalErr } = await supabase
      .from('user_challenges')
      .select('challenge_id')
      .eq('user_id', userId);

    if (chalErr) throw chalErr;

    // D. Fetch squads
    const { data: onlineSquads, error: squadsErr } = await supabase
      .from('saved_squads')
      .select('*')
      .eq('user_id', userId);

    if (squadsErr) throw squadsErr;

    // Merge Academy progress with local state
    const currentLocal = loadAcademyProgress();
    const onlineCompletedIds = (onlineLessons || []).map((l) => l.lesson_id);
    const mergedCompletedIds = Array.from(new Set([...currentLocal.completedLessonIds, ...onlineCompletedIds]));
    const mergedStartedIds = Array.from(new Set([...currentLocal.startedLessonIds, ...mergedCompletedIds]));

    const mergedQuizzes = { ...currentLocal.quizScores };
    (onlineQuizzes || []).forEach((q) => {
      mergedQuizzes[q.lesson_id] = {
        score: q.score,
        attempts: q.attempts,
        selectedAnswer: q.selected_answer,
        isPassed: q.is_passed,
      };
    });

    const onlineChallengeIds = (onlineChallenges || []).map((c) => c.challenge_id);
    const mergedChallengeIds = Array.from(new Set([...currentLocal.completedChallengeIds, ...onlineChallengeIds]));

    // Compute updated total XP
    const totalXp = (mergedCompletedIds.length * 50) +
      (Object.values(mergedQuizzes).filter((q) => q.isPassed).length * 30) +
      (mergedChallengeIds.length * 150);

    const mergedAcademy = {
      ...currentLocal,
      startedLessonIds: mergedStartedIds,
      completedLessonIds: mergedCompletedIds,
      quizScores: mergedQuizzes,
      completedChallengeIds: mergedChallengeIds,
      totalXp,
      updatedAt: new Date().toISOString(),
    };
    saveAcademyProgress(mergedAcademy);

    // Merge squads
    if (onlineSquads && onlineSquads.length > 0) {
      const currentSquads = loadAllSquads();
      const squadMap = new Map<string, SavedSquad>();
      currentSquads.forEach((s) => squadMap.set(s.id, s));

      onlineSquads.forEach((row: any) => {
        const mappedSquad: SavedSquad = {
          id: row.id,
          name: row.name,
          formationId: row.formation_id,
          slots: Array.isArray(row.starting_eleven) ? row.starting_eleven : [],
          bench: Array.isArray(row.bench) ? row.bench : [],
          playstyle: row.tactical_style || 'Contre-attaque rapide',
          updatedAt: row.updated_at || new Date().toISOString(),
          version: 1,
        };
        squadMap.set(mappedSquad.id, mappedSquad);
      });

      saveAllSquads(Array.from(squadMap.values()));
    }

    // Update profile XP & level_tier in Supabase
    await supabase
      .from('profiles')
      .update({
        xp: totalXp,
        level_tier: calculateTierFromXp(totalXp),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    const stats: UserStatsSummary = {
      completedLessonsCount: mergedCompletedIds.length,
      passedQuizzesCount: Object.values(mergedQuizzes).filter((q) => q.isPassed).length,
      completedChallengesCount: mergedChallengeIds.length,
      savedSquadsCount: (onlineSquads || []).length,
      totalXp,
      lastViewedLessonId: mergedAcademy.lastViewedLessonId,
    };

    return { success: true, stats };
  } catch (err: any) {
    console.error('Error during online data synchronization:', err);
    return { success: false, stats: null, error: err.message || 'Erreur lors de la synchronisation' };
  }
}

// 3. Sync single lesson progress online
export async function syncSingleLessonOnline(userId: string, lessonId: string, isCompleted: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    if (isCompleted) {
      await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            is_completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );
    } else {
      await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', userId)
        .eq('lesson_id', lessonId);
    }

    // Refresh profile XP
    const currentLocal = loadAcademyProgress();
    await supabase
      .from('profiles')
      .update({
        xp: currentLocal.totalXp,
        level_tier: calculateTierFromXp(currentLocal.totalXp),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return true;
  } catch (err) {
    console.warn('Failed to sync lesson online:', err);
    return false;
  }
}

// 4. Sync single quiz result online
export async function syncSingleQuizOnline(
  userId: string,
  lessonId: string,
  score: number,
  attempts: number,
  selectedAnswer: number,
  isPassed: boolean
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    await supabase
      .from('quiz_results')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          score,
          attempts,
          selected_answer: selectedAnswer,
          is_passed: isPassed,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );

    const currentLocal = loadAcademyProgress();
    await supabase
      .from('profiles')
      .update({
        xp: currentLocal.totalXp,
        level_tier: calculateTierFromXp(currentLocal.totalXp),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return true;
  } catch (err) {
    console.warn('Failed to sync quiz online:', err);
    return false;
  }
}

// 5. Sync challenge online
export async function syncSingleChallengeOnline(userId: string, challengeId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    await supabase
      .from('user_challenges')
      .upsert(
        {
          user_id: userId,
          challenge_id: challengeId,
          claimed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,challenge_id' }
      );

    const currentLocal = loadAcademyProgress();
    await supabase
      .from('profiles')
      .update({
        xp: currentLocal.totalXp,
        level_tier: calculateTierFromXp(currentLocal.totalXp),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return true;
  } catch (err) {
    console.warn('Failed to sync challenge online:', err);
    return false;
  }
}

// 6. Sync single squad online
export async function syncSingleSquadOnline(userId: string, squad: SavedSquad): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('saved_squads')
      .upsert(
        {
          id: squad.id,
          user_id: userId,
          name: squad.name,
          formation_id: squad.formationId,
          tactical_style: squad.playstyle,
          starting_eleven: squad.slots,
          bench: squad.bench,
          is_public: false,
          updated_at: squad.updatedAt || new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to sync squad online:', err);
    return false;
  }
}

// 7. Delete squad online
export async function deleteSquadOnline(userId: string, squadId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('saved_squads')
      .delete()
      .eq('id', squadId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to delete squad online:', err);
    return false;
  }
}

// 8. Migration Helper: inspect local storage data
export function getLocalMigrationSummary(): LocalMigrationSummary {
  const academy = loadAcademyProgress();
  const squads = loadAllSquads();

  const localLessonsCount = academy.completedLessonIds.length;
  const localQuizzesCount = Object.values(academy.quizScores).filter((q) => q.isPassed).length;
  const localChallengesCount = academy.completedChallengeIds.length;
  const localSquadsCount = squads.length;
  const localXp = academy.totalXp;

  const hasLocalData = localLessonsCount > 0 || localQuizzesCount > 0 || localChallengesCount > 0 || localSquadsCount > 1;

  return {
    hasLocalData,
    localLessonsCount,
    localQuizzesCount,
    localChallengesCount,
    localSquadsCount,
    localXp,
  };
}

// 9. Upload all local data to Supabase (explicit migration)
export async function migrateLocalDataToSupabase(userId: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase n’est pas configuré.' };
  }

  try {
    const academy = loadAcademyProgress();
    const squads = loadAllSquads();

    // 1. Lessons
    if (academy.completedLessonIds.length > 0) {
      const lessonRows = academy.completedLessonIds.map((lid) => ({
        user_id: userId,
        lesson_id: lid,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }));
      await supabase.from('lesson_progress').upsert(lessonRows, { onConflict: 'user_id,lesson_id' });
    }

    // 2. Quizzes
    const quizEntries = Object.entries(academy.quizScores);
    if (quizEntries.length > 0) {
      const quizRows = quizEntries.map(([lid, val]) => ({
        user_id: userId,
        lesson_id: lid,
        score: val.score,
        attempts: val.attempts,
        selected_answer: val.selectedAnswer,
        is_passed: val.isPassed,
        completed_at: new Date().toISOString(),
      }));
      await supabase.from('quiz_results').upsert(quizRows, { onConflict: 'user_id,lesson_id' });
    }

    // 3. Challenges
    if (academy.completedChallengeIds.length > 0) {
      const chalRows = academy.completedChallengeIds.map((cid) => ({
        user_id: userId,
        challenge_id: cid,
        claimed_at: new Date().toISOString(),
      }));
      await supabase.from('user_challenges').upsert(chalRows, { onConflict: 'user_id,challenge_id' });
    }

    // 4. Squads
    if (squads.length > 0) {
      const squadRows = squads.map((s) => ({
        id: s.id,
        user_id: userId,
        name: s.name,
        formation_id: s.formationId,
        tactical_style: s.playstyle,
        starting_eleven: s.slots,
        bench: s.bench,
        is_public: false,
        updated_at: s.updatedAt || new Date().toISOString(),
      }));
      await supabase.from('saved_squads').upsert(squadRows, { onConflict: 'id' });
    }

    // 5. Update Profile XP
    await supabase
      .from('profiles')
      .update({
        xp: academy.totalXp,
        level_tier: calculateTierFromXp(academy.totalXp),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return {
      success: true,
      message: `Synchronisation réussie : ${academy.completedLessonIds.length} leçons, ${quizEntries.length} quiz et ${squads.length} compositions importées en ligne !`,
    };
  } catch (err: any) {
    console.error('Error during local migration:', err);
    return { success: false, message: err.message || 'Échec de l’importation des données locales.' };
  }
}
