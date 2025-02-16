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

// 텍스트 줄바꿈 처리를 위한 함수
function formatKoreanText(text: string) {
  return text.replace(/([.?!])\s+/g, '$1\u00A0')
}

interface ExpressionTabProps {
  lyric: LyricLine
}

export default function ExpressionTab({ lyric }: ExpressionTabProps) {
  const expressions = lyric.expressions || []
  const [savedExpressions, setSavedExpressions] = useState<Set<string>>(
    new Set()
  )
  const [hiddenExpressions, setHiddenExpressions] = useState<Set<string>>(
    new Set()
  )
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)

  // lyric prop이 변경되면 페이지를 초기화
  useEffect(() => {
    setCurrentPage(0)
  }, [lyric])

  const totalPages = expressions.length

  const toggleSetItem = (
    setState: React.Dispatch<React.SetStateAction<Set<string>>>,
    expression: string
  ) => {
    setState((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(word)) {
        newSet.delete(word)
      } else {
        newSet.add(word)
      }
      return newSet
    })
  }

  const handleToggleSave = (expression: string) => {
    toggleSetItem(setSavedExpressions, expression)
    // TODO: 실제 저장 로직 구현
  }

  const handleToggleHide = (expression: string) => {
    toggleSetItem(setHiddenExpressions, expression)
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

  // 현재 페이지에 해당하는 표현 1개 추출
  const currentExpressions = expressions.slice(currentPage, currentPage + 1)

  if (expressions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>이 가사에는 분석할 표현이 없어요!</p>
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
          {currentExpressions.map((expressionItem, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* 표현 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3
                    className="text-lg font-medium text-white"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {formatKoreanText(expressionItem.expression)}
                  </h3>
                  <p
                    className="text-accent-400 text-sm"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {formatKoreanText(expressionItem.meaning)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(expressionItem.expression)}
                    className={`p-2 rounded-full transition-colors ${
                      savedExpressions.has(expressionItem.expression)
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {savedExpressions.has(expressionItem.expression) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleHide(expressionItem.expression)}
                    className={`p-2 rounded-lg transition-colors ${
                      hiddenExpressions.has(expressionItem.expression)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {hiddenExpressions.has(expressionItem.expression) ? (
                      <EyeOff className="w-5 h-5 text-red-500" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 예문 영역 */}
              {expressionItem.example && (
                <div className="p-4 bg-gray-800/50">
                  <p
                    className="text-sm text-gray-400 mb-1"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    예문
                  </p>
                  <p
                    className="text-gray-300"
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {formatKoreanText(expressionItem.example)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 동그라미 인디케이터 (보라색) */}
      {expressions.length > 1 && (
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
      {expressions.length > 1 && (
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
