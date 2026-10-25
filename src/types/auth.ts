export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  xp: number;
  level_tier: string;
  created_at: string;
  updated_at: string;
}

export interface UserStatsSummary {
  completedLessonsCount: number;
  passedQuizzesCount: number;
  completedChallengesCount: number;
  savedSquadsCount: number;
  totalXp: number;
  lastViewedLessonId: string | null;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export interface LocalMigrationSummary {
  hasLocalData: boolean;
  localLessonsCount: number;
  localQuizzesCount: number;
  localChallengesCount: number;
  localSquadsCount: number;
  localXp: number;
}
