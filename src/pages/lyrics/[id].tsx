// pages/lyrics/[id].tsx
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer/index'
import LyricsCard from '@/components/lyrics/LyricsCard/index'
import { SAMPLE_LYRICS } from '@/utils/dummyData'
import {
  getVideoCaption,
  matchLyricsWithCaptions,
  generateDefaultTimestamps,
} from '@/utils/youtubeUtils'
import useLyricsStore from '@/stores/lyricsStore'

export default function LyricsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const {
    currentIndex,
    timestamps,
    isRepeatMode,
    setCurrentIndex,
    setTimestamps,
  } = useLyricsStore()

  // 자막 정보 가져오기
  useEffect(() => {
    async function fetchCaptions() {
      try {
        setIsLoading(true)
        const captions = await getVideoCaption(SAMPLE_LYRICS.youtube_id)
        const lyrics = SAMPLE_LYRICS.lyrics_analysis.map((l) => l.original)

        if (captions.length > 0) {
          const newTimestamps = matchLyricsWithCaptions(lyrics, captions)
          setTimestamps(newTimestamps)
        } else {
          const defaultTimestamps = generateDefaultTimestamps(lyrics.length)
          setTimestamps(defaultTimestamps)
        }
      } catch (error) {
        console.error('Error loading captions:', error)
        const defaultTimestamps = generateDefaultTimestamps(
          SAMPLE_LYRICS.lyrics_analysis.length
        )
        setTimestamps(defaultTimestamps)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaptions()
  }, [setTimestamps])

  // 현재 시간에 따른 가사 인덱스 업데이트
  const handleTimeUpdate = (currentTime: number) => {
    const newIndex = timestamps.findIndex(
      (ts) => currentTime >= ts.start && currentTime < ts.end
    )
    if (newIndex !== -1 && newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

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
                <YouTubePlayer
                  videoId={SAMPLE_LYRICS.youtube_id}
                  onTimeUpdate={handleTimeUpdate}
                  initialStartTime={timestamps[currentIndex]?.start}
                  initialEndTime={timestamps[currentIndex]?.end}
                  isRepeatMode={isRepeatMode}
                />
              </div>
            </div>

            <div className="lg:w-1/2">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 bg-gray-800 rounded-xl">
                  <div className="text-white">로딩 중...</div>
                </div>
              ) : (
                <LyricsCard
                  lyrics={SAMPLE_LYRICS.lyrics_analysis}
                  currentIndex={currentIndex}
                  onIndexChange={setCurrentIndex}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
