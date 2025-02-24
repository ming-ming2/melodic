// utils/logger.ts
import { ReviewLog, FSRSCard, CardState, Rating, Platform } from '@/types/study'

export class StudyLogger {
  private logs: ReviewLog[] = []
  private platform: Platform

  constructor(platform: Platform = 'web') {
    this.platform = platform
  }

  /**
   * 새로운 리뷰 로그 생성
   */
  createReviewLog(
    card: FSRSCard,
    rating: Rating,
    timeSpent: number,
    sessionId: string
  ): ReviewLog {
    const log: ReviewLog = {
      id: crypto.randomUUID(),
      sessionId,
      cardId: card.id,
      reviewType: card.data.state,
      rating,
      interval: this.calculateInterval(card),
      lastInterval: this.calculateLastInterval(card),
      easeFactor: card.data.difficulty,
      timeSpent,
      timestamp: Date.now(),
      stability: card.data.stability,
      difficulty: card.data.difficulty,
      deviceInfo: navigator.userAgent,
      syncState: {
        lastSynced: null,
        pendingChanges: true,
        platform: this.platform,
        version: 1,
      },
      platform: this.platform,
    }

    this.logs.push(log)
    return log
  }

  /**
   * 현재 복습 간격 계산
   */
  private calculateInterval(card: FSRSCard): number {
    if (!card.data.nextReview || !card.data.lastReview) return 0
    return Math.round(
      (card.data.nextReview.getTime() - card.data.lastReview.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  }

  /**
   * 이전 복습 간격 계산
   */
  private calculateLastInterval(card: FSRSCard): number {
    if (!card.data.lastReview) return 0
    return Math.round(
      (Date.now() - card.data.lastReview.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  /**
   * 로그 통계 계산
   */
  calculateStats(timeRange?: { start: Date; end: Date }) {
    let targetLogs = this.logs

    if (timeRange) {
      const { start, end } = timeRange
      targetLogs = this.logs.filter(
        (log) =>
          new Date(log.timestamp) >= start && new Date(log.timestamp) <= end
      )
    }

    const totalReviews = targetLogs.length
    const correctReviews = targetLogs.filter((log) => log.rating > 1).length

    return {
      totalReviews,
      correctReviews,
      accuracyRate: totalReviews ? (correctReviews / totalReviews) * 100 : 0,
      averageTime: totalReviews
        ? targetLogs.reduce((sum, log) => sum + log.timeSpent, 0) / totalReviews
        : 0,
      retentionRate: this.calculateRetentionRate(targetLogs),
      reviewsByState: this.groupByState(targetLogs),
    }
  }

  /**
   * 기억 유지율 계산
   */
  private calculateRetentionRate(logs: ReviewLog[]): number {
    if (!logs.length) return 0

    const reviewsByCard = new Map<string, ReviewLog[]>()
    logs.forEach((log) => {
      const cardLogs = reviewsByCard.get(log.cardId) || []
      cardLogs.push(log)
      reviewsByCard.set(log.cardId, cardLogs)
    })

    let totalRetention = 0
    reviewsByCard.forEach((cardLogs) => {
      const successfulReviews = cardLogs.filter((log) => log.rating > 1).length
      totalRetention += successfulReviews / cardLogs.length
    })

    return (totalRetention / reviewsByCard.size) * 100
  }

  /**
   * 상태별 리뷰 수 집계
   */
  private groupByState(logs: ReviewLog[]): Record<CardState, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.reviewType] = (acc[log.reviewType] || 0) + 1
        return acc
      },
      {} as Record<CardState, number>
    )
  }

  /**
   * 로그 내보내기
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'id',
        'sessionId',
        'cardId',
        'reviewType',
        'rating',
        'interval',
        'timeSpent',
        'timestamp',
        'difficulty',
      ].join(',')

      const rows = this.logs.map((log) =>
        [
          log.id,
          log.sessionId,
          log.cardId,
          log.reviewType,
          log.rating,
          log.interval,
          log.timeSpent,
          new Date(log.timestamp).toISOString(),
          log.difficulty,
        ].join(',')
      )

      return [headers, ...rows].join('\n')
    }

    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * 로그 가져오기
   */
  importLogs(logs: ReviewLog[]) {
    this.logs = [...this.logs, ...logs]
  }

  /**
   * 로그 초기화
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * 특정 세션의 로그 가져오기
   */
  getSessionLogs(sessionId: string): ReviewLog[] {
    return this.logs.filter((log) => log.sessionId === sessionId)
  }

  /**
   * 특정 카드의 로그 가져오기
   */
  getCardLogs(cardId: string): ReviewLog[] {
    return this.logs.filter((log) => log.cardId === cardId)
  }
}
