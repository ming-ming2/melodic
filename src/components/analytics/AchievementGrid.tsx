// components/analytics/AchievementGrid.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Clock, BookOpen, Star, Zap } from 'lucide-react'

interface Achievement {
  icon: React.ElementType
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
}

const achievements: Achievement[] = [
  {
    icon: Clock,
    title: '총 학습 시간',
    value: '12.5시간',
    change: '+2.5시간',
    trend: 'up',
  },
  {
    icon: BookOpen,
    title: '학습한 곡',
    value: '32곡',
    change: '+3곡',
    trend: 'up',
  },
  {
    icon: Star,
    title: '저장한 단어/문법',
    value: '430개',
    change: '+45개',
    trend: 'up',
  },
  {
    icon: Zap,
    title: '최고 연속 학습',
    value: '7일',
    change: '최고 기록!',
    trend: 'neutral',
  },
]

export default function AchievementGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-500/10 rounded-xl">
              <achievement.icon className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                {achievement.title}
              </p>
              <p className="text-2xl font-bold text-white">
                {achievement.value}
              </p>
              <p
                className={`text-sm mt-1 ${
                  achievement.trend === 'up'
                    ? 'text-green-400'
                    : achievement.trend === 'down'
                      ? 'text-red-400'
                      : 'text-accent-400'
                }`}
              >
                {achievement.change}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
