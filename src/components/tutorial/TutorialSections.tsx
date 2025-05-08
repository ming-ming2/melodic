// components/tutorial/TutorialSections.tsx
import React from 'react'
import { motion } from 'framer-motion'
import IntroSection from './sections/IntroSection'
import CoreFeaturesSection from './sections/CoreFeaturesSection'
import PremiumSection from './sections/PremiumSection'
import PracticeSection from './sections/PracticeSection'
import FAQSection from './sections/FAQSection'
import { useDevice } from '@/contexts/DeviceContext'

interface TutorialSectionsProps {
  currentStep: number
  onPremiumFeatureClick: () => void
}

export default function TutorialSections({
  currentStep,
  onPremiumFeatureClick,
}: TutorialSectionsProps) {
  const { deviceType } = useDevice()
  const isTabletOrMobile = deviceType === 'mobile' || deviceType === 'tablet'

  const renderSection = () => {
    switch (currentStep) {
      case 0:
        return <IntroSection />
      case 1:
        return (
          <CoreFeaturesSection onPremiumFeatureClick={onPremiumFeatureClick} />
        )
      case 2:
        return <PracticeSection />
      case 3:
        return <PremiumSection />
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
      className={`h-full overflow-y-auto ${
        currentStep === 2 ? 'p-0' : isTabletOrMobile ? 'p-4' : 'p-8'
      }`}
    >
      {renderSection()}
    </motion.div>
  )
}
