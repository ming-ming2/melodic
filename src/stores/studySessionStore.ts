// stores/studySessionStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FSRS } from '@/utils/fsrs'
import {
  FSRSCard,
  StudySession,
  Rating,
  ReviewLog,
  StudyConfig,
  Platform,
} from '@/types/study'

const DEFAULT_CONFIG: StudyConfig = {
  learningSteps: [1, 10],
  relearningSteps: [5, 20],
  weights: [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
    0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655,
    0.6621,
  ],
  requestRetention: 0.9,
  maximumInterval: 36500,
  enableFuzz: true,
}

interface StudySessionStore {
  // 세션 상태
  session: StudySession | null
  currentCard: FSRSCard | null
  reviewHistory: ReviewLog[]
  studyStartTime: number | null
  platform: Platform

  // FSRS 인스턴스
  fsrs: FSRS

  // 액션
  initialize: (platform: Platform) => void
  startSession: (cards: FSRSCard[]) => void
  answerCard: (rating: Rating) => void
  endSession: () => void

  // 통계
  getSessionStats: () => {
    totalTime: number
    correctCount: number
    averageTimePerCard: number
    retentionRate: number
  }
}

const useStudySessionStore = create<StudySessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      currentCard: null,
      reviewHistory: [],
      studyStartTime: null,
      platform: 'web',
      fsrs: new FSRS(DEFAULT_CONFIG),

      initialize: (platform: Platform) => {
        set({
          session: null,
          currentCard: null,
          reviewHistory: [],
          studyStartTime: null,
          platform,
          fsrs: new FSRS(DEFAULT_CONFIG, platform),
        })
      },

      startSession: (cards: FSRSCard[]) => {
        if (!cards.length) return

        const sessionId = crypto.randomUUID()
        const now = new Date()

        // 세션 초기화
        const newSession: StudySession = {
          id: sessionId,
          startTime: now,
          totalCards: cards.length,
          newCount: cards.filter((card) => card.data.state === 'new').length,
          reviewCount: cards.filter((card) => card.data.state !== 'new').length,
          correctCount: 0,
          currentCard: cards[0],
          platform: get().platform,
        }

        set({
          session: newSession,
          currentCard: cards[0],
          studyStartTime: Date.now(),
          reviewHistory: [],
        })
      },

      answerCard: (rating: Rating) => {
        const { currentCard, session, fsrs, platform, reviewHistory } = get()
        if (!currentCard || !session) return

        const timeSpent = Date.now() - (get().studyStartTime || Date.now())

        try {
          // FSRS로 카드 상태 업데이트
          const updatedData = fsrs.review(currentCard, rating)

          // 리뷰 로그 생성
          const reviewLog: ReviewLog = {
            id: crypto.randomUUID(),
            sessionId: session.id,
            cardId: currentCard.id,
            reviewType: currentCard.data.state,
            rating,
            interval: Math.floor(
              (updatedData.nextReview!.getTime() -
                updatedData.lastReview!.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            lastInterval: currentCard.data.lastReview
              ? Math.floor(
                  (new Date().getTime() -
                    currentCard.data.lastReview.getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0,
            easeFactor: updatedData.difficulty,
            timeSpent,
            timestamp: Date.now(),
            stability: updatedData.stability,
            difficulty: updatedData.difficulty,
            deviceInfo: navigator.userAgent,
            syncState: {
              lastSynced: null,
              pendingChanges: true,
              platform,
              version: 1,
            },
            platform,
          }

          // 상태 업데이트
          set({
            currentCard: {
              ...currentCard,
              data: updatedData,
            },
            session: {
              ...session,
              correctCount:
                rating !== 1 ? session.correctCount + 1 : session.correctCount,
            },
            reviewHistory: [...reviewHistory, reviewLog],
          })
        } catch (error) {
          console.error('Failed to process answer:', error)
          // TODO: 에러 처리 및 복구 메커니즘
        }
      },

      endSession: () => {
        const { session } = get()
        if (!session) return

        const endTime = new Date()
        set((state) => ({
          session: {
            ...state.session!,
            endTime,
          },
          currentCard: null,
          studyStartTime: null,
        }))

        // TODO: 세션 데이터 저장 및 동기화
      },

      getSessionStats: () => {
        const { session, reviewHistory } = get()
        if (!session || !reviewHistory.length) {
          return {
            totalTime: 0,
            correctCount: 0,
            averageTimePerCard: 0,
            retentionRate: 0,
          }
        }

        const totalTime = reviewHistory.reduce(
          (sum, log) => sum + log.timeSpent,
          0
        )
        const correctCount = session.correctCount
        const averageTimePerCard = totalTime / reviewHistory.length
        const retentionRate = (correctCount / reviewHistory.length) * 100

        return {
          totalTime,
          correctCount,
          averageTimePerCard,
          retentionRate,
        }
      },
    }),
    {
      name: 'study-session-storage',
      // 민감한 데이터는 제외하고 저장
      partialize: (state) => ({
        platform: state.platform,
        reviewHistory: state.reviewHistory,
      }),
    }
  )
)

export default useStudySessionStore
