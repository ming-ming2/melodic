// components/lyrics/LyricsCard/ExpressionTab.tsx
import React from 'react'
import { Lock } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface ExpressionTabProps {
  lyric: LyricLine
  isPremium?: boolean
}

export default function ExpressionTab({
  isPremium = false,
}: ExpressionTabProps) {
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Lock className="w-8 h-8 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          프리미엄 전용 기능
        </h3>
        <p className="text-gray-400 mb-4">
          표현 분석을 확인하려면 프리미엄으로 업그레이드하세요.
        </p>
        <button className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
          프리미엄 가입하기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">표현 분석</h3>
        {/* 프리미엄 콘텐츠 내용 */}
        <p className="text-gray-300">
          이 표현은 일상 회화에서도 자주 사용되며...
        </p>
      </div>
    </div>
  )
}
