// stores/lyricsStore.ts
import { create } from 'zustand'
import type { TimestampData } from '@/utils/youtubeUtils'

interface LyricsState {
  currentIndex: number
  timestamps: TimestampData[]
  isRepeatMode: boolean
  isAutoScrolling: boolean

  setCurrentIndex: (index: number) => void
  setTimestamps: (timestamps: TimestampData[]) => void
  toggleRepeatMode: () => void
  toggleAutoScrolling: () => void
  updateTimestamp: (index: number, timestamp: TimestampData) => void
}

const useLyricsStore = create<LyricsState>((set) => ({
  currentIndex: 0,
  timestamps: [],
  isRepeatMode: false,
  isAutoScrolling: true,

  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTimestamps: (timestamps) => set({ timestamps }),
  toggleRepeatMode: () =>
    set((state) => ({ isRepeatMode: !state.isRepeatMode })),
  toggleAutoScrolling: () =>
    set((state) => ({ isAutoScrolling: !state.isAutoScrolling })),
  updateTimestamp: (index, timestamp) =>
    set((state) => ({
      timestamps: state.timestamps.map((t, i) => (i === index ? timestamp : t)),
    })),
}))

export default useLyricsStore
