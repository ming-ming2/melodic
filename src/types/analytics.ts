// types/analytics.ts
export interface DailyStats {
  day: string
  minutes: number
}

export interface LanguageProgress {
  language: string
  words: number
  grammar: number
  songs: number
  flag?: string
}

export interface StudyStats {
  totalStudyTime: number
  weeklyIncrease: number
  totalSongs: number
  weeklySongIncrease: number
  totalWordGrammar: number
  weeklyWordGrammarIncrease: number
  streakDays: number
  bestStreak: number
}

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
}

export interface WeeklyChartProps {
  data: DailyStats[]
}

export interface LanguageStatsProps {
  data: LanguageProgress[]
}
