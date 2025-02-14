// components/analytics/WeeklyProgress.tsx
import React from 'react'
import { motion } from 'framer-motion'

const weekDays = ['월', '화', '수', '목', '금', '토', '일']
const progressData = [45, 30, 60, 25, 45, 90, 40]

export default function WeeklyProgress() {
  const maxValue = Math.max(...progressData)

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">주간 학습 시간</h3>
      <div className="flex items-end justify-between h-40 gap-2">
        {weekDays.map((day, index) => {
          const heightPercentage = (progressData[index] / maxValue) * 100
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-full">
                <motion.div
                  initial={{ height: '0%' }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-accent-500 to-accent-400 rounded-lg group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {progressData[index]}분
                  </div>
                </motion.div>
              </div>
              <span className="text-sm text-gray-400">{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
