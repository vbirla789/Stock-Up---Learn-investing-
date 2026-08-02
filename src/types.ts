// Shared domain types.

/** A level tile is one of three states on the home grid. */
export type LevelState = 'done' | 'current' | 'locked'

export interface ContextStep {
  type: 'context'
  lead: string
  accent: string
  body: string
}

export interface VideoStep {
  type: 'video'
  caption: string
}

export interface QuizStep {
  type: 'quiz'
  lead: string
  accent: string
  options: string[]
  /** index into options */
  answer: number
  why: string
}

export type Step = ContextStep | VideoStep | QuizStep

export interface Level {
  id: number
  chapter: string
  title: string
  steps: Step[]
}

/** What we persist to localStorage. */
export interface Progress {
  completed: number
  xp: number
  streak: number
  doneToday: boolean
}

/** Progress plus the rank derived from XP at render time. */
export type HomeState = Progress & { rank: number }

export type Tier = 'gold' | 'blue' | 'grey'

export interface Rival {
  name: string
  points: number
  avatar?: string
}

export type Entry = Rival & { rank: number; isYou?: boolean }

export type Row = Entry & { tier: Tier }

export interface Board {
  /** left, centre, right — ranks 2, 1, 3 */
  podium: Entry[]
  rows: Row[]
  you: Entry
}

export type View =
  | { name: 'home' }
  | { name: 'level'; levelId: number }
  | { name: 'leaderboard' }
