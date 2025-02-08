// components/lyrics/LyricsCard/index.tsx
import React, { useState } from 'react'
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
  { id: 'translation', label: '번역', icon: '📜', premium: false },
  { id: 'vocabulary', label: '단어', icon: '📚', premium: false },
  { id: 'grammar', label: '문법', icon: '📖', premium: false },
  { id: 'expression', label: '표현 분석', icon: '🎶', premium: true },
] as const

export default function LyricsCard({
  lyrics,
  currentIndex,
  onIndexChange,
}: LyricsCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('translation')
  const currentLyric = lyrics[currentIndex]

  const goToPrevious = () => {
    onIndexChange(Math.max(0, currentIndex - 1))
  }

  const goToNext = () => {
    onIndexChange(Math.min(lyrics.length - 1, currentIndex + 1))
  }

  const renderTabContent = () => {
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

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* 네비게이션 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-center text-gray-400 text-sm">
          {currentIndex + 1} / {lyrics.length}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === lyrics.length - 1}
          className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50 transition-colors"
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
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            } transition-colors`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {tab.premium && (
              <span className="ml-1 text-xs text-yellow-500">PRO</span>
            )}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-gray-700 rounded-lg p-4">{renderTabContent()}</div>
    </div>
  )
}
