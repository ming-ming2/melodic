// stores/studySessionStore.ts
import { create } from 'zustand'
import { FSRS, FSRSData, Rating } from '@/utils/fsrs'

interface Card {
  id: string
  collectionId: string
  content: {
    word?: string
    grammar?: string
    meaning: string
    example: string
    context: {
      songId: string
      songTitle: string
      artist: string
      lyricLine: string
    }
  }
  fsrs: FSRSData
}

interface Collection {
  id: string
  name: string
  newPerDay: number
  maxReviewsPerDay: number
}

interface TodayCards {
  newCards: Card[]
  reviewCards: Card[]
}

interface StudySessionState {
  // 현재 학습중인 컬렉션 정보
  currentCollection: {
    id: string
    name: string
    newPerDay: number // 하루 신규 학습 목표
    maxReviewsPerDay: number // 하루 최대 복습량
  } | null

  // 학습 큐
  currentCard: Card | null
  newQueue: Card[] // 신규 카드
  learningQueue: Card[] // 학습중/재학습 카드
  graduatedQueue: Card[] // 복습 예정 카드

  // 통계
  todayStats: {
    newCount: number // 오늘 학습한 신규 카드 수
    reviewCount: number // 오늘 복습한 카드 수
    correctCount: number // 정답 수
  }

  // 액션
  startSession: (collectionId: string) => Promise<void>
  endSession: () => void
  rateCard: (rating: Rating) => void
  getNextCard: () => Card | null
}

// stores/studySessionStore.ts (계속)

const fsrs = new FSRS() // FSRS 인스턴스 생성

const useStudySessionStore = create<StudySessionState>((set, get) => ({
  // 초기 상태
  currentCollection: null,
  currentCard: null,
  newQueue: [],
  learningQueue: [],
  graduatedQueue: [],
  todayStats: {
    newCount: 0,
    reviewCount: 0,
    correctCount: 0,
  },

  // 학습 세션 시작
  startSession: async (collectionId: string) => {
    try {
      const collection: Collection = await fetch(
        `/api/collections/${collectionId}`
      ).then((res) => res.json())
      const { newCards, reviewCards }: TodayCards = await fetch(
        `/api/collections/${collectionId}/today-cards`
      ).then((res) => res.json())

      set({
        currentCollection: collection,
        newQueue: newCards,
        graduatedQueue: reviewCards.filter(
          (card) => new Date(card.fsrs.nextReview!) <= new Date()
        ),
        learningQueue: [],
      })

      // 3. 첫 카드 선택
      get().getNextCard()
    } catch (error) {
      console.error('Failed to start study session:', error)
      // TODO: 에러 처리
    }
  },

  // 다음 카드 가져오기
  getNextCard: () => {
    const state = get()
    let nextCard: Card | null = null

    // 우선순위: learning > graduated > new
    if (state.learningQueue.length > 0) {
      // 학습중/재학습 카드 우선
      ;[nextCard] = state.learningQueue
      set({
        learningQueue: state.learningQueue.slice(1),
        currentCard: nextCard,
      })
    } else if (state.graduatedQueue.length > 0) {
      // 복습 예정 카드
      ;[nextCard] = state.graduatedQueue
      set({
        graduatedQueue: state.graduatedQueue.slice(1),
        currentCard: nextCard,
      })
    } else if (
      state.newQueue.length > 0 &&
      state.todayStats.newCount < state.currentCollection!.newPerDay
    ) {
      // 신규 카드 (일일 한도 내에서)
      ;[nextCard] = state.newQueue
      set({
        newQueue: state.newQueue.slice(1),
        currentCard: nextCard,
        todayStats: {
          ...state.todayStats,
          newCount: state.todayStats.newCount + 1,
        },
      })
    }

    return nextCard
  },

  // 카드 평가
  rateCard: (rating: Rating) => {
    const state = get()
    const currentCard = state.currentCard

    // null check
    if (!currentCard) {
      console.warn('No card is currently being reviewed')
      return
    }

    const updatedFSRS = fsrs.review(currentCard.fsrs, rating)
    const updatedCard: Card = {
      ...currentCard,
      fsrs: updatedFSRS,
    }

    // 큐 업데이트 부분도 null 체크 추가
    if (rating === 1) {
      // Again
      set((state) => {
        if (!state.currentCard) return state // null check
        return {
          learningQueue: [updatedCard, ...state.learningQueue],
          currentCard: null,
        }
      })
    } else {
      // Good/Easy
      set((state) => {
        if (!state.currentCard) return state // null check
        return {
          currentCard: null,
          todayStats: {
            ...state.todayStats,
            correctCount: state.todayStats.correctCount + 1,
            reviewCount: state.todayStats.reviewCount + 1,
          },
        }
      })
    }

    // API 호출
    fetch(`/api/cards/${currentCard.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedCard),
    }).catch((error) => {
      console.error('Failed to update card:', error)
    })

    // 다음 카드 가져오기
    get().getNextCard()
  },

  // 세션 종료
  endSession: () => {
    set({
      currentCollection: null,
      currentCard: null,
      newQueue: [],
      learningQueue: [],
      graduatedQueue: [],
      todayStats: {
        newCount: 0,
        reviewCount: 0,
        correctCount: 0,
      },
    })
  },
}))

export default useStudySessionStore
