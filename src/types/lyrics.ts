// types/lyrics.ts
// 단어 타입
export interface Word {
  word: string
  meaning: string
  example: string
}

// 문법 타입
export interface Grammar {
  pattern: string
  explanation: string
  example: string
}

// 표현 타입
export interface Expression {
  expression: string
  meaning: string
  example: string
}

// 가사 라인 타입
export interface LyricLine {
  line_id: number
  original: string
  translated: string
  words: Word[]
  grammar: Grammar[]
  expressions: Expression[]
}

// 노래 전체 데이터 타입
export interface SongLyrics {
  song_id: string
  title: string
  artist: string
  language: string
  youtube_id: string
  lyrics_analysis: LyricLine[]
}

// API 응답용 타입
export interface Caption {
  start: string
  dur: string
  text: string
}

export interface ProcessedLyrics {
  lyrics: LyricLine[]
  videoId: string
  title: string
  artist: string
  language: string
}
