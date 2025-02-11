// components/settings/LanguageSection.tsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Plus, X } from 'lucide-react'
import SectionHeader from './common/SectionHeader'
import {
  LANGUAGE_DATA,
  validateAndCorrectLanguage,
  getFeaturedLanguages,
} from '@/utils/languageData'

interface LanguageSectionProps {
  scrollOnClick: boolean
}

export default function LanguageSection({
  scrollOnClick,
}: LanguageSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'ja',
    'en',
  ])
  const [showCustomInput, setShowCustomInput] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const selectedLanguagesData = LANGUAGE_DATA.filter((lang) =>
    selectedLanguages.includes(lang.id)
  )

  return (
    <div
      ref={sectionRef}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 transition-colors"
    >
      <SectionHeader
        title="선호 언어 설정"
        description="학습하고 싶은 언어를 선택해주세요"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        icon={Globe}
        scrollOnClick={scrollOnClick}
        containerRef={sectionRef}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-700/50">
              <div className="pt-5 mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  선택된 언어
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLanguagesData.map((lang) => (
                    <motion.div
                      key={lang.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="group bg-gray-700 hover:bg-accent-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-gray-300 group-hover:text-accent-400 transition-colors">
                        {lang.name}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedLanguages((prev) =>
                            prev.filter((id) => id !== lang.id)
                          )
                        }
                        className="text-gray-400 hover:text-accent-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    /* TODO: 언어 선택 모달 열기 */
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                  <span>언어 추가하기</span>
                </button>

                <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
                  <p className="text-sm text-accent-400">
                    💡 Tip: 다양한 언어를 선택할수록 더 많은 학습 기회가
                    제공됩니다!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
