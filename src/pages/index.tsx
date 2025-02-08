// pages/index.tsx
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import NavigationBar from '@/components/common/NavigationBar'
import SearchBar from '@/components/home/SearchBar'
import TutorialBanner from '@/components/home/TutorialBanner'
import RandomRecommendation from '@/components/home/RandomRecommendation'
import PopularSongsList from '@/components/home/PopularSongsList'
import RecentLearningList from '@/components/home/RecentLearningList'
import useSongStore from '@/stores/songStore'
import useAuthStore from '@/stores/authStore'
import useOnboardingStore from '@/stores/onboardingStore'

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore()
  const { hasSeenTutorial } = useOnboardingStore()
  const recentLearnings = useSongStore((state) => state.recentLearnings)

  useEffect(() => {
    useSongStore.getState().initialize()
  }, [])

  return (
    <>
      <Head>
        <title>Melodic - 음악으로 배우는 새로운 언어</title>
        <meta
          name="description"
          content="좋아하는 노래로 즐겁게 새로운 언어를 배워보세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-950">
        <NavigationBar />
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 py-4"
          >
            <SearchBar />

            {!isAuthenticated && !hasSeenTutorial && <TutorialBanner />}

            <section>
              <h2 className="text-xl font-bold text-white mb-4">
                🎵 오늘의 추천곡
              </h2>
              <RandomRecommendation />
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                {isAuthenticated && (
                  <button className="text-gray-400 hover:text-white transition-colors text-sm">
                    더보기
                  </button>
                )}
              </div>
              <PopularSongsList />
            </section>

            {isAuthenticated && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  {recentLearnings.length > 0 && (
                    <button className="text-gray-400 hover:text-white transition-colors text-sm">
                      전체보기
                    </button>
                  )}
                </div>
                <RecentLearningList />
              </section>
            )}
          </motion.div>
        </div>

        <footer className="border-t border-gray-800 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center text-gray-400 text-sm">
              <p>© 2024 Melodic. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  이용약관
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보처리방침
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage
