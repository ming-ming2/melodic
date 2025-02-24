// components/lyrics/DemoLyricsCard.tsx
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'
import VocabularyTab from '@/components/lyrics/LyricsCard/VocabularyTab'
import GrammarTab from '@/components/lyrics/LyricsCard/GrammarTab'
import ExpressionTab from '@/components/lyrics/LyricsCard/ExpressionTab'

interface DemoLyricsCardProps {
  lyrics: LyricLine[]
  currentIndex: number
  onIndexChange: (index: number) => void
  onControlAction?: (action: string) => void
}

type TabType = 'vocabulary' | 'grammar' | 'expressions'

const tabData = [
  { id: 'vocabulary', label: '단어', icon: '📚' },
  { id: 'grammar', label: '문법', icon: '📖' },
  { id: 'expressions', label: '표현', icon: '🗣️' },
] as const

export default function DemoLyricsCard({
  lyrics,
  currentIndex,
  onIndexChange,
  onControlAction,
}: DemoLyricsCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('vocabulary')
  const currentLyric = lyrics[currentIndex]

  // 가사가 바뀔 때 탭 초기화
  useEffect(() => {
    setActiveTab('vocabulary')
  }, [currentLyric])

  const handleSwipe = (direction: 'left' | 'right') => {
    let newIndex = 0
    if (direction === 'left') {
      newIndex = currentIndex === lyrics.length - 1 ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex === 0 ? lyrics.length - 1 : currentIndex - 1
    }
    onIndexChange(newIndex)
    onControlAction && onControlAction('navigate')
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'vocabulary':
        return <VocabularyTab lyric={currentLyric} />
      case 'grammar':
        return <GrammarTab lyric={currentLyric} />
      case 'expressions':
        return <ExpressionTab lyric={currentLyric} />
      default:
        return null
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

      {/* 가사 이동 네비게이션바 */}
      <div className="flex justify-between items-center p-4 border-t border-b border-gray-800">
        <button
          onClick={() => handleSwipe('right')}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {lyrics.length}
        </div>
        <button
          onClick={() => handleSwipe('left')}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 탭 버튼 */}
      <div className="px-4 grid grid-cols-3 gap-2 border-t border-b border-gray-800">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              // 실제 탭 클릭 시 onControlAction 호출 (학습탭 완료는 DemoLyricsPage에서 탭 클릭 기록으로 처리)
              onControlAction && onControlAction('tab')
            }}
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
    </div>
  )
}
