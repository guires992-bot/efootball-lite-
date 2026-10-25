export type NavSection = 'accueil' | 'equipes' | 'joueurs' | 'apprendre' | 'classements' | 'tournois';

export type PlayerPosition =
  | 'GB'
  | 'DC'
  | 'DD'
  | 'DG'
  | 'MDC'
  | 'MC'
  | 'MO'
  | 'MD'
  | 'MG'
  | 'AD'
  | 'AG'
  | 'AC';

export type PositionCategory = 'TOUS' | 'ATTAQUANTS' | 'MILIEUX' | 'DEFENSEURS' | 'GARDIENS';

export type TacticalStyle =
  | 'Possession'
  | 'Contre-attaque rapide'
  | 'Contre-attaque longue'
  | 'Jeu sur les ailes';

export interface PlayerStats {
  pace: number;       // Vitesse
  finishing: number;  // Finition
  passing: number;    // Passe
  dribbling: number;  // Dribble
  defending: number;  // Défense
  physical: number;   // Physique
}

// Granular statistics for the Player Guide and Comparator (Part 3)
export interface GranularPlayerStats {
  speed: number | null;            // Vitesse
  acceleration: number | null;     // Accélération
  finishing: number | null;        // Finition
  kickingPower: number | null;     // Puissance de tir
  passing: number | null;          // Passe
  ballControl: number | null;      // Contrôle de balle
  dribbling: number | null;        // Dribble
  defending: number | null;        // Défense
  physicalContact: number | null;  // Contact physique
  stamina: number | null;          // Endurance
  weakFootAccuracy?: number | null; // 1 à 4
  weakFootUsage?: number | null;    // 1 à 4
}

export interface PlayerCard {
  id: string;
  name: string;
  club: string;
  nationality: string;
  position: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  overall: number;                 // Note globale
  overallRating?: number;           // Alias prompt 3
  playStyle: string;               // Style de jeu
  playingStyle?: string;           // Alias prompt 3
  preferredFoot: 'Droitier' | 'Gaucher';
  keyStats: PlayerStats;           // Compact summary stats
  granularStats?: GranularPlayerStats; // Detailed stats for comparator
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  tacticalUses?: string[];         // Usages tactiques recommandés
  source?: string;                 // Origine des données
  updatedAt?: string;              // Date de dernière mise à jour
  isDemo: boolean;
}

export type AnalysisRole =
  | 'Avant-centre'
  | 'Ailier'
  | 'Meneur / Milieu offensif'
  | 'Milieu central / Box-to-box'
  | 'Sentinelle / Milieu défensif'
  | 'Défenseur central'
  | 'Arrière latéral'
  | 'Gardien de but';

export interface FormationSlotTemplate {
  slotId: string;
  position: PlayerPosition;
  label: string;
  x: number;
  y: number;
}

export interface TacticalFormation {
  id: string;
  name: string;
  label: string;
  category: '4 Défenseurs' | '3 Défenseurs' | '5 Défenseurs';
  playstyleFit: string;
  strengths: string;
  weaknesses: string;
  slots: FormationSlotTemplate[];
}

export interface SquadSlot {
  slotId: string;
  position: PlayerPosition;
  x: number;
  y: number;
  playerId: string | null;
}

export interface SavedSquad {
  id: string;
  name: string;
  formationId: string;
  slots: SquadSlot[];
  bench: (string | null)[];
  playstyle: TacticalStyle;
  updatedAt: string;
  version: number;
}

// --- ACADÉMIE eFOOTBALL (PARTIE 1 & 4) ---
export interface AcademyModule {
  title: string;
  description: string;
  controlsKey: string;
}

export interface AcademyLevel {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  accentColor?: string;
  modules: AcademyModule[];
}

export type LessonLevel = 'debutant' | 'intermediaire' | 'avance';
export type LessonTheme =
  | 'Commandes'
  | 'Attaque'
  | 'Défense'
  | 'Tactique'
  | 'Équipe'
  | 'Progression'
  | 'Mental & Compétition';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TacticalScenarioChoice {
  text: string;
  feedback: string;
  isOptimal: boolean;
}

export interface TacticalScenario {
  id: string;
  situationTitle: string;
  situationDescription: string;
  choices: TacticalScenarioChoice[];
}

export interface TrainingChallenge {
  id: string;
  title: string;
  level: LessonLevel;
  objective: string;
  instructions: string[];
  duration: string;
  successCriteria: string;
  xpReward: number;
}

export interface AcademyLesson {
  id: string;
  level: LessonLevel;
  order: number;
  title: string;
  subtitle: string;
  theme: LessonTheme;
  duration: string;
  objective: string;
  contentSteps: {
    stepNumber: number;
    title: string;
    explanation: string;
    tip?: string;
  }[];
  matchExample: {
    situation: string;
    solution: string;
  };
  frequentMistakes: string[];
  practicalExercise: string;
  scenario?: TacticalScenario;
  quiz: QuizQuestion;
  squadBuilderRecommendation?: {
    formationId: string;
    description: string;
  };
}

export interface AcademyProgressData {
  startedLessonIds: string[];
  completedLessonIds: string[];
  quizScores: Record<string, { score: number; attempts: number; selectedAnswer: number; isPassed: boolean }>;
  completedChallengeIds: string[];
  totalXp: number;
  lastViewedLessonId: string | null;
  version: number;
  updatedAt: string;
}

export interface AcademyLevelSummary {
  id: LessonLevel;
  title: string;
  tagline: string;
  accentColor: string;
  lessonsCount: number;
}

export interface TournamentItem {
  id: string;
  name: string;
  platform: 'Cross-play' | 'PlayStation 5' | 'PC' | 'Mobile';
  dates: string;
  format: string;
  slotsLeft: number;
  totalSlots: number;
  prizePool: string;
  isDemo: boolean;
}

export interface CommunityRank {
  rank: number;
  handle: string;
  division: string;
  rating: number;
  winRate: string;
  favoriteFormation: string;
  streak: string;
}

export interface VerifiedMatchResult {
  id: string;
  tournament: string;
  date: string;
  playerA: string;
  scoreA: number;
  playerB: string;
  scoreB: number;
  mvp: string;
}
