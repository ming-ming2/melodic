// components/lyrics/LyricsCard/TranslationTab.tsx
import React from 'react'
import type { LyricLine } from '@/types/lyrics'

interface TranslationTabProps {
  lyric: LyricLine
}

export default function TranslationTab({ lyric }: TranslationTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">원문</h3>
        <p className="text-lg text-white">{lyric.original}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">번역</h3>
        <p className="text-lg text-white">{lyric.translated}</p>
      </div>
    </div>
  )
}
