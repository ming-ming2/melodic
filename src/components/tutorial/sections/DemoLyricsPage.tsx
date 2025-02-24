// pages/DemoLyricsPage.tsx
import React, { useState, useEffect, useRef, MouseEvent } from 'react'
import Head from 'next/head'
import { ChevronLeft } from 'lucide-react'
import DemoYouTubePlayer, { DemoYouTubePlayerRef } from './DemoYouTubePlayer'
import DemoLyricsCard from './DemoLyricsCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { TUTORIAL_SONG_DATA } from '@/utils/tutorialDummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import { motion, AnimatePresence } from 'framer-motion'

interface TimedLyric extends LyricLine {
  timestamp: { start: number; end: number }
  similarity: number
}

interface DemoLyricsPageProps {
  onBack: () => void
  onComplete: () => void
}

export default function DemoLyricsPage({
  onBack,
  onComplete,
}: DemoLyricsPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timedLyrics, setTimedLyrics] = useState<TimedLyric[]>([])
  const [isUserNavigation, setIsUserNavigation] = useState(false)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAutoUpdatedIndexRef = useRef<number>(-1)
  const handleNavigationPanelConfirm = () => {
    setShowLyricsPanel(false)
  }

  const handleTabPanelConfirm = () => {
    setShowLyricsPanel(false)
  }

  // 튜토리얼 관련 상태
  const [currentStep, setCurrentStep] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [tutorialComplete, setTutorialComplete] = useState(false)
  // 가사/학습탭 안내 패널 표시 여부 (target: lyrics)
  const [showLyricsPanel, setShowLyricsPanel] = useState(false)

  // DemoYouTubePlayer 제어용 ref
  const playerRef = useRef<DemoYouTubePlayerRef>(null)

  const tutorialSteps = [
    {
      instruction: 'Step 1: 플레이 버튼 눌러 영상 시작해봐!',
      feedback: '영상 시작 완료!',
      expectedAction: 'play',
      target: 'video',
    },
    {
      instruction: 'Step 2: 재생/일시정지 버튼으로 영상 멈췄다 다시 터치해봐.',
      feedback: '일시정지 OK!',
      expectedAction: 'pause',
      target: 'video',
    },
    {
      instruction: 'Step 3: 스킵 백 버튼 누르면 구간 처음부터 재생돼!',
      feedback: '스킵 백 완료!',
      expectedAction: 'skip',
      target: 'video',
    },
    {
      instruction: 'Step 4: 반복 버튼 눌러서 루프 모드 확인해봐!',
      feedback: '루프 모드 활성화!',
      expectedAction: 'repeat',
      target: 'video',
    },
    {
      instruction:
        'Step 5: 가사 네비게이션! 좌우 화살표를 눌러 가사를 이동해봐.',
      feedback: '가사 네비게이션 완료!',
      expectedAction: 'navigate',
      target: 'lyrics',
    },
    {
      instruction:
        'Step 6: 학습 탭! 실제 학습 탭(단어, 문법, 표현)을 눌러 기능 체험해봐.',
      feedback: '학습 탭 확인 완료!',
      expectedAction: 'tab',
      target: 'lyrics',
    },
  ]

  const handleControlAction = (action: string) => {
    if (
      currentStep < tutorialSteps.length &&
      action === tutorialSteps[currentStep].expectedAction
    ) {
      setFeedbackMessage(tutorialSteps[currentStep].feedback)
      setTimeout(() => {
        setFeedbackMessage('')
        setCurrentStep((prev) => prev + 1)
        setShowLyricsPanel(false)
      }, 2000)
    }
  }

  // 영상 안내 패널은 DemoYouTubePlayer 내부 처리(변경 없음)

  // 가사/학습탭 안내 패널은 모달로 띄워지도록 함 (절대 위치)
  useEffect(() => {
    if (tutorialSteps[currentStep]?.expectedAction === 'navigate') {
      const timer = setTimeout(() => {
        setShowLyricsPanel(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
    if (tutorialSteps[currentStep]?.expectedAction === 'tab') {
      setShowLyricsPanel(true)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep >= tutorialSteps.length) {
      setTutorialComplete(true)
    }
  }, [currentStep])

  useEffect(() => {
    async function initializeLyrics() {
      try {
        setIsLoading(true)
        const captions = await getVideoCaption(TUTORIAL_SONG_DATA.youtube_id)
        const matchedLyrics = matchLyricsWithCaptions(
          TUTORIAL_SONG_DATA.lyrics_analysis,
          captions
        )
        setTimedLyrics(matchedLyrics)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Failed to initialize lyrics:', error)
        const defaultTimedLyrics = TUTORIAL_SONG_DATA.lyrics_analysis.map(
          (lyric, index) => ({
            ...lyric,
            timestamp: { start: index * 3, end: (index + 1) * 3 },
            similarity: 0,
          })
        )
        setTimedLyrics(defaultTimedLyrics)
        setCurrentIndex(0)
      } finally {
        setIsLoading(false)
      }
    }
    initializeLyrics()
  }, [])

  return (
    <>
      <Head>
        <title>{TUTORIAL_SONG_DATA.title} - Demo Tutorial</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md border-b border-gray-800 rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="text-white hover:text-accent-400 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-medium text-white">
                Demo - 노래 학습 튜토리얼
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto">
        {/* 영상 영역 */}
        <div className="w-full lg:w-1/2">
          <div className="w-full lg:sticky lg:top-14">
            <div className="aspect-video w-full relative">
              {!isLoading && timedLyrics.length > 0 && (
                <DemoYouTubePlayer
                  ref={playerRef}
                  videoId={TUTORIAL_SONG_DATA.youtube_id}
                  currentLyric={timedLyrics[currentIndex].timestamp}
                  onTimeUpdate={(currentTime) => {
                    if (
                      !isLoading &&
                      timedLyrics.length > 0 &&
                      !isUserNavigation
                    ) {
                      const newIndex = timedLyrics.findIndex(
                        (lyric) =>
                          currentTime >= lyric.timestamp.start &&
                          currentTime < lyric.timestamp.end
                      )
                      if (
                        newIndex !== -1 &&
                        newIndex !== currentIndex &&
                        newIndex !== lastAutoUpdatedIndexRef.current
                      ) {
                        setCurrentIndex(newIndex)
                        lastAutoUpdatedIndexRef.current = newIndex
                      }
                    }
                  }}
                  isUserNavigation={isUserNavigation}
                  onControlAction={handleControlAction}
                  highlightControl={
                    tutorialSteps[currentStep]?.target === 'video'
                      ? tutorialSteps[currentStep]?.expectedAction
                      : ''
                  }
                />
              )}
            </div>
            {tutorialSteps[currentStep]?.target === 'video' &&
              currentStep < 4 && (
                <div className="mt-4 px-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 rounded-xl shadow-lg text-center">
                    <p className="text-white text-lg">
                      {tutorialSteps[currentStep].instruction}
                    </p>
                    <p className="text-white text-sm mt-1">
                      해당 버튼을 직접 눌러 진행해봐!
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* 가사 영역 */}
        <div className="w-full lg:w-1/2 bg-gray-900 lg:min-h-screen flex flex-col relative">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex-grow overflow-auto">
              <DemoLyricsCard
                lyrics={timedLyrics}
                currentIndex={currentIndex}
                onIndexChange={(newIndex) => {
                  setIsUserNavigation(true)
                  setCurrentIndex(newIndex)
                  if (navigationTimeoutRef.current) {
                    clearTimeout(navigationTimeoutRef.current)
                  }
                  navigationTimeoutRef.current = setTimeout(() => {
                    setIsUserNavigation(false)
                  }, 500)
                }}
                onControlAction={handleControlAction}
              />
            </div>
          )}
          {tutorialSteps[currentStep]?.target === 'lyrics' &&
            showLyricsPanel && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50"
                >
                  {tutorialSteps[currentStep].expectedAction === 'navigate' && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 rounded-xl shadow-lg text-center">
                      <p className="text-white text-lg">
                        {tutorialSteps[currentStep].instruction}
                      </p>
                      <p className="text-white text-sm mt-1">
                        좌우 화살표를 눌러 가사를 이동해봐!
                      </p>
                      <button
                        onClick={handleNavigationPanelConfirm}
                        className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        확인
                      </button>
                    </div>
                  )}
                  {tutorialSteps[currentStep].expectedAction === 'tab' && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 rounded-xl shadow-lg text-center">
                      <p className="text-white text-lg">
                        {tutorialSteps[currentStep].instruction}
                      </p>
                      <p className="text-white text-sm mt-1">
                        실제 학습 탭(단어, 문법, 표현)을 눌러 기능을 체험해봐!
                      </p>
                      <button
                        onClick={handleTabPanelConfirm}
                        className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        확인
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
        </div>
      </div>

      {/* 피드백 알림 – 좌우 중앙 */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-teal-400 to-blue-400 px-6 py-4 rounded-xl shadow-lg">
              <p className="text-white text-lg font-semibold text-center">
                {feedbackMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 튜토리얼 완료 모달 */}
      <AnimatePresence>
        {tutorialComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl shadow-2xl text-center max-w-xs mx-auto">
              <p className="text-3xl font-bold text-white mb-4">
                튜토리얼 완료!
              </p>
              <p className="text-lg text-white mb-6">
                모든 기능을 다 익혔어. 계속 체험할 수 있어.
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => setTutorialComplete(false)}
                  className="px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  계속 체험하기
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
