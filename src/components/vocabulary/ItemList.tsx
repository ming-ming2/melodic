import React, { useState } from 'react'
import { EyeOff, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface ItemListProps {
  items: VocabularyItem[]
  sortBy: 'recent' | 'alphabetical'
  searchQuery: string
  onItemClick: (item: VocabularyItem) => void
  onHideItem?: (item: VocabularyItem) => void
}

export default function ItemList({
  items,
  onItemClick,
  onHideItem,
}: ItemListProps) {
  const [visibleItems, setVisibleItems] = useState<VocabularyItem[]>(items)

  const handleHideItem = (item: VocabularyItem, e: React.MouseEvent) => {
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
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              {/* 단어 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium hover:text-accent-400 transition-colors">
                    {item.word}
                  </h3>
                  {item.pronunciation && (
                    <span className="text-sm text-gray-400">
                      {item.pronunciation}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{item.meaning}</p>
                {/* 태그 */}
                <div className="flex items-center gap-2 mt-2">
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

              {/* 숨김 버튼 */}
              <button
                onClick={(e) => handleHideItem(item, e)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <EyeOff className="w-5 h-5" />
              </button>
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
