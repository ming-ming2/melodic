import React, { useState } from 'react'
import { Search, ArrowUpDown, BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface VocabularyDetailHeaderProps {
  title: string
  totalItems: number
  todayTarget: number
  todayLearned: number
  onSortChange: (sortBy: 'recent' | 'alphabetical') => void
  onSearchChange: (query: string) => void
}

export default function VocabularyDetailHeader({
  title,
  totalItems,
  todayTarget,
  todayLearned,
  onSortChange,
  onSearchChange,
}: VocabularyDetailHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <div className="space-y-4">
      {/* 상단부: 제목 및 버튼들 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2">
          {/* 검색 토글 버튼 */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* 정렬 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>

            {/* 정렬 메뉴 */}
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    onSortChange('recent')
                    setShowSortMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  최근 추가순
                </button>
                <button
                  onClick={() => {
                    onSortChange('alphabetical')
                    setShowSortMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  알파벳순
                </button>
              </div>
            )}
          </div>

          {/* 통계 버튼 */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 검색바 */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showSearch ? 'auto' : 0,
          opacity: showSearch ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="bg-gray-800 rounded-lg p-2">
          <input
            type="text"
            placeholder="단어 검색..."
            onChange={handleSearchChange}
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* 학습 진행률 (트렌디한 디자인) */}
      <div className="bg-gray-800 rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">오늘의 학습</span>
          <span className="text-white">
            {todayLearned} / {todayTarget}
          </span>
        </div>
        <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(todayLearned / todayTarget) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {Math.round((todayLearned / todayTarget) * 100)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-gray-400">전체 단어</p>
            <p className="text-lg font-medium text-white">{totalItems}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
