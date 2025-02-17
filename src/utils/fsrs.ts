// utils/fsrs.ts

export type CardState = 'new' | 'learning' | 'graduated' | 'relearning'
export type Rating = 1 | 3 | 4 // again, good, easy

interface FSRSConfig {
  weights: number[]
  requestRetention: number
  maximumInterval: number
}

export interface FSRSData {
  state: CardState
  difficulty: number
  stability: number
  lastReview: Date | null
  nextReview: Date | null
}

export class FSRS {
  private readonly DECAY = -0.5
  private readonly FACTOR = 0.9 ** (1 / this.DECAY) - 1

  private config: FSRSConfig = {
    // 최적화된 가중치 값들
    weights: [
      0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046,
      1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898,
      0.51655, 0.6621,
    ],
    requestRetention: 0.9, // 90% 목표 기억 유지율
    maximumInterval: 36500, // 최대 100년
  }

  constructor(config?: Partial<FSRSConfig>) {
    this.config = { ...this.config, ...config }
  }

  // 메인 리뷰 함수
  public review(card: FSRSData, rating: Rating): FSRSData {
    switch (card.state) {
      case 'new':
        return this.handleNewCard(card, rating)
      case 'learning':
      case 'relearning':
        return this.handleLearningCard(card, rating)
      case 'graduated':
        return this.handleGraduatedCard(card, rating)
      default:
        throw new Error('Invalid card state')
    }
  }

  private handleNewCard(card: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const difficulty = this.initDifficulty(rating)
    const stability = this.initStability(rating)

    return {
      state: rating === 1 ? 'learning' : 'graduated',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
    }
  }

  private handleLearningCard(card: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const difficulty = this.nextDifficulty(card.difficulty, rating)
    const stability = this.nextShortTermStability(card.stability, rating)

    return {
      state: rating === 1 ? card.state : 'graduated',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
    }
  }

  private handleGraduatedCard(card: FSRSData, rating: Rating): FSRSData {
    const now = new Date()
    const elapsedDays = this.getElapsedDays(card.lastReview!)
    const retrievability = this.forgettingCurve(elapsedDays, card.stability)

    const difficulty = this.nextDifficulty(card.difficulty, rating)
    const stability =
      rating === 1
        ? this.nextForgetStability(
            card.difficulty,
            card.stability,
            retrievability
          )
        : this.nextRecallStability(
            card.difficulty,
            card.stability,
            retrievability,
            rating
          )

    return {
      state: rating === 1 ? 'relearning' : 'graduated',
      difficulty,
      stability,
      lastReview: now,
      nextReview: this.calculateNextReview(stability, rating),
    }
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

  private calculateNextReview(stability: number, rating: Rating): Date {
    const now = new Date()

    if (rating === 1) {
      // Again인 경우 10분 후
      return new Date(now.getTime() + 10 * 60 * 1000)
    } else {
      // Good/Easy인 경우 계산된 간격
      const interval = this.nextInterval(stability)
      return new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)
    }
  }

  // 유틸리티 함수들
  private constrainDifficulty(difficulty: number): number {
    return Math.min(Math.max(Number(difficulty.toFixed(2)), 1), 10)
  }

  private linearDamping(deltaD: number, oldD: number): number {
    return (deltaD * (10 - oldD)) / 9
  }

  private meanReversion(init: number, current: number): number {
    const w = this.config.weights
    return w[7] * init + (1 - w[7]) * current
  }

  private getElapsedDays(lastReview: Date): number {
    return (new Date().getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
  }

  private applyFuzz(interval: number): number {
    if (interval < 2.5) return interval

    const fuzzyInterval = Math.round(interval)
    const minInterval = Math.max(2, Math.round(fuzzyInterval * 0.95 - 1))
    const maxInterval = Math.round(fuzzyInterval * 1.05 + 1)

    return Math.floor(
      Math.random() * (maxInterval - minInterval + 1) + minInterval
    )
  }
}
