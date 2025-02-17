// pages/studyroom.tsx
import React, { useState } from 'react'
import AppLayout from '@/components/common/AppLayout'
import VocabularySection from '@/components/studyroom/VocabularySection'
import GrammarSection from '@/components/studyroom/GrammarSection'
import HiddenSection from '@/components/studyroom/HiddenSection'

type ActiveTab = 'vocabulary' | 'grammar' | 'hidden'

interface StudyMode {
  isActive: boolean
  collectionId: string
  type: 'vocabulary' | 'grammar'
}

export default function StudyRoomPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vocabulary')
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null)

  // 학습 시작 핸들러
  const handleStartStudy = (
    collectionId: string,
    type: 'vocabulary' | 'grammar'
  ) => {
    setStudyMode({
      isActive: true,
      collectionId,
      type,
    })
  }

  // 학습 종료 핸들러
  const handleEndStudy = () => {
    setStudyMode(null)
  }

  // 기본 공부방 UI
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">📖 공부방</h1>

        {/* 탭 네비게이션 */}
        <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`
              flex-1 flex items-center justify-center py-3 rounded-lg
              ${
                activeTab === 'vocabulary'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            단어장
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`
              flex-1 flex items-center justify-center py-3 rounded-lg
              ${
                activeTab === 'grammar'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            문법 노트
          </button>
          <button
            onClick={() => setActiveTab('hidden')}
            className={`
              flex-1 flex items-center justify-center py-3 rounded-lg
              ${
                activeTab === 'hidden'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            숨김 목록
          </button>
        </div>

        {/* 각 섹션에 학습 시작 핸들러 전달 */}
        {activeTab === 'vocabulary' && (
          <VocabularySection onStartStudy={handleStartStudy} />
        )}
        {activeTab === 'grammar' && (
          <GrammarSection onStartStudy={handleStartStudy} />
        )}
        {activeTab === 'hidden' && <HiddenSection />}
      </div>
    </AppLayout>
  )
}
