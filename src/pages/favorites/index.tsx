// pages/favorites/index.tsx
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import { AnimatePresence } from 'framer-motion'
import {
  FavoriteSongList,
  FavoriteSongGrid,
} from '@/components/favorites/FavoriteSongViews'
import { ViewToggle } from '@/components/favorites/FavoriteControls'
import useSongStore from '@/stores/songStore'
import FavoriteSearchBar from '@/components/favorites/FavoriteSearchBar'
type ViewMode = 'grid' | 'list'
type SortOption = 'recent' | 'title'

export default function FavoritesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy] = useState<SortOption>('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const { recentLearnings, toggleFavorite } = useSongStore()

  // 즐겨찾기된 노래들만 필터링
  const favoriteSongs = useMemo(() => {
    return recentLearnings.filter((song) => song.isFavorite)
  }, [recentLearnings])

  // 검색, 필터링, 정렬 적용
  const filteredSongs = useMemo(() => {
    return favoriteSongs
      .filter((song) => {
        // 검색어 필터링
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
          )
        }

        return true
      })
      .sort((a, b) => {
        // 정렬
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'recent':
          default:
            const dateA = a.learnedDate ? new Date(a.learnedDate) : new Date(0)
            const dateB = b.learnedDate ? new Date(b.learnedDate) : new Date(0)
            return dateB.getTime() - dateA.getTime()
        }
      })
  }, [favoriteSongs, searchQuery, sortBy])

  const handleSongClick = (songId: number) => {
    router.push(`/lyrics/${songId}`)
  }

  const handleUnfavorite = (songId: number) => {
    if (window.confirm('정말로 즐겨찾기에서 삭제하시겠습니까?')) {
      toggleFavorite(songId)
    }
  }

  return (
    <>
      <Head>
        <title>즐겨찾기한 노래 - Melodic</title>
      </Head>

      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* 헤더 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-white">즐겨찾기한 노래</h1>

            <div className="flex items-center gap-4">
              <FavoriteSearchBar
                className="w-full md:w-64"
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>
          </div>

          {/* 노래 리스트 */}
          <AnimatePresence mode="wait">
            {filteredSongs.length > 0 ? (
              viewMode === 'grid' ? (
                <FavoriteSongGrid
                  songs={filteredSongs}
                  onSongClick={handleSongClick}
                  onUnfavorite={handleUnfavorite}
                />
              ) : (
                <FavoriteSongList
                  songs={filteredSongs}
                  onSongClick={handleSongClick}
                  onUnfavorite={handleUnfavorite}
                />
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">즐겨찾기한 노래가 없습니다.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </AppLayout>
    </>
  )
}
