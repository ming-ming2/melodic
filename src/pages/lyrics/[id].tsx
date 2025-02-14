// pages/lyrics/[id].tsx
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer'
import LyricsCard from '@/components/lyrics/LyricsCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { getVideoCaption, detectLanguage } from '@/utils/youtubeUtils'
import { processVideoLyrics } from '@/utils/lyricsProcessor'
import type { LyricLine } from '@/types/lyrics'

export default function LyricsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const videoId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [isUserNavigation, setIsUserNavigation] = useState(false)
  const [videoInfo, setVideoInfo] = useState<{
    title: string
    channelTitle: string
  } | null>(null)

  useEffect(() => {
    async function initializeLyrics() {
      if (!videoId) return

      try {
        setIsLoading(true)
        setError(null)

        // 1. 비디오 정보 가져오기
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        )
        const data = await response.json()

        if (!data.items?.length) {
          throw new Error('비디오를 찾을 수 없습니다.')
        }

        const videoInfo = {
          title: data.items[0].snippet.title,
          channelTitle: data.items[0].snippet.channelTitle,
        }
        setVideoInfo(videoInfo)

        // 2. 자막 가져오기
        const captions = await getVideoCaption(videoId)
        if (!captions.length) {
          throw new Error('자막을 찾을 수 없습니다.')
        }

        // 3. 언어 감지
        const language = detectLanguage(captions[0].text)
        const songTitle = searchParams.get('title') || videoInfo.title
        const artist = searchParams.get('artist') || videoInfo.channelTitle

        // 4. 가사 처리 및 분석
        const processedData = await processVideoLyrics(
          videoId,
          songTitle,
          artist,
          captions.map((caption) => ({
            text: caption.text,
            start: parseFloat(caption.start),
            end: parseFloat(caption.start) + parseFloat(caption.dur),
          }))
        )

        setLyrics(processedData.lyrics)
        setCurrentIndex(0)
      } catch (error) {
        console.error('Failed to initialize lyrics:', error)
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    initializeLyrics()
  }, [videoId, searchParams])

  const handleTimeUpdate = (currentTime: number) => {
    if (!isLoading && lyrics.length > 0 && !isUserNavigation) {
      const newIndex = lyrics.findIndex(
        (lyric) =>
          currentTime >= lyric.timestamp.start &&
          currentTime < lyric.timestamp.end
      )

      if (newIndex !== -1 && newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  const handleManualIndexChange = (newIndex: number) => {
    setIsUserNavigation(true)
    setCurrentIndex(newIndex)
    setTimeout(() => setIsUserNavigation(false), 500)
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg max-w-md text-center">
            <h2 className="text-lg font-medium mb-2">오류가 발생했습니다</h2>
            <p>{error}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{videoInfo?.title || '로딩 중...'} - Melodic</title>
        <meta name="theme-color" content="#111827" />
      </Head>

      <AppLayout showBottomNav={false}>
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:max-w-7xl lg:mx-auto">
          <div className="w-full lg:w-1/2">
            <div className="w-full lg:sticky lg:top-14">
              <div className="aspect-video w-full">
                {!isLoading && lyrics.length > 0 && (
                  <YouTubePlayer
                    videoId={videoId}
                    currentLyric={lyrics[currentIndex].timestamp}
                    onTimeUpdate={handleTimeUpdate}
                    isUserNavigation={isUserNavigation}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-gray-900 lg:h-[calc(100vh-56px)] lg:overflow-hidden">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <LyricsCard
                lyrics={lyrics}
                currentIndex={currentIndex}
                onIndexChange={handleManualIndexChange}
              />
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}
