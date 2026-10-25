import { AcademyLesson, TrainingChallenge, AcademyLevelSummary } from '../types';

export const ACADEMY_LEVEL_SUMMARIES: AcademyLevelSummary[] = [
  {
    id: 'debutant',
    title: 'Niveau 1 — Débutant',
    tagline: 'Découvre les bases, l\'interface, les commandes et ton premier plan de jeu.',
    accentColor: '#38bdf8',
    lessonsCount: 10,
  },
  {
    id: 'intermediaire',
    title: 'Niveau 2 — Intermédiaire',
    tagline: 'Affûte tes enchaînements rapides, ton pressing et ton équilibre tactique.',
    accentColor: '#22c55e',
    lessonsCount: 10,
  },
  {
    id: 'avance',
    title: 'Niveau 3 — Avancé',
    tagline: 'Lecture de match compétitive, gestion du tempo et adaptation en temps réel.',
    accentColor: '#3b82f6',
    lessonsCount: 10,
  },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // =========================================================================
  // NIVEAU 1 — DÉBUTANT (10 LEÇONS)
  // =========================================================================
  {
    id: 'deb-1',
    level: 'debutant',
    order: 1,
    title: 'Découvrir l’interface et les principaux menus',
    subtitle: 'Prise en main du jeu et navigation efficace',
    theme: 'Commandes',
    duration: '6 min',
    objective: 'Comprendre l\'organisation générale d\'eFootball pour configurer ses paramètres et naviguer rapidement sans se perdre.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le Menu Principal (Événements & Dream Team)',
        explanation: 'Le menu d\'accueil centralise les événements hebdomadaires contre l\'IA, les circuits PvP et le mode Dream Team (mon équipe personnalisée).',
        tip: 'Les événements "Tour Event" contre l\'IA sont le meilleur moyen d\'accumuler des points d\'entraînement sans stress de classement.'
      },
      {
        stepNumber: 2,
        title: 'La Gestion du Plan de Jeu',
        explanation: 'Accessible avant chaque rencontre ou dans l\'onglet Mon Équipe. C\'est ici que tu sélectionnes ta formation, ton entraîneur et tes 11 titulaires.',
      },
      {
        stepNumber: 3,
        title: 'Configuration de la manette',
        explanation: 'Vérifie dans les Paramètres de jeu si tu es en configuration Standard ou Alternative. Choisis un changement de curseur "Semi-assisté" pour débuter.',
        tip: 'Le curseur semi-assisté t\'évite de perdre le contrôle sur les centres adverses tout en te laissant le choix du joueur à la récupération.'
      }
    ],
    matchExample: {
      situation: 'Tu lances ton premier match en ligne mais les touches ne correspondent pas à tes réflexes habituels.',
      solution: 'Mets le jeu en pause ou configure ton profil de manette depuis le menu principal : active la course sur R2/RT et le tir sur Carré/X.'
    },
    frequentMistakes: [
      'Garder le changement de curseur 100% automatique (l\'IA change de joueur au pire moment).',
      'Ignorer la jauge d\'endurance des joueurs avant de lancer une série de matchs.'
    ],
    practicalExercise: 'Rends-toi dans les Paramètres de commande, vérifie ton affectation des touches et lance un match d\'entraînement libre de 3 minutes.',
    scenario: {
      id: 'scen-deb-1',
      situationTitle: 'Choix de configuration pour débuter',
      situationDescription: 'Tu découvres eFootball et tu hésites sur le réglage du changement de curseur.',
      choices: [
        {
          text: 'Activer le changement de curseur Entièrement Manuel',
          feedback: 'Trop complexe pour débuter : tu devras orienter le joystick droit à chaque passe adverse, au risque de laisser des boulevards.',
          isOptimal: false
        },
        {
          text: 'Choisir le changement de curseur Semi-assisté avec indicateur du prochain joueur',
          feedback: 'Excellente décision : l\'IA t\'aide sur les trajectoires aériennes mais te laisse libre de choisir ton défenseur clé au sol.',
          isOptimal: true
        },
        {
          text: 'Laisser le changement de curseur Automatique complet',
          feedback: 'Piège classique : l\'IA va changer de joueur intempestivement quand l\'adversaire déclenchera une passe en profondeur.',
          isOptimal: false
        }
      ]
    },
    quiz: {
      id: 'quiz-deb-1',
      question: 'Quel réglage de changement de curseur est recommandé pour concilier confort et réactivité au début ?',
      options: ['Manuel intégral au joystick droit', 'Semi-assisté', 'Automatique forcé'],
      correctIndex: 1,
      explanation: 'Le mode Semi-assisté permet d\'anticiper manuellement sans subir les changements intempestifs du mode automatique.'
    }
  },
  {
    id: 'deb-2',
    level: 'debutant',
    order: 2,
    title: 'Comprendre les commandes essentielles',
    subtitle: 'La base gestuelle : passe, tir, sprint et tacle',
    theme: 'Commandes',
    duration: '8 min',
    objective: 'Associer instinctivement chaque action principale à sa commande pour réagir sans temps de latence mental.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Les 4 commandes avec ballon',
        explanation: 'Passe courte au sol (Croix / A), Passe lobée / Centre (Rond / B), Tir au but (Carré / X), Passe en profondeur (Triangle / Y).',
        tip: 'Ne maintiens pas le bouton de passe trop longtemps : le dosage détermine la force, pas la direction.'
      },
      {
        stepNumber: 2,
        title: 'Le sprint et son piège (R2 / RT)',
        explanation: 'Courir permet de déborder, mais réduit immédiatement la précision des tirs et le contrôle du ballon.',
        tip: 'Règle d\'or : lâche le sprint dès que tu t\'apprêtes à faire une passe ou un tir !'
      },
      {
        stepNumber: 3,
        title: 'Les commandes sans ballon',
        explanation: 'Pressing de base (Croix / A maintenu), Tacle glissé (Rond / B), Tacle debout (Double touche Croix ou Carré selon configuration).',
      }
    ],
    matchExample: {
      situation: 'Ton joueur pousse le ballon trop loin et le gardien adverse s\'en empare facilement.',
      solution: 'Tu as maintenu la gâchette de sprint enfoncée au moment de la réception. Relâche R2/RT pour amortir le ballon collé au pied.'
    },
    frequentMistakes: [
      'Garder le doigt collé sur le sprint durant toute la possession.',
      'Tenter un tacle glissé frontal dans la surface de réparation (carton rouge assuré).'
    ],
    practicalExercise: 'En match amical ou contre l\'IA, effectue 20 passes consécutives sans toucher au bouton de sprint une seule fois.',
    scenario: {
      id: 'scen-deb-2',
      situationTitle: 'Réception de passe sous pression',
      situationDescription: 'Tu reçois un ballon dos au but adverse alors qu\'un défenseur arrive sur tes talons.',
      choices: [
        {
          text: 'Sprint immédiat vers l\'avant avec R2',
          feedback: 'Le ballon va s\'éloigner de tes pieds et le défenseur interceptera la balle au contact.',
          isOptimal: false
        },
        {
          text: 'Relâcher le sprint et orienter le joystick gauche vers un partenaire démarqué',
          feedback: 'Parfait : le contrôle orienté sécurise la balle et protège ton angle de relance.',
          isOptimal: true
        }
      ]
    },
    quiz: {
      id: 'quiz-deb-2',
      question: 'Que se passe-t-il si vous maintenez la touche de sprint enfoncée au moment de recevoir le ballon ?',
      options: ['Le joueur amortit parfaitement le ballon', 'Le joueur pousse le ballon loin de lui et augmente le risque de perte', 'Le joueur tire automatiquement'],
      correctIndex: 1,
      explanation: 'Le sprint lors de la réception allonge la trajectoire du contrôle, rendant la balle facile à intercepter pour l\'adversaire.'
    }
  },
  {
    id: 'deb-3',
    level: 'debutant',
    order: 3,
    title: 'Maîtriser les passes courtes et longues',
    subtitle: 'Orientation du buste, dosage de jauge et angles de relance',
    theme: 'Attaque',
    duration: '7 min',
    objective: 'Éliminer les pertes de balle faciles en comprenant l\'impact de l\'orientation du corps sur la précision des transmissions.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'L\'orientation du buste',
        explanation: 'Dans eFootball, une passe effectuée à 180° (sans regarder son partenaire) a 80% de chance d\'être molle ou imprécise.',
        tip: 'Fais un mini-pas dans la direction de ton coéquipier avant d\'appuyer sur la touche de passe.'
      },
      {
        stepNumber: 2,
        title: 'Le dosage de la jauge',
        explanation: 'Une jauge entre 30% et 50% offre une passe claquée idéale pour traverser le premier rideau adverse.',
      },
      {
        stepNumber: 3,
        title: 'La passe lobée / transversale (Rond / B)',
        explanation: 'Idéale pour basculer le jeu d\'un côté à l\'autre quand l\'adversaire concentre tout son bloc sur une seule aile.',
      }
    ],
    matchExample: {
      situation: 'Ton défenseur central essaie de relancer vers l\'avant alors qu\'il court en direction de son propre gardien.',
      solution: 'Passe en retrait vers le gardien ou pivote d\'abord avant d\'allonger la passe.'
    },
    frequentMistakes: [
      'Forcer la passe en profondeur dès que l\'on a le ballon.',
      'Ignorer le pied fort du passeur lors d\'une longue transversale.'
    ],
    practicalExercise: 'Fais circuler le ballon entre tes 4 défenseurs et ton milieu défensif pendant 1 minute sans rater une passe.',
    quiz: {
      id: 'quiz-deb-3',
      question: 'Pourquoi une passe réalisée dos au receveur sans contrôle est-elle déconseillée ?',
      options: ['Elle est interdite par les règles', 'L\'angle anatomique réduit drastiquement la puissance et la précision de transmission', 'Elle déclenche automatiquement un hors-jeu'],
      correctIndex: 1,
      explanation: 'eFootball applique une physique de balle réaliste : si le joueur n\'est pas orienté vers sa cible, la passe est flottante et facilement interceptée.'
    }
  },
  {
    id: 'deb-4',
    level: 'debutant',
    order: 4,
    title: 'Apprendre à contrôler le ballon',
    subtitle: 'Contrôles orientés et protection de balle avec le corps',
    theme: 'Commandes',
    duration: '7 min',
    objective: 'Gagner 1 seconde précieuse sur chaque prise de balle pour pouvoir enchaîner passe ou tir.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le contrôle orienté au joystick gauche',
        explanation: 'Avant que le ballon n\'arrive, incline le joystick gauche vers l\'espace libre pour orienter ta première touche.',
      },
      {
        stepNumber: 2,
        title: 'Protéger la balle avec le dos',
        explanation: 'Lorsque l\'adversaire te colle, oriente le joystick à l\'opposé pour placer le corps de ton joueur comme bouclier.',
      },
      {
        stepNumber: 3,
        title: 'L\'amorti sans toucher au joystick',
        explanation: 'Si la passe arrive très vite, lâcher toutes les commandes permet un contrôle net dans les pieds.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire charge avec son défenseur au moment où ton attaquant reçoit le ballon.',
      solution: 'Contrôle orienté vers l\'extérieur pour esquiver la charge et ouvrir l\'angle de tir.'
    },
    frequentMistakes: [
      'Contrôler vers l\'avant alors qu\'un défenseur anticipe la trajectoire.',
    ],
    practicalExercise: 'Enchaîne 10 passes vers ton avant-centre en orientant chaque contrôle à 90° de l\'arrivée de la balle.',
    quiz: {
      id: 'quiz-deb-4',
      question: 'Comment amortir un ballon difficile sans le pousser à plusieurs mètres ?',
      options: ['Enfoncer le sprint à fond', 'Relâcher le sprint et orienter délicatement le joystick dans l\'espace libre', 'Appuyer sur tir immédiatement'],
      correctIndex: 1,
      explanation: 'Relâcher le sprint permet d\'absorber l\'inertie du ballon et de le garder sous contrôle immédiat.'
    }
  },
  {
    id: 'deb-5',
    level: 'debutant',
    order: 5,
    title: 'Améliorer les tirs et la finition',
    subtitle: 'Tir placé enroulé, frappe tendue et face-à-face avec le gardien',
    theme: 'Attaque',
    duration: '9 min',
    objective: 'Augmenter ton ratio de conversion d\'occasions en choisissant le bon type de frappe selon l\'angle.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le tir de base (Carré / X)',
        explanation: 'Frappe standard. Idéale entre 10 et 16 mètres face aux buts, jauge dosée à 50-60%.',
      },
      {
        stepNumber: 2,
        title: 'Le tir enroulé / placé (R2 + Carré / RT + X)',
        explanation: 'Brosse la balle vers le petit filet opposé. Indispensable pour les ailiers rentrants (ex: Salah pied gauche ou Mbappé pied droit).',
      },
      {
        stepNumber: 3,
        title: 'Le face-à-face avec le gardien',
        explanation: 'Attends que le gardien adverse esquisse son plongeon ou sa sortie, puis décale légèrement ta course avant d\'enrouler.',
      }
    ],
    matchExample: {
      situation: 'Ton attaquant arrive à 45° sur son pied droit face au gardien sorti au point de penalty.',
      solution: 'Tir enroulé (R2 + Carré) au second poteau avec 40% de jauge.'
    },
    frequentMistakes: [
      'Remplir la jauge à 100% (le ballon s\'envole dans les tribunes).',
      'Tirer sur le mauvais pied sans compétence pied faible.'
    ],
    practicalExercise: 'Entraîne-toi sur 5 face-à-face à marquer exclusivement avec le tir enroulé au second poteau.',
    quiz: {
      id: 'quiz-deb-5',
      question: 'Quelle combinaison permet d\'enrouler son tir vers le petit filet opposé ?',
      options: ['L1 + Rond', 'R2 + Carré (RT + X)', 'L2 + Croix'],
      correctIndex: 1,
      explanation: 'La gâchette de brossage combinée au bouton de tir déclenche un tir enroulé précis vers le coin du but.'
    }
  },
  {
    id: 'deb-6',
    level: 'debutant',
    order: 6,
    title: 'Défendre sans se désorganiser',
    subtitle: 'Le Match-up (L2 / LT), le reculoir et la couverture axiale',
    theme: 'Défense',
    duration: '9 min',
    objective: 'Arrêter de concéder des buts sur contre en maintenant une ligne défensive imperméable.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le Match-up (L2 / LT) : ton meilleur allié',
        explanation: 'En maintenant L2/LT, ton défenseur se met en posture basse de crabe, prêt à intercepter les passes et bloquer les frappes automatiquement.',
      },
      {
        stepNumber: 2,
        title: 'Ne pas se jeter',
        explanation: 'Dans eFootball, sortir un défenseur central à 40 mètres crée un trou béant dans l\'axe. Recule avec lui jusqu\'à la surface.',
      },
      {
        stepNumber: 3,
        title: 'Le tacle au bon moment',
        explanation: 'N\'appuie sur le tacle debout que lorsque le porteur adverse a poussé son ballon un peu trop loin.',
      }
    ],
    matchExample: {
      situation: 'L\'attaquant adverse arrive à pleine vitesse vers tes 16 mètres.',
      solution: 'Ne te jette pas en sprint : maintiens L2/LT en reculant pour temporiser et attendre le soutien d\'un milieu.'
    },
    frequentMistakes: [
      'Courir tout droit vers le porteur avec le bouton de pressing enfoncé en permanence.',
      'Faire monter le défenseur central libéro.'
    ],
    practicalExercise: 'Joue une mi-temps complète en défendant uniquement avec L2/LT sans effectuer aucun tacle glissé.',
    quiz: {
      id: 'quiz-deb-6',
      question: 'À quoi sert la commande Match-up (L2 / LT) en phase défensive ?',
      options: ['À faire plonger son gardien', 'À adopter une posture de recul freiné qui intercepte automatiquement les ballons à portée', 'À tacler l\'adversaire par derrière'],
      correctIndex: 1,
      explanation: 'Le Match-up permet de fermer les lignes de passe et d\'étendre les jambes pour contrer les tirs adverses.'
    }
  },
  {
    id: 'deb-7',
    level: 'debutant',
    order: 7,
    title: 'Comprendre les déplacements et le positionnement',
    subtitle: 'Lignes défensives, largeur sur le terrain et appels naturels',
    theme: 'Tactique',
    duration: '8 min',
    objective: 'Observer la carte radar et comprendre comment tes joueurs bougent sans ballon.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'L\'utilisation du Radar',
        explanation: 'Le radar en bas d\'écran te montre les partenaires démarqués sur les ailes bien avant qu\'ils n\'apparaissent à la caméra.',
      },
      {
        stepNumber: 2,
        title: 'Garder ses lignes compactes',
        explanation: 'Entre tes défenseurs et tes attaquants, il ne doit pas y avoir un fossé de 50 mètres. Tes milieux doivent faire le lien.',
      },
      {
        stepNumber: 3,
        title: 'Laisser les appels se déclencher',
        explanation: 'Un ailier a besoin d\'1 à 2 secondes pour prendre de la vitesse. Temporise avant d\'envoyer la passe.',
      }
    ],
    matchExample: {
      situation: 'Le bloc adverse est regroupé au centre et aucun attaquant n\'est libre.',
      solution: 'Regarde le radar, repère ton arrière latéral seul sur l\'aile opposée et fais une transversale.'
    },
    frequentMistakes: [
      'Jouer sans jamais regarder le radar.',
      'Passer la balle avant que l\'attaquant n\'ait franchi la ligne défensive (hors-jeu).'
    ],
    practicalExercise: 'Sur tes 5 prochaines attaques, vérifie systématiquement le radar avant de déclencher la passe décisive.',
    quiz: {
      id: 'quiz-deb-7',
      question: 'Quelle est la principale utilité du radar en bas d\'écran ?',
      options: ['Afficher les scores des autres matchs', 'Repérer les démarquages hors champ et les déséquilibres adverses', 'Calculer la vitesse du vent'],
      correctIndex: 1,
      explanation: 'Le radar donne une vue aérienne instantanée de l\'ensemble des 22 joueurs sur le terrain.'
    }
  },
  {
    id: 'deb-8',
    level: 'debutant',
    order: 8,
    title: 'Construire une première équipe équilibrée',
    subtitle: 'Colonne vertébrale, synergie des postes et gestion du banc',
    theme: 'Équipe',
    duration: '8 min',
    objective: 'Composer une équipe sans faiblesse évidente en associant profils défensifs et offensifs.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'La colonne vertébrale indispensable',
        explanation: 'Il te faut au minimum 1 grand gardien, 1 défenseur central rapide, 1 sentinelle physique et 1 buteur régulier.',
      },
      {
        stepNumber: 2,
        title: 'Éviter le piège du 100% attaquants',
        explanation: 'Mettre 5 attaquants et aucun milieu récupérateur te fera prendre l\'eau à chaque transition adverse.',
      },
      {
        stepNumber: 3,
        title: 'Prévoir un banc utile',
        explanation: 'Ton banc doit comporter au moins 1 gardien remplaçant, 1 défenseur polyvalent, 1 milieu d\'impact et 1 attaquant Super Sub.',
      }
    ],
    matchExample: {
      situation: 'Ton équipe mène 1-0 mais s\'écroule physiquement à la 70e minute.',
      solution: 'Injecte des remplaçants frais au milieu et sur les ailes pour maintenir le pressing.'
    },
    frequentMistakes: [
      'N\'avoir que des joueurs offensifs sur le banc.',
      'Ne pas remplacer les joueurs dont la jauge d\'endurance clignote en rouge.'
    ],
    practicalExercise: 'Ouvre le Constructeur d\'Équipe d\'eFootball Elite et compose un onze avec au moins 1 Sentinelle et 2 défenseurs centraux solides.',
    squadBuilderRecommendation: {
      formationId: '4-3-3',
      description: 'Le 4-3-3 offre une répartition équilibrée sur toute la largeur avec un milieu à trois protecteur.'
    },
    quiz: {
      id: 'quiz-deb-8',
      question: 'Quel profil de milieu est indispensable pour protéger sa défense face aux contre-attaques ?',
      options: ['Un second ailier', 'Une Sentinelle défensive avec de bonnes caractéristiques d\'interception', 'Un joueur sans compétence défensive'],
      correctIndex: 1,
      explanation: 'Une Sentinelle reste en position basse devant les centraux et coupe les passes axiales de l\'adversaire.'
    }
  },
  {
    id: 'deb-9',
    level: 'debutant',
    order: 9,
    title: 'Comprendre les formations tactiques de base',
    subtitle: '4-3-3, 4-4-2 et 4-2-3-1 décryptés',
    theme: 'Tactique',
    duration: '8 min',
    objective: 'Reconnaître les caractéristiques des trois formations les plus stables pour débuter.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le 4-3-3 : la largeur avant tout',
        explanation: 'Deux ailiers pour écarter le jeu, un buteur de surface et trois milieux complémentaires.',
      },
      {
        stepNumber: 2,
        title: 'Le 4-4-2 : deux lignes de quatre disciplinées',
        explanation: 'Excellente occupation du terrain et double menace axiale avec deux avants-centres.',
      },
      {
        stepNumber: 3,
        title: 'Le 4-2-3-1 : la forteresse axiale',
        explanation: 'Deux milieux défensifs pour verrouiller la zone centrale et un numéro 10 pour distribuer.',
      }
    ],
    matchExample: {
      situation: 'Tu as du mal à défendre contre les passes rapides dans l\'axe.',
      solution: 'Passe en 4-2-3-1 ou 4-2-1-3 avec un double pivot pour fermer l\'accès à ta surface.'
    },
    frequentMistakes: [
      'Changer de schéma tactique toutes les 10 minutes sans le maîtriser.',
    ],
    practicalExercise: 'Compare les formations 4-3-3 et 4-4-2 dans le Constructeur et observe la position des milieux axiaux.',
    squadBuilderRecommendation: {
      formationId: '4-2-3-1',
      description: 'Testez le 4-2-3-1 avec un double pivot défensif pour stabiliser vos résultats.'
    },
    quiz: {
      id: 'quiz-deb-9',
      question: 'Quel est le point fort principal d\'une formation en 4-3-3 ?',
      options: ['Aucun joueur sur les côtés', 'Une largeur offensive maximale grâce à la présence de deux ailiers', 'Une défense à six joueurs'],
      correctIndex: 1,
      explanation: 'Les deux ailiers du 4-3-3 forcent les arrières latéraux adverses à s\'écarter, ouvrant des brèches pour les milieux.'
    }
  },
  {
    id: 'deb-10',
    level: 'debutant',
    order: 10,
    title: 'Préparer son premier match avec un plan de jeu simple',
    subtitle: 'Consignes de match, gestion du stress et routine d’avant-match',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Établir une routine méthodique avant de lancer une rencontre pour aborder le match avec sérénité.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Vérifier la flèche de forme des joueurs',
        explanation: 'Une flèche vers le haut donne un boost de statistiques ; une flèche vers le bas réduit la réactivité. Remplacer un joueur en forme descendante.',
      },
      {
        stepNumber: 2,
        title: 'Désigner les tireurs de coups de pied arrêtés',
        explanation: 'Configure ton meilleur tireur de corners, de coup franc et de penalty avant le coup d\'envoi.',
      },
      {
        stepNumber: 3,
        title: 'Définir une consigne de match claire',
        explanation: 'Pour débuter, choisis un style simple comme Contre-Attaque Rapide ou Possession et tiens-toi à ce plan pendant les 90 minutes.',
      }
    ],
    matchExample: {
      situation: 'Ton gardien titulaire a une flèche rouge de méforme avant un match décisif.',
      solution: 'Aligne immédiatement ton gardien remplaçant, même s\'il a une note globale légèrement inférieure.'
    },
    frequentMistakes: [
      'Jouer avec des joueurs en méforme absolue.',
      'S\'énerver après avoir encaissé un premier but rapide et tout changer dans la panique.'
    ],
    practicalExercise: 'Avant ton prochain match, ouvre le plan de jeu, remplace tous les joueurs ayant une flèche descendante et vérifie tes tireurs.',
    quiz: {
      id: 'quiz-deb-10',
      question: 'Que faut-il faire si votre joueur vedette a une flèche de forme rouge (très mauvaise) avant le match ?',
      options: ['Le laisser jouer car sa note de base compense', 'Le remplacer par un joueur ayant une flèche neutre ou positive', 'Abandonner le match'],
      correctIndex: 1,
      explanation: 'La flèche rouge réduit significativement toutes les statistiques en match. Un remplaçant en bonne forme sera bien plus performant.'
    }
  },

  // =========================================================================
  // NIVEAU 2 — INTERMÉDIAIRE (10 LEÇONS)
  // =========================================================================
  {
    id: 'int-1',
    level: 'intermediaire',
    order: 1,
    title: 'Créer des occasions avec des passes rapides',
    subtitle: 'La passe sensationnelle (Stunning Pass) et le une-deux dynamique',
    theme: 'Attaque',
    duration: '8 min',
    objective: 'Accélérer la circulation du ballon avec des passes tranchantes pour déstabiliser les blocs organisés.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'La passe sensationnelle (R2 + Passe / RT + A)',
        explanation: 'Enfoncer R2 au moment de la passe déclenche une trajectoire tendue à jauge mauve qui transperce les lignes défensives.',
        tip: 'Attention : le joueur prend un élan plus long. Ne l\'utilise pas si un défenseur est collé à toi.'
      },
      {
        stepNumber: 2,
        title: 'Le Une-Deux dynamique (L1 + Passe puis Triangle / Y)',
        explanation: 'Faire une passe avec L1 enfoncé ordonne au passeur de sprinter immédiatement vers l\'avant.',
      },
      {
        stepNumber: 3,
        title: 'Jouer en une touche de balle',
        explanation: 'La compétence "Passe en une touche" permet de faire tourner le ballon sans contrôle préalable pour surprendre le pressing adverse.',
      }
    ],
    matchExample: {
      situation: 'Deux milieux défensifs adverses coupent la trajectoire axiale vers ton avant-centre.',
      solution: 'Une-deux orienté entre ton milieu offensif et ton ailier pour contourner la sentinelle en un temps.'
    },
    frequentMistakes: [
      'Déclencher le une-deux avec son défenseur central (il monte et laisse un vide monumental derrière lui).',
    ],
    practicalExercise: 'Marque un but en match en réalisant un une-deux parfait (L1 + Croix puis Triangle dans la course).',
    quiz: {
      id: 'quiz-int-1',
      question: 'Quel est l\'inconvénient d\'une passe sensationnelle (Stunning Pass à jauge violette) ?',
      options: ['Elle est moins précise', 'Le temps d\'armement du joueur est plus long avant de frapper la balle', 'Elle use deux fois plus d\'endurance'],
      correctIndex: 1,
      explanation: 'L\'élan nécessaire à la frappe puissante demande un court délai d\'armement qui peut être exploité par un défenseur proche.'
    }
  },
  {
    id: 'int-2',
    level: 'intermediaire',
    order: 2,
    title: 'Construire une attaque contre une défense compacte',
    subtitle: 'Fixer d’un côté pour renverser de l’autre et jeu entre les lignes',
    theme: 'Attaque',
    duration: '9 min',
    objective: 'Percer les défenses basses regroupées dans leurs 16 mètres sans s\'empaler sur les défenseurs.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le principe de fixation',
        explanation: 'Fais circuler la balle sur le côté gauche avec ton latéral et ton ailier pour attirer tout le bloc adverse.',
      },
      {
        stepNumber: 2,
        title: 'Le renversement brutal',
        explanation: 'Dès que le bloc adverse est concentré à gauche, passe par ton milieu défensif pour basculer vers ton ailier droit démarqué.',
      },
      {
        stepNumber: 3,
        title: 'Trouver le joueur entre les lignes',
        explanation: 'Utilise un milieu offensif avec le profil "Meneur créatif" pour recevoir le ballon dos aux défenseurs dans la zone dangereuse.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire a 5 défenseurs dans sa surface et bloque tous les tirs axiaux.',
      solution: 'Passe en retrait à 25 mètres vers ton milieu central pour armer un tir lointain ou déclencher un centre au second poteau.'
    },
    frequentMistakes: [
      'Forcer la passe dans l\'entonnoir axial saturé de jambes.',
    ],
    practicalExercise: 'Lors de ta prochaine possession, fais passer le ballon d\'une aile à l\'autre deux fois avant de chercher le buteur.',
    quiz: {
      id: 'quiz-int-2',
      question: 'Quelle est la méthode la plus efficace pour contourner un bloc bas compact dans l\'axe ?',
      options: ['Tirer immédiatement du milieu de terrain', 'Fixer le jeu sur une aile pour aspirer le bloc puis renverser rapidement à l\'opposé', 'Faire monter le gardien'],
      correctIndex: 1,
      explanation: 'Renverser le jeu exploite le temps de coulissement des défenseurs et offre de l\'espace au joueur isolé sur l\'aile opposée.'
    }
  },
  {
    id: 'int-3',
    level: 'intermediaire',
    order: 3,
    title: 'Utiliser les appels et les déplacements des joueurs',
    subtitle: 'Déclenchement manuel d’appels et synchronisation du passeur',
    theme: 'Attaque',
    duration: '8 min',
    objective: 'Ne plus subir les mouvements passifs de ses attaquants et créer des lignes de course dynamiques.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'L\'appel manuel orienté',
        explanation: 'Après une passe, pousser le joystick droit dans la direction souhaitée oriente la course de démarquage de ton partenaire.',
      },
      {
        stepNumber: 2,
        title: 'La feinte d\'appel pour libérer un espace',
        explanation: 'Un attaquant qui plonge au premier poteau emmène le défenseur central et libère l\'espace au point de penalty pour le numéro 10.',
      },
      {
        stepNumber: 3,
        title: 'La temporisation avant la passe',
        explanation: 'Utilise un petit crochet sans sprint pour donner le temps à ton ailier d\'atteindre la ligne du dernier défenseur.',
      }
    ],
    matchExample: {
      situation: 'Ton avant-centre fait un appel mais le défenseur adverse le serre de près.',
      solution: 'Attends une demi-seconde qu\'il passe l\'épaule devant le défenseur avant d\'envoyer la passe en profondeur lobée.'
    },
    frequentMistakes: [
      'Donner le ballon trop tôt alors que l\'attaquant est encore à l\'arrêt.',
      'Donner le ballon trop tard quand l\'attaquant est déjà en position de hors-jeu.'
    ],
    practicalExercise: 'Déclenche 5 appels de balle avec L1 + Croix et sers le joueur dans sa course sans être hors-jeu.',
    quiz: {
      id: 'quiz-int-3',
      question: 'Comment éviter d\'être signalé hors-jeu lors d\'un appel en profondeur ?',
      options: ['Sprinter plus vite que tout le monde', 'Temporiser avec le porteur de balle pour délivrer la passe au moment exact où l\'attaquant est aligné avec le dernier défenseur', 'Faire une passe au gardien'],
      correctIndex: 1,
      explanation: 'La synchronisation entre le porteur et l\'attaquant est la clé : une fraction de seconde de temporisation évite le piège du hors-jeu.'
    }
  },
  {
    id: 'int-4',
    level: 'intermediaire',
    order: 4,
    title: 'Améliorer la finition sous pression',
    subtitle: 'Tir sensationnel (Stunning Shot), piqué et feinte de frappe',
    theme: 'Attaque',
    duration: '9 min',
    objective: 'Garder son sang-froid dans les 16 mètres pour convertir les demi-occasions disputées.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le Tir Sensationnel (R2 + Carré / RT + X)',
        explanation: 'Génère une frappe foudroyante qui transperce même les gardiens de haut niveau, idéale à 18-20 mètres.',
      },
      {
        stepNumber: 2,
        title: 'La feinte de tir (Carré puis Croix / X puis A)',
        explanation: 'Fait coucher le défenseur ou le gardien qui se jette en tacle, ouvrant le but vide.',
      },
      {
        stepNumber: 3,
        title: 'Le tir piqué (L1 + Carré / LB + X)',
        explanation: 'Redoutable si l\'adversaire fait sortir son gardien manuellement (Triangle maintenu).',
      }
    ],
    matchExample: {
      situation: 'Le gardien adverse sprinte vers ton attaquant à 12 mètres du but.',
      solution: 'Léger piqué dosé à 30% avec L1 + Carré par-dessus son plongeon.'
    },
    frequentMistakes: [
      'Tenter un tir sensationnel avec un défenseur au contact (il sera contré avant d\'armer).',
    ],
    practicalExercise: 'Marque au moins un but sur tir sensationnel et un but sur lob dans tes matchs d\'entraînement.',
    quiz: {
      id: 'quiz-int-4',
      question: 'Que permet de réaliser la feinte de tir (Tir puis Passe rapidement) ?',
      options: ['Un carton jaune', 'Casser l\'élan d\'un défenseur qui plonge et ouvrir un angle de frappe libre', 'Une relance longue'],
      correctIndex: 1,
      explanation: 'La feinte de frappe fait glisser le défenseur adverse et offre une seconde d\'équilibre parfaite pour marquer.'
    }
  },
  {
    id: 'int-5',
    level: 'intermediaire',
    order: 5,
    title: 'Défendre en anticipant les passes adverses',
    subtitle: 'Coupure de lignes, double-contact défensif et gestion de la distance',
    theme: 'Défense',
    duration: '9 min',
    objective: 'Récupérer le ballon proprement avant même qu\'il n\'atteigne l\'attaquant adverse.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Lire les intentions du porteur adverse',
        explanation: 'Ne regarde pas seulement le joueur adverse avec le ballon, regarde où sont orientés ses attaquants sur le radar.',
      },
      {
        stepNumber: 2,
        title: 'Occuper la ligne de passe',
        explanation: 'Place ton milieu défensif sur la trajectoire imaginaire entre le passeur et le buteur avec L2/LT.',
      },
      {
        stepNumber: 3,
        title: 'Laisser l\'adversaire jouer vers l\'arrière',
        explanation: 'S\'il est forcé de jouer vers ses défenseurs, tu as gagné le duel tactique. Ne te découvre pas inutilement.',
      }
    ],
    matchExample: {
      situation: 'L\'ailier adverse arrive sur le côté et cherche à centrer vers son buteur de tête.',
      solution: 'Garde le contrôle de ton défenseur central au second poteau pour couper la trajectoire avant la réception.'
    },
    frequentMistakes: [
      'Chasser le ballon comme un chien fou au lieu de protéger l\'axe du but.',
    ],
    practicalExercise: 'Réalise au moins 5 interceptions propres avec ta sentinelle en une mi-temps.',
    quiz: {
      id: 'quiz-int-5',
      question: 'Quelle est la priorité défensive lorsque l\'adversaire construit au milieu de terrain ?',
      options: ['Se jeter sur le porteur avec deux joueurs', 'Couper les lignes de passe vers les attaquants axiaux tout en maintenant le bloc structuré', 'Laisser marquer pour relancer plus vite'],
      correctIndex: 1,
      explanation: 'Couper la ligne de passe oblige l\'adversaire à temporiser ou à tenter des passes risquées faciles à intercepter.'
    }
  },
  {
    id: 'int-6',
    level: 'intermediaire',
    order: 6,
    title: 'Gérer le pressing sans ouvrir trop d’espaces',
    subtitle: 'L’appel du second défenseur (Carré maintenu) et le piège du contre-pressing',
    theme: 'Défense',
    duration: '8 min',
    objective: 'Harceler l\'adversaire de manière coordonnée sans créer de boulevards dans son propre dos.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'L\'appel du second défenseur (Carré / X maintenu)',
        explanation: 'Un équipier géré par l\'IA va presser le porteur de balle pendant que tu contrôles ton joueur pour bloquer la passe.',
      },
      {
        stepNumber: 2,
        title: 'Ne pas presser avec un joueur de la ligne défensive',
        explanation: 'Si le second défenseur appelé est ton défenseur central, il va quitter sa ligne et offrir un duel 1v1 mortel.',
      },
      {
        stepNumber: 3,
        title: 'Presser sur les temps faibles adverses',
        explanation: 'Déclenche le pressing quand l\'adversaire est dos au jeu ou effectue un mauvais contrôle orienté.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire temporise sur l\'aile gauche.',
      solution: 'Appelle ton latéral IA en pressing tout en bloquant l\'axe intérieur avec ton milieu défensif.'
    },
    frequentMistakes: [
      'Maintenir la touche d\'appel du second défenseur en continu (l\'équipe se disloque).',
    ],
    practicalExercise: 'Utilise le pressing à deux exclusivement sur les joueurs adverses situés dans les couloirs latéraux.',
    quiz: {
      id: 'quiz-int-6',
      question: 'Quel est le danger principal de maintenir la touche d\'appel du second défenseur en continu ?',
      options: ['Le jeu s\'arrête', 'Un défenseur central peut dézoner pour presser, laissant un attaquant adverse seul face au gardien', 'Le ballon est crevé'],
      correctIndex: 1,
      explanation: 'Le second pressing doit être utilisé avec parcimonie pour éviter de déstructurer la charnière centrale.'
    }
  },
  {
    id: 'int-7',
    level: 'intermediaire',
    order: 7,
    title: 'Choisir une formation adaptée à son style',
    subtitle: 'Associer schéma tactique et style d’entraîneur (Possession vs Contre-Attaque)',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Sélectionner la formation qui sublime vos points forts personnels et masque vos limites.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Pour les joueurs de contre rapide : le 4-2-1-3',
        explanation: 'Double sentinelle pour sécuriser la relance et trident offensif prêt à jaillir à la récupération.',
      },
      {
        stepNumber: 2,
        title: 'Pour les joueurs de possession : le 4-3-3 ou 4-1-2-3',
        explanation: 'Multiplie les triangles de passe au milieu pour trouver l\'homme libre.',
      },
      {
        stepNumber: 3,
        title: 'Pour la solidité défensive : le 5-2-1-2',
        explanation: 'Verrouille totalement l\'axe contre les attaquants ultra véloces.',
      }
    ],
    matchExample: {
      situation: 'Tu aimes jouer direct mais tes attaquants sont toujours trop seuls.',
      solution: 'Passe en 4-2-1-3 avec un numéro 10 en soutien direct des 3 attaquants.'
    },
    frequentMistakes: [
      'Copier la formation d\'un joueur pro sans avoir les profils de joueurs adaptés.',
    ],
    practicalExercise: 'Dans le Constructeur d\'Équipe, teste le 4-2-1-3 et vérifie si tes ailiers ont assez de vitesse pour la transition.',
    squadBuilderRecommendation: {
      formationId: '4-2-1-3',
      description: 'La formation reine de la méta compétitive actuelle pour les transitions rapides.'
    },
    quiz: {
      id: 'quiz-int-7',
      question: 'Quelle formation est particulièrement redoutable pour exploiter les transitions de contre-attaque rapide ?',
      options: ['5-4-1 ultra défensif', '4-2-1-3 avec trident offensif et double pivot', '3-6-1 sans attaquant'],
      correctIndex: 1,
      explanation: 'Le 4-2-1-3 offre la meilleure synergie entre assise défensive axiale et projection immédiate des 3 attaquants.'
    }
  },
  {
    id: 'int-8',
    level: 'intermediaire',
    order: 8,
    title: 'Comprendre les rôles et les profils de joueurs',
    subtitle: 'Renard des surfaces, Buteur opportuniste, Sentinelle et Box-to-box',
    theme: 'Équipe',
    duration: '10 min',
    objective: 'Comprendre comment le style de jeu inscrit sur la carte conditionne les courses du joueur en match.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Les styles d\'attaquants',
        explanation: 'Buteur opportuniste (plonge dans le dos des défenseurs), Renard des surfaces (rôde dans la surface), Point d\'appui (décroche pour remiser).',
      },
      {
        stepNumber: 2,
        title: 'Les styles de milieux',
        explanation: 'Sentinelle (ne monte JAMAIS, reste en couverture), Box-to-box (cours de surface à surface), Chef d\'orchestre (organise en retrait).',
      },
      {
        stepNumber: 3,
        title: 'Les styles de défenseurs',
        explanation: 'Destructeur (monte au duel avec agressivité), Bâtisseur (couvre en reculant et relance propre).',
      }
    ],
    matchExample: {
      situation: 'Ton milieu défensif monte trop haut et se fait prendre dans le dos.',
      solution: 'Il a le profil "Chef d\'orchestre" ou "Box-to-box". Remplace-le par un joueur ayant le profil strict de "Sentinelle" (comme Rodri ou Casemiro).'
    },
    frequentMistakes: [
      'Associer deux défenseurs centraux "Destructeur" (ils montent tous les deux et laissent le but vide).',
    ],
    practicalExercise: 'Consulte le Guide des Joueurs d\'eFootball Elite et filtre les joueurs par style de jeu pour trouver une Sentinelle.',
    quiz: {
      id: 'quiz-int-8',
      question: 'Quel est le comportement d\'un milieu défensif ayant le profil "Sentinelle" ?',
      options: ['Il tente de marquer des buts à chaque attaque', 'Il reste strictement en couverture devant les défenseurs centraux sans monter', 'Il se place comme ailier gauche'],
      correctIndex: 1,
      explanation: 'La Sentinelle est le seul profil qui refuse systématiquement de monter pour garantir la sécurité axiale.'
    }
  },
  {
    id: 'int-9',
    level: 'intermediaire',
    order: 9,
    title: 'Équilibrer attaque et défense',
    subtitle: 'La jauge d’effort offensive/défensive (croix directionnelle haut/bas)',
    theme: 'Tactique',
    duration: '8 min',
    objective: 'Adapter le niveau d\'engagement de l\'équipe en direct selon l\'évolution du score.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'La jauge d\'effort (Mentalité)',
        explanation: 'En double-cliquant sur la flèche Haut ou Bas de la croix directionnelle, tu changes le curseur de mentalité (du bleu ultra-défensif au rouge ultra-offensif).',
      },
      {
        stepNumber: 2,
        title: 'Le curseur défensif (-1)',
        explanation: 'Tes latéraux restent en retrait et tes ailiers descendent d\'un cran pour sécuriser un avantage.',
      },
      {
        stepNumber: 3,
        title: 'Le curseur offensif (+1 ou +2)',
        explanation: 'À +2 (rouge écarlate), ton défenseur central le plus grand monte en avant-centre pour les dernières minutes.',
      }
    ],
    matchExample: {
      situation: 'Tu es mené 1-0 à la 85e minute.',
      solution: 'Passe en mentalité offensive (+1 ou +2) pour surcharger la surface adverse sur les centres.'
    },
    frequentMistakes: [
      'Rester en ultra-offensif dès le début du match (fatigue prématurée et contres subis).',
    ],
    practicalExercise: 'En match amical, teste le passage de -1 à +1 pour observer le comportement de tes latéraux.',
    quiz: {
      id: 'quiz-int-9',
      question: 'Que se passe-t-il lorsque vous montez la mentalité de match au niveau maximum (+2 rouge) ?',
      options: ['Le match se termine', 'Un défenseur central monte comme attaquant de pointe pour jouer le tout pour le tout', 'Les fautes sont désactivées'],
      correctIndex: 1,
      explanation: 'La mentalité maximale envoie le défenseur central de tête dans la surface adverse pour forcer l\'égalisation.'
    }
  },
  {
    id: 'int-10',
    level: 'intermediaire',
    order: 10,
    title: 'Adapter sa tactique pendant un match',
    subtitle: 'Gestion des temps forts, remplacements stratégiques et lecture de mi-temps',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Modifier intelligemment ses réglages à la mi-temps pour inverser le cours d\'une rencontre difficile.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le diagnostic de la mi-temps',
        explanation: 'Regarde les statistiques de tirs et de possession : si l\'adversaire t\'attaque constamment sur un côté, renforce ce couloir.',
      },
      {
        stepNumber: 2,
        title: 'Le coaching gagnant à la 60e minute',
        explanation: 'Les remplaçants avec la compétence "Super Sub" (ex: Haaland, Leão) bénéficient d\'un boost s\'ils entrent en seconde période.',
      },
      {
        stepNumber: 3,
        title: 'Changer de dispositif pour surprendre',
        explanation: 'Passer d\'un 4-3-3 à un 4-4-2 avec deux buteurs oblige l\'adversaire à modifier ses repères de marquage.',
      }
    ],
    matchExample: {
      situation: 'L\'ailier gauche adverse prend systématiquement de vitesse ton arrière droit fatigué.',
      solution: 'Fais entrer un arrière défensif frais et place une instruction de marquage individuel.'
    },
    frequentMistakes: [
      'Garder les 11 mêmes joueurs pendant 90 minutes alors qu\'ils sont épuisés.',
    ],
    practicalExercise: 'Prépare dans ton effectif 3 remplaçants ciblés et fais-les entrer systématiquement entre la 60e et la 70e minute.',
    quiz: {
      id: 'quiz-int-10',
      question: 'Quelle compétence de joueur apporte un bonus significatif lorsqu\'il entre en jeu en seconde période ?',
      options: ['Capitaine', 'Super Sub', 'Pénalty'],
      correctIndex: 1,
      explanation: 'La compétence Super Sub augmente les statistiques et le dynamisme du joueur lorsqu\'il entre en cours de match.'
    }
  },

  // =========================================================================
  // NIVEAU 3 — AVANCÉ (10 LEÇONS)
  // =========================================================================
  {
    id: 'av-1',
    level: 'avance',
    order: 1,
    title: 'Analyser le style de jeu d’un adversaire',
    subtitle: 'Lecture de schéma en 3 minutes et détection des failles récurrentes',
    theme: 'Tactique',
    duration: '10 min',
    objective: 'Identifier en moins de 3 minutes de jeu le schéma préférentiel de l\'adversaire pour le neutraliser.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Les 3 premières minutes d\'observation',
        explanation: 'Ne te rue pas à l\'attaque. Observe si l\'adversaire relance court systématiquement ou allonge sur ses ailiers.',
      },
      {
        stepNumber: 2,
        title: 'Identifier le joueur cible',
        explanation: '80% des joueurs en ligne ont un joueur fétiche par lequel transitent toutes les attaques (souvent l\'ailier rapide ou le numéro 10).',
      },
      {
        stepNumber: 3,
        title: 'Fermer son schéma préférentiel',
        explanation: 'S\'il abuse du une-deux axial, verrouille le passeur avec ta sentinelle pour le forcer à jouer sur les ailes où il est moins à l\'aise.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire ne fait que des passes en cloche en profondeur pour Mbappé.',
      solution: 'Baisse ta ligne défensive avec le style Contre Longue ou recule manuellement avec Van Dijk pour couper l\'espace dans son dos.'
    },
    frequentMistakes: [
      'Jouer toujours de la même manière quel que soit le profil de l\'adversaire.',
    ],
    practicalExercise: 'Sur tes 3 prochains matchs, note sur un carnet le circuit de passe principal de ton adversaire en première mi-temps.',
    quiz: {
      id: 'quiz-av-1',
      question: 'Que faut-il observer en priorité lors des premières minutes d\'un match compétitif ?',
      options: ['La couleur des maillots', 'Les habitudes de relance de l\'adversaire et le joueur par lequel transitent ses attaques', 'Le nombre de supporters'],
      correctIndex: 1,
      explanation: 'Repérer le schéma fétiche de l\'adversaire permet de neutraliser 80% de son potentiel offensif dès le premier quart d\'heure.'
    }
  },
  {
    id: 'av-2',
    level: 'avance',
    order: 2,
    title: 'Identifier les espaces libres et les exploiter',
    subtitle: 'Le troisième homme et la surcharge de zone',
    theme: 'Attaque',
    duration: '9 min',
    objective: 'Appliquer le concept du 3e homme pour rendre ses attaques imprévisibles contre les meilleurs défenseurs.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le concept du Troisième Homme',
        explanation: 'Le joueur A passe au joueur B qui remet en une touche au joueur C lancé en pleine course. L\'adversaire n\'a pas le temps de changer de curseur.',
      },
      {
        stepNumber: 2,
        title: 'Créer une surcharge locale (Overload)',
        explanation: 'Fais coulisser ton milieu offensif sur l\'aile droite pour créer un 3 contre 2 face au latéral adverse.',
      },
      {
        stepNumber: 3,
        title: 'Attaquer l\'intervalle demi-espace (Half-space)',
        explanation: 'La zone entre le défenseur central et le latéral est la zone la plus fragile de toute défense.',
      }
    ],
    matchExample: {
      situation: 'Le défenseur adverse bloque la passe directe vers ton avant-centre.',
      solution: 'Passe à ton ailier qui remet immédiatement en retrait dans la course de ton milieu offensif (troisième homme).'
    },
    frequentMistakes: [
      'Toujours chercher la passe directe plutôt que la combinaison à 3 joueurs.',
    ],
    practicalExercise: 'Construis 3 actions complètes basées sur le principe du 3e homme en match de division.',
    quiz: {
      id: 'quiz-av-2',
      question: 'En quoi consiste le principe tactique du "Troisième Homme" ?',
      options: ['Jouer avec un troisième gardien', 'Combiner entre le joueur A et B pour trouver un joueur C démarqué lancé en pleine course', 'Faire entrer 3 remplaçants simultanément'],
      correctIndex: 1,
      explanation: 'Le troisième homme exploite le temps de réaction défensif en trouvant un partenaire libre par une remise en une touche.'
    }
  },
  {
    id: 'av-3',
    level: 'avance',
    order: 3,
    title: 'Organiser une défense face à plusieurs styles d’attaque',
    subtitle: 'Neutraliser le jeu sur les ailes, les dribbleurs fous et les centres plongeants',
    theme: 'Défense',
    duration: '10 min',
    objective: 'Configurer sa défense spécifiquement selon la menace adverse principale.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Face aux dribbleurs d\'ailes',
        explanation: 'Ne tacle jamais le premier. Maintiens 2 mètres de distance avec le Match-up et attends qu\'il pousse la balle.',
      },
      {
        stepNumber: 2,
        title: 'Face aux attaquants de tête géants (ex: Haaland)',
        explanation: 'Place un défenseur physique (ex: Van Dijk) et dispute le duel aérien avec le bouton de dégagement aérien au bon timing.',
      },
      {
        stepNumber: 3,
        title: 'Face au jeu de possession rapide',
        explanation: 'Forme un bloc compact à 25 mètres et force l\'adversaire à frapper de loin.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire utilise des ailiers à 98 de vitesse qui sprintent tout droit sur la ligne.',
      solution: 'Active l\'instruction individuelle défensive sur tes arrières latéraux pour qu\'ils ne montent jamais.'
    },
    frequentMistakes: [
      'Défendre de la même manière contre un joueur de possession et un joueur de contre long.',
    ],
    practicalExercise: 'Réalise un match complet sans concéder de but face à un joueur utilisant deux ailiers rapides.',
    quiz: {
      id: 'quiz-av-3',
      question: 'Comment neutraliser un joueur qui utilise exclusivement les débordements de ses ailiers ultra rapides ?',
      options: ['Sortir le gardien au milieu du terrain', 'Assigner une consigne défensive stricte aux arrières latéraux et temporiser au Match-up sans se jeter', 'Mettre 5 attaquants'],
      correctIndex: 1,
      explanation: 'Des latéraux disciplinés qui restent en couverture privent les ailiers d\'espaces de sprint.'
    }
  },
  {
    id: 'av-4',
    level: 'avance',
    order: 4,
    title: 'Gérer le rythme d’un match',
    subtitle: 'Alterner tempo lent de conservation et accélérations brutales',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Endormir l\'adversaire avec des passes sécurisées pour frapper d\'un coup sur une rupture verticale.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le faux rythme (Tempo lent)',
        explanation: 'Fais 5 à 6 passes tranquilles entre tes milieux sans sprint. L\'adversaire commence à s\'impatienter et avance ses lignes.',
      },
      {
        stepNumber: 2,
        title: 'L\'éclair de rupture (Tempo rapide)',
        explanation: 'Dès que le bloc adverse a fait deux pas en avant, délivre une passe laser vers ton attaquant en pleine course.',
      },
      {
        stepNumber: 3,
        title: 'Casser le rythme quand on subit',
        explanation: 'Si l\'adversaire enchaîne 3 occasions d\'affilée, garde la balle 30 secondes en retrait pour faire retomber la pression.',
      }
    ],
    matchExample: {
      situation: 'L\'adversaire presse avec frénésie et ton équipe commence à paniquer.',
      solution: 'Rejoue sur le gardien, temporise avec la semelle et fais courir son attaquant dans le vide.'
    },
    frequentMistakes: [
      'Jouer à 100% de vitesse en permanence : tes joueurs s\'épuisent et tes choix deviennent prévisibles.',
    ],
    practicalExercise: 'Conserve le ballon pendant 45 secondes sans chercher à avancer, puis déclenche un but sur la première accélération.',
    quiz: {
      id: 'quiz-av-4',
      question: 'Quel est l\'intérêt d\'alterner phases lentes et accélérations brutales ?',
      options: ['Faire durer le temps de jeu', 'Endormir l\'attention de l\'adversaire, faire monter son bloc et créer des brèches soudaines', 'Gagner des points bonus'],
      correctIndex: 1,
      explanation: 'L\'alternance de tempo brise les réflexes d\'anticipation de l\'adversaire.'
    }
  },
  {
    id: 'av-5',
    level: 'avance',
    order: 5,
    title: 'Construire une stratégie selon le score',
    subtitle: 'Protéger un résultat à la 80e ou remonter 2 buts de retard',
    theme: 'Tactique',
    duration: '10 min',
    objective: 'Appliquer les schémas mentaux de gestion de crise et de fermeture de match en compétition.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Mener 1-0 à la 80e minute',
        explanation: 'Passe en mentalité -1, fais entrer un troisième milieu défensif et joue les corners à deux pour conserver le ballon.',
      },
      {
        stepNumber: 2,
        title: 'Être mené 0-2 à la 60e minute',
        explanation: 'Ne panique pas. Passe en 4-2-4 ou 3-2-3-2 avec un pressing haut et fais entrer des joueurs à grosse accélération.',
      },
      {
        stepNumber: 3,
        title: 'Éviter le but psychologique',
        explanation: 'La 45e et la 90e minute sont les moments où la concentration fléchit le plus. Joue simple et sécurise la touche.',
      }
    ],
    matchExample: {
      situation: 'Tu mènes 2-1 à la 88e minute et tu as un coup franc dans ton propre camp.',
      solution: 'Joue court vers un défenseur démarqué, ne dégage pas au hasard pour rendre la balle à l\'adversaire.'
    },
    frequentMistakes: [
      'Continuer d\'attaquer à 5 joueurs alors qu\'on mène d\'un but dans le temps additionnel.',
    ],
    practicalExercise: 'Gagne un match en menant d\'un but et en conservant le score sur les 15 dernières minutes.',
    quiz: {
      id: 'quiz-av-5',
      question: 'Quelle est la meilleure approche lorsque vous menez d\'un but à la 85e minute d\'un match décisif ?',
      options: ['Attaquer avec tous les défenseurs pour tenter le 3-0', 'Consolider le milieu avec un profil défensif frais, passer en mentalité défensive et sécuriser les possessions', 'Mettre le jeu en pause et attendre'],
      correctIndex: 1,
      explanation: 'La gestion de fin de match repose sur la conservation intelligente et le renforcement des lignes défensives.'
    }
  },
  {
    id: 'av-6',
    level: 'avance',
    order: 6,
    title: 'Ajuster sa formation face à un adversaire dominant',
    subtitle: 'Changement de structure en cours de match pour contrer un déséquilibre',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Reconnaître quand une formation ne fonctionne pas et basculer sur un plan B efficace.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Détecter l\'infériorité numérique au milieu',
        explanation: 'Si l\'adversaire a 4 milieux et que tu n\'en as que 2, tu seras asphyxié. Rajoute immédiatement un milieu central.',
      },
      {
        stepNumber: 2,
        title: 'Le passage à 3 ou 5 défenseurs',
        explanation: 'Si l\'adversaire joue avec deux pointes très axiales, une défense à 3 centraux (5-2-1-2) neutralise ses deux attaquants.',
      },
      {
        stepNumber: 3,
        title: 'Le plan B pré-enregistré',
        explanation: 'Configure ta sous-tactique avant le match pour basculer en un seul raccourci manette.',
      }
    ],
    matchExample: {
      situation: 'Ton 4-3-3 se fait transpercer par le 4-2-2-2 très axial de l\'adversaire.',
      solution: 'Bascule en 4-2-3-1 pour resserrer le double pivot devant ta surface.'
    },
    frequentMistakes: [
      'Refuser de changer de formation par orgueil alors qu\'on subit depuis 30 minutes.',
    ],
    practicalExercise: 'Utilise la sous-tactique en match pour changer de formation entre la première et la deuxième mi-temps.',
    squadBuilderRecommendation: {
      formationId: '5-2-1-2',
      description: 'Le 5-2-1-2 est le verrou ultime pour stopper les attaques axiales dominantes.'
    },
    quiz: {
      id: 'quiz-av-6',
      question: 'Quel est l\'intérêt d\'avoir préparé une sous-tactique dans son plan de jeu ?',
      options: ['Gagner du temps sur les arrêts de jeu', 'Changer de dispositif tactique en direct sans devoir mettre le jeu en pause', 'Changer la météo du stade'],
      correctIndex: 1,
      explanation: 'La sous-tactique permet d\'adapter instantanément son dispositif en plein match d\'une simple pression sur la croix directionnelle.'
    }
  },
  {
    id: 'av-7',
    level: 'avance',
    order: 7,
    title: 'Comprendre les complémentarités entre les joueurs',
    subtitle: 'Duos défensifs et tridents d’attaque : les associations parfaites',
    theme: 'Équipe',
    duration: '10 min',
    objective: 'Associer des profils opposés et complémentaires pour qu\'aucun joueur ne se marche dessus.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'La charnière centrale idéale',
        explanation: 'Associe toujours un Bâtisseur (rapide, bon relanceur, ex: Saliba) avec un Destructeur (puissant, agressif, ex: Rüdiger).',
      },
      {
        stepNumber: 2,
        title: 'Le double pivot au milieu',
        explanation: 'Associe une Sentinelle qui reste en ancre (ex: Rodri) avec un Box-to-box qui apporte le surnombre (ex: Valverde).',
      },
      {
        stepNumber: 3,
        title: 'Le duo d\'attaque',
        explanation: 'Associe un Buteur opportuniste de profondeur (ex: Mbappé) avec un Renard ou Point d\'appui dos au jeu (ex: Kane ou Haaland).',
      }
    ],
    matchExample: {
      situation: 'Tes deux milieux axiaux sont des créateurs sans impact physique : l\'équipe perd tous les deuxièmes ballons.',
      solution: 'Remplace l\'un des créateurs par un milieu robuste capable de gagner les duels au sol.'
    },
    frequentMistakes: [
      'Aligner deux profils identiques côte à côte (ex: deux ailiers créatifs qui réclament la balle dans les pieds sans jamais plonger).',
    ],
    practicalExercise: 'Dans le Comparateur de Joueurs d\'eFootball Elite, compare Rodri et Valverde pour observer leurs complémentarités.',
    quiz: {
      id: 'quiz-av-7',
      question: 'Pourquoi est-il déconseillé d\'associer deux défenseurs centraux ayant tous les deux le style "Destructeur" ?',
      options: ['Ils prennent trop de cartons', 'Ils ont tendance à monter tous les deux au duel, laissant la profondeur totalement béante', 'Ils ne savent pas courir'],
      correctIndex: 1,
      explanation: 'Un Destructeur doit être couvert par un Bâtisseur qui lit la trajectoire et couvre la profondeur.'
    }
  },
  {
    id: 'av-8',
    level: 'avance',
    order: 8,
    title: 'Adapter les consignes à son plan de jeu',
    subtitle: 'Instructions individuelles : Marquage individuel, Ligne défensive et Ancrage',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Personnaliser le comportement de joueurs précis pour neutraliser l\'adversaire.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Consigne individuelle : Défensif',
        explanation: 'Assignée à un latéral offensif (ex: Theo Hernández), cette consigne l\'empêche de monter pour préserver l\'équilibre.',
      },
      {
        stepNumber: 2,
        title: 'Consigne individuelle : Ancrage',
        explanation: 'Assignée à ton ailier ou buteur, cette consigne l\'empêche de dézoner et le garde toujours au cœur de l\'attaque.',
      },
      {
        stepNumber: 3,
        title: 'Le Marquage individuel strict',
        explanation: 'Colle ta sentinelle sur le meneur de jeu adverse pour le priver de tout ballon propre.',
      }
    ],
    matchExample: {
      situation: 'Le meneur adverse (De Bruyne) distribue des caviars depuis le début de la rencontre.',
      solution: 'Active l\'instruction de marquage individuel avec ton milieu défensif pour le museler.'
    },
    frequentMistakes: [
      'Assigner trop de consignes contradictoires qui paralysent le jeu d\'équipe.',
    ],
    practicalExercise: 'Configure une consigne "Défensif" sur l\'un de tes arrières latéraux et observe son placement en phase d\'attaque.',
    quiz: {
      id: 'quiz-av-8',
      question: 'Que permet la consigne individuelle "Défensif" appliquée à un arrière latéral ?',
      options: ['Lui interdire de toucher le ballon', 'Lui ordonner de rester en retrait lors des attaques pour sécuriser le couloir contre les contre-attaques', 'Le faire jouer gardien'],
      correctIndex: 1,
      explanation: 'La consigne "Défensif" bride les montées du latéral pour maintenir une base arrière solide à 3 ou 4 défenseurs.'
    }
  },
  {
    id: 'av-9',
    level: 'avance',
    order: 9,
    title: 'Corriger les erreurs récurrentes après un match',
    subtitle: 'Analyse des statistiques de fin de match et révision des ralentis',
    theme: 'Tactique',
    duration: '9 min',
    objective: 'Transformer chaque défaite en opportunité d\'apprentissage en identifiant ses faiblesses statistiques.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le taux de passes réussies',
        explanation: 'Un joueur compétitif doit viser au moins 82% de passes réussies. En dessous de 75%, tu rends trop de ballons de contre.',
      },
      {
        stepNumber: 2,
        title: 'L\'origine des buts encaissés',
        explanation: 'Regarde les ralentis : le but vient-il d\'une passe risquée au milieu, d\'un tacle manqué ou d\'un duel aérien ?',
      },
      {
        stepNumber: 3,
        title: 'Le ratio tirs / tirs cadrés',
        explanation: 'Si tu as 10 tirs pour 2 cadrés, tu tires de trop loin ou sous mauvaise posture.',
      }
    ],
    matchExample: {
      situation: 'Tu perds 2-1 malgré 60% de possession.',
      solution: 'Regarde les stats : 3 tirs seulement. Ta possession était stérile. Il faut jouer plus vertical et oser le un-contre-un.'
    },
    frequentMistakes: [
      'Accuser systématiquement le script ou la chance sans analyser ses erreurs de relance.',
    ],
    practicalExercise: 'Après ton prochain match en ligne, analyse l\'écran de statistiques et identifie 1 point prioritaire d\'amélioration.',
    quiz: {
      id: 'quiz-av-9',
      question: 'Quel pourcentage de passes réussies un joueur compétitif doit-il viser au minimum ?',
      options: ['50%', '82% et plus', '100% obligatoirement'],
      correctIndex: 1,
      explanation: 'Un ratio de passes supérieur à 82% garantit la maîtrise des transitions et limite les contre-attaques concédées.'
    }
  },
  {
    id: 'av-10',
    level: 'avance',
    order: 10,
    title: 'Préparer un plan de match et une stratégie de secours',
    subtitle: 'La routine des joueurs d’e-sport avant un tournoi',
    theme: 'Tactique',
    duration: '10 min',
    objective: 'Avoir un protocole complet prêt à l\'emploi pour affronter n\'importe quel adversaire en compétition.',
    contentSteps: [
      {
        stepNumber: 1,
        title: 'Le Plan A : ta tactique de maîtrise',
        explanation: 'Ton dispositif principal avec tes automatismes, testé sur des dizaines de matchs.',
      },
      {
        stepNumber: 2,
        title: 'Le Plan B : pour déverrouiller un bloc bas',
        explanation: 'Schéma avec plus de largeur et deux attaquants de surface pour forcer la décision.',
      },
      {
        stepNumber: 3,
        title: 'La préparation mentale',
        explanation: 'En compétition, rester calme après avoir concédé un but permet d\'éviter l\'engrenage du tilt.',
      }
    ],
    matchExample: {
      situation: 'En tournoi, ton adversaire bloque totalement ton 4-3-3 habituel.',
      solution: 'Active ton plan B en 4-2-1-3 à la mi-temps et modifie ton approche pour le déstabiliser.'
    },
    frequentMistakes: [
      'Aborder un match de tournoi sans avoir prévu de plan de secours en cas de difficulté.',
    ],
    practicalExercise: 'Définis tes deux formations de référence (Plan A et Plan B) dans le Constructeur d\'eFootball Elite.',
    squadBuilderRecommendation: {
      formationId: '4-2-1-3',
      description: 'Préparez votre équipe type pour les tournois de la communauté.'
    },
    quiz: {
      id: 'quiz-av-10',
      question: 'Pourquoi est-il crucial d\'avoir un plan de jeu B en compétition e-sport ?',
      options: ['Pour changer de maillot à la mi-temps', 'Pour répondre tactiquement si l\'adversaire neutralise totalement votre dispositif principal', 'Pour faire durer le tournoi'],
      correctIndex: 1,
      explanation: 'En tournoi compétitif, savoir basculer sur un plan B adapté est ce qui différencie les bons joueurs des champions.'
    }
  }
];

