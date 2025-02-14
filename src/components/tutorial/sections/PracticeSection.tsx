// components/tutorial/sections/PracticeSection.tsx
import React from 'react'

interface PracticeSectionProps {
  onPremiumFeatureClick: () => void
}

export default function PracticeSection({}: PracticeSectionProps) {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          실제 학습 경험 체험하기
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          멜로딕에서 어떻게 노래로 언어를 학습하는지 직접 체험해보세요.
        </p>
      </div>
    </div>
  )
}
