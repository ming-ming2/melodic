// pages/lyrics/[id].tsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer/index'
import LyricsCard from '@/components/lyrics/LyricsCard/index'
import { TUTORIAL_SONG_DATA } from '@/utils/tutorialDummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import LoadingSpinner from '@/components/common/LoadingSpinner' // 추가
interface TimedLyric extends LyricLine {
  timestamp: {
    start: number
    end: number
  }
  similarity: number
}

export default function LyricsPage() {
  const router = useRouter()
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
    <>
      <Head>
        <title>{TUTORIAL_SONG_DATA.title} - Melodic</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <AppLayout
        showBottomNav={false}
        headerTitle={TUTORIAL_SONG_DATA.title}
        onBack={() => router.back()}
      >
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto">
          {/* 유튜브 플레이어 영역 */}
          <div className="w-full lg:w-1/2">
            <div className="w-full lg:sticky lg:top-14">
              <div className="aspect-video w-full">
                {!isLoading && timedLyrics.length > 0 && (
                  <YouTubePlayer
                    videoId={TUTORIAL_SONG_DATA.youtube_id}
                    currentLyric={timedLyrics[currentIndex].timestamp}
                    onTimeUpdate={handleTimeUpdate}
                    isUserNavigation={isUserNavigation}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 가사 카드 영역 */}
          <div className="w-full lg:w-1/2 bg-gray-900 lg:min-h-screen flex flex-col">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex-grow overflow-auto">
                <LyricsCard
                  lyrics={timedLyrics}
                  currentIndex={currentIndex}
                  onIndexChange={handleManualIndexChange}
                />
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}