export const TRAINING_CHALLENGES: TrainingChallenge[] = [
  {
    id: 'chal-1',
    title: 'Défi Clean Sheet de Fer',
    level: 'debutant',
    objective: 'Terminer un match entier sans encaisser le moindre but.',
    instructions: [
      'Utilise le Match-up (L2 / LT) sur toutes les phases de reculoir.',
      'Ne sors aucun défenseur central de sa zone axiale.',
      'Effectue au moins 4 interceptions au milieu de terrain.'
    ],
    duration: '10 min (1 match)',
    successCriteria: '0 but concédé au coup de sifflet final.',
    xpReward: 100,
  },
  {
    id: 'chal-2',
    title: 'Défi Maître du Tempo (60% Possession)',
    level: 'intermediaire',
    objective: 'Atteindre au moins 60% de possession tout en gagnant le match.',
    instructions: [
      'Fais tourner le ballon d\'une aile à l\'autre avant chaque attaque.',
      'Ne sprinte jamais lors de la réception des passes.',
      'Termine avec un taux de passes réussies supérieur à 85%.'
    ],
    duration: '12 min (1 match)',
    successCriteria: 'Victoire avec possession ≥ 60%.',
    xpReward: 150,
  },
  {
    id: 'chal-3',
    title: 'Défi Finition Chirurgicale',
    level: 'intermediaire',
    objective: 'Marquer 2 buts en utilisant exclusivement le tir enroulé (R2 + Carré).',
    instructions: [
      'Repère le pied fort de ton ailier ou attaquant.',
      'Ouvre ton angle de tir à 45° dans les 16 mètres.',
      'Enroule au second poteau avec 40% à 50% de jauge.'
    ],
    duration: '10 min',
    successCriteria: 'Au moins 2 buts marqués en tir enroulé.',
    xpReward: 150,
  },
  {
    id: 'chal-4',
    title: 'Défi Canonnier Sensationnel',
    level: 'avance',
    objective: 'Marquer un but sur tir sensationnel à plus de 20 mètres des cages.',
    instructions: [
      'Isole ton milieu de terrain dans l\'axe sans défenseur au contact.',
      'Enfonce R2/RT à fond avant d\'appuyer sur la frappe (jauge mauve).',
      'Cadre la frappe sous la barre transversale.'
    ],
    duration: '10 min',
    successCriteria: 'But marqué sur Stunning Shot hors de la surface.',
    xpReward: 200,
  }
];
