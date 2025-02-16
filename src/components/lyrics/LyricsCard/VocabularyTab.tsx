// components/lyrics/LyricsCard/VocabularyTab.tsx
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookmarkPlus, Check } from 'lucide-react'
import type { LyricLine } from '@/types/lyrics'

// 텍스트 줄바꿈 처리를 위한 함수
function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

interface VocabularyTabProps {
  lyric: LyricLine
}

export default function VocabularyTab({ lyric }: VocabularyTabProps) {
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const words = lyric.words || []

  // lyric prop이 바뀌면 currentPage를 초기화
  useEffect(() => {
    setCurrentPage(0)
  }, [lyric])

  const totalPages = words.length // 한 페이지당 1개씩

  const handleSaveWord = (word: string) => {
    setSavedWords((prev) => {
      const newSet = new Set(prev)
      newSet.add(word)
      return newSet
    })
    // TODO: 실제 저장 로직 구현
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
    if (info.offset.x < -50) {
      handleNext()
    } else if (info.offset.x > 50) {
      handlePrev()
    }
  }

  // 키보드 좌우 화살표 처리
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

  // 한 페이지에 1개씩
  const currentWords = words.slice(currentPage, currentPage + 1)

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 학습할 단어가 없어요!</p>
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
          {currentWords.map((wordItem, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* 단어 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3
                    className="text-lg font-medium text-white"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {formatKoreanText(wordItem.word)}
                  </h3>
                  <p
                    className="text-accent-400 text-sm"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {formatKoreanText(wordItem.meaning)}
                  </p>
                </div>
                <button
                  onClick={() => handleSaveWord(wordItem.word)}
                  className={`p-2 rounded-full transition-colors ${
                    savedWords.has(wordItem.word)
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {savedWords.has(wordItem.word) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <BookmarkPlus className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* 예문 */}
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
                  {formatKoreanText(wordItem.example)}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 페이지 인디케이터: 보라색 동그라미 */}
      {words.length > 1 && (
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

      {/* 좌우 네비게이션 버튼 */}
      {words.length > 1 && (
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
