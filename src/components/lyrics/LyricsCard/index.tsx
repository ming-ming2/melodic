// components/lyrics/LyricsCard/index.tsx
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'
import TranslationTab from './TranslationTab'
import VocabularyTab from './VocabularyTab'
import GrammarTab from './GrammarTab'
import ExpressionTab from './ExpressionTab'

interface LyricsCardProps {
  lyrics: LyricLine[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

type TabType = 'translation' | 'vocabulary' | 'grammar' | 'expression'

const tabData = [
  { id: 'translation', label: '번역', icon: '📜' },
  { id: 'vocabulary', label: '단어', icon: '📚' },
  { id: 'grammar', label: '문법', icon: '📖' },
  { id: 'expression', label: '표현', icon: '🎶', premium: true },
] as const

export default function LyricsCard({
  lyrics,
  currentIndex,
  onIndexChange,
}: LyricsCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('translation')
  const currentLyric = lyrics[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < lyrics.length - 1) {
      onIndexChange(currentIndex + 1)
    } else if (direction === 'right' && currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* 가사 내용 */}
      <div className="p-4 flex-shrink-0">
        <p className="text-xl font-medium text-white mb-2">
          {currentLyric.original}
        </p>
        <p className="text-gray-400">{currentLyric.translated}</p>
      </div>

      {/* 탭 버튼 */}
      <div className="px-4 grid grid-cols-4 gap-2 border-t border-b border-gray-800">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 flex flex-col items-center justify-center ${
              activeTab === tab.id
                ? 'text-accent-500 border-b-2 border-accent-500'
                : 'text-gray-400'
            }`}
          >
            <span className="text-lg mb-1">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between items-center p-4 border-t border-gray-800">
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-gray-800 disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {lyrics.length}
        </div>

        <button
          onClick={() => handleSwipe('left')}
          disabled={currentIndex === lyrics.length - 1}
          className="p-2 rounded-full bg-gray-800 disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )

  function renderTabContent() {
    switch (activeTab) {
      case 'translation':
        return <TranslationTab lyric={currentLyric} />
      case 'vocabulary':
        return <VocabularyTab lyric={currentLyric} />
      case 'grammar':
        return <GrammarTab lyric={currentLyric} />
      case 'expression':
        return <ExpressionTab lyric={currentLyric} isPremium={false} />
      default:
        return null
    }
  }
}
