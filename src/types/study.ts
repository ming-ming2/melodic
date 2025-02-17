// types/study.ts

import { FSRSData } from '@/utils/fsrs'

// 학습 가능한 컬렉션 타입
export type CollectionType = 'vocabulary' | 'grammar'

// 기본 컬렉션 인터페이스
export interface Collection {
  id: string
  name: string
  type: CollectionType
  settings: {
    newPerDay: number // 하루 신규 학습 목표
    maxReviewsPerDay: number // 하루 최대 복습량
  }
  language: {
    id: string
    name: string
    flag: string
  }
}

// 학습 카드 인터페이스
export interface Card {
  id: string
  collectionId: string
  content: {
    word?: string // 단어장용
    grammar?: string // 문법노트용
    meaning: string
    example: string
    context: {
      songId: string
      songTitle: string
      artist: string
      lyricLine: string
    }
  }
  fsrs: FSRSData // FSRS 알고리즘 관련 데이터
}

// 학습 통계
export interface StudyStats {
  todayLearned: number // 오늘 학습한 양
  todayTarget: number // 오늘의 목표량
  totalItems: number // 전체 아이템 수
  correctCount: number // 정답 수
}

// 오늘의 학습 카드
export interface TodayCards {
  newCards: Card[] // 오늘 학습할 신규 카드
  reviewCards: Card[] // 오늘 복습할 카드
}
