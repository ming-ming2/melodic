// components/tutorial/sections/CoreFeaturesSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Music, Grid, Repeat, Star, FileText } from 'lucide-react'

interface CoreFeaturesProps {
  onPremiumFeatureClick: () => void
}

const FEATURES = [
  {
    icon: BookOpen,
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

export default function CoreFeaturesSection({
  onPremiumFeatureClick,
}: CoreFeaturesProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          멜로딕의 핵심 기능
        </h2>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          음악을 통해 언어를 배우는 가장 즐거운 방법, 멜로딕의 혁신적인 기능들을
          만나보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            onHoverStart={() => setHoveredFeature(index)}
            onHoverEnd={() => setHoveredFeature(null)}
            className={`
              relative 
              p-5 
              rounded-xl 
              border 
              transition-all 
              duration-300
              ${
                hoveredFeature === index
                  ? 'bg-gray-800 border-accent-600 shadow-lg'
                  : 'bg-gray-900 border-gray-800'
              }
            `}
          >
            <div className="flex items-center mb-4">
              <feature.icon
                className={`
                  w-6 md:w-8 h-6 md:h-8 mr-3 
                  ${feature.isPremium ? 'text-yellow-500' : 'text-accent-500'}
                `}
              />
              <h3 className="text-base md:text-lg font-semibold text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-400 mb-4">
              {feature.description}
            </p>
            {feature.isPremium && (
              <button
                onClick={onPremiumFeatureClick}
                className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-400"
              >
                <Star className="w-5 h-5" fill="currentColor" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
