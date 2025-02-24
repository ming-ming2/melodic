// utils/fsrs.ts
import {
  FSRSData,
  FSRSCard,
  Rating,
  StudyConfig,
  Platform,
} from '@/types/study'
import seedrandom from 'seedrandom'

export class FSRS {
  private readonly DECAY = -0.5
  private readonly FACTOR = 0.9 ** (1 / this.DECAY) - 1

  constructor(
    private config: StudyConfig,
    private platform: Platform = 'web'
  ) {}

  public review(
    card: FSRSCard,
    rating: Rating /*timeSpent: number*/
  ): FSRSData {
    try {
      if (!card?.data) {
        throw new Error('Invalid card data')
      }

      let updatedData: FSRSData

      switch (card.data.state) {
        case 'new':
          updatedData = this.handleNewCard(card.data, rating)
          break
        case 'learning':
        case 'relearning':
          updatedData = this.handleLearningCard(card.data, rating)
          break
        case 'review':
          updatedData = this.handleReviewCard(card.data, rating)
          break
        default:
          throw new Error('Invalid card state')
      }

      // 복구 데이터 저장
      updatedData.recoveryData = {
        originalState: { ...card.data },
        timestamp: Date.now(),
        reason: 'regular_review',
      }

      // 동기화 상태 업데이트
      updatedData.syncState = {
        lastSynced: null,
        pendingChanges: true,
        platform: this.platform,
        version: (card.data.syncState?.version || 0) + 1,
      }

      return updatedData
    } catch (error) {
      console.error('Review failed:', error)
      throw error
    }
  }

  private handleNewCard(data: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const difficulty = this.initDifficulty(rating)
    const stability = this.initStability(rating)

    return {
      ...data,
      state: rating === 1 ? 'learning' : 'review',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
      reps: data.reps + 1,
    }
  }

  private handleLearningCard(data: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const difficulty = this.nextDifficulty(data.difficulty, rating)
    const stability = this.nextShortTermStability(data.stability, rating)

    return {
      ...data,
      state: rating === 1 ? data.state : 'review',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
      reps: data.reps + 1,
    }
  }

  private handleReviewCard(data: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const interval = this.getElapsedDays(data.lastReview!)
    const retrievability = this.forgettingCurve(interval, data.stability)
    const difficulty = this.nextDifficulty(data.difficulty, rating)

    let stability: number
    if (rating === 1) {
      stability = this.nextForgetStability(
        difficulty,
        data.stability,
        retrievability
      )
    } else {
      stability = this.nextRecallStability(
        difficulty,
        data.stability,
        retrievability,
        rating
      )
    }

    return {
      ...data,
      state: rating === 1 ? 'relearning' : 'review',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
      lapses: rating === 1 ? data.lapses + 1 : data.lapses,
      reps: data.reps + 1,
    }
  }

  private calculateNextReview(stability: number, rating: Rating): Date {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // 날짜 정규화

    if (rating === 1) {
      // Again인 경우 10분 후
      return new Date(now.getTime() + 10 * 60 * 1000)
    } else {
      const interval = this.nextInterval(stability)
      return new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
    }
  }

  private nextInterval(stability: number): number {
    const interval =
      (stability / this.FACTOR) *
      (Math.pow(this.config.requestRetention, 1 / this.DECAY) - 1)

    const fuzzedInterval = this.applyFuzz(interval)
    return Math.min(
      Math.max(Math.round(fuzzedInterval), 1),
      this.config.maximumInterval
    )
  }

  private applyFuzz(interval: number): number {
    if (!this.config.enableFuzz || interval < 2.5) return interval

    interval = Math.round(interval)
    const minInterval = Math.max(2, Math.round(interval * 0.95 - 1))
    const maxInterval = Math.round(interval * 1.05 + 1)
    const fuzzFactor = this.generateFuzzFactor()

    return Math.floor(
      fuzzFactor * (maxInterval - minInterval + 1) + minInterval
    )
  }

  private generateFuzzFactor(): number {
    const seed = Date.now().toString()
    const rng = seedrandom(seed)
    return rng()
  }

  private forgettingCurve(elapsedDays: number, stability: number): number {
    return Math.pow(1 + (this.FACTOR * elapsedDays) / stability, this.DECAY)
  }

  private initDifficulty(rating: Rating): number {
    const w = this.config.weights
    return this.constrainDifficulty(w[4] - Math.exp(w[5] * (rating - 1)) + 1)
  }

  private initStability(rating: Rating): number {
    const w = this.config.weights
    return Math.max(w[rating - 1], 0.1)
  }

  private nextDifficulty(oldDifficulty: number, rating: Rating): number {
    const w = this.config.weights
    const deltaD = -w[6] * (rating - 3)
    const next = oldDifficulty + this.linearDamping(deltaD, oldDifficulty)
    return this.constrainDifficulty(
      this.meanReversion(this.initDifficulty(4), next)
    )
  }

  private nextRecallStability(
    difficulty: number,
    stability: number,
    retrievability: number,
    rating: Rating
  ): number {
    const w = this.config.weights
    const easyBonus = rating === 4 ? w[16] : 1

    return Number(
      (
        stability *
        (1 +
          Math.exp(w[8]) *
            (11 - difficulty) *
            Math.pow(stability, -w[9]) *
            (Math.exp((1 - retrievability) * w[10]) - 1) *
            easyBonus)
      ).toFixed(2)
    )
  }

  private nextForgetStability(
    difficulty: number,
    stability: number,
    retrievability: number
  ): number {
    const w = this.config.weights
    return Number(
      Math.min(
        w[11] *
          Math.pow(difficulty, -w[12]) *
          (Math.pow(stability + 1, w[13]) - 1) *
          Math.exp((1 - retrievability) * w[14]),
        stability
      ).toFixed(2)
    )
  }

  private nextShortTermStability(stability: number, rating: Rating): number {
    const w = this.config.weights
    return Number(
      (stability * Math.exp(w[17] * (rating - 3 + w[18]))).toFixed(2)
    )
  }

  private linearDamping(deltaD: number, oldD: number): number {
    return (deltaD * (10 - oldD)) / 9
  }

  private meanReversion(init: number, current: number): number {
    const w = this.config.weights
    return w[7] * init + (1 - w[7]) * current
  }

  private constrainDifficulty(difficulty: number): number {
    return Math.min(Math.max(Number(difficulty.toFixed(2)), 1), 10)
  }

  private getElapsedDays(lastReview: Date): number {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const last = new Date(lastReview)
    last.setHours(0, 0, 0, 0)
    return (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  }
}
