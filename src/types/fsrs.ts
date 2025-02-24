// types/fsrs.ts

/**
 * FSRS 알고리즘의 계산 가중치
 */
export interface FSRSWeights {
  // 기본 가중치
  w: number[] // 기본 19개 파라미터
  requestRetention: number // 목표 기억 유지율 (기본값: 0.9)
  maximumInterval: number // 최대 복습 간격 (기본값: 36500)
  easyBonus: number // Easy 평가 시 추가 보너스
  hardPenalty: number // Hard 평가 시 페널티
}

/**
 * FSRS 카드 상태 정보
 */
export interface FSRSState {
  // 기본 상태 정보
  state: 'new' | 'learning' | 'relearning' | 'review'
  difficulty: number // 1-10 사이의 난이도
  stability: number // 기억 안정성
  retrievability: number // 기억 인출 가능성

  // 복습 간격 정보
  lastReview: Date | null
  nextReview: Date | null
  scheduledDays: number // 예정된 복습 간격(일)
  elapsedDays: number // 마지막 복습 후 경과 일수

  // 학습 통계
  reps: number // 총 복습 횟수
  lapses: number // 실패(Again) 횟수
  streak: number // 연속 성공 횟수
  averageTime: number // 평균 응답 시간(ms)

  // 추가 메타데이터
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * FSRS 리뷰 로그 항목
 */
export interface FSRSReviewLog {
  id: string
  cardId: string
  rating: 1 | 3 | 4 // Again, Good, Easy
  elapsedTime: number // 응답 시간(ms)

  // 리뷰 시점의 상태
  priorState: FSRSState
  posteriorState: FSRSState

  // 메타데이터
  timestamp: Date
  deviceInfo: string
  schedulerVersion: string
}

/**
 * FSRS 스케줄러 설정
 */
export interface FSRSSchedulerConfig {
  // 기본 설정
  weights: FSRSWeights
  timezone: string
  startHour: number // 하루의 시작 시간

  // 학습 제한
  newCardsPerDay: number
  reviewsPerDay: number
  timeoutMinutes: number // 세션 타임아웃

  // 고급 설정
  enableFuzz: boolean // 간격 퍼지 기능
  enableTimeouts: boolean // 타임아웃 기능
  allowEarlyReviews: boolean // 조기 복습 허용

  // 백업 및 복구
  backupInterval: number // 백업 간격(분)
  keepBackupDays: number // 백업 보관 기간
}

/**
 * FSRS 학습 통계
 */
export interface FSRSStats {
  // 기본 통계
  totalCards: number
  activeCards: number
  matureCards: number // 21일 이상 간격의 카드
  youngCards: number // 21일 미만 간격의 카드

  // 복습 통계
  totalReviews: number
  correctReviews: number
  averageTime: number
  retentionRate: number

  // 시간별 통계
  reviewsByHour: Record<number, number>
  retentionByInterval: Record<number, number>

  // 난이도 분포
  difficultyDistribution: {
    easy: number // 1-3
    medium: number // 4-7
    hard: number // 8-10
  }
}

/**
 * FSRS 복구 데이터
 */
export interface FSRSRecoveryData {
  timestamp: Date
  reason: string
  originalState: FSRSState
  modifiedState: FSRSState
  isReverted: boolean
  revertedAt?: Date
}
