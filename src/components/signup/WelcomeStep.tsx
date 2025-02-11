// components/signup/WelcomeStep.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface WelcomeStepProps {
  nickname: string
  onComplete: () => void
}

export default function WelcomeStep({
  nickname,
  onComplete,
}: WelcomeStepProps) {
  return (
    <div className="max-w-md mx-auto w-full text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="mb-8 inline-block"
      >
        <div className="w-24 h-24 bg-accent-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          환영합니다, {nickname}님! 🎉
        </h2>
        <p className="text-gray-400 mb-8">
          이제 음악과 함께 새로운 언어를 배워볼까요?
        </p>

        <motion.button
          onClick={onComplete}
          className="w-full bg-accent-600 text-white py-4 rounded-xl font-medium hover:bg-accent-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🚀 지금 시작하기
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-800 rounded-xl"
        >
          <h3 className="text-white font-medium mb-2">알고 계셨나요? 🤔</h3>
          <p className="text-gray-400 text-sm">
            음악을 통한 언어 학습은 일반적인 학습 방법보다 최대 40% 더
            효과적이라고 해요!
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
