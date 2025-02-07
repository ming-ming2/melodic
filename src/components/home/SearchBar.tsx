// components/home/SearchBar.tsx
import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useSongStore from '@/stores/songStore'

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const { searchHistory, addSearchHistory } = useSongStore()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery)
      // 검색 로직 추가 필요
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsFocused(false)
  }

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center bg-gray-800 rounded-xl p-3 shadow-md"
      >
        <Search className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="노래 제목이나 가사를 검색해보세요"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full bg-transparent text-white outline-none"
        />
        {searchQuery && (
          <X className="text-gray-400 cursor-pointer" onClick={clearSearch} />
        )}
      </motion.div>

      <AnimatePresence>
        {isFocused && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full bg-gray-700 rounded-b-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
          >
            <div className="p-2 text-sm text-gray-300">최근 검색어</div>
            {searchHistory.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="p-2 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  setSearchQuery(item.query)
                  handleSearch()
                }}
              >
                <span>{item.query}</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
