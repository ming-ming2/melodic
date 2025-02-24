// types/study.ts
export type CardState = 'new' | 'learning' | 'review' | 'relearning'
export type Rating = 1 | 3 | 4 // again, good, easy
export type Platform = 'web' | 'mobile'

export interface SyncState {
  lastSynced: Date | null
  pendingChanges: boolean
  platform: Platform
  version: number
}

export interface RecoveryData {
  originalState: FSRSData
  timestamp: number
  reason: string
}

export interface FSRSData {
  state: CardState
  difficulty: number
  stability: number
  lastReview: Date | null
  nextReview: Date | null
  lapses: number
  reps: number
  seed?: number
  syncState?: SyncState
  recoveryData?: RecoveryData
}
export interface FSRSSchedulerConfig {
  // 기본 설정
  startHour: number
  timezone: string

  // 학습 제한
  newCardsPerDay: number
  reviewsPerDay: number
  timeoutMinutes: number

  // 고급 설정
  enableFuzz: boolean
  enableTimeouts: boolean
  allowEarlyReviews: boolean

  // FSRS 관련 설정
  learningSteps: number[]
  relearningSteps: number[]
  weights: number[]
  requestRetention: number
  maximumInterval: number
}

export interface StudyConfig {
  // 기존 설정들
  learningSteps: number[]
  relearningSteps: number[]
  weights: number[]
  requestRetention: number
  maximumInterval: number
  enableFuzz: boolean
}

export interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  totalCards: number
  newCount: number
  reviewCount: number
  correctCount: number
  currentCard: FSRSCard | null
  platform: Platform
}

export interface FSRSCard {
  id: string
  type: 'vocabulary' | 'grammar'
  data: FSRSData
  front: string
  back: string
  context?: {
    songId: string
    songTitle: string
    lyricLine: string
  }
  lastModified: Date
  createdAt: Date
  syncState: SyncState
}

export interface ReviewLog {
  id: string
  sessionId: string
  cardId: string
  reviewType: CardState
  rating: Rating
  interval: number
  lastInterval: number
  easeFactor: number
  timeSpent: number
  timestamp: number
  stability?: number
  difficulty?: number
  deviceInfo: string
  syncState: SyncState
  platform: Platform
}
