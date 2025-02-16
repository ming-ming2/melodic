import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Check,
  EyeOff,
} from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

// 텍스트 포맷 함수
function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

interface GrammarTabProps {
  lyric: LyricLine
}

export default function GrammarTab({ lyric }: GrammarTabProps) {
  const grammarItems = lyric.grammar || []
  const [savedGrammars, setSavedGrammars] = useState<Set<string>>(new Set())
  const [hiddenGrammars, setHiddenGrammars] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setCurrentPage(0)
  }, [lyric])

  const totalPages = grammarItems.length

  const toggleSetItem = (
    setState: React.Dispatch<React.SetStateAction<Set<string>>>,
    pattern: string
  ) => {
    setState((prev) => {
      const newSet = new Set(prev)
      newSet.has(pattern) ? newSet.delete(pattern) : newSet.add(pattern)
      return newSet
    })
  }

  const handleToggleSave = (pattern: string) => {
    toggleSetItem(setSavedGrammars, pattern)
    // TODO: 실제 저장 로직 구현
  }

  const handleToggleHide = (pattern: string) => {
    toggleSetItem(setHiddenGrammars, pattern)
    // TODO: 실제 숨김 로직 구현
  }

  const handleNext = () => {
    if (totalPages <= 1) return
    setDirection(1)
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrev = () => {
    if (totalPages <= 1) return
    setDirection(-1)
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50) handleNext()
    else if (info.offset.x > 50) handlePrev()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages])

  const swipeVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    animate: { opacity: 1, x: 0 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  }

  const currentGrammar = grammarItems.slice(currentPage, currentPage + 1)

  if (grammarItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 학습할 문법이 없어요!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={swipeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'tween', duration: 0.1, ease: 'easeInOut' }}
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="space-y-4"
        >
          {currentGrammar.map((grammarItem, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <div
                className="p-4 border-b border-gray-700 flex justify-between items-start"
                style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              >
                <div>
                  <h3 className="text-lg font-medium text-accent-400 mb-2">
                    {formatKoreanText(grammarItem.pattern)}
                  </h3>
                  <p className="text-white">
                    {formatKoreanText(grammarItem.explanation)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(grammarItem.pattern)}
                    className={`p-2 rounded-full transition-colors ${
                      savedGrammars.has(grammarItem.pattern)
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {savedGrammars.has(grammarItem.pattern) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleHide(grammarItem.pattern)}
                    className={`p-2 rounded-lg transition-colors ${
                      hiddenGrammars.has(grammarItem.pattern)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {hiddenGrammars.has(grammarItem.pattern) ? (
                      <EyeOff className="w-5 h-5 text-red-500" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50">
                <p
                  className="text-sm text-gray-400 mb-1"
                  style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                >
                  예문
                </p>
                <p
                  className="text-gray-300"
                  style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                >
                  {formatKoreanText(grammarItem.example)}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {grammarItems.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentPage ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {grammarItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-transparent"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-transparent"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  )
}
