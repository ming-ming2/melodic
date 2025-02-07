// stores/songStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Song, SearchHistory } from '@/types/song'
import { DUMMY_POPULAR_SONGS, DUMMY_RECENT_LEARNINGS } from '@/utils/dummyData'

interface SongStore {
  popularSongs: Song[]
  recentLearnings: Song[]
  searchHistory: SearchHistory[]
  randomRecommendation: Song | null

  setPopularSongs: (songs: Song[]) => void
  setRecentLearnings: (songs: Song[]) => void
  addSearchHistory: (query: string) => void
  setRandomRecommendation: () => void
  toggleFavorite: (songId: number) => void
  initialize: () => void
}

const useSongStore = create<SongStore>()(
  persist(
    (set, get) => ({
      popularSongs: [],
      recentLearnings: [],
      searchHistory: [],
      randomRecommendation: null,

      initialize: () => {
        set({
          popularSongs: DUMMY_POPULAR_SONGS,
          recentLearnings: DUMMY_RECENT_LEARNINGS,
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

      toggleFavorite: (songId) =>
        set((state) => ({
          recentLearnings: state.recentLearnings.map((song) =>
            song.id === songId
              ? { ...song, isFavorite: !song.isFavorite }
              : song
          ),
        })),
    }),
    {
      name: 'melodic-storage',
      partialize: (state) => ({
        recentLearnings: state.recentLearnings,
        searchHistory: state.searchHistory,
      }),
    }
  )
)

export default useSongStore
