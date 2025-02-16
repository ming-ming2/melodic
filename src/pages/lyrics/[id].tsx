import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer'
import LyricsCard from '@/components/lyrics/LyricsCard'
import { TUTORIAL_SONG_DATA } from '@/utils/tutorialDummyData'
import { getVideoCaption, matchLyricsWithCaptions } from '@/utils/youtubeUtils'
import { LyricLine } from '@/types/lyrics'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { ChevronLeft } from 'lucide-react'

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

  return (
    <>
      <Head>
        <title>{TUTORIAL_SONG_DATA.title} - Melodic</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md border-b border-gray-800 rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-accent-400 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-medium text-white">
                {TUTORIAL_SONG_DATA.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto">
        <div className="w-full lg:w-1/2">
          <div className="w-full lg:sticky lg:top-14">
            <div className="aspect-video w-full">
              {!isLoading && timedLyrics.length > 0 && (
                <YouTubePlayer
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
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-gray-900 lg:min-h-screen flex flex-col">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex-grow overflow-auto">
              <LyricsCard
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
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
