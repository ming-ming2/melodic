// components/tutorial/TutorialProgressBar.tsx
import React from 'react'
import { motion } from 'framer-motion'

interface TutorialProgressBarProps {
  totalSteps: number
  currentStep: number
}

export default function TutorialProgressBar({
  totalSteps,
  currentStep,
}: TutorialProgressBarProps) {
  return (
    <div className="w-full h-1 bg-gray-700 relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${((currentStep + 1) / totalSteps) * 100}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="absolute top-0 left-0 h-full bg-accent-500"
      />
    </div>
  )
}
