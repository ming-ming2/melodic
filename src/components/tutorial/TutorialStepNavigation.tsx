// components/tutorial/TutorialStepNavigation.tsx
import React from 'react'
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
  return (
    <div className="w-full overflow-x-auto py-4">
      <div
        className="flex space-x-4 px-4 snap-x snap-mandatory"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {steps.map((step, index) => (
          <motion.button
            key={index}
            onClick={() => onStepChange(index)}
            className={`
              flex-shrink-0 
              w-64 
              snap-center 
              p-4 
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
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-4">
              <step.icon
                className={`
                  w-8 h-8 
                  ${currentStep === index ? 'text-accent-500' : 'text-gray-400'}
                `}
              />
              <div className="text-left">
                <h3
                  className={`
                  font-semibold 
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
