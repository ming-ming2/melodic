// pages/lyrics/[id].tsx
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'
import YouTubePlayer from '@/components/lyrics/YouTubePlayer'
import LyricsCard from '@/components/lyrics/LyricsCard'
import { SAMPLE_LYRICS } from '@/utils/dummyData'

export default function LyricsPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{SAMPLE_LYRICS.title} - Melodic</title>
      </Head>

      <div className="min-h-screen bg-gray-950">
        {/* 상단 네비게이션 */}
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

        {/* 메인 콘텐츠 영역 */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 왼쪽: 유튜브 영상 */}
            <div className="lg:w-1/2">
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden sticky top-24">
                <YouTubePlayer videoId={SAMPLE_LYRICS.youtube_id} />
              </div>
            </div>

            {/* 오른쪽: 학습 카드 */}
            <div className="lg:w-1/2">
              <LyricsCard lyrics={SAMPLE_LYRICS.lyrics_analysis} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
