// components/tutorial/sections/PracticeSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import DemoLyricsPage from './DemoLyricsPage'

interface PracticeSectionProps {
  onPremiumFeatureClick: () => void
}

const PracticeSection = ({ onPremiumFeatureClick }: PracticeSectionProps) => {
  return (
    <div className="w-full">
      {' '}
      {/* container mx-auto 대신 w-full 사용 */}
      <div className="text-center mb-8 p-8">
        {' '}
        {/* 약간의 패딩 추가 */}
        <h2 className="text-2xl font-bold text-white mb-4">
          실제 학습 경험 체험하기
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          멜로딕에서 어떻게 노래로 언어를 학습하는지 직접 체험해보세요.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 w-full" // w-full 추가
      >
        <DemoLyricsPage />
      </motion.div>
      <div className="text-center mt-8 px-4">
        {' '}
        {/* 패딩 추가 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPremiumFeatureClick}
          className="bg-accent-600 text-white px-6 py-3 rounded-xl hover:bg-accent-700 transition-colors"
        >
          더 많은 학습 기능 체험하기
        </motion.button>
      </div>
    </div>
  )
}
export default PracticeSection
