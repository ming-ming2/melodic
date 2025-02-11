// components/signup/LanguageSelectionStep.tsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, X } from 'lucide-react'
import {
  // LANGUAGE_DATA,
  validateAndCorrectLanguage,
  getFeaturedLanguages,
} from '@/utils/languageData'

interface LanguageSelectionStepProps {
  selectedLanguages: string[]
  onUpdate: (languages: string[]) => void
  onBack: () => void
  onNext: () => void
}

const FEATURED_LANGUAGES = getFeaturedLanguages()

export default function LanguageSelectionStep({
  selectedLanguages,
  onUpdate,
  onBack,
  onNext,
}: LanguageSelectionStepProps) {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customLanguage, setCustomLanguage] = useState('')
  const [customLanguages, setCustomLanguages] = useState<string[]>([])
  const [validationMessage, setValidationMessage] = useState<{
    text: string
    type: 'error' | 'success' | 'info'
  } | null>(null)

  const customInputRef = useRef<HTMLDivElement>(null)

  const handleCustomButtonClick = () => {
    setShowCustomInput(true)
    // 살짝의 딜레이 후 스크롤 (애니메이션이 시작된 후 스크롤되도록)
    setTimeout(() => {
      customInputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
  }

  const handleLanguageToggle = (langId: string) => {
    if (selectedLanguages.includes(langId)) {
      onUpdate(selectedLanguages.filter((id) => id !== langId))
    } else {
      onUpdate([...selectedLanguages, langId])
    }
  }

  const handleAddCustomLanguage = () => {
    if (!customLanguage) return

    const validationResult = validateAndCorrectLanguage(customLanguage)

    if (!validationResult.isValid) {
      setValidationMessage({
        text: validationResult.message!,
        type: 'error',
      })
      return
    }

    if (validationResult.correctedName) {
      setValidationMessage({
        text: validationResult.message!,
        type: 'info',
      })
    }

    const langToAdd = validationResult.languageData!
    if (selectedLanguages.includes(langToAdd.id)) {
      setValidationMessage({
        text: '이미 선택된 언어입니다.',
        type: 'error',
      })
      return
    }

    const newCustomLanguages = [...customLanguages, langToAdd.name]
    setCustomLanguages(newCustomLanguages)
    onUpdate([...selectedLanguages, langToAdd.id])
    setCustomLanguage('')
    setShowCustomInput(false) // 성공적으로 추가되면 입력창 닫기

    // 3초 후 메시지 제거
    setTimeout(() => setValidationMessage(null), 3000)
  }

  const handleRemoveCustomLanguage = (index: number) => {
    const newCustomLanguages = customLanguages.filter((_, i) => i !== index)
    setCustomLanguages(newCustomLanguages)
    onUpdate(
      selectedLanguages.filter(
        (lang) => lang !== `custom-${customLanguages[index]}`
      )
    )
  }

  const cardVariants = {
    selected: {
      scale: 1.05,
      backgroundColor: 'rgb(67, 56, 202)',
      transition: { duration: 0.2 },
    },
    notSelected: {
      scale: 1,
      backgroundColor: 'rgb(31, 41, 55)',
      transition: { duration: 0.2 },
    },
  }

  const isRecommendationEnabled = selectedLanguages.length >= 3

  return (
    <div className="max-w-md mx-auto w-full h-full overflow-y-auto pb-20">
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white flex items-center mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        뒤로
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">
        어떤 언어의 노래를 배우고 싶으신가요?
      </h2>
      <p className="text-gray-400 mb-8">한 개 이상 선택해주세요</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {FEATURED_LANGUAGES.map((lang) => (
          <motion.button
            key={lang.id}
            variants={cardVariants}
            animate={
              selectedLanguages.includes(lang.id) ? 'selected' : 'notSelected'
            }
            onClick={() => handleLanguageToggle(lang.id)}
            className="p-4 rounded-xl text-white flex flex-col items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl mb-2">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </motion.button>
        ))}

        <motion.button
          onClick={handleCustomButtonClick}
          variants={cardVariants}
          animate="notSelected"
          className="p-4 rounded-xl text-white flex flex-col items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-3xl mb-2">
            <Plus className="w-8 h-8" />
          </span>
          <span className="font-medium">기타</span>
        </motion.button>
      </div>

      {/* 커스텀 언어 목록 */}
      {customLanguages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            추가된 언어
          </h3>
          <div className="flex flex-wrap gap-2">
            {customLanguages.map((lang, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{lang}</span>
                <button
                  onClick={() => handleRemoveCustomLanguage(index)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            ref={customInputRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="언어를 입력하세요"
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none"
                />
                <button
                  onClick={handleAddCustomLanguage}
                  disabled={!customLanguage}
                  className={`whitespace-nowrap px-4 py-3 rounded-xl font-medium transition-colors
                    ${
                      customLanguage
                        ? 'bg-accent-600 text-white hover:bg-accent-700'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  추가
                </button>
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 검증 메시지 */}
              <AnimatePresence mode="wait">
                {validationMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      validationMessage.type === 'error'
                        ? 'bg-red-500/10 text-red-500'
                        : validationMessage.type === 'success'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {validationMessage.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isRecommendationEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-800 rounded-xl"
        >
          <h3 className="text-white font-medium mb-2">
            🎯 맞춤 추천 설정이 활성화되었어요!
          </h3>
          <p className="text-gray-400 text-sm">
            3개 이상의 언어를 선택하셨네요. 선호하는 언어들을 바탕으로 더 정확한
            곡을 추천해드릴 수 있어요.
          </p>
        </motion.div>
      )}

      {/* 모바일 버전 버튼 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent">
        <motion.button
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
          className={`w-full max-w-md mx-auto py-3 rounded-xl font-medium transition-colors
            ${
              selectedLanguages.length > 0
                ? 'bg-accent-600 text-white hover:bg-accent-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          whileTap={selectedLanguages.length > 0 ? { scale: 0.98 } : {}}
        >
          다음
        </motion.button>
      </div>

      {/* 데스크톱 버전 버튼 */}
      <div className="hidden md:block">
        <motion.button
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
          className={`w-full max-w-md mx-auto py-3 rounded-xl font-medium transition-colors
            ${
              selectedLanguages.length > 0
                ? 'bg-accent-600 text-white hover:bg-accent-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          whileTap={selectedLanguages.length > 0 ? { scale: 0.98 } : {}}
        >
          다음
        </motion.button>
      </div>
    </div>
  )
}
