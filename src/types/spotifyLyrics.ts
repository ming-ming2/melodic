// types/spotifyLyrics.ts
import { LyricLine } from './lyrics'

export interface SpotifyLyricLine {
  startTimeMs: string
  words: string
  syllables: string[]
  endTimeMs: string
}

export interface SpotifyLyricsResponse {
  error?: boolean
  message?: string
  syncType: string
  lines: SpotifyLyricLine[]
}

export interface AdjustedLyricLine extends SpotifyLyricLine {
  adjustedStartTimeMs?: string
  adjustedEndTimeMs?: string
}

export interface SpotifyToLyricsLineMapping {
  spotifyLine: SpotifyLyricLine
  lyricLine: LyricLine
  confidence: number
}

export interface AudioAnalysisResult {
  musicStartTime: number | null // T_start: 음악 시작 시간 (초)
  skipSegments: Array<{ start: number; end: number }> // T_skip: 인터루드 구간들
}

export interface LyricsSyncResult {
  originalLyrics: SpotifyLyricsResponse
  adjustedLyrics: SpotifyLyricsResponse
  audioAnalysis: AudioAnalysisResult
}
