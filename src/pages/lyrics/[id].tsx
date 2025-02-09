// pages/lyrics/[id].tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer/index'
import LyricsCard from '@/components/lyrics/LyricsCard/index'
import { SAMPLE_LYRICS } from '@/utils/dummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import { useCallback, useRef } from 'react'

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

  // 자막 로드 및 매칭
  useEffect(() => {
    async function initializeLyrics() {
      try {
        setIsLoading(true)
        const captions = await getVideoCaption(SAMPLE_LYRICS.youtube_id)
        // console.log('Raw Captions:', captions)
        const matchedLyrics = matchLyricsWithCaptions(
          SAMPLE_LYRICS.lyrics_analysis,
          captions
        )
        // console.log('Matched Lyrics Before Set:', matchedLyrics)

        setTimedLyrics(matchedLyrics)
        setCurrentIndex(0)
        // console.log('Matched Lyrics After Set:', timedLyrics)
      } catch (error) {
        console.error('Failed to initialize lyrics:', error)
        // 에러 발생 시 기본 타임스탬프 생성
        const defaultTimedLyrics = SAMPLE_LYRICS.lyrics_analysis.map(
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

  // 현재 시간에 따른 가사 인덱스 업데이트
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!isLoading && timedLyrics.length > 0 && !isUserNavigation) {
        const newIndex = timedLyrics.findIndex(
          (lyric) =>
            currentTime >= lyric.timestamp.start &&
            currentTime < lyric.timestamp.end
        )

        // 자동 업데이트 로직 개선
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

  // 수동 인덱스 변경 핸들러 개선
  const handleManualIndexChange = useCallback((newIndex: number) => {
    // 사용자 네비게이션 명시적 설정
    setIsUserNavigation(true)
    setCurrentIndex(newIndex)

    // 일정 시간 후 자동으로 네비게이션 플래그 리셋
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    navigationTimeoutRef.current = setTimeout(() => {
      setIsUserNavigation(false)
    }, 500) // 0.5초 후 리셋 (필요에 따라 조정 가능)
  }, [])

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>{SAMPLE_LYRICS.title} - Melodic</title>
      </Head>

      <div className="min-h-screen bg-gray-950">
        <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            <h1 className="ml-4 text-lg font-bold text-white">
              {SAMPLE_LYRICS.title} - {SAMPLE_LYRICS.artist}
            </h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden sticky top-24">
                {!isLoading && timedLyrics.length > 0 && (
                  <YouTubePlayer
                    videoId={SAMPLE_LYRICS.youtube_id}
                    currentLyric={timedLyrics[currentIndex].timestamp}
                    onTimeUpdate={handleTimeUpdate}
                    isUserNavigation={isUserNavigation}
                  />
                )}
              </div>
            </div>

            <div className="lg:w-1/2">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 bg-gray-800 rounded-xl">
                  <div className="text-white">가사 로딩 중...</div>
                </div>
              ) : (
                <LyricsCard
                  lyrics={timedLyrics}
                  currentIndex={currentIndex}
                  onIndexChange={handleManualIndexChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
