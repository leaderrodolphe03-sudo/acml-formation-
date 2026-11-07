import type { Lesson, Level, LevelId, Module, QuizQuestion } from './types'

export const LEVELS: Level[] = [
  {
    id: 'debutant',
    name: 'Débutant',
    public: "Personnes qui n'ont jamais appris l'anglais ou presque",
    objectif: 'Comprendre et utiliser des phrases simples du quotidien',
    color: '#16a34a',
  },
  {
    id: 'intermediaire',
    name: 'Intermédiaire',
    public: 'Personnes qui comprennent les bases',
    objectif: 'Tenir une conversation, comprendre des textes et des échanges courants',
    color: '#0f4a85',
  },
  {
    id: 'avance',
    name: 'Avancé',
    public: "Personnes à l'aise en anglais",
    objectif: "S'exprimer avec fluidité, nuance et précision (professionnel, académique)",
    color: '#e3131b',
  },
]

export const levelById = (id: LevelId) => LEVELS.find((l) => l.id === id)!

// [titre du module, [ [titre leçon, minutes, description] ... ] ]
type Raw = [string, [string, number, string][]][]

const RAW: Record<LevelId, Raw> = {
  debutant: [
    ['Les salutations', [
      ['Say hello in English', 8, 'Saluer, répondre et prendre congé selon le moment de la journée.'],
      ['How are you?', 7, 'Demander et donner des nouvelles simplement.'],
      ['Polite words', 6, 'Please, thank you, sorry : les mots qui ouvrent toutes les portes.'],
    ]],
    ['Se présenter', [
      ['My name is…', 9, 'Dire son nom, son âge et sa nationalité.'],
      ['Where are you from?', 8, 'Parler de son pays et de sa ville.'],
      ['My family', 10, 'Présenter les membres de sa famille.'],
    ]],
    ['Les nombres et le temps', [
      ['Numbers 1 to 100', 9, 'Compter, donner un numéro de téléphone, un prix.'],
      ['What time is it?', 8, "Lire et dire l'heure."],
      ['Days and months', 7, 'Les jours, les mois et les dates.'],
    ]],
    ['La vie quotidienne', [
      ['My daily routine', 10, 'Décrire sa journée avec le présent simple.'],
      ['At the market', 9, 'Acheter, demander un prix, négocier poliment.'],
      ['Food and drinks', 8, 'Commander au restaurant et parler de ses goûts.'],
    ]],
  ],
  intermediaire: [
    ['Raconter au passé', [
      ['Last weekend', 11, 'Le prétérit pour raconter des événements passés.'],
      ['Irregular verbs made easy', 12, 'Mémoriser les verbes irréguliers les plus utiles.'],
      ['Telling a story', 10, 'Enchaîner les idées : first, then, after that, finally.'],
    ]],
    ['Converser avec aisance', [
      ['Small talk', 9, 'Engager la conversation et la faire durer.'],
      ['Giving opinions', 10, 'I think, in my opinion, I agree / disagree.'],
      ['Asking for clarification', 8, 'Faire répéter, reformuler, vérifier sa compréhension.'],
    ]],
    ['Projets et futur', [
      ['Plans and intentions', 10, 'Going to, will et le présent continu à valeur de futur.'],
      ['Making appointments', 9, 'Fixer, déplacer, annuler un rendez-vous.'],
      ['Travel English', 12, "À l'aéroport, à l'hôtel, demander son chemin."],
    ]],
  ],
  avance: [
    ['Anglais professionnel', [
      ['Job interviews', 14, 'Se présenter et valoriser son parcours en entretien.'],
      ['Professional emails', 12, 'Rédiger des e-mails clairs, formels et efficaces.'],
      ['Leading a meeting', 13, 'Animer, recadrer et conclure une réunion.'],
    ]],
    ['Nuance et précision', [
      ['Phrasal verbs in context', 12, 'Les phrasal verbs incontournables, en situation.'],
      ['Idioms natives use', 11, 'Les expressions idiomatiques les plus courantes.'],
      ['Hedging and softening', 10, 'Nuancer son discours : might, could, it seems that…'],
    ]],
    ['Anglais académique', [
      ['Structuring an argument', 13, 'Introduction, développement, conclusion : convaincre.'],
      ['Presentations that work', 14, 'Préparer et délivrer une présentation captivante.'],
      ['Debating with confidence', 12, 'Défendre une position et réfuter poliment.'],
    ]],
  ],
}

const QUIZ: Record<LevelId, QuizQuestion[]> = {
  debutant: [
    { q: 'Comment dit-on « Bonjour » le matin ?', choices: ['Good night', 'Good morning', 'Goodbye'], answer: 1 },
    { q: '« Thank you » signifie…', choices: ['Merci', "S'il vous plaît", 'Pardon'], answer: 0 },
    { q: 'Complétez : « My name ___ Koffi. »', choices: ['are', 'am', 'is'], answer: 2 },
  ],
  intermediaire: [
    { q: 'Prétérit de « go » :', choices: ['goed', 'went', 'gone'], answer: 1 },
    { q: 'Pour donner son avis, on dit :', choices: ['In my opinion', 'On my opinion', 'At my opinion'], answer: 0 },
    { q: '« I ___ visit my aunt tomorrow » (intention) :', choices: ['am going to', 'went', 'have visited'], answer: 0 },
  ],
  avance: [
    { q: '« To put off a meeting » signifie…', choices: ['Annuler', 'Reporter', 'Commencer'], answer: 1 },
    { q: 'Formule la plus formelle pour un e-mail :', choices: ['Hey guys', 'Dear Sir or Madam', 'Hi there'], answer: 1 },
    { q: '« It seems that… » sert à…', choices: ['Nuancer', 'Ordonner', 'Insulter'], answer: 0 },
  ],
}

export const MODULES: Module[] = []
export const LESSONS: Lesson[] = []

for (const levelId of Object.keys(RAW) as LevelId[]) {
  let order = 0
  RAW[levelId].forEach(([modTitle, lessons], mi) => {
    const moduleId = `${levelId}-m${mi + 1}`
    MODULES.push({ id: moduleId, levelId, order: mi + 1, title: modTitle })
    lessons.forEach(([title, minutes, description], li) => {
      order++
      LESSONS.push({
        id: `${moduleId}-l${li + 1}`,
        levelId,
        moduleId,
        order,
        title,
        description,
        duration: minutes * 60,
        objectives: [
          description,
          'Mémoriser le vocabulaire clé de la leçon',
          "S'entraîner à l'oral avec les exemples de la vidéo",
        ],
        resources: [
          { name: `Fiche – ${title}.pdf`, kind: 'pdf' },
          { name: 'Liste de vocabulaire', kind: 'vocabulaire' },
        ],
        quiz: li % 3 === 2 || li === 0 ? QUIZ[levelId] : undefined,
      })
    })
  })
}

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)
export const moduleById = (id: string) => MODULES.find((m) => m.id === id)
export const lessonsOfLevel = (levelId: LevelId) => LESSONS.filter((l) => l.levelId === levelId)
export const modulesOfLevel = (levelId: LevelId) => MODULES.filter((m) => m.levelId === levelId)
