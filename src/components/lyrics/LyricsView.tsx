// components/lyrics/LyricsView.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LyricLine } from '@/types/lyrics'
import WordPopup from './WordPopup'
import GrammarPopup from './GrammarPopup'

interface LyricsViewProps {
  lyrics: LyricLine[]
  currentLineId?: number
}

export default function LyricsView({ lyrics, currentLineId }: LyricsViewProps) {
  const [selectedWord, setSelectedWord] = useState<{
    word: string
    meaning: string
    example: string
    rect: DOMRect
  } | null>(null)

  const [selectedGrammar, setSelectedGrammar] = useState<{
    pattern: string
    explanation: string
    example: string
    rect: DOMRect
  } | null>(null)

  const handleWordClick = (
    word: string,
    meaning: string,
    example: string,
    event: React.MouseEvent
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSelectedWord({ word, meaning, example, rect })
    setSelectedGrammar(null)
  }

  const handleGrammarClick = (
    pattern: string,
    explanation: string,
    example: string,
    event: React.MouseEvent
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSelectedGrammar({ pattern, explanation, example, rect })
    setSelectedWord(null)
  }

  return (
    <div className="space-y-6">
      {lyrics.map((line) => (
        <motion.div
          key={line.line_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl ${
            currentLineId === line.line_id
              ? 'bg-accent-500 bg-opacity-10'
              : 'hover:bg-gray-800'
          } transition-colors`}
        >
          {/* 원문 */}
          <p className="text-lg font-medium text-white mb-2">
            {line.words.map((word, index) => (
              <React.Fragment key={index}>
                <span
                  onClick={(e) =>
                    handleWordClick(word.word, word.meaning, word.example, e)
                  }
                  className="cursor-pointer hover:text-accent-400 transition-colors"
                >
                  {word.word.split(' ')[0]}
                </span>{' '}
              </React.Fragment>
            ))}
          </p>

          {/* 번역 */}
          <p className="text-gray-400 mb-2">{line.translated}</p>

          {/* 문법 표시 */}
          {line.grammar.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {line.grammar.map((gram, index) => (
                <span
                  key={index}
                  onClick={(e) =>
                    handleGrammarClick(
                      gram.pattern,
                      gram.explanation,
                      gram.example,
                      e
                    )
                  }
                  className="text-sm px-2 py-1 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors text-gray-300"
                >
                  {gram.pattern}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {/* 팝업 */}
      <AnimatePresence>
        {selectedWord && (
          <WordPopup {...selectedWord} onClose={() => setSelectedWord(null)} />
        )}
        {selectedGrammar && (
          <GrammarPopup
            {...selectedGrammar}
            onClose={() => setSelectedGrammar(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
