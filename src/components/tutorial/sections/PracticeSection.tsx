import React, { useState } from 'react'
import { motion } from 'framer-motion'
import FeatureSections from './FeatureSections'
import DemoLyricsPage from './DemoLyricsPage'

const PracticeSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<
    'overview' | 'song-learning' | 'word-learning'
  >('overview')

  const handleFeatureSelect = (feature: 'song-learning' | 'word-learning') => {
    setSelectedFeature(feature)
  }

  const handleBackToOverview = () => {
    setSelectedFeature('overview')
  }

  // 튜토리얼 완료 핸들러 추가
  const handleTutorialComplete = () => {
    // TODO: 튜토리얼 완료 후 처리 로직 (예: 다음 화면으로 이동 등)
    setSelectedFeature('overview')
  }

  // 실시간 노래 학습 렌더링
  if (selectedFeature === 'song-learning') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-gray-950 z-50 overflow-hidden"
      >
        <DemoLyricsPage
          onBack={handleBackToOverview}
          onComplete={handleTutorialComplete}
        />
      </motion.div>
    )
  }

  // 기본 개요 화면
  return (
    <div className="w-full">
      <FeatureSections onFeatureSelect={handleFeatureSelect} />
    </div>
  )
}

export default PracticeSection
