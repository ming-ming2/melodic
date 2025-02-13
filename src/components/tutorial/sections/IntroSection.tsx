// components/tutorial/sections/IntroSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function IntroSection() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col justify-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center"
      >
        <Image
          src="/logo.png"
          alt="Melodic 로고"
          width={100}
          height={50}
          className="mx-auto mb-4"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
          음악으로 배우는 언어
        </h1>
        <p className="text-sm md:text-base text-gray-400 mb-6">
          좋아하는 노래를 통해 자연스럽게 언어를 학습할 수 있는 플랫폼
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-gray-800 p-3 rounded-xl text-center">
            <div className="text-2xl mb-1">🎵</div>
            <h3 className="text-xs md:text-sm text-white font-semibold mb-1">
              노래로 학습
            </h3>
            <p className="text-xs text-gray-400">즐겁게 언어 배우기</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl text-center">
            <div className="text-2xl mb-1">📚</div>
            <h3 className="text-xs md:text-sm text-white font-semibold mb-1">
              맞춤형 학습
            </h3>
            <p className="text-xs text-gray-400">나만의 학습 방식</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 text-sm bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            건너뛰기
          </button>
          <button className="w-full py-2 text-sm bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
            튜토리얼 시작하기
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
