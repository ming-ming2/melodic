// components/tutorial/sections/PremiumSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PremiumSection() {
  const [currentPlan, setCurrentPlan] = useState(0)

  const planDetails = [
    {
      type: '무료 플랜',
      features: [
        '하루 최대 3개 노래 학습',
        '광고 시청시 추가 학습 가능',
        '단어장, 문법노트 저장',
        '단어 및 기본 문법 분석',
      ],
      color: 'bg-gray-800',
      buttonText: '현재 사용 중',
    },
    {
      type: '프리미엄 플랜',
      features: [
        '무제한 노래 학습',
        '광고 없는 학습 환경',
        '과학적인 방식의 학습 제공',
        '오프라인 학습 모드',
      ],
      color: 'bg-gradient-to-br from-accent-600/20 to-accent-500/10',
      buttonText: '7일 무료 체험 시작',
    },
  ]

  const handleNext = () => {
    setCurrentPlan((prev) => (prev === planDetails.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentPlan((prev) => (prev === 0 ? planDetails.length - 1 : prev - 1))
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">프리미엄 멤버십</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          프리미엄으로 학습의 차원을 높이세요.
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* 데스크톱 화살표 */}
        <button
          onClick={handlePrev}
          className="hidden md:block absolute left-0 z-10 p-2 text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:block absolute right-0 z-10 p-2 text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <motion.div
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) handleNext()
            if (offset.x > 50) handlePrev()
          }}
          className="w-full max-w-md overflow-hidden"
        >
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentPlan * 100}%)` }}
          >
            {planDetails.map((plan, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <div
                  className={`
                    ${plan.color} 
                    rounded-2xl 
                    p-6 
                    shadow-lg
                    w-full
                  `}
                >
                  <div className="flex items-center justify-center mb-6">
                    {index === 1 && (
                      <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                    )}
                    <h3 className="text-xl font-bold text-white">
                      {plan.type}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* {index === 1 && (
                    <div className="text-center text-gray-300 mb-4">
                      첫 달 50% 할인 중!
                    </div>
                  )} */}

                  <button
                    className={`
                    w-full 
                    py-3 
                    rounded-lg 
                    ${
                      index === 0
                        ? 'bg-gray-700 text-white'
                        : 'bg-accent-600 text-white hover:bg-accent-700'
                    }
                  `}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {planDetails.map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full 
              ${currentPlan === index ? 'bg-accent-500' : 'bg-gray-700'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
