// components/lyrics/LyricsCard/GrammarTab.tsx
import React from 'react'
import type { LyricLine } from '@/types/lyrics'

interface GrammarTabProps {
  lyric: LyricLine
}

export default function GrammarTab({ lyric }: GrammarTabProps) {
  if (!lyric.grammar || lyric.grammar.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 학습할 문법이 없어요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lyric.grammar.map((grammarItem, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
          {/* 문법 패턴 */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-accent-400 mb-2">
              {grammarItem.pattern}
            </h3>
            <p className="text-white">{grammarItem.explanation}</p>
          </div>

          {/* 예문 */}
          <div className="p-4 bg-gray-800/50">
            <p className="text-sm text-gray-400 mb-1">예문</p>
            <p className="text-gray-300">{grammarItem.example}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
