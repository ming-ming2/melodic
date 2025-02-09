// components/lyrics/LyricsCard/GrammarTab.tsx
import React from 'react'
import type { LyricLine } from '@/types/lyrics'

interface GrammarTabProps {
  lyric: LyricLine
}

export default function GrammarTab({ lyric }: GrammarTabProps) {
  if (!lyric.grammar || lyric.grammar.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">
          이 가사에는 학습할 문법 요소가 없어요!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lyric.grammar.map((grammar, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-accent-400 mb-2">
            {grammar.pattern}
          </h3>
          <p className="text-white mb-3">{grammar.explanation}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-400">예문</p>
            <p className="text-gray-300">{grammar.example}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
