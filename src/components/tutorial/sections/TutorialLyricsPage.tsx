import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer'
import LyricsCard from '@/components/lyrics/LyricsCard'
import { TUTORIAL_SONG_DATA } from '@/utils/tutorialDummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// 튜토리얼 단계 타입
type TutorialStep =
  | 'loading'
  | 'initial-pause'
  | 'play-button'
  | 'repeat-button'
  | 'lyrics-navigation'
  | 'completed'

interface TimedLyric extends LyricLine {
  timestamp: {
    start: number
    end: number
  }
  similarity: number
}

interface TutorialLyricsPageProps {
  onBack: () => void
  onComplete: () => void
}

// 튜토리얼 가이드 컴포넌트
const TutorialGuide: React.FC<{
  step: TutorialStep
  onNext: () => void
}> = ({ step, onNext }) => {
  const guideVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  }

  const renderGuide = () => {
    switch (step) {
      case 'loading':
        return <LoadingSpinner />

      case 'initial-pause':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
          >
            <div className="bg-gray-900 p-8 rounded-2xl max-w-md text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎵 멜로딕 학습 준비
              </h2>
              <p className="text-gray-400 mb-6">
                음악과 함께 언어를 배워볼까요? 재생 버튼을 눌러 학습을
                시작해주세요!
              </p>
              <button
                onClick={onNext}
                className="w-full bg-accent-600 text-white py-3 rounded-xl hover:bg-accent-700"
              >
                시작하기
              </button>
            </div>
          </motion.div>
        )

      case 'play-button':
        return (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-1/2 right-[calc(50%+250px)] transform -translate-y-1/2"
            >
              <div className="bg-black/70 p-4 rounded-xl text-white flex items-center space-x-4 pointer-events-auto">
                <ArrowRight className="w-8 h-8 text-accent-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg">재생 버튼</h3>
                  <p className="text-sm text-gray-300">
                    이 버튼을 눌러 노래를 시작하세요!
                  </p>
                </div>
              </div>
            </motion.div>

            <div
              className="absolute top-1/2 right-[calc(50%+100px)] transform -translate-y-1/2 
              w-16 h-16 border-4 border-accent-500 rounded-full animate-ping"
            />
          </div>
        )

      case 'repeat-button':
        return (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute bottom-1/2 left-[calc(50%+250px)] transform translate-y-1/2"
            >
              <div className="bg-black/70 p-4 rounded-xl text-white flex items-center space-x-4 pointer-events-auto">
                <ArrowRight className="w-8 h-8 text-accent-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg">반복 버튼</h3>
                  <p className="text-sm text-gray-300">
                    어려운 부분을 반복해서 학습할 수 있어요!
                  </p>
                </div>
              </div>
            </motion.div>

            <div
              className="absolute bottom-1/2 left-[calc(50%+100px)] transform translate-y-1/2 
              w-16 h-16 border-4 border-accent-500 rounded-full animate-ping"
            />
          </div>
        )

      case 'completed':
        return (
          <motion.div
            variants={guideVariants}
            initial="hidden"
            animate="visible"
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
          >
            <div className="bg-gray-900 p-8 rounded-2xl max-w-md text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎉 튜토리얼 완료!
              </h2>
              <p className="text-gray-400 mb-6">
                이제 멜로딕으로 즐겁게 언어를 학습할 준비가 되셨어요!
              </p>
              <button
                onClick={onNext}
                className="w-full bg-accent-600 text-white py-3 rounded-xl hover:bg-accent-700"
              >
                학습 시작하기
              </button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return renderGuide()
}

const TutorialLyricsPage: React.FC<TutorialLyricsPageProps> = ({
  onBack,
  onComplete,
}) => {
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('loading')
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timedLyrics, setTimedLyrics] = useState<TimedLyric[]>([])
  const [isUserNavigation, setIsUserNavigation] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  const playerRef = useRef<any>(null)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAutoUpdatedIndexRef = useRef<number>(-1)

  // 가사 초기화 및 로딩
  useEffect(() => {
    async function initializeLyrics() {
      try {
        const captions = await getVideoCaption(TUTORIAL_SONG_DATA.youtube_id)
        const matchedLyrics = matchLyricsWithCaptions(
          TUTORIAL_SONG_DATA.lyrics_analysis,
          captions
        )
        setTimedLyrics(matchedLyrics)
        setCurrentIndex(0)
        setIsLoading(false)
        setTutorialStep('initial-pause')
      } catch (error) {
        console.error('Failed to initialize lyrics:', error)
        const defaultTimedLyrics = TUTORIAL_SONG_DATA.lyrics_analysis.map(
          (lyric, index) => ({
            ...lyric,
            timestamp: {
              start: index * 3,
              end: (index + 1) * 3,
            },
            similarity: 0,
          })
        )
        setTimedLyrics(defaultTimedLyrics)
        setCurrentIndex(0)
        setIsLoading(false)
        setTutorialStep('initial-pause')
      }
    }

    initializeLyrics()
  }, [])

  // 시간 업데이트 핸들러
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!isLoading && timedLyrics.length > 0 && !isUserNavigation) {
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
    },
    [isLoading, timedLyrics, currentIndex, isUserNavigation]
  )

  // 수동 인덱스 변경 핸들러
  const handleManualIndexChange = useCallback((newIndex: number) => {
    setIsUserNavigation(true)
    setCurrentIndex(newIndex)

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    navigationTimeoutRef.current = setTimeout(() => {
      setIsUserNavigation(false)
    }, 500)
  }, [])

  // 플레이어 준비 상태 핸들러
  const handlePlayerReady = () => {
    setIsPlayerReady(true)
    // 초기에는 플레이어 일시정지
    playerRef.current?.pauseVideo()
  }

  // 튜토리얼 단계 진행 핸들러
  const handleNextStep = () => {
    const stepProgression: TutorialStep[] = [
      'initial-pause',
      'play-button',
      'repeat-button',
      'completed',
    ]

    const currentStepIndex = stepProgression.indexOf(tutorialStep)

    if (currentStepIndex < stepProgression.length - 1) {
      const nextStep = stepProgression[currentStepIndex + 1]
      setTutorialStep(nextStep)

      // 각 단계별 특별한 처리
      switch (nextStep) {
        case 'play-button':
          // 플레이어 멈추기
          playerRef.current?.pauseVideo()
          break
        case 'repeat-button':
          // 플레이어 다시 시작
          playerRef.current?.playVideo()
          break
        case 'completed':
          // 마지막 단계에서는 onComplete 호출
          onComplete()
          break
      }
    }
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* 상단 헤더 */}
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
                노래 학습 튜토리얼
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 튜토리얼 가이드 */}
      <TutorialGuide step={tutorialStep} onNext={handleNextStep} />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto flex-1">
        {/* YouTube 플레이어 영역 */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-14">
          <div className="aspect-video w-full">
            {isPlayerReady && timedLyrics.length > 0 && (
              <YouTubePlayer
                ref={playerRef}
                videoId={TUTORIAL_SONG_DATA.youtube_id}
                currentLyric={timedLyrics[currentIndex].timestamp}
                onTimeUpdate={handleTimeUpdate}
                isUserNavigation={isUserNavigation}
                onPlayerReady={handlePlayerReady}
              />
            )}
          </div>
        </div>

        {/* 가사 카드 영역 */}
        <div className="w-full lg:w-1/2 bg-gray-900 lg:h-[calc(100vh-56px)] lg:overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <LyricsCard
              lyrics={timedLyrics}
              currentIndex={currentIndex}
              onIndexChange={handleManualIndexChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialLyricsPage
