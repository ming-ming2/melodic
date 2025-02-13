// components/tutorial/PremiumModal.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { X, Crown, Check } from 'lucide-react'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const premiumFeatures = [
    '무제한 노래 학습',
    '심화 표현 분석',
    '오프라인 학습 모드',
    '광고 없는 학습 환경',
    '우선 고객 지원',
  ]

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-2xl max-w-md w-full p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            프리미엄으로 학습의 차원을 높이세요
          </h2>
          <p className="text-gray-400 mb-6">
            멜로딕 프리미엄만의 특별한 기능을 만나보세요
          </p>

          <div className="space-y-4 mb-8">
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-800 rounded-xl p-3"
              >
                <Check className="w-5 h-5 text-accent-500 mr-3" />
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors">
              7일 무료 체험 시작
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition-colors"
            >
              나중에 결정할게요
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
