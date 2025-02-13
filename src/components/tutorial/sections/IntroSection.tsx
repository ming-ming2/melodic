// components/tutorial/sections/IntroSection.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Music, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * formatKoreanText
 * 한국어 텍스트의 문장 구분(예: '다. ' '요. ' 등) 후 일반 공백을 non-breaking space로 대체하여,
 * 의미 단위가 한 문단으로 묶이도록 합니다.
 */
function formatKoreanText(text: string) {
  // ([.?!]) 뒤의 공백을 non-breaking space로 대체
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

export default function IntroSection() {
  const [currentHighlight, setCurrentHighlight] = useState(0)

  const serviceHighlights = [
    {
      icon: Music,
      title: '음악 기반 학습',
      description:
        '좋아하는 노래를 통해 자연스럽게 언어를 학습합니다. 문법, 발음, 표현을 실제 음악으로 익혀보세요.',
    },
    {
      icon: BookOpen,
      title: '맞춤형 학습 경로',
      description:
        '사용자의 언어 수준과 관심사에 맞는 노래를 추천합니다. 개인화된 학습 경험을 제공합니다.',
    },
    {
      icon: Star,
      title: '종합적인 언어 학습',
      description:
        '단순 번역을 넘어 문화적 맥락과 실용적인 표현을 배울 수 있습니다. 듣기, 읽기, 이해력을 종합적으로 향상시킵니다.',
    },
  ]

  const handleNext = () => {
    setCurrentHighlight((prev) =>
      prev === serviceHighlights.length - 1 ? 0 : prev + 1
    )
  }

  const handlePrev = () => {
    setCurrentHighlight((prev) =>
      prev === 0 ? serviceHighlights.length - 1 : prev - 1
    )
  }

  return (
    <div className="container mx-auto px-4  h-full flex flex-col">
      <div className="text-center mb-8">
        <Image
          src="/logo.png"
          alt="Melodic 로고"
          width={100}
          height={50}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          음악으로 만드는 언어 학습 혁명
        </h1>
        <p
          className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText(
            '멜로딕은 음악을 통해 언어 학습의 즐거움을 재정의합니다.'
          )}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHighlight}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md bg-gray-800 rounded-xl p-6 text-center relative"
          >
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={handlePrev}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                onClick={handleNext}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 flex justify-center">
              {React.createElement(serviceHighlights[currentHighlight].icon, {
                className: 'w-12 h-12 text-accent-500',
              })}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              {serviceHighlights[currentHighlight].title}
            </h3>
            <p
              className="text-gray-400 text-sm md:text-base leading-relaxed"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
            >
              {formatKoreanText(
                serviceHighlights[currentHighlight].description
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {serviceHighlights.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentHighlight === index ? 'bg-accent-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
