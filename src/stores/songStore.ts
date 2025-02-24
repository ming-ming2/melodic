// stores/songStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Song, SearchHistory } from '@/types/song'
import { DUMMY_POPULAR_SONGS, DUMMY_RECENT_LEARNINGS } from '@/utils/dummyData'
import { DUMMY_FAVORITE_SONGS } from '@/utils/dummyData'
interface SongStore {
  popularSongs: Song[]
  recentLearnings: Song[]
  searchHistory: SearchHistory[]
  randomRecommendation: Song | null
  favoriteSongs: Song[] // 새로 추가: 즐겨찾기 목록

  // 기존 메서드들
  setPopularSongs: (songs: Song[]) => void
  setRecentLearnings: (songs: Song[]) => void
  addSearchHistory: (query: string) => void
  setRandomRecommendation: () => void
  toggleFavorite: (songId: number) => void
  initialize: () => void

  // 새로 추가되는 메서드들
  getFavoriteSongs: () => Song[]
  addToFavorites: (song: Song) => void
  removeFromFavorites: (songId: number) => void
  updateSongProgress: (songId: number, progress: number) => void
  isFavorite: (songId: number) => boolean
}

const useSongStore = create<SongStore>()(
  persist(
    (set, get) => ({
      popularSongs: [],
      recentLearnings: [],
      searchHistory: [],
      randomRecommendation: null,
      favoriteSongs: [], // 새로 추가

      initialize: () => {
        set({
          popularSongs: DUMMY_POPULAR_SONGS,
          recentLearnings: [...DUMMY_RECENT_LEARNINGS, ...DUMMY_FAVORITE_SONGS],
          randomRecommendation:
            DUMMY_POPULAR_SONGS[
              Math.floor(Math.random() * DUMMY_POPULAR_SONGS.length)
            ],
        })
      },

      setPopularSongs: (songs) => set({ popularSongs: songs }),
      setRecentLearnings: (songs) => set({ recentLearnings: songs }),

      addSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            {
              id: Date.now(),
              query,
              timestamp: new Date().toISOString(),
            },
            ...state.searchHistory.slice(0, 5),
          ],
        })),

      setRandomRecommendation: () => {
        const popularSongs = get().popularSongs
        const randomSong =
          popularSongs[Math.floor(Math.random() * popularSongs.length)]
        set({ randomRecommendation: randomSong })
      },

      // 기존 toggleFavorite 메서드 수정
      toggleFavorite: (songId) => {
        set((state) => {
          // recentLearnings에서 해당 곡 찾기
          const song = state.recentLearnings.find((s) => s.id === songId)

          if (!song) return state

          // favoriteSongs 업데이트
          const newFavoriteSongs = state.isFavorite(songId)
            ? state.favoriteSongs.filter((s) => s.id !== songId)
            : [
                ...state.favoriteSongs,
                { ...song, favoriteAddedAt: new Date().toISOString() },
              ]

          return {
            recentLearnings: state.recentLearnings.map((song) =>
              song.id === songId
                ? { ...song, isFavorite: !song.isFavorite }
                : song
            ),
            favoriteSongs: newFavoriteSongs,
          }
        })
      },

      // 새로운 메서드들
      getFavoriteSongs: () => get().favoriteSongs,

      addToFavorites: (song) =>
        set((state) => ({
          favoriteSongs: [
            ...state.favoriteSongs,
            { ...song, favoriteAddedAt: new Date().toISOString() },
          ],
        })),

      removeFromFavorites: (songId) =>
        set((state) => ({
          favoriteSongs: state.favoriteSongs.filter(
            (song) => song.id !== songId
          ),
        })),

      updateSongProgress: (songId, progress) =>
        set((state) => ({
          favoriteSongs: state.favoriteSongs.map((song) =>
            song.id === songId ? { ...song, progress } : song
          ),
        })),

      isFavorite: (songId) => {
        const state = get()
        return state.favoriteSongs.some((song) => song.id === songId)
      },
    }),
    {
      name: 'melodic-storage',
      partialize: (state) => ({
        recentLearnings: state.recentLearnings,
        searchHistory: state.searchHistory,
        favoriteSongs: state.favoriteSongs, // 추가: 즐겨찾기도 저장
      }),
    }
  )
)

export default useSongStore
