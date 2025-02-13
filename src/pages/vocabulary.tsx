// src/pages/vocabulary.tsx
import React, { useState } from 'react'
import { Book, FileText, EyeOff } from 'lucide-react'
import AppLayout from '@/components/common/AppLayout'
import VocabularySection from '@/components/vocabulary/VocabularySection'
import GrammarSection from '@/components/vocabulary/GrammarSection'
import HiddenSection from '@/components/vocabulary/HiddenSection'

type ActiveTab = 'vocabulary' | 'grammar' | 'hidden'

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vocabulary')

  const renderSection = () => {
    switch (activeTab) {
      case 'vocabulary':
        return <VocabularySection />
      case 'grammar':
        return <GrammarSection />
      case 'hidden':
        return <HiddenSection />
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          📖 단어장 & 문법 노트
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`
              flex-1 flex items-center justify-center py-3 
              ${
                activeTab === 'vocabulary'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
              rounded-lg transition-colors
            `}
          >
            <Book className="w-5 h-5 mr-2" />
            단어장
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`
              flex-1 flex items-center justify-center py-3 
              ${
                activeTab === 'grammar'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
              rounded-lg transition-colors
            `}
          >
            <FileText className="w-5 h-5 mr-2" />
            문법 노트
          </button>
          <button
            onClick={() => setActiveTab('hidden')}
            className={`
              flex-1 flex items-center justify-center py-3 
              ${
                activeTab === 'hidden'
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }
              rounded-lg transition-colors
            `}
          >
            <EyeOff className="w-5 h-5 mr-2" />
            숨김 목록
          </button>
        </div>

        {/* 섹션 렌더링 */}
        {renderSection()}
      </div>
    </AppLayout>
  )
}
