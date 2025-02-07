// types/song.ts
export interface Song {
  id: number
  title: string
  artist: string
  albumCover: string
  difficulty: 'easy' | 'medium' | 'hard'
  genre?: string
  learnedDate?: string
  isFavorite?: boolean
}

export interface SearchHistory {
  id: number
  query: string
  timestamp: string
}
