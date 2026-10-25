import { PlayerCard, AnalysisRole } from '../types';

export const FAVORITES_STORAGE_KEY = 'efootball_arena_favorites_v1';
export const RECENT_COMPARISONS_KEY = 'efootball_arena_recent_comparisons_v1';

// --- FAVORITES IN LOCALSTORAGE ---
export function getFavoritePlayerIds(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set<string>();
  } catch (e) {
    return new Set<string>();
  }
}

export function saveFavoritePlayerIds(ids: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e);
  }
}

export function toggleFavorite(playerId: string): boolean {
  const current = getFavoritePlayerIds();
  const willBeFavorite = !current.has(playerId);
  if (willBeFavorite) {
    current.add(playerId);
  } else {
    current.delete(playerId);
  }
  saveFavoritePlayerIds(current);
  return willBeFavorite;
}

// --- RECENT COMPARISONS ---
export interface RecentComparisonItem {
  player1Id: string;
  player2Id: string;
  timestamp: string;
}

export function getRecentComparisons(): RecentComparisonItem[] {
  try {
    const raw = localStorage.getItem(RECENT_COMPARISONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch (e) {
    return [];
  }
}

export function addRecentComparison(player1Id: string, player2Id: string): void {
  try {
    if (player1Id === player2Id) return;
    const current = getRecentComparisons().filter(
      (item) =>
        !(
          (item.player1Id === player1Id && item.player2Id === player2Id) ||
          (item.player1Id === player2Id && item.player2Id === player1Id)
        )
    );
    const updated: RecentComparisonItem[] = [
      { player1Id, player2Id, timestamp: new Date().toISOString() },
      ...current,
    ].slice(0, 5);
    localStorage.setItem(RECENT_COMPARISONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save recent comparison', e);
  }
}

// --- POSITION ROLE ANALYSIS & TRANSPARENT COMPATIBILITY SCORE ---
export interface RoleWeightRule {
  role: AnalysisRole;
  description: string;
  keyRequirements: string[];
  calculateScore: (player: PlayerCard) => { score: number; formulaNotice: string };
}

export const ROLE_WEIGHT_RULES: Record<AnalysisRole, RoleWeightRule> = {
  'Avant-centre': {
    role: 'Avant-centre',
    description: 'Finition chirurgicale dans la surface, puissance athlétique et accélération pour fausser compagnie aux défenseurs.',
    keyRequirements: ['Finition (35%)', 'Vitesse & Accélération (25%)', 'Contact Physique (20%)', 'Dribble & Contrôle (20%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const fin = g?.finishing ?? p.keyStats.finishing;
      const vit = g?.speed ?? p.keyStats.pace;
      const phy = g?.physicalContact ?? p.keyStats.physical;
      const dri = g?.dribbling ?? p.keyStats.dribbling;
      const score = Math.round(fin * 0.35 + vit * 0.25 + phy * 0.20 + dri * 0.20);
      return {
        score,
        formulaNotice: 'Formule : Finition 35% + Vitesse 25% + Physique 20% + Dribble 20%'
      };
    }
  },
  'Ailier': {
    role: 'Ailier',
    description: 'Vitesse de débordement supersonique, agilité en 1 contre 1 et qualité de centre ou tir enroulé au second poteau.',
    keyRequirements: ['Vitesse & Accélération (40%)', 'Dribble & Agilité (30%)', 'Passe & Centre (20%)', 'Finition (10%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const vit = g?.speed ?? p.keyStats.pace;
      const dri = g?.dribbling ?? p.keyStats.dribbling;
      const pas = g?.passing ?? p.keyStats.passing;
      const fin = g?.finishing ?? p.keyStats.finishing;
      const score = Math.round(vit * 0.40 + dri * 0.30 + pas * 0.20 + fin * 0.10);
      return {
        score,
        formulaNotice: 'Formule : Vitesse 40% + Dribble 30% + Passe 20% + Finition 10%'
      };
    }
  },
  'Meneur / Milieu offensif': {
    role: 'Meneur / Milieu offensif',
    description: 'Vision du jeu supérieure, passes laser pour casser les lignes et tirs lointains cadrés.',
    keyRequirements: ['Passe courte & longue (35%)', 'Contrôle & Dribble (30%)', 'Finition & Frappe (20%)', 'Vitesse (15%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const pas = g?.passing ?? p.keyStats.passing;
      const dri = g?.ballControl ?? p.keyStats.dribbling;
      const fin = g?.finishing ?? p.keyStats.finishing;
      const vit = g?.speed ?? p.keyStats.pace;
      const score = Math.round(pas * 0.35 + dri * 0.30 + fin * 0.20 + vit * 0.15);
      return {
        score,
        formulaNotice: 'Formule : Passe 35% + Contrôle 30% + Tir 20% + Vitesse 15%'
      };
    }
  },
  'Milieu central / Box-to-box': {
    role: 'Milieu central / Box-to-box',
    description: 'Endurance inépuisable, capacité à relancer proprement et présence physique dans les deux surfaces de réparation.',
    keyRequirements: ['Endurance & Physique (30%)', 'Passe (25%)', 'Défense (25%)', 'Dribble & Orientation (20%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const sta = g?.stamina ?? p.keyStats.physical;
      const pas = g?.passing ?? p.keyStats.passing;
      const def = g?.defending ?? p.keyStats.defending;
      const dri = g?.dribbling ?? p.keyStats.dribbling;
      const score = Math.round(sta * 0.30 + pas * 0.25 + def * 0.25 + dri * 0.20);
      return {
        score,
        formulaNotice: 'Formule : Endurance 30% + Passe 25% + Défense 25% + Dribble 20%'
      };
    }
  },
  'Sentinelle / Milieu défensif': {
    role: 'Sentinelle / Milieu défensif',
    description: 'Interceptions axiales, tacles debout propres, protection des défenseurs centraux et passe sécurisée.',
    keyRequirements: ['Défense & Interception (40%)', 'Contact Physique (30%)', 'Passe (15%)', 'Endurance (15%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const def = g?.defending ?? p.keyStats.defending;
      const phy = g?.physicalContact ?? p.keyStats.physical;
      const pas = g?.passing ?? p.keyStats.passing;
      const sta = g?.stamina ?? p.keyStats.physical;
      const score = Math.round(def * 0.40 + phy * 0.30 + pas * 0.15 + sta * 0.15);
      return {
        score,
        formulaNotice: 'Formule : Défense 40% + Contact 30% + Passe 15% + Endurance 15%'
      };
    }
  },
  'Défenseur central': {
    role: 'Défenseur central',
    description: 'Aura défensive, domination dans les duels aériens, puissance au plaquage et vitesse de couverture.',
    keyRequirements: ['Défense (45%)', 'Contact Physique & Tête (35%)', 'Vitesse de recul (15%)', 'Relance (5%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const def = g?.defending ?? p.keyStats.defending;
      const phy = g?.physicalContact ?? p.keyStats.physical;
      const vit = g?.speed ?? p.keyStats.pace;
      const pas = g?.passing ?? p.keyStats.passing;
      const score = Math.round(def * 0.45 + phy * 0.35 + vit * 0.15 + pas * 0.05);
      return {
        score,
        formulaNotice: 'Formule : Défense 45% + Physique 35% + Vitesse 15% + Relance 5%'
      };
    }
  },
  'Arrière latéral': {
    role: 'Arrière latéral',
    description: 'Vitesse de repli et de contre, solidité au duel face aux ailiers adverses et apport de centres précis.',
    keyRequirements: ['Vitesse & Accélération (35%)', 'Défense (30%)', 'Passe & Centre (20%)', 'Endurance (15%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const vit = g?.speed ?? p.keyStats.pace;
      const def = g?.defending ?? p.keyStats.defending;
      const pas = g?.passing ?? p.keyStats.passing;
      const sta = g?.stamina ?? p.keyStats.physical;
      const score = Math.round(vit * 0.35 + def * 0.30 + pas * 0.20 + sta * 0.15);
      return {
        score,
        formulaNotice: 'Formule : Vitesse 35% + Défense 30% + Passe 20% + Endurance 15%'
      };
    }
  },
  'Gardien de but': {
    role: 'Gardien de but',
    description: 'Réflexes sur la ligne, envergure dans les sorties aériennes et solidité en 1 contre 1.',
    keyRequirements: ['Défense / Réflexes (60%)', 'Physique & Envergure (25%)', 'Relance au pied (15%)'],
    calculateScore: (p) => {
      const g = p.granularStats;
      const def = g?.defending ?? p.keyStats.defending;
      const phy = g?.physicalContact ?? p.keyStats.physical;
      const pas = g?.passing ?? p.keyStats.passing;
      const score = Math.round(def * 0.60 + phy * 0.25 + pas * 0.15);
      return {
        score,
        formulaNotice: 'Formule : Réflexes/Arrêts 60% + Envergure 25% + Relance 15%'
      };
    }
  }
};
