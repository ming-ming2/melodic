// components/lyrics/LyricsCard/index.tsx
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

interface LyricsCardProps {
  lyrics: LyricLine[]
}

export default function LyricsCard({ lyrics }: LyricsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<
    'translation' | 'vocabulary' | 'grammar' | 'expression'
  >('translation')

  const currentLyric = lyrics[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(lyrics.length - 1, prev + 1))
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* 네비게이션 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-center text-gray-400 text-sm">
          {currentIndex + 1} / {lyrics.length}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === lyrics.length - 1}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 현재 가사 */}
      <div className="mb-6">
        <p className="text-xl font-medium text-white mb-2">
          {currentLyric.original}
        </p>
        <p className="text-gray-400">{currentLyric.translated}</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 mb-4">
        {['해석', '단어', '문법', '표현'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 - 추후 구현 */}
      <div className="bg-gray-700 rounded-lg p-4">
        {/* 탭 내용은 다음 단계에서 구현 */}
        <p className="text-gray-400">Tab content for {activeTab}</p>
      </div>
    </div>
  )
}
