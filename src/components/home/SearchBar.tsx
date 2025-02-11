// components/home/SearchBar.tsx
import React, { useState } from 'react'
import { Search, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleBack = () => {
    setIsFocused(false)
    setSearchQuery('')
  }

  return (
    <div className={`${className} relative z-50`}>
      <motion.div
        layout
        className={`
          bg-gray-800 overflow-hidden rounded-full
          ${isFocused ? 'fixed top-2 left-2 right-2 md:relative md:inset-auto' : ''}
          ${isFocused ? 'h-14 md:h-10' : 'h-10'}
        `}
        transition={{
          layout: { duration: 0.15, ease: 'easeOut' },
        }}
      >
        {/* 내부 컨텐츠를 absolute로 배치하여 좌우 이동 방지 */}
        <div className="relative h-full">
          {/* 뒤로가기 버튼 */}
          <AnimatePresence mode="wait">
            {isFocused && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 p-1"
                onClick={handleBack}
                transition={{ duration: 0.1 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* 메인 컨텐츠 */}
          <div
            className={`
            absolute top-0 h-full
            ${isFocused ? 'left-12 md:left-4' : 'left-4'}
            right-4
            transition-[left] duration-200 ease-out
            flex items-center
          `}
          >
            {/* 검색 아이콘 */}
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />

            {/* 입력창 */}
            <input
              type="text"
              placeholder="원하시는 노래를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="flex-1 h-full pl-3 bg-transparent text-white focus:outline-none text-base"
            />

            {/* 삭제 버튼 */}
            <AnimatePresence mode="wait">
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-2 hover:bg-gray-700 rounded-full flex-shrink-0"
                  onClick={() => setSearchQuery('')}
                  transition={{ duration: 0.1 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 검색 결과 (모바일에서만 표시) */}
      <AnimatePresence>
        {isFocused && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-2 right-2 top-[4.5rem] bottom-2 bg-gray-800 rounded-2xl shadow-lg"
            transition={{ duration: 0.15 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
