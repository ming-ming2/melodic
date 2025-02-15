// components/lyrics/LyricsCard/ExpressionTab.tsx
import React from 'react'
import { BookmarkPlus, Check } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface ExpressionTabProps {
  lyric: LyricLine
}

export default function ExpressionTab({ lyric }: ExpressionTabProps) {
  const [savedExpressions, setSavedExpressions] = React.useState<Set<string>>(
    new Set()
  )

  const handleSaveExpression = (expression: string) => {
    setSavedExpressions((prev) => {
      const newSet = new Set(prev)
      newSet.add(expression)
      return newSet
    })
    // TODO: 실제 저장 로직 구현
  }

  if (!lyric.expressions || lyric.expressions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 분석할 표현이 없어요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lyric.expressions.map((expressionItem, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
          {/* 표현 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <h3 className="text-lg font-medium text-white">
                {expressionItem.expression}
              </h3>
              <p className="text-accent-400 text-sm">
                {expressionItem.meaning}
              </p>
            </div>
            <button
              onClick={() => handleSaveExpression(expressionItem.expression)}
              className={`p-2 rounded-full transition-colors ${
                savedExpressions.has(expressionItem.expression)
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {savedExpressions.has(expressionItem.expression) ? (
                <Check className="w-5 h-5" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
