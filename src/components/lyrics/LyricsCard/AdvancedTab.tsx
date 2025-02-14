// components/lyrics/LyricsCard/AdvancedTab.tsx
import React from 'react'
import { Lock } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface AdvancedTabProps {
  lyric: LyricLine
}

export default function AdvancedTab({ lyric }: AdvancedTabProps) {
  const isPremium = !lyric.advanced_study.premium_only // 실제로는 사용자의 구독 상태를 확인해야 함

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Lock className="w-8 h-8 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          프리미엄 전용 기능
        </h3>
        <p className="text-gray-400 mb-4">
          심화 분석을 확인하려면 프리미엄으로 업그레이드하세요.
        </p>
        <button className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
          프리미엄 가입하기
        </button>
      </div>
    )
  }

  const {
    metaphorical_expressions,
    pronunciation_tips,
    similar_expressions,
    real_life_usages,
    advanced_grammar_explanations,
  } = lyric.advanced_study

  return (
    <div className="space-y-6">
      {/* 비유적 표현 섹션 */}
      {metaphorical_expressions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-3">
            비유적 표현
          </h3>
          <div className="space-y-4">
            {metaphorical_expressions.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-700 last:border-0 pb-3 last:pb-0"
              >
                <h4 className="text-white font-medium mb-2">{item.phrase}</h4>
                <p className="text-gray-300 mb-2">{item.explanation}</p>
                <p className="text-sm text-gray-400">예시: {item.example}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 발음 팁 섹션 */}
      {pronunciation_tips.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-3">발음 팁</h3>
          <div className="space-y-3">
            {pronunciation_tips.map((tip, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-white font-medium mb-1">{tip.phrase}</p>
                <p className="text-gray-300 text-sm">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 유사 표현 섹션 */}
      {similar_expressions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-3">
            유사 표현
          </h3>
          {similar_expressions.map((item, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="text-white mb-2">
                '{item.original_expression}' 과 비슷한 표현:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                {item.similar_expressions.map((expr, i) => (
                  <li key={i} className="text-gray-300">
                    {expr}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 실생활 사용 섹션 */}
      {real_life_usages.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-3">
            실생활 사용
          </h3>
          {real_life_usages.map((item, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="text-white mb-1">{item.phrase}</p>
              <p className="text-gray-300 text-sm">{item.usage}</p>
            </div>
          ))}
        </div>
      )}

      {/* 심화 문법 설명 섹션 */}
      {advanced_grammar_explanations.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-3">
            심화 문법
          </h3>
          {advanced_grammar_explanations.map((item, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="text-white mb-1">{item.pattern}</p>
              <p className="text-gray-300 text-sm">
                {item.advanced_explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
