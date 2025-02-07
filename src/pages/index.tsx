// pages/index.tsx
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/home/SearchBar'
import RandomRecommendation from '@/components/home/RandomRecommendation'
import PopularSongsList from '@/components/home/PopularSongsList'
import RecentLearningList from '@/components/home/RecentLearningList'
import useSongStore from '@/stores/songStore'
import { DUMMY_POPULAR_SONGS } from '@/utils/dummyData'

const HomePage: React.FC = () => {
  const { setPopularSongs, setRandomRecommendation } = useSongStore()

  useEffect(() => {
    // 초기 데이터 로드 시뮬레이션
    useSongStore.getState().initialize()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-white p-4 space-y-6 max-w-4xl mx-auto"
    >
      <SearchBar />
      <RandomRecommendation />
      <PopularSongsList />
      <RecentLearningList />
    </motion.div>
  )
}

export default HomePage
