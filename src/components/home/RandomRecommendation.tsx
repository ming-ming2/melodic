// components/home/RandomRecommendation.tsx
import React from 'react'
import { motion } from 'framer-motion'
import useSongStore from '@/stores/songStore'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RandomRecommendation: React.FC = () => {
  const { randomRecommendation } = useSongStore()
  const router = useRouter()

  if (!randomRecommendation) return null

  const handleClick = () => {
    router.push('/lyrics/betelgeuse_yuuri')
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-72 rounded-2xl overflow-hidden group"
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-50 transition-all duration-300 group-hover:brightness-75"
        style={{ backgroundImage: `url(${randomRecommendation.albumCover})` }}
      />

      {/* 오버레이 콘텐츠 */}
      <div className="absolute inset-0 backdrop-blur-md bg-opacity-40 flex flex-col justify-end p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-between items-end"
        >
          <div>
            <div className="text-sm mb-2 text-primary-300 animate-pulse">
              오늘의 추천곡 🎶
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {randomRecommendation.title}
            </h2>
            <p className="text-lg text-gray-300">
              {randomRecommendation.artist}
            </p>
          </div>

          {/* 학습 시작 버튼 */}
          <button
            onClick={handleClick} // 클릭 핸들러 추가
            className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors"
          >
            <Play className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default RandomRecommendation
