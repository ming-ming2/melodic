// components/tutorial/sections/PremiumSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'

export default function PremiumSection() {
  const freePlanFeatures = [
    '최대 5개 노래 학습',
    '기본 단어장 저장',
    '번역 및 기본 문법 분석',
  ]

  const premiumPlanFeatures = [
    '무제한 노래 학습',
    '무제한 단어장 저장',
    '심화 문법 분석',
    '표현 학습 기능',
    '오프라인 학습 모드',
    '광고 없는 학습 환경',
    '우선 고객 지원',
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          프리미엄으로 학습의 차원을 높이세요
        </h2>
        <p className="text-base text-gray-400 max-w-xl mx-auto">
          멜로딕 프리미엄은 당신의 언어 학습 경험을 완전히 새롭게 만들어 줍니다.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        {/* 무료 플랜 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-80 bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            무료 플랜
          </h3>
          <div className="space-y-4 mb-6">
            {freePlanFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-400 mb-4">언어 학습의 시작</div>
          <button className="w-full py-3 bg-gray-700 text-white rounded-lg">
            현재 사용 중
          </button>
        </motion.div>

        {/* 프리미엄 플랜 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-80 bg-gradient-to-br from-accent-600/20 to-accent-500/10 rounded-2xl p-6 shadow-2xl border border-accent-500/30"
        >
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-yellow-500 mr-2" />
            <h3 className="text-2xl font-bold text-white">프리미엄 플랜</h3>
          </div>
          <div className="space-y-4 mb-6">
            {premiumPlanFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-500" />
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-300 mb-4">
            첫 달 50% 할인 중!
          </div>
          <button className="w-full py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
            7일 무료 체험 시작
          </button>
        </motion.div>
      </div>
    </div>
  )
}
