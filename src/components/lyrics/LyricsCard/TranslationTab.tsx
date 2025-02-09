// components/lyrics/LyricsCard/TranslationTab.tsx
import React from 'react'
import type { LyricLine } from '@/types/lyrics'

interface TranslationTabProps {
  lyric: LyricLine
}

export default function TranslationTab({ lyric }: TranslationTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">원문</h3>
        <p className="text-lg text-white">{lyric.original}</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">번역</h3>
        <p className="text-lg text-white">{lyric.translated}</p>
      </div>
    </div>
  )
}
