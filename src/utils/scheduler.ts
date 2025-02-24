// utils/scheduler.ts
import { FSRSCard, CardState, StudyConfig } from '@/types/study'
import { FSRS } from '@/utils/fsrs'
import { getDueCards } from '@/utils/studyUtils'

export class StudyScheduler {
  private fsrs: FSRS
  private config: StudyConfig

  constructor(config: StudyConfig) {
    this.config = config
    this.fsrs = new FSRS(config)
  }

  /**
   * 오늘의 학습 카드 큐 생성
   */
  public getStudyQueue(cards: FSRSCard[]): FSRSCard[] {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // 일일 학습 시작 시간을 0시로 설정

    // 복습 예정 카드 필터링
    const dueCards = getDueCards(cards, now)

    // 상태별로 분류
    const newCards = cards.filter((card) => card.data.state === 'new')
    const reviewCards = dueCards.filter((card) => card.data.state === 'review')
    const learningCards = dueCards.filter(
      (card) =>
        card.data.state === 'learning' || card.data.state === 'relearning'
    )

    // 학습 우선순위에 따라 정렬
    return this.prioritizeCards([
      ...learningCards, // 학습 중인 카드 우선
      ...reviewCards, // 그 다음 복습 카드
      ...newCards, // 마지막으로 새 카드
    ])
  }

  /**
   * 카드 우선순위 지정
   */
  private prioritizeCards(cards: FSRSCard[]): FSRSCard[] {
    return cards.sort((a, b) => {
      // 상태에 따른 우선순위
      const stateOrder: Record<CardState, number> = {
        learning: 3,
        relearning: 2,
        review: 1,
        new: 0,
      }

      const orderDiff = stateOrder[b.data.state] - stateOrder[a.data.state]
      if (orderDiff !== 0) return orderDiff

      // 안정성이 낮은 카드 우선
      return (a.data.stability || 0) - (b.data.stability || 0)
    })
  }

  /**
   * 학습 시간 초과 체크
   */
  public isSessionTimeout(startTime: Date): boolean {
    const MAX_SESSION_TIME = 30 * 60 * 1000 // 30분
    return Date.now() - startTime.getTime() > MAX_SESSION_TIME
  }

  /**
   * 다음 복습 시간 계산
   */
  public getNextReviewTime(card: FSRSCard): Date {
    if (!card.data.nextReview) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return now
    }

    if (this.config.enableFuzz) {
      const fuzzFactor = 0.95 + Math.random() * 0.1 // ±5% 변동
      const interval = card.data.nextReview.getTime() - Date.now()
      return new Date(Date.now() + interval * fuzzFactor)
    }

    return card.data.nextReview
  }

  /**
   * 복습 필요한 카드 수 계산
   */
  public getDueCardCounts(cards: FSRSCard[]): {
    new: number
    learning: number
    review: number
  } {
    const now = new Date()
    const dueCards = getDueCards(cards, now)

    return {
      new: cards.filter((card) => card.data.state === 'new').length,
      learning: dueCards.filter(
        (card) =>
          card.data.state === 'learning' || card.data.state === 'relearning'
      ).length,
      review: dueCards.filter((card) => card.data.state === 'review').length,
    }
  }
}
