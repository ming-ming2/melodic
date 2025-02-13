// src/components/vocabulary/GrammarSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LANGUAGE_DATA } from '@/utils/languageData'

type ViewMode = 'language' | 'song'

export default function GrammarSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('language')

  // 더미 데이터 (추후 실제 데이터로 대체)
  const languageGrammars = [
    { language: 'ja', grammars: 15, songs: 5 },
    { language: 'en', grammars: 30, songs: 8 },
    { language: 'fr', grammars: 20, songs: 3 },
  ]

  const songGrammars = [
    {
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      grammars: 7,
      language: 'en',
    },
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      grammars: 5,
      language: 'en',
    },
  ]

  return (
    <div>
      {/* 뷰 모드 토글 */}
      <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
        <button
          onClick={() => setViewMode('language')}
          className={`
            flex-1 flex items-center justify-center py-2 
            ${
              viewMode === 'language'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          언어별 문법 노트
        </button>
        <button
          onClick={() => setViewMode('song')}
          className={`
            flex-1 flex items-center justify-center py-2 
            ${
              viewMode === 'song'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          노래별 문법 노트
        </button>
      </div>

      {/* 언어별 문법 노트 */}
      {viewMode === 'language' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {languageGrammars.map((item) => {
            const languageData = LANGUAGE_DATA.find(
              (lang) => lang.id === item.language
            )
            return (
              <div
                key={item.language}
                className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-4xl mr-4">{languageData?.flag}</div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">
                    {languageData?.name} 문법 노트
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.grammars}개 문법 패턴 | {item.songs}개 학습 노래
                  </p>
                </div>
                <button className="text-accent-500 hover:text-accent-400">
                  보기
                </button>
              </div>
            )
          })}
        </motion.div>
      )}

      {/* 노래별 문법 노트 */}
      {viewMode === 'song' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {songGrammars.map((song) => {
            const languageData = LANGUAGE_DATA.find(
              (lang) => lang.id === song.language
            )
            return (
              <div
                key={song.title}
                className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-4xl mr-4">{languageData?.flag}</div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{song.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {song.artist} | {song.grammars}개 문법 패턴
                  </p>
                </div>
                <button className="text-accent-500 hover:text-accent-400">
                  보기
                </button>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
