import React, { useState } from 'react'
import { EyeOff, Hash, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface GrammarListProps {
  items: GrammarItem[]
  sortBy: 'recent' | 'alphabetical'
  searchQuery: string
  onItemClick: (item: GrammarItem) => void
  onHideItem?: (item: GrammarItem) => void
}

export default function GrammarList({
  items,
  onItemClick,
  onHideItem,
}: GrammarListProps) {
  const [visibleItems, setVisibleItems] = useState<GrammarItem[]>(items)

  const handleHideItem = (item: GrammarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmHide = window.confirm('정말로 이 항목을 숨기시겠습니까?')

    if (confirmHide) {
      // 컴포넌트 내부에서 처리
      setVisibleItems((prev) => prev.filter((i) => i.id !== item.id))

      // 부모 컴포넌트에 숨김 이벤트 전달 (옵셔널)
      onHideItem?.(item)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <AnimatePresence>
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              {/* 문법 정보 */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="mt-1 flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-accent-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-medium text-white hover:text-accent-400 transition-colors">
                        {item.pattern}
                      </h3>
                      <span className="text-sm text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded">
                        {item.level}
                      </span>
                    </div>
                    <p className="text-gray-300">{item.meaning}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {item.explanation}
                    </p>
                  </div>
                  {/* 숨김 버튼 */}
                  <button
                    onClick={(e) => handleHideItem(item, e)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>

                {/* 태그 */}
                <div className="flex items-center gap-2 ml-8">
                  <Hash className="w-3 h-3 text-accent-400" />
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
