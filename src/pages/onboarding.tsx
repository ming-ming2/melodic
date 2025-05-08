// pages/onboarding.tsx
import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Book,
  Star,
  FileText,
  HelpCircle,
} from 'lucide-react'
import TutorialNavigation from '@/components/tutorial/TutorialNavigation'
import TutorialStepNavigation from '@/components/tutorial/TutorialStepNavigation'
import TutorialProgressBar from '@/components/tutorial/TutorialProgressBar'
import TutorialSections from '@/components/tutorial/TutorialSections'
import PremiumModal from '@/components/tutorial/PremiumModal'

// 튜토리얼 스텝 데이터
const TUTORIAL_STEPS = [
  {
    icon: Home,
    title: '시작하기',
    description: '멜로딕 소개',
  },
  {
    icon: Book,
    title: '핵심 기능',
    description: '주요 기능 알아보기',
  },
  {
    icon: FileText,
    title: '실습',
    description: '직접 체험하기',
  },
  {
    icon: Star,
    title: '프리미엄',
    description: '무료 vs 프리미엄',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: '자주 묻는 질문',
  },
]

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const router = useRouter()
  const totalSteps = TUTORIAL_STEPS.length

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePremiumFeatureClick = () => {
    setIsPremiumModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* 프로그레스 바 */}
      <TutorialProgressBar totalSteps={totalSteps} currentStep={currentStep} />

      {/* 수평 스크롤 네비게이션 (lg 브레이크포인트 미만에서 표시) */}
      <TutorialStepNavigation
        steps={TUTORIAL_STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* 데스크톱 사이드바 네비게이션과 콘텐츠 영역 */}
      <div className="flex flex-1">
        <TutorialNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          className="hidden lg:block"
        />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative overflow-y-auto ${currentStep === 2 ? 'p-0' : 'p-4'}">
            <AnimatePresence mode="wait">
              <TutorialSections
                currentStep={currentStep}
                onPremiumFeatureClick={handlePremiumFeatureClick}
              />
            </AnimatePresence>
          </div>

          {/* 하단 네비게이션 */}
          <div className="sticky bottom-0 bg-gray-900 p-4 flex justify-between items-center border-t border-gray-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-2 
                ${
                  currentStep === 0
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white hover:text-accent-400'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>
            {/* 홈 버튼 추가 */}
            <button
              onClick={() => router.push('/')}
              className="text-white hover:text-accent-400"
            >
              <Home className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === totalSteps - 1}
              className={`
                flex items-center gap-2 
                ${
                  currentStep === totalSteps - 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white hover:text-accent-400'
                }
              `}
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 프리미엄 모달 */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  )
}
