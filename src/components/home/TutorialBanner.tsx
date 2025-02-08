// components/home/TutorialBanner.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useOnboardingStore from '@/stores/onboardingStore'

const TutorialBanner: React.FC = () => {
  const router = useRouter()
  const { hasSeenTutorial, setHasSeenTutorial } = useOnboardingStore()

  if (hasSeenTutorial) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent-600 rounded-xl p-4 mb-6 relative"
    >
      <button
        onClick={() => setHasSeenTutorial(true)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent-700 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="pr-8">
        <h3 className="text-lg font-semibold text-white mb-1">
          멜로딕을 처음 사용하시나요? 🎵
        </h3>
        <p className="text-white/80 mb-3">지금 바로 사용법을 알아보세요!</p>
        <button
          onClick={() => {
            router.push('/onboarding')
            setHasSeenTutorial(true)
          }}
          className="bg-white text-accent-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          튜토리얼 보기 →
        </button>
      </div>
    </motion.div>
  )
}

export default TutorialBanner
