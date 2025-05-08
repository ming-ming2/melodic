// pages/index.tsx
import React, { useEffect } from 'react'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import RandomRecommendation from '@/components/home/RandomRecommendation'
import PopularSongsList from '@/components/home/PopularSongsList'
import RecentLearningList from '@/components/home/RecentLearningList'
import useSongStore from '@/stores/songStore'

export default function HomePage() {
  useEffect(() => {
    useSongStore.getState().initialize()
  }, [])

  return (
    <>
      <Head>
        <title>Melodic - 음악으로 배우는 새로운 언어</title>
        <meta name="theme-color" content="#111827" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <AppLayout>
        {/* 여기에 max-width와 mx-auto 추가하여 중앙 정렬된 컨테이너 만들기 */}
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* 오늘의 추천곡 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">오늘의 추천곡</h2>
            <RandomRecommendation />
          </section>

          {/* 인기 노래 */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <button className="text-sm text-gray-400">더보기</button>
            </div>
            <div className="-mx-4">
              <PopularSongsList />
            </div>
          </section>

          {/* 최근 학습한 노래 */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <button className="text-sm text-gray-400">전체보기</button>
            </div>
            <RecentLearningList />
          </section>
        </div>
      </AppLayout>
    </>
  )
}
