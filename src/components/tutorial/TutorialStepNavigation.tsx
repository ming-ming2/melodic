// components/tutorial/TutorialStepNavigation.tsx
import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TutorialStep {
  icon: React.ElementType
  title: string
  description: string
}

interface TutorialStepNavigationProps {
  steps: TutorialStep[]
  currentStep: number
  onStepChange: (index: number) => void
}

export default function TutorialStepNavigation({
  steps,
  currentStep,
  onStepChange,
}: TutorialStepNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (scrollContainerRef.current && stepRefs.current[currentStep]) {
      const container = scrollContainerRef.current
      const activeStep = stepRefs.current[currentStep]

      if (activeStep) {
        const containerWidth = container.offsetWidth
        const stepWidth = activeStep.offsetWidth
        const stepOffset = activeStep.offsetLeft

        // 현재 단계를 화면 중앙에 위치
        const scrollPosition = stepOffset - containerWidth / 2 + stepWidth / 2

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        })
      }
    }
  }, [currentStep])

  return (
    <div
      ref={scrollContainerRef}
      className="w-full overflow-x-auto py-2 bg-gray-900"
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="flex space-x-2 px-4 snap-x">
        {steps.map((step, index) => (
          <motion.button
            key={index}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            onClick={() => onStepChange(index)}
            className={`
              flex-shrink-0 
              w-64 
              snap-center 
              p-2 
              rounded-xl 
              border 
              transition-all 
              duration-300
              ${
                currentStep === index
                  ? 'bg-accent-600/20 border-accent-500 scale-105'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }
            `}
            whileTap={{ scale: 0.85 }}
          >
            <div className="flex items-center space-x-2">
              <step.icon
                className={`
                  w-6 h-6 
                  ${currentStep === index ? 'text-accent-500' : 'text-gray-400'}
                `}
              />
              <div className="text-left">
                <h3
                  className={`
                    font-semibold text-sm
                    ${currentStep === index ? 'text-white' : 'text-gray-300'}
                  `}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
