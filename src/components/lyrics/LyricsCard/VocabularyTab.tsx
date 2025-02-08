// components/lyrics/LyricsCard/VocabularyTab.tsx
import React from 'react'
import { BookmarkPlus } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface VocabularyTabProps {
  lyric: LyricLine
}

export default function VocabularyTab({ lyric }: VocabularyTabProps) {
  const handleSaveWord = (word: string) => {
    // TODO: 단어장 저장 로직 구현
    console.log('Save word:', word)
  }

  return (
    <div className="space-y-4">
      {lyric.words.map((word, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium text-white">{word.word}</h3>
              <p className="text-accent-400">{word.meaning}</p>
            </div>
            <button
              onClick={() => handleSaveWord(word.word)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <BookmarkPlus className="w-5 h-5 text-gray-400 hover:text-accent-400" />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">예문</p>
            <p className="text-gray-300">{word.example}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
