// components/settings/SubscriptionSection.tsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Check, CreditCard } from 'lucide-react'
import SectionHeader from './common/SectionHeader'

interface SubscriptionSectionProps {
  scrollOnClick: boolean
}

export default function SubscriptionSection({
  scrollOnClick,
}: SubscriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isPremium = false // TODO: 실제 구독 상태 연동

  const benefits = [
    '모든 곡의 심화 표현 분석',
    '무제한 단어장 저장',
    '오프라인 학습 지원',
    '광고 없는 학습',
    '프리미엄 전용 테마',
  ]

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      ref={sectionRef}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 transition-colors"
    >
      <SectionHeader
        title="구독 관리"
        description={isPremium ? '프리미엄 구독 중' : '무료 플랜 사용 중'}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        icon={Crown}
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
              <div className="pt-5 mb-6">
                <div
                  className={`p-4 rounded-xl ${
                    isPremium
                      ? 'bg-gradient-to-br from-accent-500/20 to-accent-500/5 border border-accent-500/20'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {isPremium ? (
                      <Crown className="w-5 h-5 text-accent-400" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium text-white">
                      {isPremium ? '프리미엄' : '무료 플랜'}
                    </span>
                  </div>
                  {isPremium ? (
                    <p className="text-sm text-gray-300">
                      멜로딕의 모든 기능을 사용할 수 있습니다.
                      <br />
                      다음 결제일: 2024년 3월 10일
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      프리미엄으로 업그레이드하고 더 많은 기능을 사용해보세요
                    </p>
                  )}
                </div>
              </div>
              {!isPremium && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400">
                      프리미엄 혜택
                    </h3>
                    <ul className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 group"
                        >
                          <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-accent-400" />
                          </div>
                          <span className="text-gray-300 group-hover:text-accent-400 transition-colors">
                            {benefit}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full py-3 px-4 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-medium flex items-center justify-center gap-2 transition-colors">
                    <Crown className="w-5 h-5 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                    <span>프리미엄으로 업그레이드</span>
                  </button>
                </div>
              )}
              {isPremium && (
                <button className="w-full py-3 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors">
                  구독 관리
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
