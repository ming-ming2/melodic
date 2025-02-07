// components/home/PopularSongsList.tsx
import React from 'react'
import { motion } from 'framer-motion'
import useSongStore from '@/stores/songStore'
import { useRouter } from 'next/navigation'

const PopularSongsList: React.FC = () => {
  const { popularSongs } = useSongStore()
  const router = useRouter()

  const handleSongClick = (songId: number) => {
    router.push(`/learn/${songId}`)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">🔥 인기 노래</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {popularSongs.map((song) => (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 w-48 cursor-pointer"
            onClick={() => handleSongClick(song.id)}
          >
            <div className="relative">
              <img
                src={song.albumCover}
                alt={`${song.title} 앨범 커버`}
                className="w-full h-48 object-cover rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 bg-black opacity-20 hover:opacity-10 transition-opacity rounded-2xl" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-semibold truncate">{song.title}</h3>
                <p className="text-xs truncate">{song.artist}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PopularSongsList
