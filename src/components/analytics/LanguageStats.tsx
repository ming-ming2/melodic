// components/analytics/LanguageStats.tsx
import React from 'react'
import type { LanguageStatsProps } from '@/types/analytics'

export default function LanguageStats({ data }: LanguageStatsProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">
        언어별 학습 현황
      </h3>
      <div className="space-y-6">
        {data.map((lang) => (
          <div key={lang.language}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {lang.flag && <span className="text-xl">{lang.flag}</span>}
                <p className="text-gray-300">{lang.language}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-400">단어 {lang.words}개</span>
                <span className="text-gray-400">문법 {lang.grammar}개</span>
                <span className="text-gray-400">곡 {lang.songs}개</span>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-300"
                style={{ width: `${(lang.words / 300) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
