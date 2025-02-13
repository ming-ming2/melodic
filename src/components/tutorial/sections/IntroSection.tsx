// components/tutorial/sections/IntroSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function IntroSection() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Melodic 로고"
            width={120}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            음악으로 배우는 새로운 언어 학습
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-6">
            멜로딕은 좋아하는 노래를 통해 자연스럽게 언어를 학습할 수 있는
            혁신적인 플랫폼입니다.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-gray-800 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">🎵</div>
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
              노래로 학습
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              좋아하는 노래로 언어 학습
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
              맞춤형 학습
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">
              당신의 레벨에 맞는 노래 추천
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-800 text-gray-400 py-3 rounded-xl hover:bg-gray-700 transition-colors"
          >
            건너뛰기
          </button>
          <button className="w-full bg-accent-600 text-white py-3 rounded-xl hover:bg-accent-700 transition-colors">
            튜토리얼 시작하기
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
