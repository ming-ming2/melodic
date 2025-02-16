import React from 'react'
import { motion } from 'framer-motion'
import { Music, BookOpen } from 'lucide-react'

interface FeatureSectionProps {
  onFeatureSelect: (feature: 'song-learning' | 'word-learning') => void
}

// 줄바꿈 처리를 위한 함수 (FAQSection에서 가져옴)
function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

const FeatureSections: React.FC<FeatureSectionProps> = ({
  onFeatureSelect,
}) => {
  const features = [
    {
      icon: Music,
      title: '실시간 노래 학습',
      description: '노래와 함께 실시간으로 언어를 학습해보세요.',
      color: 'bg-gradient-to-br from-accent-500/20 to-accent-500/10',
      onClick: () => onFeatureSelect('song-learning'),
    },
    {
      icon: BookOpen,
      title: '나만의 단어장',
      description: '과학적 학습으로 오래 기억하기.',
      color: 'bg-gradient-to-br from-primary-500/20 to-primary-500/10',
      onClick: () => onFeatureSelect('word-learning'),
    },
  ]

  return (
    <div className="w-full space-y-6 px-4 py-8">
      <div className="text-center">
        <h2
          className="text-2xl font-bold text-white mb-4"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText('멜로딕 학습 방법')}
        </h2>
        <p
          className="text-gray-400 max-w-2xl mx-auto"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText(
            '혁신적인 학습 방식으로 언어의 세계를 탐험해보세요.'
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.2,
              type: 'spring',
              stiffness: 300,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            onClick={feature.onClick}
            className={`
              ${feature.color} 
              rounded-2xl 
              p-6 
              border 
              border-gray-700/30
              hover:border-accent-500/50
              transition-all
              duration-300
              cursor-pointer
              group
            `}
          >
            <div className="flex items-center gap-4 mb-4">
              <feature.icon className="w-10 h-10 text-white group-hover:text-accent-400 transition-colors" />
              <h3
                className="text-xl font-semibold text-white group-hover:text-accent-300 transition-colors"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                {formatKoreanText(feature.title)}
              </h3>
            </div>
            <p
              className="text-gray-300 group-hover:text-white transition-colors"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
            >
              {formatKoreanText(feature.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FeatureSections
