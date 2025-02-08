// pages/onboarding.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Book, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'

const tutorialSteps = [
  {
    title: '노래로 배우는 새로운 방법',
    description: '좋아하는 노래로 즐겁게 언어를 학습하세요',
    icon: Search,
  },
  {
    title: '나만의 단어장',
    description: '학습한 단어와 표현을 저장하고 복습하세요',
    icon: Book,
  },
  {
    title: '퀴즈로 실력 향상',
    description: '학습한 내용을 퀴즈로 확인하세요',
    icon: Award,
  },
]

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-md w-full text-center"
        >
          {/* 아이콘 */}
          <div className="mb-8">
            {React.createElement(tutorialSteps[currentStep].icon, {
              className: 'w-16 h-16 text-accent-500 mx-auto',
            })}
          </div>

          {/* 텍스트 */}
          <h2 className="text-2xl font-bold text-white mb-4">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-gray-400 mb-8">
            {tutorialSteps[currentStep].description}
          </p>

          {/* 진행 상태 */}
          <div className="flex justify-center space-x-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-accent-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* 버튼 */}
          <button
            onClick={nextStep}
            className="bg-accent-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-accent-700 transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? '시작하기' : '다음'}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default OnboardingPage
