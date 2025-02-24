// utils/sm2.ts
import { FSRSData, Rating } from '@/types/study'

export class SM2 {
  // SM2 기본값
  private static readonly INITIAL_EASE_FACTOR = 2.5
  private static readonly MINIMUM_EASE_FACTOR = 1.3
  private static readonly INITIAL_INTERVAL = 1
  private static readonly SECOND_INTERVAL = 6

  /**
   * SM2에서 FSRS로 데이터 변환
   */
  public static convertToFSRS(
    scheduledDays: number,
    easeFactor: number,
    reps: number
  ): Pick<FSRSData, 'difficulty' | 'stability'> {
    // 안정성은 현재 복습 간격을 그대로 사용 (최소 0.1)
    const stability = Math.max(scheduledDays, 0.1)

    // 난이도는 ease factor를 기반으로 계산 (1-10 사이로 정규화)
    const difficulty = this.convertEaseFactorToDifficulty(easeFactor)

    return {
      difficulty,
      stability,
    }
  }

  /**
   * Ease Factor를 FSRS 난이도(1-10)로 변환
   */
  private static convertEaseFactorToDifficulty(easeFactor: number): number {
    // 난이도는 ease factor와 반비례
    // ease factor 범위(1.3-2.5+)를 난이도 범위(1-10)로 매핑
    const normalizedEF = Math.max(
      Math.min(easeFactor, 2.5),
      this.MINIMUM_EASE_FACTOR
    )
    const difficulty =
      11 -
      ((normalizedEF - this.MINIMUM_EASE_FACTOR) * 9) /
        (this.INITIAL_EASE_FACTOR - this.MINIMUM_EASE_FACTOR)

    return Number(Math.min(Math.max(difficulty, 1), 10).toFixed(2))
  }

  /**
   * FSRS 난이도를 Ease Factor로 변환 (역변환 시 필요)
   */
  private static convertDifficultyToEaseFactor(difficulty: number): number {
    const normalizedDifficulty = Math.max(Math.min(difficulty, 10), 1)
    const easeFactor =
      this.MINIMUM_EASE_FACTOR +
      ((11 - normalizedDifficulty) *
        (this.INITIAL_EASE_FACTOR - this.MINIMUM_EASE_FACTOR)) /
        9

    return Number(easeFactor.toFixed(2))
  }

  /**
   * 다음 복습 간격 계산 (SM2 알고리즘)
   */
  public static calculateNextInterval(
    currentInterval: number,
    easeFactor: number,
    rating: Rating,
    repetitions: number
  ): number {
    // Again(1)인 경우 처음부터 다시 시작
    if (rating === 1) {
      return this.INITIAL_INTERVAL
    }

    // 첫 번째 성공적인 복습
    if (repetitions === 1) {
      return this.INITIAL_INTERVAL
    }

    // 두 번째 성공적인 복습
    if (repetitions === 2) {
      return this.SECOND_INTERVAL
    }

    // 그 이후의 복습
    return Math.round(currentInterval * easeFactor)
  }

  /**
   * Ease Factor 업데이트 (SM2 알고리즘)
   */
  public static updateEaseFactor(currentEF: number, rating: Rating): number {
    if (rating === 1) {
      // Again인 경우 ease factor 감소
      return Math.max(currentEF - 0.2, this.MINIMUM_EASE_FACTOR)
    }

    // SM2 공식에 따른 ease factor 조정
    // EF′ = EF + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02))
    const newEF =
      currentEF + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02))

    return Number(Math.max(newEF, this.MINIMUM_EASE_FACTOR).toFixed(2))
  }

  /**
   * 초기 SM2 데이터 생성
   */
  public static initializeData() {
    return {
      interval: this.INITIAL_INTERVAL,
      easeFactor: this.INITIAL_EASE_FACTOR,
      repetitions: 0,
    }
  }

  /**
   * SM2 데이터 검증
   */
  public static validateSM2Data(
    interval: number,
    easeFactor: number,
    repetitions: number
  ): boolean {
    return (
      interval >= 0 &&
      easeFactor >= this.MINIMUM_EASE_FACTOR &&
      repetitions >= 0
    )
  }
}

// SM2 관련 타입 정의
export interface SM2Data {
  interval: number
  easeFactor: number
  repetitions: number
}
