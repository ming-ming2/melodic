// pages/analytics.tsx
import React from 'react'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import HeroSection from '@/components/analytics/HeroSection'
import StatsOverview from '@/components/analytics/StatsOverview'
import WeeklyProgress from '@/components/analytics/WeeklyProgress'
import LanguageStats from '@/components/analytics/LanguageStats'

// 주간 학습 데이터
const weeklyData = [
  { day: '월', minutes: 45 },
  { day: '화', minutes: 30 },
  { day: '수', minutes: 60 },
  { day: '목', minutes: 25 },
  { day: '금', minutes: 45 },
  { day: '토', minutes: 90 },
  { day: '일', minutes: 40 },
]

// 언어별 진행도 데이터
const languageProgress = [
  { language: '일본어', words: 150, grammar: 25, songs: 12, flag: '🇯🇵' },
  { language: '영어', words: 200, grammar: 30, songs: 15, flag: '🇺🇸' },
  { language: '프랑스어', words: 80, grammar: 10, songs: 5, flag: '🇫🇷' },
]

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>학습 통계 - Melodic</title>
      </Head>

      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* 히어로 섹션 */}
          <HeroSection level={5} experience={750} streakDays={7} />

          {/* 통계 오버뷰 */}
          <StatsOverview />

          {/* 차트 섹션 */}
          <div className="grid md:grid-cols-2 gap-6">
            <WeeklyProgress data={weeklyData} />
            <LanguageStats data={languageProgress} />
          </div>
        </div>
      </AppLayout>
    </>
  )
}
