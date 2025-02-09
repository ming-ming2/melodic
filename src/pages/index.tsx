// pages/index.tsx
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import SearchBar from '@/components/home/SearchBar'
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
        <div className="px-4 py-3 space-y-6">
          {/* 검색 */}
          <div className="sticky top-14 z-10">
            <div className="pt-2 pb-3 bg-transparent">
              <SearchBar />
            </div>
          </div>

          {/* 오늘의 추천곡 */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">오늘의 추천곡</h2>
            <RandomRecommendation />
          </section>

          {/* 인기 노래 */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-white">인기 노래</h2>
              <button className="text-sm text-gray-400">더보기</button>
            </div>
            <div className="-mx-4">
              <PopularSongsList />
            </div>
          </section>

          {/* 최근 학습한 노래 */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-white">최근 학습</h2>
              <button className="text-sm text-gray-400">전체보기</button>
            </div>
            <RecentLearningList />
          </section>
        </div>
      </AppLayout>
    </>
  )
}
