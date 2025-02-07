// components/home/RecentLearningList.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSongStore from '@/stores/songStore'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RecentLearningList: React.FC = () => {
  const { recentLearnings, toggleFavorite } = useSongStore()
  const router = useRouter()

  const handleSongClick = (songId: number) => {
    router.push(`/learn/${songId}`)
  }

  const sortedLearnings = [...recentLearnings].sort(
    (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
  )

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">📚 최근 학습한 노래</h2>
      <AnimatePresence>
        {sortedLearnings.map((song) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`
              flex items-center p-3 mb-2 rounded-xl 
              ${
                song.isFavorite
                  ? 'bg-gray-800 border-2 border-accent-600'
                  : 'bg-gray-900 hover:bg-gray-800'
              }
              transition-all duration-300 cursor-pointer
            `}
          >
            <img
              src={song.albumCover}
              alt={`${song.title} 앨범 커버`}
              className="w-16 h-16 rounded-lg mr-4 object-cover"
            />
            <div className="flex-grow" onClick={() => handleSongClick(song.id)}>
              <h3 className="text-md font-semibold text-white">{song.title}</h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
              <p className="text-xs text-gray-500 mt-1">
                학습 날짜: {song.learnedDate || '최근'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(song.id)
              }}
              className={`
                p-2 rounded-full transition-colors 
                ${
                  song.isFavorite
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-500 hover:text-yellow-400'
                }
              `}
            >
              <Star
                fill={song.isFavorite ? 'currentColor' : 'transparent'}
                strokeWidth={1.5}
                className="w-6 h-6"
              />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default RecentLearningList
