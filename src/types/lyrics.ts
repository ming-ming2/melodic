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
  explanation: string
}

// 비유적 표현 타입
export interface MetaphoricalExpression {
  phrase: string
  explanation: string
  example: string
}

// 발음 팁 타입
export interface PronunciationTip {
  phrase: string
  tip: string
}

// 유사 표현 타입
export interface SimilarExpression {
  original_expression: string
  similar_expressions: string[]
}

// 실생활 사용 타입
export interface RealLifeUsage {
  phrase: string
  usage: string
}

// 심화 문법 설명 타입
export interface AdvancedGrammarExplanation {
  pattern: string
  advanced_explanation: string
}

// 심화 학습 타입
export interface AdvancedStudy {
  metaphorical_expressions: MetaphoricalExpression[]
  pronunciation_tips: PronunciationTip[]
  similar_expressions: SimilarExpression[]
  real_life_usages: RealLifeUsage[]
  advanced_grammar_explanations: AdvancedGrammarExplanation[]
  premium_only: boolean
}

// 가사 라인 타입
export interface LyricLine {
  line_id: number
  original: string
  translated: string
  words: Word[]
  grammar: Grammar[]
  expressions: Expression[]
  advanced_study: AdvancedStudy
  timestamp: {
    start: number
    end: number
  }
}

// 노래 전체 데이터 타입
export interface SongLyrics {
  song_id: string
  title: string
  artist: string
  language: string
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
