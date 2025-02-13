// components/home/SearchBar.tsx
import React, { useState, useRef, useCallback } from 'react'
import { Search, X, ArrowLeft, Loader2, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import debounce from 'lodash/debounce'
import { SpotifySearchResult } from '@/types/spotify'
import { searchSpotifyTracks } from '@/utils/spotifySearch'

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([])
        return
      }

      try {
        setIsLoading(true)
        const results = await searchSpotifyTracks(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handleResultClick = (result: SpotifySearchResult) => {
    // TODO: YouTube API 연동은 나중에 구현
    console.log('Selected track:', result)
    setIsFocused(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleBack = () => {
    setIsFocused(false)
    setSearchQuery('')
    setSearchResults([])
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
        <div className="relative h-full">
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

          <div
            className={`
              absolute top-0 h-full
              ${isFocused ? 'left-12 md:left-4' : 'left-4'}
              right-4
              transition-[left] duration-200 ease-out
              flex items-center
            `}
          >
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />

            <input
              ref={inputRef}
              type="text"
              placeholder="원하시는 노래를 검색하세요"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              className="flex-1 h-full pl-3 bg-transparent text-white focus:outline-none text-base"
            />

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-2"
                  transition={{ duration: 0.1 }}
                >
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </motion.div>
              ) : (
                searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 hover:bg-gray-700 rounded-full flex-shrink-0"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                      inputRef.current?.focus()
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      {/* 검색 결과 */}
      <AnimatePresence>
        {isFocused && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
        fixed top-[4.5rem] left-2 right-2
        md:absolute md:top-full md:mt-2
        bg-gray-800/90 backdrop-blur-md 
        rounded-2xl shadow-2xl overflow-hidden
        max-h-[60vh] md:max-h-[400px]
        overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
      "
          >
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="w-full p-4 hover:bg-gray-700/50 transition-colors flex items-center gap-4 border-b border-gray-700/50 last:border-b-0"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={result.albumImageUrl}
                    alt={result.albumName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-white text-sm font-medium mb-1 truncate">
                    {result.title}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {result.artist} • {result.albumName}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
