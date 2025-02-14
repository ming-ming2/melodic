// src/components/vocabulary/HiddenSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Book, FileText } from 'lucide-react'
import { LANGUAGE_DATA } from '@/utils/languageData'

type ViewMode = 'words' | 'grammar'

export default function HiddenSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('words')

  // 더미 데이터 (추후 실제 데이터로 대체)
  const hiddenWords = [
    { id: 1, word: '開く', meaning: '열다', language: 'ja' },
    { id: 2, word: 'ambitious', meaning: '야심찬', language: 'en' },
  ]

  const hiddenGrammars = [
    { id: 1, pattern: 'てしまう', explanation: '완료의 의미', language: 'ja' },
    {
      id: 2,
      pattern: 'Present Perfect',
      explanation: '과거부터 현재까지의 행동',
      language: 'en',
    },
  ]

  const restoreItem = (type: 'word' | 'grammar', id: number) => {
    // TODO: 실제 복원 로직 구현
    console.log(`복원 - ${type}: ${id}`)
  }

  return (
    <div>
      {/* 뷰 모드 토글 */}
      <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
        <button
          onClick={() => setViewMode('words')}
          className={`
            flex-1 flex items-center justify-center py-2 
            ${
              viewMode === 'words'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          <Book className="w-5 h-5 mr-2" />
          숨긴 단어
        </button>
        <button
          onClick={() => setViewMode('grammar')}
          className={`
            flex-1 flex items-center justify-center py-2 
            ${
              viewMode === 'grammar'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          <FileText className="w-5 h-5 mr-2" />
          숨긴 문법
        </button>
      </div>

      {/* 숨긴 단어 */}
      {viewMode === 'words' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {hiddenWords.map((item) => {
            const languageData = LANGUAGE_DATA.find(
              (lang) => lang.id === item.language
            )
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-4xl mr-4">{languageData?.flag}</div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.word}</h3>
                  <p className="text-gray-400 text-sm">{item.meaning}</p>
                </div>
                <button
                  onClick={() => restoreItem('word', item.id)}
                  className="text-accent-500 hover:text-accent-400 flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  복원
                </button>
              </div>
            )
          })}
          {hiddenWords.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              숨긴 단어가 없습니다.
            </div>
          )}
        </motion.div>
      )}

      {/* 숨긴 문법 */}
      {viewMode === 'grammar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {hiddenGrammars.map((item) => {
            const languageData = LANGUAGE_DATA.find(
              (lang) => lang.id === item.language
            )
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-4xl mr-4">{languageData?.flag}</div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.pattern}</h3>
                  <p className="text-gray-400 text-sm">{item.explanation}</p>
                </div>
                <button
                  onClick={() => restoreItem('grammar', item.id)}
                  className="text-accent-500 hover:text-accent-400 flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  복원
                </button>
              </div>
            )
          })}
          {hiddenGrammars.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              숨긴 문법이 없습니다.
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
