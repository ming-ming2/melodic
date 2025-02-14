// components/vocabulary/ItemDetailModal.tsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Music, Book } from 'lucide-react'

interface VocabularyItem {
  id: string
  word: string
  meaning: string
  example: string
  songExample: {
    text: string
    songTitle: string
  }
  tags: string[]
  pronunciation?: string
  dateAdded: string
  hidden: boolean
}

interface ItemDetailModalProps {
  item: VocabularyItem
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

// 애니메이션에 사용할 variants. custom 값(direction)에 따라 x값을 조정함.
const swipeVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
  }),
}

export default function ItemDetailModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ItemDetailModalProps) {
  // direction: 1이면 오른쪽(다음), -1이면 왼쪽(이전)으로 넘기는 방향.
  const [direction, setDirection] = useState(0)

  // 모달 오픈 시 배경 스크롤 차단
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // 키보드 이벤트 (화살표 및 ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        setDirection(-1)
        onPrev()
      } else if (e.key === 'ArrowRight' && hasNext) {
        setDirection(1)
        onNext()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrev, onNext, onClose, hasPrev, hasNext])

  // 드래그 종료 시 오프셋에 따라 이전/다음 전환 (임계값: 50px)
  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50 && hasNext) {
      setDirection(1)
      onNext()
    } else if (info.offset.x > 50 && hasPrev) {
      setDirection(-1)
      onPrev()
    }
  }

  const handlePrevClick = () => {
    if (hasPrev) {
      setDirection(-1)
      onPrev()
    }
  }
  const handleNextClick = () => {
    if (hasNext) {
      setDirection(1)
      onNext()
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-gray-900 rounded-2xl shadow-xl overflow-hidden md:max-h-[90vh] md:overflow-y-auto"
        >
          {/* 좌측 화살표 버튼 */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevClick}
              disabled={!hasPrev}
              className={`p-2 ml-2 rounded-full transition-colors ${
                hasPrev
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>
          {/* 우측 화살표 버튼 */}
          <div className="absolute inset-y-0 right-0 flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextClick}
              disabled={!hasNext}
              className={`p-2 mr-2 rounded-full transition-colors ${
                hasNext
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={item.id}
              custom={direction}
              variants={swipeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
              className="p-6"
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {item.word}
                    </h2>
                    {item.pronunciation && (
                      <span className="text-lg text-gray-400">
                        {item.pronunciation}
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-accent-400">{item.meaning}</p>
                </div>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent-500/10 text-accent-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* 예문 섹션 */}
              <div className="space-y-6">
                {/* 일반 예문 */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Book className="w-5 h-5 text-accent-400" />
                    <h3 className="text-white font-medium">일반 예문</h3>
                  </div>
                  <p className="text-gray-300">{item.example}</p>
                </div>
                {/* 노래 예문 */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Music className="w-5 h-5 text-accent-400" />
                    <h3 className="text-white font-medium">노래 예문</h3>
                  </div>
                  <p className="text-gray-300 mb-2">{item.songExample.text}</p>
                  <p className="text-sm text-gray-400">
                    From: {item.songExample.songTitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
