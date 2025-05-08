// components/tutorial/sections/CoreFeaturesSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Music, Grid, Repeat, Star, FileText } from 'lucide-react'

interface CoreFeaturesProps {
  onPremiumFeatureClick: () => void
}

const FEATURES = [
  {
    icon: Book,
    title: '상세 가사 분석',
    description: '노래의 각 문장을 깊이 있게 분석합니다.',
    isPremium: false,
  },
  {
    icon: Music,
    title: '발음 학습',
    description: '원어민 수준의 발음을 익힐 수 있어요.',
    isPremium: true,
  },
  {
    icon: Grid,
    title: '단어장 관리',
    description: '학습한 단어를 체계적으로 정리합니다.',
    isPremium: false,
  },
  {
    icon: Repeat,
    title: '반복 학습',
    description: '어려운 문장을 집중적으로 학습할 수 있어요.',
    isPremium: true,
  },
  {
    icon: Star,
    title: '표현 분석',
    description: '문화적 맥락을 포함한 표현을 배웁니다.',
    isPremium: true,
  },
  {
    icon: FileText,
    title: '문법 노트',
    description: '문장의 문법적 구조를 상세히 분석합니다.',
    isPremium: false,
  },
]

// 줄바꿈 처리를 위한 함수
function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

export default function CoreFeaturesSection({
  onPremiumFeatureClick,
}: CoreFeaturesProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] py-8">
      <div className="text-center mb-12">
        <h2
          className="text-2xl font-bold text-white mb-4"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText('멜로딕의 핵심 기능')}
        </h2>
        <p
          className="text-gray-400 max-w-2xl mx-auto"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText('음악을 통해 언어를 배우는 가장 즐거운 방법')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            onHoverStart={() => setHoveredFeature(index)}
            onHoverEnd={() => setHoveredFeature(null)}
            onClick={feature.isPremium ? onPremiumFeatureClick : undefined}
            className={`
              relative 
              p-6 
              rounded-xl 
              border 
              transition-all 
              duration-300
              cursor-pointer
              ${
                hoveredFeature === index
                  ? 'bg-gray-800 border-accent-600 shadow-lg shadow-accent-500/10'
                  : feature.isPremium
                    ? 'bg-gray-900 border-yellow-600/30'
                    : 'bg-gray-900 border-gray-800'
              }
            `}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <feature.icon
                className={`
                  w-12 h-12 mb-4
                  ${feature.isPremium ? 'text-yellow-500' : 'text-accent-500'}
                `}
              />
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p
                className="text-gray-300"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                {formatKoreanText(feature.description)}
              </p>
            </div>
            {feature.isPremium && (
              <div className="absolute top-2 right-2 text-yellow-500">
                <Star className="w-5 h-5" fill="currentColor" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
