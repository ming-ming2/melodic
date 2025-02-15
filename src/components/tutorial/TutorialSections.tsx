// components/tutorial/TutorialSections.tsx
import React from 'react'
import { motion } from 'framer-motion'
import IntroSection from './sections/IntroSection'
import CoreFeaturesSection from './sections/CoreFeaturesSection'
import PremiumSection from './sections/PremiumSection'
import PracticeSection from './sections/PracticeSection'
import FAQSection from './sections/FAQSection'

interface TutorialSectionsProps {
  currentStep: number
  onPremiumFeatureClick: () => void
}

export default function TutorialSections({
  currentStep,
  onPremiumFeatureClick,
}: TutorialSectionsProps) {
  const renderSection = () => {
    switch (currentStep) {
      case 0:
        return <IntroSection />
      case 1:
        return (
          <CoreFeaturesSection onPremiumFeatureClick={onPremiumFeatureClick} />
        )
      case 2:
        return <PremiumSection />
      case 3:
        return <PracticeSection />
      case 4:
        return <FAQSection />
      default:
        return null
    }
  }

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={`h-full overflow-y-auto ${currentStep === 3 ? 'p-0' : 'p-8'}`} // 실습 단계일 때만 패딩 제거
    >
      {renderSection()}
    </motion.div>
  )
}
