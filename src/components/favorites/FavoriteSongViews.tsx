// components/favorites/FavoriteSongViews.tsx
import React from 'react'
import Image from 'next/image'
import { motion, LayoutGroup } from 'framer-motion'
import { Star, Music } from 'lucide-react'
import type { Song } from '@/types/song'

interface SongViewProps {
  songs: Song[]
  onSongClick: (songId: number) => void
  onUnfavorite: (songId: number) => void
}

export function FavoriteSongGrid({
  songs,
  onSongClick,
  onUnfavorite,
}: SongViewProps) {
  return (
    <LayoutGroup>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {songs.map((song) => (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
            className="bg-gradient-to-br from-gray-800/50 to-accent-500/10 
            rounded-2xl overflow-hidden group 
            border border-gray-700/50 hover:border-accent-500/30 
            transition-all duration-300 backdrop-blur-sm"
          >
            <div
              className="aspect-square relative cursor-pointer overflow-hidden"
              onClick={() => onSongClick(song.id)}
            >
              {song.albumCover ? (
                <Image
                  src={song.albumCover}
                  alt={`${song.title} - ${song.artist}`}
                  fill
                  className="object-cover transition-transform duration-300 
                  group-hover:scale-105 brightness-90 group-hover:brightness-100"
                />
              ) : (
                <div className="w-full h-full bg-accent-500/10 flex items-center justify-center">
                  <Music className="w-12 h-12 text-accent-400 opacity-70" />
                </div>
              )}

              <div
                className="absolute inset-0 bg-gradient-to-t 
              from-black/60 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="p-4 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUnfavorite(song.id)
                }}
                className="absolute top-2 right-2 p-2 
                bg-black/30 rounded-full hover:bg-accent-500/30 
                transition-colors"
              >
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              </button>

              <div className="space-y-1">
                {song.learnedDate && (
                  <span className="text-xs text-accent-300/70 block mb-1">
                    {new Date(song.learnedDate).toLocaleDateString()}
                  </span>
                )}
                <h3
                  className="text-white font-medium truncate text-base 
                group-hover:text-accent-300 transition-colors"
                >
                  {song.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                {song.genre && (
                  <p className="text-accent-400/70 text-xs mt-1">
                    {song.genre}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  )
}

export function FavoriteSongList({
  songs,
  onSongClick,
  onUnfavorite,
}: SongViewProps) {
  return (
    <LayoutGroup>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {songs.map((song) => (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
            className="bg-gradient-to-r from-gray-800/50 to-accent-500/10 
            rounded-2xl p-4 flex items-center gap-4 
            hover:border-accent-500/30 border border-transparent
            transition-all duration-300 backdrop-blur-sm"
          >
            <div
              className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => onSongClick(song.id)}
            >
              {song.albumCover ? (
                <Image
                  src={song.albumCover}
                  alt={`${song.title} - ${song.artist}`}
                  fill
                  className="object-cover transition-transform duration-300 
                  group-hover:scale-105 brightness-90 hover:brightness-100"
                />
              ) : (
                <div className="w-full h-full bg-accent-500/10 flex items-center justify-center">
                  <Music className="w-8 h-8 text-accent-400 opacity-70" />
                </div>
              )}
            </div>

            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => onSongClick(song.id)}
            >
              {song.learnedDate && (
                <span className="text-xs text-accent-300/70 block mb-1">
                  {new Date(song.learnedDate).toLocaleDateString()}
                </span>
              )}
              <h3
                className="text-white font-medium truncate text-base 
              hover:text-accent-300 transition-colors"
              >
                {song.title}
              </h3>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              {song.genre && (
                <p className="text-accent-400/70 text-xs mt-1">{song.genre}</p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onUnfavorite(song.id)
              }}
              className="p-2 text-gray-400 hover:text-accent-400 transition-colors"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  )
}
