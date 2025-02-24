// stores/studyProgressStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FSRSStats, FSRSState } from '@/types/fsrs'
import { Platform } from '@/types/study'

interface ProgressState {
  // 전체 학습 통계
  stats: FSRSStats
  streakDays: number
  lastStudyDate: Date | null
  dailyGoals: {
    newCards: number
    reviews: number
  }

  // 오늘의 학습 현황
  todayStats: {
    newCards: number
    reviews: number
    correctCount: number
    totalTime: number
    startTime: Date | null
  }

  // 플랫폼 정보
  platform: Platform
  lastSynced: Date | null
}

interface ProgressActions {
  // 학습 세션 관련
  startStudySession: () => void
  endStudySession: () => void

  // 학습 진행 기록
  recordNewCard: () => void
  recordReview: (
    state: FSRSState,
    isCorrect: boolean,
    timeSpent: number
  ) => void

  // 목표 설정
  setDailyGoals: (newCards: number, reviews: number) => void

  // 통계 업데이트
  updateStats: (newStats: Partial<FSRSStats>) => void
  resetTodayStats: () => void

  // 동기화
  syncProgress: () => Promise<void>
}

type StudyProgressStore = ProgressState & ProgressActions

const useStudyProgressStore = create<StudyProgressStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      stats: {
        totalCards: 0,
        activeCards: 0,
        matureCards: 0,
        youngCards: 0,
        totalReviews: 0,
        correctReviews: 0,
        averageTime: 0,
        retentionRate: 0,
        reviewsByHour: {},
        retentionByInterval: {},
        difficultyDistribution: {
          easy: 0,
          medium: 0,
          hard: 0,
        },
      },
      streakDays: 0,
      lastStudyDate: null,
      dailyGoals: {
        newCards: 20,
        reviews: 100,
      },
      todayStats: {
        newCards: 0,
        reviews: 0,
        correctCount: 0,
        totalTime: 0,
        startTime: null,
      },
      platform: 'web',
      lastSynced: null,

      // 액션 함수들
      startStudySession: () => {
        const now = new Date()
        set((state) => ({
          todayStats: {
            ...state.todayStats,
            startTime: now,
          },
          lastStudyDate: now,
        }))
      },

      endStudySession: () => {
        const { todayStats, stats } = get()
        const endTime = new Date()
        const sessionTime = todayStats.startTime
          ? endTime.getTime() - todayStats.startTime.getTime()
          : 0

        // 통계 업데이트
        set((state) => ({
          stats: {
            ...state.stats,
            totalReviews: stats.totalReviews + todayStats.reviews,
            correctReviews: stats.correctReviews + todayStats.correctCount,
            averageTime: Math.round(
              (stats.averageTime * stats.totalReviews + sessionTime) /
                (stats.totalReviews + todayStats.reviews)
            ),
            retentionRate:
              Math.round(
                (todayStats.correctCount / todayStats.reviews) * 100
              ) || 0,
          },
          todayStats: {
            ...state.todayStats,
            totalTime: state.todayStats.totalTime + sessionTime,
            startTime: null,
          },
        }))
      },

      recordNewCard: () => {
        set((state) => ({
          todayStats: {
            ...state.todayStats,
            newCards: state.todayStats.newCards + 1,
          },
          stats: {
            ...state.stats,
            totalCards: state.stats.totalCards + 1,
            activeCards: state.stats.activeCards + 1,
            youngCards: state.stats.youngCards + 1,
          },
        }))
      },

      recordReview: (
        state: FSRSState,
        isCorrect: boolean,
        timeSpent: number
      ) => {
        const hour = new Date().getHours()

        set((state) => ({
          todayStats: {
            ...state.todayStats,
            reviews: state.todayStats.reviews + 1,
            correctCount: state.todayStats.correctCount + (isCorrect ? 1 : 0),
            totalTime: state.todayStats.totalTime + timeSpent,
          },
          stats: {
            ...state.stats,
            reviewsByHour: {
              ...state.stats.reviewsByHour,
              [hour]: (state.stats.reviewsByHour[hour] || 0) + 1,
            },
          },
        }))
      },

      setDailyGoals: (newCards: number, reviews: number) => {
        set(() => ({
          dailyGoals: {
            newCards,
            reviews,
          },
        }))
      },

      updateStats: (newStats: Partial<FSRSStats>) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...newStats,
          },
        }))
      },

      resetTodayStats: () => {
        set(() => ({
          todayStats: {
            newCards: 0,
            reviews: 0,
            correctCount: 0,
            totalTime: 0,
            startTime: null,
          },
        }))
      },

      syncProgress: async () => {
        try {
          // TODO: 서버와 동기화 로직 구현
          const now = new Date()
          set(() => ({
            lastSynced: now,
          }))
        } catch (error) {
          console.error('Failed to sync progress:', error)
        }
      },
    }),
    {
      name: 'study-progress-storage',
      partialize: (state) => ({
        stats: state.stats,
        streakDays: state.streakDays,
        lastStudyDate: state.lastStudyDate,
        dailyGoals: state.dailyGoals,
        platform: state.platform,
      }),
    }
  )
)

export default useStudyProgressStore
