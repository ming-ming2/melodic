// pages/signup.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SignUpData } from '@/types/auth'
import BasicInfoStep from '@/components/signup/BasicInfoStep'
import LanguageSelectionStep from '@/components/signup/LanguageSelectionStep'
import WelcomeStep from '@/components/signup/WelcomeStep'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    password: '',
    nickname: '',
    languages: [],
  })
  const router = useRouter()

  const handleNext = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  const handleComplete = () => {
    // TODO: 실제 회원가입 API 호출
    console.log('Sign up data:', signUpData)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* 로고 영역 */}
      <div className="text-center mt-8 mb-6">
        <Link href="/" className="inline-block">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Melodic 로고"
              width={40}
              height={40}
              priority
              className="w-16 h-10 mr-2"
            />
            <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
              Melodic
            </span>
          </div>
        </Link>
      </div>

      {/* 단계 표시 */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= step
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 w-16 mx-2 rounded ${
                    i < step ? 'bg-accent-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`absolute inset-0 px-6 ${step === 3 ? 'pb-12 md:pb-24' : ''}`}
          >
            {step === 1 && (
              <BasicInfoStep
                data={signUpData}
                onUpdate={setSignUpData}
                onNext={handleNext}
              />
            )}
            {step === 2 && (
              <LanguageSelectionStep
                selectedLanguages={signUpData.languages}
                onUpdate={(languages) =>
                  setSignUpData((prev) => ({ ...prev, languages }))
                }
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {step === 3 && (
              <WelcomeStep
                nickname={signUpData.nickname}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
