// components/lyrics/LyricsCard/VocabularyTab.tsx
import React from 'react'
import { BookmarkPlus, Check } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface VocabularyTabProps {
  lyric: LyricLine
}

export default function VocabularyTab({ lyric }: VocabularyTabProps) {
  const [savedWords, setSavedWords] = React.useState<Set<string>>(new Set())

  const handleSaveWord = (word: string) => {
    setSavedWords((prev) => {
      const newSet = new Set(prev)
      newSet.add(word)
      return newSet
    })
    // TODO: 실제 저장 로직 구현
  }

  if (!lyric.words || lyric.words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 학습할 단어가 없어요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lyric.words.map((wordItem, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
          {/* 단어 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <h3 className="text-lg font-medium text-white">
                {wordItem.word}
              </h3>
              <p className="text-accent-400 text-sm">{wordItem.meaning}</p>
            </div>
            <button
              onClick={() => handleSaveWord(wordItem.word)}
              className={`p-2 rounded-full transition-colors ${
                savedWords.has(wordItem.word)
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {savedWords.has(wordItem.word) ? (
                <Check className="w-5 h-5" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 예문 */}
          <div className="p-4 bg-gray-800/50">
            <p className="text-sm text-gray-400 mb-1">예문</p>
            <p className="text-gray-300">{wordItem.example}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
