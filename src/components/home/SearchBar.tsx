import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, ArrowLeft, Loader2, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SpotifySearchResult } from '@/types/spotify'
import { searchSpotifyTracks } from '@/utils/spotifySearch'
import { findBestMatchingVideo } from '@/utils/youtubeMatching'
import { fetchLyricsFromLrclib } from '@/utils/lrcService'
import { getVideoCaption } from '@/utils/youtubeUtils'

interface SearchBarProps {
  className?: string
  onSearchStart?: () => void
  onSearchEnd?: () => void
}

// 검색어와 결과의 유사도를 하이라이트하는 컴포넌트
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>

  const lowercaseText = text.toLowerCase()
  const lowercaseQuery = query.toLowerCase()

  if (!lowercaseText.includes(lowercaseQuery)) {
    return <>{text}</>
  }

  const startIndex = lowercaseText.indexOf(lowercaseQuery)
  const endIndex = startIndex + lowercaseQuery.length

  return (
    <>
      {text.slice(0, startIndex)}
      <span className="text-accent-400 font-medium">
        {text.slice(startIndex, endIndex)}
      </span>
      {text.slice(endIndex)}
    </>
  )
}

export default function SearchBar({
  className,
  onSearchStart,
  onSearchEnd,
}: SearchBarProps) {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const results = await searchSpotifyTracks(query)
      setSearchResults(results)
      setShowResults(results.length > 0)

      if (results.length === 0) {
        // 검색 결과가 없을 때 더 명확한 피드백
        setErrorMessage(`"${query}"에 대한 검색 결과가 없습니다`)
      }
    } catch (error) {
      console.error('검색 오류:', error)
      setSearchResults([])
      setShowResults(false)
      setErrorMessage('검색 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 검색어 변경 시 디바운스 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(searchQuery)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearch])

  // 검색 결과 영역 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 입력 필드와 결과 컨테이너를 모두 체크
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsContainerRef.current &&
        !resultsContainerRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          setShowResults(false)
        }, 200) // 클릭 이벤트 처리를 위한 약간의 지연
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // 입력이 있을 때 에러 메시지 초기화
    if (value) {
      setErrorMessage(null)
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    // 기존에 검색 결과가 있으면 표시
    if (searchResults.length > 0) {
      setShowResults(true)
    }
  }

  // 노래 선택 처리 함수
  const handleResultClick = async (result: SpotifySearchResult) => {
    try {
      setIsProcessing(true)
      onSearchStart?.()
      setErrorMessage(null)

      // YouTube에서 매칭되는 영상 찾기
      const videoMatch = await findBestMatchingVideo(result)
      if (!videoMatch) {
        setErrorMessage(`"${result.title}"에 맞는 영상을 찾지 못했습니다`)
        console.error('매칭되는 영상을 찾지 못했습니다')
        return
      }

      let originalLyrics = null
      let lyricsSource = ''

      // 가사 정보 가져오기 시도
      try {
        // 1단계: YouTube 자막 정보 가져오기 시도
        console.log('YouTube 자막 정보 가져오기 시도...')
        const captions = await getVideoCaption(videoMatch.id)
        if (captions && captions.length > 0) {
          lyricsSource = 'youtube'
          console.log('YouTube 자막 찾음:', captions.length, '개')
        } else {
          throw new Error('YouTube 자막 없음')
        }
      } catch (_) {
        // 2단계: LRClib에서 가사 정보 가져오기 시도
        console.log('LRClib 가사 검색 시도 중...')
        originalLyrics = await fetchLyricsFromLrclib(
          result.artist,
          result.title
        )

        if (originalLyrics) {
          lyricsSource = 'lrclib'
          console.log('LRClib 가사 찾음')
        } else {
          console.log('가사를 찾지 못했습니다')
        }
      }

      // 페이지 이동 URL 구성
      let url = `/lyrics/${videoMatch.id}?title=${encodeURIComponent(
        result.title
      )}&artist=${encodeURIComponent(result.artist)}`

      // 앨범 커버 이미지 추가
      if (result.albumImageUrl) {
        url += `&cover=${encodeURIComponent(result.albumImageUrl)}`
      }

      // LRClib에서 가져온 가사가 있는 경우에만 URL에 추가
      if (lyricsSource === 'lrclib' && originalLyrics) {
        const encodedLyrics = encodeURIComponent(
          btoa(encodeURIComponent(originalLyrics))
        )
        url += `&lyrics=${encodedLyrics}&source=lrclib`
      } else {
        url += `&source=${lyricsSource}`
      }

      // 페이지 이동
      router.push(url)

      // 상태 초기화
      setIsFocused(false)
      setSearchQuery('')
      setSearchResults([])
      setShowResults(false)
    } catch (error) {
      console.error('노래 검색 처리 중 오류:', error)
      setErrorMessage('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
      onSearchEnd?.()
    }
  }

  const handleBack = () => {
    setIsFocused(false)
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    setErrorMessage(null)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    setErrorMessage(null)
    inputRef.current?.focus()
  }

  return (
    <div className={`${className} relative z-50`}>
      {/* 검색창 */}
      <motion.div
        layout
        className={`
          bg-gray-800 overflow-hidden rounded-full
          ${isFocused ? 'fixed top-2 left-2 right-2 md:relative md:inset-auto' : ''}
          ${isFocused ? 'h-14 md:h-10' : 'h-10'}
          border border-transparent focus-within:border-accent-500/30
        `}
        transition={{
          layout: { duration: 0.15, ease: 'easeOut' },
        }}
      >
        <div className="relative h-full">
          {/* 뒤로가기 버튼 (모바일) */}
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

          {/* 검색 입력 필드 */}
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
              onFocus={handleInputFocus}
              className="flex-1 h-full pl-3 bg-transparent text-white focus:outline-none text-base"
            />

            {/* 로딩 / 삭제 버튼 */}
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
                    onClick={handleClearSearch}
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

      {/* 검색 결과 표시 영역 */}
      <AnimatePresence>
        {isFocused && (showResults || errorMessage) && (
          <motion.div
            ref={resultsContainerRef}
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
              border border-gray-700/50
            "
          >
            {/* 에러 메시지 표시 */}
            {errorMessage && (
              <div className="py-6 text-center text-gray-400">
                {errorMessage}
              </div>
            )}

            {/* 검색 결과 리스트 */}
            {!errorMessage && searchResults.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700/50">
                  &quot;{searchQuery}&quot;와(과) 일치하는 {searchResults.length}개의 결과
                </div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    disabled={isProcessing}
                    className={`
                      w-full p-4 hover:bg-gray-700/50 transition-colors 
                      flex items-center gap-4 border-b border-gray-700/50 
                      last:border-b-0
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          result.albumImageUrl || '/images/default-cover.jpg'
                        }
                        alt={result.albumName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 이미지 로드 실패 시 대체 이미지
                          ;(e.target as HTMLImageElement).src =
                            '/images/default-cover.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white text-sm font-medium mb-1 truncate">
                        <HighlightedText
                          text={result.title}
                          query={searchQuery}
                        />
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        <HighlightedText
                          text={result.artist}
                          query={searchQuery}
                        />{' '}
                        • {result.albumName}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* 로딩 오버레이 */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-xs mx-auto shadow-2xl border border-gray-700/50"
            >
              <div className="relative w-20 h-20 mx-auto mb-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t-2 border-l-2 border-accent-500"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 rounded-full border-b-2 border-r-2 border-accent-400"
                ></motion.div>
                <div className="absolute inset-3 flex items-center justify-center">
                  <Music className="w-8 h-8 text-accent-400" />
                </div>
              </div>

              <h3 className="text-white font-bold text-lg mb-2">
                음악 학습 준비 중
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                YouTube 영상과 가사를 분석하고 있어요
              </p>

              <div className="w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{
                    width: ['0%', '30%', '60%', '100%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
