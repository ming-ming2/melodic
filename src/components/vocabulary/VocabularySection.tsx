// src/components/vocabulary/VocabularySection.tsx
import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { LANGUAGE_DATA } from '@/utils/languageData'

type ViewMode = 'language' | 'song'

export default function VocabularySection() {
  const [viewMode, setViewMode] = useState<ViewMode>('language')

  // 더미 데이터 (추후 실제 데이터로 대체)
  const languageWords = [
    { language: 'ja', words: 10, songs: 3 },
    { language: 'en', words: 25, songs: 7 },
    { language: 'fr', words: 15, songs: 2 },
  ]

  const songWords = [
    { title: 'Shape of You', artist: 'Ed Sheeran', words: 12, language: 'en' },
    {
      title: 'Careless Whisper',
      artist: 'George Michael',
      words: 8,
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
          언어별 단어장
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
          노래별 단어장
        </button>
      </div>

      {/* 언어별 단어장 */}
      {viewMode === 'language' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {languageWords.map((item) => {
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
                    {languageData?.name} 단어장
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.words}개 단어 | {item.songs}개 학습 노래
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

      {/* 노래별 단어장 */}
      {viewMode === 'song' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {songWords.map((song) => {
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
                    {song.artist} | {song.words}개 단어
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
