// utils/studyUtils.ts
import { FSRSCard, StudySession, ReviewLog, CardState } from '@/types/study'

/**
 * 학습 진행도 계산
 */
export const calculateProgress = (session: StudySession) => {
  const totalCards = session.totalCards
  const completedCards = session.correctCount
  return {
    percentage: Math.round((completedCards / totalCards) * 100),
    remaining: totalCards - completedCards,
  }
}

/**
 * 기억 유지율 계산
 */
export const calculateRetentionRate = (reviewLogs: ReviewLog[]): number => {
  if (reviewLogs.length === 0) return 0
  const correctReviews = reviewLogs.filter((log) => log.rating !== 1).length
  return Math.round((correctReviews / reviewLogs.length) * 100)
}

/**
 * 평균 학습 시간 계산 (ms)
 */
export const calculateAverageStudyTime = (reviewLogs: ReviewLog[]): number => {
  if (reviewLogs.length === 0) return 0
  const totalTime = reviewLogs.reduce((sum, log) => sum + log.timeSpent, 0)
  return Math.round(totalTime / reviewLogs.length)
}

/**
 * 카드 상태별 분류
 */
export const categorizeCards = (cards: FSRSCard[]) => {
  return cards.reduce(
    (acc, card) => {
      const state = card.data.state
      if (!acc[state]) acc[state] = []
      acc[state].push(card)
      return acc
    },
    {} as Record<CardState, FSRSCard[]>
  )
}

/**
 * 학습 난이도 분석
 */
export const analyzeDifficulty = (reviewLogs: ReviewLog[]) => {
  const difficulties = reviewLogs.map((log) => log.difficulty || 0)
  return {
    average:
      difficulties.reduce((sum, diff) => sum + diff, 0) / difficulties.length,
    max: Math.max(...difficulties),
    min: Math.min(...difficulties),
  }
}

/**
 * 리뷰 간격 통계
 */
export const analyzeIntervals = (reviewLogs: ReviewLog[]) => {
  const intervals = reviewLogs.map((log) => log.interval)
  return {
    average: Math.round(
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    ),
    max: Math.max(...intervals),
    min: Math.min(...intervals),
  }
}

/**
 * 오늘의 학습 목표 달성 여부 체크
 */
export const checkDailyGoal = (
  reviewLogs: ReviewLog[],
  dailyGoal: number,
  date = new Date()
): boolean => {
  const todayStart = new Date(date)
  todayStart.setHours(0, 0, 0, 0)

  const todayLogs = reviewLogs.filter((log) => {
    const logDate = new Date(log.timestamp)
    return logDate >= todayStart
  })

  return todayLogs.length >= dailyGoal
}

/**
 * 연속 학습일 계산
 */
export const calculateStudyStreak = (reviewLogs: ReviewLog[]): number => {
  if (reviewLogs.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const currentDate = today

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const hasStudied = reviewLogs.some((log) => {
      const logDate = new Date(log.timestamp)
      return logDate.toISOString().split('T')[0] === dateStr
    })

    if (!hasStudied) break

    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

/**
 * 복습 예정 카드 필터링
 */
export const getDueCards = (
  cards: FSRSCard[],
  date = new Date()
): FSRSCard[] => {
  return cards.filter((card) => {
    if (!card.data.nextReview) return false
    return card.data.nextReview <= date
  })
}

/**
 * 세션 요약 정보 생성
 */
export const generateSessionSummary = (
  session: StudySession,
  reviewLogs: ReviewLog[]
) => {
  const progress = calculateProgress(session)
  const retentionRate = calculateRetentionRate(reviewLogs)
  const avgTime = calculateAverageStudyTime(reviewLogs)
  const difficulty = analyzeDifficulty(reviewLogs)

  return {
    totalCards: session.totalCards,
    completedCards: session.correctCount,
    progressPercentage: progress.percentage,
    retentionRate,
    averageTimePerCard: avgTime,
    averageDifficulty: difficulty.average,
    startTime: session.startTime,
    endTime: session.endTime || new Date(),
  }
}

/**
 * 오답 패턴 분석
 */
export const analyzeErrorPatterns = (
  reviewLogs: ReviewLog[]
): Record<string, number> => {
  const errorLogs = reviewLogs.filter((log) => log.rating === 1)

  return errorLogs.reduce(
    (acc, log) => {
      const cardId = log.cardId
      acc[cardId] = (acc[cardId] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}
