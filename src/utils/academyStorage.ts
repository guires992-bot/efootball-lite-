import { AcademyProgressData } from '../types';

export const ACADEMY_STORAGE_KEY = 'efootball_arena_academy_v1';

export const DEFAULT_ACADEMY_PROGRESS: AcademyProgressData = {
  startedLessonIds: [],
  completedLessonIds: [],
  quizScores: {},
  completedChallengeIds: [],
  totalXp: 0,
  lastViewedLessonId: null,
  version: 1,
  updatedAt: new Date().toISOString(),
};

// Load progress from LocalStorage
export function loadAcademyProgress(): AcademyProgressData {
  try {
    const raw = localStorage.getItem(ACADEMY_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ACADEMY_PROGRESS };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_ACADEMY_PROGRESS };
    }

    return {
      startedLessonIds: Array.isArray(parsed.startedLessonIds) ? Array.from(new Set(parsed.startedLessonIds)) : [],
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? Array.from(new Set(parsed.completedLessonIds)) : [],
      quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
      completedChallengeIds: Array.isArray(parsed.completedChallengeIds) ? Array.from(new Set(parsed.completedChallengeIds)) : [],
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
      lastViewedLessonId: typeof parsed.lastViewedLessonId === 'string' ? parsed.lastViewedLessonId : null,
      version: parsed.version || 1,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to load academy progress from localStorage, resetting to default', err);
    return { ...DEFAULT_ACADEMY_PROGRESS };
  }
}

// Save progress to LocalStorage
export function saveAcademyProgress(data: AcademyProgressData): void {
  try {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ACADEMY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save academy progress to localStorage', err);
  }
}

// Mark lesson as started
export function markLessonStarted(lessonId: string): AcademyProgressData {
  const current = loadAcademyProgress();
  const startedSet = new Set(current.startedLessonIds);
  startedSet.add(lessonId);

  const updated: AcademyProgressData = {
    ...current,
    startedLessonIds: Array.from(startedSet),
    lastViewedLessonId: lessonId,
  };
  saveAcademyProgress(updated);
  return updated;
}

// Mark lesson as completed (gives +50 XP on first completion)
export function toggleLessonCompleted(lessonId: string): { updated: AcademyProgressData; isNowCompleted: boolean; xpEarned: number } {
  const current = loadAcademyProgress();
  const completedSet = new Set(current.completedLessonIds);
  const startedSet = new Set(current.startedLessonIds);
  startedSet.add(lessonId);

  let xpEarned = 0;
  let isNowCompleted = false;

  if (completedSet.has(lessonId)) {
    // Unmark
    completedSet.delete(lessonId);
    isNowCompleted = false;
  } else {
    // Complete for first time: grant 50 XP
    completedSet.add(lessonId);
    isNowCompleted = true;
    xpEarned = 50;
  }

  const updated: AcademyProgressData = {
    ...current,
    startedLessonIds: Array.from(startedSet),
    completedLessonIds: Array.from(completedSet),
    totalXp: current.totalXp + xpEarned,
    lastViewedLessonId: lessonId,
  };
  saveAcademyProgress(updated);
  return { updated, isNowCompleted, xpEarned };
}

// Record Quiz attempt
export function saveLessonQuizResult(
  lessonId: string,
  isCorrect: boolean,
  selectedAnswer: number
): { updated: AcademyProgressData; xpEarned: number } {
  const current = loadAcademyProgress();
  const existing = current.quizScores[lessonId];
  const attempts = (existing?.attempts || 0) + 1;
  const wasAlreadyPassed = existing?.isPassed || false;

  let xpEarned = 0;
  if (isCorrect && !wasAlreadyPassed) {
    xpEarned = 30; // +30 XP on first successful quiz
  }

  const newQuizScores = {
    ...current.quizScores,
    [lessonId]: {
      score: isCorrect ? 100 : 0,
      attempts,
      selectedAnswer,
      isPassed: isCorrect,
    },
  };

  const updated: AcademyProgressData = {
    ...current,
    quizScores: newQuizScores,
    totalXp: current.totalXp + xpEarned,
    lastViewedLessonId: lessonId,
  };
  saveAcademyProgress(updated);
  return { updated, xpEarned };
}

// Complete Training Challenge
export function completeChallengeAction(
  challengeId: string,
  xpReward: number
): { updated: AcademyProgressData; isFirstTime: boolean } {
  const current = loadAcademyProgress();
  const challengeSet = new Set(current.completedChallengeIds);
  const isFirstTime = !challengeSet.has(challengeId);

  if (isFirstTime) {
    challengeSet.add(challengeId);
  }

  const updated: AcademyProgressData = {
    ...current,
    completedChallengeIds: Array.from(challengeSet),
    totalXp: current.totalXp + (isFirstTime ? xpReward : 0),
  };
  saveAcademyProgress(updated);
  return { updated, isFirstTime };
}

// Reset all progress
export function resetAcademyProgress(): AcademyProgressData {
  saveAcademyProgress(DEFAULT_ACADEMY_PROGRESS);
  return { ...DEFAULT_ACADEMY_PROGRESS };
}
