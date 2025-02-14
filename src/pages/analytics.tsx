// pages/analytics.tsx
import React from 'react'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import HeroSection from '@/components/analytics/HeroSection'
import StatsOverview from '@/components/analytics/StatsOverview'
import WeeklyProgress from '@/components/analytics/WeeklyChart'
import LanguageStats from '@/components/analytics/LanguageStats'

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
            <WeeklyProgress />
            <LanguageStats
              data={[
                {
                  language: '일본어',
                  words: 150,
                  grammar: 25,
                  songs: 12,
                  flag: '🇯🇵',
                },
                {
                  language: '영어',
                  words: 200,
                  grammar: 30,
                  songs: 15,
                  flag: '🇺🇸',
                },
                {
                  language: '프랑스어',
                  words: 80,
                  grammar: 10,
                  songs: 5,
                  flag: '🇫🇷',
                },
              ]}
            />
          </div>

          {/* 추가 섹션들 */}
          {/* ... */}
        </div>
      </AppLayout>
    </>
  )
}
