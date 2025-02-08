// types/lyrics.ts
export interface Word {
  word: string
  meaning: string
  example: string
}

export interface Grammar {
  pattern: string
  explanation: string
  example: string
}

export interface LyricLine {
  line_id: number
  original: string
  translated: string
  words: Word[]
  grammar: Grammar[]
  premium_only: boolean
}

export interface SongLyrics {
  song_id: string
  title: string
  artist: string
  youtube_id: string
  lyrics_analysis: LyricLine[]
}
