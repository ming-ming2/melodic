// components/tutorial/sections/IntroSection.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Music, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react'

function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

const swipeVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
  }),
}

export default function IntroSection() {
  const [currentHighlight, setCurrentHighlight] = useState(0)
  const [direction, setDirection] = useState(0)

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
    setDirection(1)
    setCurrentHighlight((prev) =>
      prev === serviceHighlights.length - 1 ? 0 : prev + 1
    )
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentHighlight((prev) =>
      prev === 0 ? serviceHighlights.length - 1 : prev - 1
    )
  }

  return (
    <div className="container mx-auto px-2 flex flex-col">
      <div className="text-center mb-4">
        <Image
          src="/logo.png"
          alt="Melodic 로고"
          width={80}
          height={40}
          className="mx-auto mb-2"
        />
        <p
          className="text-sm text-gray-400 max-w-xl mx-auto"
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {formatKoreanText(
            '멜로딕은 음악을 통해 언어 학습의 즐거움을 재정의합니다.'
          )}
        </p>
      </div>

      {/* 드래그 가능한 영역을 flex-1 중앙 정렬 대신 상단에 배치 */}
      <div className="relative mb-4">
        <motion.div
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) handleNext()
            else if (offset.x > 50) handlePrev()
          }}
          className="w-full max-w-md mx-auto relative"
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentHighlight}
              custom={direction}
              variants={swipeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
              }}
              className="w-full bg-gray-800 rounded-xl p-6 text-center relative"
            >
              <div className="mb-6 flex justify-center">
                {React.createElement(serviceHighlights[currentHighlight].icon, {
                  className: 'w-12 h-12 text-accent-500',
                })}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {serviceHighlights[currentHighlight].title}
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                {formatKoreanText(
                  serviceHighlights[currentHighlight].description
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 데스크톱용 화살표 버튼 */}
        <button
          onClick={handlePrev}
          className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="flex justify-center mt-2 space-x-2">
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
