export type Role = 'admin' | 'superviseur' | 'etudiant'
export type LevelId = 'debutant' | 'intermediaire' | 'avance'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  password: string // démo uniquement : en production, géré et chiffré par Supabase Auth
  role: Role
  classId?: string // étudiant : une seule classe active
  level?: LevelId
  joinedAt: string
}

export interface Level {
  id: LevelId
  name: string
  public: string
  objectif: string
  color: string
}

export interface QuizQuestion {
  q: string
  choices: string[]
  answer: number
}

export interface Resource {
  name: string
  kind: 'pdf' | 'vocabulaire'
}

export interface Lesson {
  id: string
  levelId: LevelId
  moduleId: string
  order: number
  title: string
  description: string
  duration: number // en secondes
  objectives: string[]
  resources: Resource[]
  quiz?: QuizQuestion[]
}

export interface Module {
  id: string
  levelId: LevelId
  order: number
  title: string
}

export interface ScheduleEntry {
  lessonId: string
  date: string // ISO (jour de déblocage)
}

export interface ClassRoom {
  id: string
  name: string
  supervisorId: string
  levelId: LevelId
  code: string
  startDate: string
  rhythm: { days: number[]; perSession: number } // 0 = dimanche … 6 = samedi
  rules: { revisit: boolean; requirePrevious: boolean }
  schedule: ScheduleEntry[]
}

export interface Progress {
  studentId: string
  lessonId: string
  position: number // secondes
  watched: number // secondes réellement regardées
  completedAt?: string
  quizScore?: number // %
  quizAttempts?: number
}

export type ActivityType =
  | 'connexion'
  | 'lancement'
  | 'pause'
  | 'reprise'
  | 'fin'
  | 'telechargement'
  | 'quiz'
  | 'message'
  | 'programmation'

export interface Activity {
  id: string
  userId: string
  classId?: string
  type: ActivityType
  lessonId?: string
  detail?: string
  at: string
}

export interface Message {
  id: string
  classId: string
  from: string
  to: string // id utilisateur ou 'classe' pour une annonce
  content: string
  at: string
  readBy: string[]
}

export interface DbState {
  version: number
  users: User[]
  classes: ClassRoom[]
  progress: Progress[]
  activity: Activity[]
  messages: Message[]
}

export type LessonStatus = 'terminee' | 'en-cours' | 'non-vue' | 'en-retard' | 'verrouillee'
