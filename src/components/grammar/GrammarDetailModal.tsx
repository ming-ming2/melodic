// components/grammar/GrammarDetailModal.tsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Book,
  Lightbulb,
  Music,
} from 'lucide-react'

interface GrammarItem {
  id: string
  pattern: string
  meaning: string
  explanation: string
  example: string
  songExample: {
    text: string
    songTitle: string
  }
  tags: string[]
  level: string
  dateAdded: string
  hidden: boolean
}

interface GrammarDetailModalProps {
  item: GrammarItem
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

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

export default function GrammarDetailModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: GrammarDetailModalProps) {
  const [direction, setDirection] = useState(0)

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

  const handleDragEnd = (e: any, { offset }: { offset: { x: number } }) => {
    if (offset.x < -50 && hasNext) {
      setDirection(1)
      onNext()
    } else if (offset.x > 50 && hasPrev) {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={item.id}
              custom={direction}
              variants={swipeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
              className="p-4 max-h-[65vh] overflow-y-auto"
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-accent-500/10 text-accent-400">
                      {item.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {item.pattern}
                  </h2>
                  <p className="text-base text-accent-400">{item.meaning}</p>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 p-4 -m-2 z-10" // 터치 영역 크게 확보
                >
                  <X className="w-6 h-6 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-accent-500/10 text-accent-400 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 설명 섹션 */}
              <div className="bg-gray-800 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent-400" />
                  <h3 className="text-sm font-medium text-white">설명</h3>
                </div>
                <p className="text-xs text-gray-300">{item.explanation}</p>
              </div>

              {/* 예문 섹션 */}
              <div className="space-y-3">
                {/* 일반 예문 */}
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Book className="w-4 h-4 text-accent-400" />
                    <h3 className="text-sm font-medium text-white">
                      일반 예문
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300">{item.example}</p>
                </div>

                {/* 노래 예문 */}
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-accent-400" />
                    <h3 className="text-sm font-medium text-white">
                      노래 예문
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 mb-1">
                    {item.songExample.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    From: {item.songExample.songTitle}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 네비게이션 버튼 */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button
              onClick={handlePrevClick}
              disabled={!hasPrev}
              className="p-2 rounded-full disabled:opacity-50 bg-transparent hover:bg-white/10"
            >
              <ChevronLeft className="w-6 h-6 text-white/70 hover:text-white" />
            </button>
            <button
              onClick={handleNextClick}
              disabled={!hasNext}
              className="p-2 rounded-full disabled:opacity-50 bg-transparent hover:bg-white/10"
            >
              <ChevronRight className="w-6 h-6 text-white/70 hover:text-white" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
