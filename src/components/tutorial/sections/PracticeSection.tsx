// components/tutorial/sections/PracticeSection.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookmarkPlus, Check, Lock } from 'lucide-react'
import { SAMPLE_LYRICS } from '@/utils/dummyData'

interface PracticeSectionProps {
  onPremiumFeatureClick: () => void
}

export default function PracticeSection({
  onPremiumFeatureClick,
}: PracticeSectionProps) {
  const [savedWords, setSavedWords] = useState<string[]>([])
  const [hiddenWords, setHiddenWords] = useState<string[]>([])

  const sampleLyric = SAMPLE_LYRICS.lyrics_analysis[0]

  const handleSaveWord = (word: string) => {
    if (!savedWords.includes(word)) {
      setSavedWords([...savedWords, word])
    }
  }

  const handleHideWord = (word: string) => {
    if (!hiddenWords.includes(word)) {
      setHiddenWords([...hiddenWords, word])
    }
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          실제 학습 경험 체험하기
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          멜로딕에서 어떻게 노래로 언어를 학습하는지 직접 체험해보세요.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">가사 분석</h3>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="text-white mb-2">{sampleLyric.original}</div>
            <div className="text-gray-400">{sampleLyric.translated}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">단어 학습</h3>
          <div className="space-y-3">
            {sampleLyric.words.map((wordItem, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">{wordItem.word}</div>
                  <div className="text-gray-400">{wordItem.meaning}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    예문: {wordItem.example}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSaveWord(wordItem.word)}
                    className={`
                      p-2 rounded-full 
                      ${
                        savedWords.includes(wordItem.word)
                          ? 'bg-accent-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }
                    `}
                  >
                    {savedWords.includes(wordItem.word) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleHideWord(wordItem.word)}
                    className={`
                      p-2 rounded-full 
                      ${
                        hiddenWords.includes(wordItem.word)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }
                    `}
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-2">문법 분석</h3>
          {sampleLyric.grammar.length > 0 ? (
            sampleLyric.grammar.map((grammarItem, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-4 mb-3">
                <div className="text-accent-400 font-medium mb-2">
                  {grammarItem.pattern}
                </div>
                <div className="text-white mb-2">{grammarItem.explanation}</div>
                <div className="text-gray-400 text-sm">
                  예문: {grammarItem.example}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              분석할 문법이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPremiumFeatureClick}
          className="bg-accent-600 text-white px-6 py-3 rounded-xl hover:bg-accent-700 transition-colors"
        >
          더 많은 학습 기능 체험하기
        </motion.button>
      </div>
    </div>
  )
}
