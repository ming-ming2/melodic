// components/tutorial/sections/DemoLyricsPage.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
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

const DemoLyricsPage = () => {
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
    <div className="w-full">
      {' '}
      {/* 전체 너비로 확장 */}
      <div className="flex flex-col lg:flex-row w-full">
        {' '}
        {/* 너비 100% 보장 */}
        {/* YouTube Player Section */}
        <div className="w-full lg:w-1/2">
          <div className="w-full">
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
        {/* Lyrics Card Section */}
        <div className="w-full lg:w-1/2 bg-gray-900 h-[calc(100vh-10rem)] overflow-hidden">
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

export default DemoLyricsPage
