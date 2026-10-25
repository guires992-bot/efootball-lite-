import { TacticalStyle } from '../types';

export interface TacticalGuideDetail {
  id: TacticalStyle;
  title: string;
  tagline: string;
  generalPrinciples: string;
  recommendedFormations: string[];
  keyStrengths: string[];
  mainRisks: string[];
  idealPlayerTypes: {
    role: string;
    description: string;
  }[];
  commonMistakes: string[];
  metaNuanceNotice: string;
}

export const TACTICAL_GUIDES: Record<TacticalStyle, TacticalGuideDetail> = {
  'Contre-attaque rapide': {
    id: 'Contre-attaque rapide',
    title: 'Contre-Attaque Rapide (Méta Compétitive)',
    tagline: 'Ligne haute, projection immédiate des ailiers et récupération fulgurante',
    generalPrinciples:
      'Dès la récupération du ballon, tous les attaquants et milieux se projettent automatiquement vers l\'avant avec une agressivité maximale. La ligne défensive est placée très haute pour étouffer la relance adverse.',
    recommendedFormations: ['4-2-1-3', '4-3-3', '3-2-3-2'],
    keyStrengths: [
      'Transition offensive la plus meurtrière en 2 ou 3 touches de balle.',
      'Surcharge immédiate de la défense adverse encore désorganisée.',
      'Pressing haut automatique qui force l\'adversaire à dégager en panique.'
    ],
    mainRisks: [
      'Vulnérabilité critique aux longs ballons dans le dos de la charnière centrale.',
      'Fatigue rapide des milieux et ailiers due aux sprints permanents.',
      'Si l\'adversaire brise le premier rideau, votre surface est à découvert.'
    ],
    idealPlayerTypes: [
      { role: 'Avant-centre', description: 'Buteur opportuniste avec vitesse 90+ et grosse accélération (ex: Mbappé, Haaland).' },
      { role: 'Milieux défensifs', description: 'Au moins une Sentinelle robuste pour rester en couverture axiale (ex: Rodri, Casemiro).' },
      { role: 'Défenseurs centraux', description: 'Bâtisseurs véloces avec vitesse de reculoir (ex: Saliba, Van Dijk).' }
    ],
    commonMistakes: [
      'Se jeter en avant avec un défenseur central lors du contre au lieu de reculer.',
      'Abuser du sprint avec le porteur de balle, ce qui réduit la précision de passe.',
      'Négliger les remplacements aux 60e-70e minutes quand les attaquants s\'épuisent.'
    ],
    metaNuanceNotice:
      'Note d\'observation e-sport : Bien que populaire dans les hautes divisions, ce style exige une excellente gestion manuelle du curseur défensif. Une seconde d\'hésitation face à une passe en cloche peut coûter un but.'
  },
  'Possession': {
    id: 'Possession',
    title: 'Jeu de Possession (Contrôle du Tempo)',
    tagline: 'Circulation patiente, décrochages pour offrir des lignes de passe et domination territoriale',
    generalPrinciples:
      'Les coéquipiers se rapprochent du porteur pour lui offrir des solutions courtes sécurisées au lieu de plonger systématiquement en avant. La ligne défensive avance de manière coordonnée pour maintenir le bloc dans le camp adverse.',
    recommendedFormations: ['4-3-3', '4-2-3-1', '4-1-2-3', '3-4-3'],
    keyStrengths: [
      'Privation totale de ballon pour l\'adversaire, réduisant ses occasions de marquer.',
      'Création d\'espaces par la déformation du bloc défensif adverse avec de petits décalages.',
      'Moins d\'usure physique globale sur l\'ensemble des 90 minutes.'
    ],
    mainRisks: [
      'Difficulté à percer les blocs bas ultra-compacts (défenses à 5).',
      'Pertes de balle axiales fatales en cas de passe mal dosée face à un pressing adverse.',
      'Manque de percussion si l\'on refuse de prendre des risques verticaux.'
    ],
    idealPlayerTypes: [
      { role: 'Milieux axiaux', description: 'Chefs d\'orchestre et Meneurs avec passe 90+ et contrôle fin (ex: Pedri, De Bruyne).' },
      { role: 'Gardien de but', description: 'Gardien Offensif doté d\'une bonne relance au pied court (ex: Ter Stegen, Alisson).' },
      { role: 'Attaquants', description: 'Ailiers créatifs capables d\'éliminer en 1v1 dans un petit espace.' }
    ],
    commonMistakes: [
      'Conserver le ballon stérilement dans sa moitié de terrain sans jamais accélérer.',
      'Tenter une passe risquée alors que le joueur est dos au jeu.',
      'Paniquer face au pressing haut : utilisez le gardien en retrait pour aérer.'
    ],
    metaNuanceNotice:
      'Nuance tactique : La possession demande du calme et une excellente maîtrise des passes courtes au joystick. Elle ne garantit pas la victoire contre des contres chirurgicaux si les pertes de balle interviennent au milieu.'
  },
  'Contre-attaque longue': {
    id: 'Contre-attaque longue',
    title: 'Contre-Attaque Longue (Bloc Bas Hermétique)',
    tagline: 'Défense très basse, sécurité axiale et ouvertures directes vers un point d\'appui',
    generalPrinciples:
      'Le bloc équipe se replie profondément dès la perte du ballon. La ligne défensive refuse d\'avancer pour fermer tout espace dans son dos. À la récupération, de longues passes précises ciblent directement les attaquants.',
    recommendedFormations: ['4-4-2', '5-2-1-2', '4-2-1-3'],
    keyStrengths: [
      'Insensible aux passes en profondeur lobées par-dessus la défense.',
      'Densité suffocante dans la surface de réparation (très efficace face aux dribbleurs).',
      'Exploitation maximale des grands espaces laissés par les équipes offensives.'
    ],
    mainRisks: [
      'Subir un siège continu et concéder beaucoup de tirs de loin ou de corners.',
      'Grande distance entre la récupération et le but adverse (nécessite des attaquants endurants).',
      'Difficile de remonter le score si l\'adversaire mène et conserve la balle.'
    ],
    idealPlayerTypes: [
      { role: 'Attaquant pivot', description: 'Point d\'appui physique et bon de la tête pour caler les longs dégagements (ex: Kane, Haaland).' },
      { role: 'Arrières latéraux', description: 'Arrières défensifs qui ne montent jamais sans ordre (ex: Koundé, Gvardiol).' },
      { role: 'Défenseurs centraux', description: 'Gabarits très puissants et dominants dans les airs (ex: Van Dijk, Rüdiger).' }
    ],
    commonMistakes: [
      'Tenter de ressortir balle au pied depuis sa surface au lieu d\'allonger proprement.',
      'Laisser trop de liberté au porteur adverse aux 20 mètres pour déclencher un tir sensationnel.',
      'S\'impatienter et casser le bloc manuellement.'
    ],
    metaNuanceNotice:
      'Remarque tactique : Particulièrement efficace pour sécuriser un avantage ou affronter des adversaires techniquement supérieurs en 1v1.'
  },
  'Jeu sur les ailes': {
    id: 'Jeu sur les ailes',
    title: 'Jeu sur les Ailes (Centres & Débordements)',
    tagline: 'Fixation dans l\'axe, dédoublements des pistons et centres chirurgicaux',
    generalPrinciples:
      'Le ballon est rapidement orienté vers les couloirs latéraux. Les ailiers et latéraux bénéficient d\'un soutien permanent pour déborder et adresser des centres vers une surface saturée par les attaquants axiaux.',
    recommendedFormations: ['4-4-2', '3-4-3', '4-2-3-1'],
    keyStrengths: [
      'Écarte au maximum les défenses adverses trop regroupées dans l\'axe.',
      'Variété de centres : tendus au premier poteau, lobés au second, ou en retrait aux 16m.',
      'Danger permanent sur les deuxièmes ballons repoussés par la défense.'
    ],
    mainRisks: [
      'Les latéraux montant très haut, les couloirs dans leur dos sont particulièrement vulnérables.',
      'Si les centres sont prévisibles ou contrés, cela offre une transition rapide à l\'adversaire.',
      'Dépendance totale à la qualité de tête et de finition de vos attaquants.'
    ],
    idealPlayerTypes: [
      { role: 'Ailiers / Milieux latéraux', description: 'Pieds précis avec compétence Centre Millimétré (ex: Saka, Dimarco, Salah).' },
      { role: 'Buteurs axiaux', description: 'Attaquants dotés d\'une haute détente et de la compétence Tête puissante (ex: Haaland, Kane).' },
      { role: 'Milieu de terrain', description: 'Joueur de l\'ombre prêt à reprendre les centres en retrait (ex: Bellingham).' }
    ],
    commonMistakes: [
      'Centrer systématiquement sans regarder si un partenaire est en position favorable.',
      'Utiliser des ailiers à pied inversé pour centrer sans utiliser l\'extérieur du pied.',
      'Négliger la présence de deux milieux défensifs pour couvrir la montée des latéraux.'
    ],
    metaNuanceNotice:
      'Conseil compétitif : Combinez les centres avec des feintes de frappe pour rentrer à l\'intérieur de temps en temps, afin d\'empêcher le défenseur d\'anticiper uniquement la ligne de touche.'
  }
};
