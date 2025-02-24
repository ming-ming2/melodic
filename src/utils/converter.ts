// utils/converter.ts
import { FSRSCard, CardState } from '@/types/study'
import { SM2 } from '@/utils/sm2'

interface SM2CardData {
  interval: number
  easeFactor: number
  repetitions: number
  lastReview: Date | null
}

export class CardConverter {
  /**
   * SM2에서 FSRS로 카드 데이터 변환
   */
  static sm2ToFSRS(
    cardId: string,
    sm2Data: SM2CardData,
    front: string,
    back: string
  ): FSRSCard {
    // SM2 데이터에서 FSRS 상태 계산
    const state = this.calculateCardState(sm2Data)

    // 난이도와 안정성 계산
    const { difficulty, stability } = SM2.convertToFSRS(
      sm2Data.interval,
      sm2Data.easeFactor,
      sm2Data.repetitions
    )

    // 다음 복습 일자 계산
    const nextReview = sm2Data.lastReview
      ? new Date(
          sm2Data.lastReview.getTime() + sm2Data.interval * 24 * 60 * 60 * 1000
        )
      : null

    return {
      id: cardId,
      type: 'vocabulary', // 기본값으로 vocabulary 설정
      front,
      back,
      data: {
        state,
        difficulty,
        stability,
        lastReview: sm2Data.lastReview,
        nextReview,
        lapses: Math.max(0, sm2Data.repetitions - 1), // 반복 횟수에서 실패 횟수 추정
        reps: sm2Data.repetitions,
      },
      lastModified: new Date(),
      createdAt: new Date(),
      syncState: {
        lastSynced: null,
        pendingChanges: true,
        platform: 'web',
        version: 1,
      },
    }
  }

  /**
   * SM2 데이터를 기반으로 카드 상태 결정
   */
  private static calculateCardState(data: SM2CardData): CardState {
    if (!data.lastReview) return 'new'
    if (data.repetitions === 0) return 'learning'
    if (data.easeFactor < 1.3) return 'relearning'
    return 'review'
  }

  /**
   * FSRS에서 SM2로 데이터 변환 (필요한 경우)
   */
  static fsrsToSM2(card: FSRSCard): SM2CardData {
    // 난이도를 Ease Factor로 변환 (1-10 스케일을 1.3-2.5 스케일로)
    const easeFactor = 1.3 + (card.data.difficulty - 1) * (1.2 / 9)

    // 복습 간격 계산
    const interval =
      card.data.nextReview && card.data.lastReview
        ? Math.round(
            (card.data.nextReview.getTime() - card.data.lastReview.getTime()) /
              (24 * 60 * 60 * 1000)
          )
        : 0

    return {
      interval,
      easeFactor,
      repetitions: card.data.reps,
      lastReview: card.data.lastReview,
    }
  }

  /**
   * 벌크 변환 유틸리티
   */
  static bulkConvert(
    sm2Cards: Array<[string, SM2CardData, string, string]>
  ): FSRSCard[] {
    return sm2Cards.map(([id, data, front, back]) =>
      this.sm2ToFSRS(id, data, front, back)
    )
  }

  /**
   * 변환 검증
   */
  static validateConversion(
    original: SM2CardData,
    converted: FSRSCard
  ): boolean {
    // 기본적인 데이터 정합성 검사
    if (!converted.data.lastReview && original.lastReview) return false
    if (converted.data.reps !== original.repetitions) return false

    // 복습 간격 차이가 하루 이상 나지 않는지 확인
    const originalInterval = original.interval
    const convertedInterval =
      converted.data.nextReview && converted.data.lastReview
        ? Math.round(
            (converted.data.nextReview.getTime() -
              converted.data.lastReview.getTime()) /
              (24 * 60 * 60 * 1000)
          )
        : 0

    return Math.abs(originalInterval - convertedInterval) <= 1
  }

  /**
   * 복구 데이터 생성
   */
  static createRecoveryData(original: SM2CardData): string {
    return JSON.stringify({
      type: 'sm2',
      data: original,
      timestamp: new Date().toISOString(),
    })
  }
}
