import { TacticalFormation, AcademyLevel, TournamentItem, CommunityRank, VerifiedMatchResult, PlayerCard } from '../types';
import { FORMATIONS_LIST } from './formationsData';
import { PLAYERS_DATABASE } from './playersDatabase';

export const FORMATIONS_DATA: TacticalFormation[] = FORMATIONS_LIST;

export const FEATURED_PLAYERS_SAMPLE: PlayerCard[] = PLAYERS_DATABASE.slice(0, 4);

export const ACADEMY_LEVELS: AcademyLevel[] = [
  {
    id: 'debutant',
    title: 'Débutant',
    tagline: 'Maîtrise les fondamentaux du gameplay',
    duration: '4 modules · 35 min',
    accentColor: '#38bdf8',
    modules: [
      {
        title: 'Commandes de base & Ergonomie',
        description: 'Configuration optimale de la manette, type de joystick et sensibilité du curseur.',
        controlsKey: 'Joystick G + ✕ / A'
      },
      {
        title: 'Passes au sol & Temporisation',
        description: 'Orientation du corps, dosage de la puissance et passes sécurisées sans perte de balle.',
        controlsKey: 'Dosage de jauge < 60%'
      },
      {
        title: 'Tirs placés & Finition au pied fort',
        description: 'Placement face au gardien, choix du tir enroulé et gestion de l\'angle de frappe.',
        controlsKey: 'R2 + ▢ / RT + X'
      },
      {
        title: 'Défense de zone & Curseur manuel',
        description: 'Maintenir la ligne sans se jeter, utiliser le recul freiné (Match-up) et anticiper les trajectoires.',
        controlsKey: 'L2 / LT (Match-up)'
      }
    ]
  },
  {
    id: 'intermediaire',
    title: 'Intermédiaire',
    tagline: 'Affine ta vision tactique et tes enchaînements',
    duration: '5 modules · 50 min',
    accentColor: '#22c55e',
    modules: [
      {
        title: 'Tir sensationnel (Stunning Shot)',
        description: 'Exécution du tir puissant et des passes rapides à jauge mauve sous pression.',
        controlsKey: 'R2 enfoncé à fond + ▢'
      },
      {
        title: 'Une-deux dynamiques & Déplacements',
        description: 'Déclencher l\'appel immédiat d\'un partenaire et combiner en une touche de balle.',
        controlsKey: 'L1 + ✕ puis △'
      },
      {
        title: 'Pressing coordonné à deux',
        description: 'Orienter l\'adversaire vers la ligne de touche avec l\'IA tout en bloquant l\'axe manuellement.',
        controlsKey: '▢ maintenu (Appel second défenseur)'
      },
      {
        title: 'Gestion de l\'endurance & Remplacements',
        description: 'Planifier les temps forts, repérer les baisses de stamina et injecter des Super Sub au bon moment.',
        controlsKey: 'Gestion banc 60e minute'
      }
    ]
  },
  {
    id: 'avance',
    title: 'Avancé',
    tagline: 'Niveau compétitif e-sport & Lecture méta',
    duration: '6 modules · 75 min',
    accentColor: '#3b82f6',
    modules: [
      {
        title: 'Dribbles fins au joystick & Feintes de frappe',
        description: 'Changements de direction sans sprint, feintes de corps et déclenchement de la Double Touche.',
        controlsKey: 'Joystick D puis G'
      },
      {
        title: 'Passes en profondeur manuelles',
        description: 'Passes millimétrées dans les espaces libres en coupant les lignes adverses avec la passe lobée sensationnelle.',
        controlsKey: 'L1 + R2 + △'
      },
      {
        title: 'Pièges du hors-jeu manuels',
        description: 'Monter la ligne d\'un bloc sur les coups de pied arrêtés et sur les longues transversales.',
        controlsKey: 'Croix multidirectionnelle droite x2'
      },
      {
        title: 'Transition éclair & Contre-attaque létale',
        description: 'Lecture immédiate de la récupération, projection des ailiers et finition à 3 passes maximum.',
        controlsKey: 'Lecture méta e-sport'
      }
    ]
  }
];

export const TOURNAMENTS_DEMO_DATA: TournamentItem[] = [
  {
    id: 'arena-spring-2026',
    name: 'Arena Masters Series #1',
    platform: 'Cross-play',
    dates: 'Samedi 31 Octobre · 19h00 CET',
    format: 'Arbre à élimination directe (1v1 Bo3)',
    slotsLeft: 14,
    totalSlots: 64,
    prizePool: '500 € + Points de circuit',
    isDemo: true
  },
  {
    id: 'open-tactical-cup',
    name: 'Open Francophone Tactique 4-3-3',
    platform: 'PlayStation 5',
    dates: 'Mardi 3 Novembre · 20h30 CET',
    format: 'Poules + Phase finale (1v1 Bo1)',
    slotsLeft: 6,
    totalSlots: 32,
    prizePool: 'Lots gaming & Trophée communautaire',
    isDemo: true
  },
  {
    id: 'rookie-challenge-cup',
    name: 'Défi Espoirs Arena (Div 4-10)',
    platform: 'PC',
    dates: 'Vendredi 6 Novembre · 21h00 CET',
    format: 'Tournoi réservé aux divisions d\'apprentissage',
    slotsLeft: 22,
    totalSlots: 32,
    prizePool: 'Coaching e-sport par les top joueurs',
    isDemo: true
  }
];

export const COMMUNITY_RANKS_DEMO: CommunityRank[] = [
  { rank: 1, handle: 'AeroStrike_eF', division: 'Division 1 Méta', rating: 2185, winRate: '78.4%', favoriteFormation: '4-2-1-3', streak: '7V' },
  { rank: 2, handle: 'Kaiser_Tactic', division: 'Division 1 Méta', rating: 2140, winRate: '74.2%', favoriteFormation: '4-3-3', streak: '5V' },
  { rank: 3, handle: 'Nexus_Playmaker', division: 'Division 1 Méta', rating: 2108, winRate: '71.9%', favoriteFormation: '5-2-1-2', streak: '3V' },
  { rank: 4, handle: 'Vanguard_FC', division: 'Division 1 Méta', rating: 2075, winRate: '69.5%', favoriteFormation: '4-3-3', streak: '4V' },
  { rank: 5, handle: 'Shadow_Pivot', division: 'Division 1 Méta', rating: 2042, winRate: '67.0%', favoriteFormation: '4-2-1-3', streak: '2V' },
];

export const VERIFIED_RESULTS_DEMO: VerifiedMatchResult[] = [
  {
    id: 'res-101',
    tournament: 'Arena Masters Qualifier #8',
    date: '23 Octobre 2026',
    playerA: 'AeroStrike_eF',
    scoreA: 3,
    playerB: 'Kaiser_Tactic',
    scoreB: 1,
    mvp: 'K. Mbappé (2B, 1A)'
  },
  {
    id: 'res-102',
    tournament: 'Open Francophone Cup',
    date: '22 Octobre 2026',
    playerA: 'Nexus_Playmaker',
    scoreA: 2,
    playerB: 'Vanguard_FC',
    scoreB: 2,
    mvp: 'K. De Bruyne (1B, 1A)'
  },
  {
    id: 'res-103',
    tournament: 'Défi Tactique Division 1',
    date: '21 Octobre 2026',
    playerA: 'Shadow_Pivot',
    scoreA: 1,
    playerB: 'AeroStrike_eF',
    scoreB: 2,
    mvp: 'Rodri (Interceptions clés)'
  }
];
