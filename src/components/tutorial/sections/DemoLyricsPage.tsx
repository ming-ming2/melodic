// pages/lyrics/[id].tsx (DemoLyricsPage)
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer'
import LyricsCard from '@/components/lyrics/LyricsCard'
import { TUTORIAL_SONG_DATA } from '@/utils/tutorialDummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface TimedLyric extends LyricLine {
  timestamp: {
    start: number
    end: number
  }
  similarity: number
}

const DemoLyricsPage = ({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: () => void
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timedLyrics, setTimedLyrics] = useState<TimedLyric[]>([])
  const [isUserNavigation, setIsUserNavigation] = useState(false)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAutoUpdatedIndexRef = useRef<number>(-1)

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
            timestamp: {
              start: index * 3,
              end: (index + 1) * 3,
            },
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

  return (
    <div className="h-screen flex flex-col">
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
                노래 학습 체험하기
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto flex-1">
        {/* YouTube Player 영역 */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-14">
          <div className="aspect-video w-full">
            {!isLoading && timedLyrics.length > 0 && (
              <YouTubePlayer
                videoId={TUTORIAL_SONG_DATA.youtube_id}
                currentLyric={timedLyrics[currentIndex].timestamp}
                onTimeUpdate={handleTimeUpdate}
                isUserNavigation={isUserNavigation}
                onPlayerReady={() => {
                  // 필요하다면 플레이어 준비 완료 시 동작 추가 가능
                }}
              />
            )}
          </div>
        </div>

        {/* 가사 카드 영역 */}
        <div className="w-full lg:w-1/2 bg-gray-900 lg:h-[calc(100vh-56px)] lg:overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <LyricsCard
                lyrics={timedLyrics}
                currentIndex={currentIndex}
                onIndexChange={handleManualIndexChange}
              />
              {/* 하단 내비게이션 바 (데스크톱 전용) */}
              <div className="hidden lg:flex justify-between items-center p-4 border-t border-gray-800 bg-gray-900">
                <button
                  onClick={() =>
                    handleManualIndexChange(
                      currentIndex > 0
                        ? currentIndex - 1
                        : timedLyrics.length - 1
                    )
                  }
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="text-sm text-gray-400">
                  {currentIndex + 1} / {timedLyrics.length}
                </div>
                <button
                  onClick={() =>
                    handleManualIndexChange(
                      currentIndex < timedLyrics.length - 1
                        ? currentIndex + 1
                        : 0
                    )
                  }
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DemoLyricsPage
