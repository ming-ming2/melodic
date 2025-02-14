// components/analytics/StatsOverview.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Music, Book, Star } from 'lucide-react'

const stats = [
  {
    icon: Clock,
    label: '학습 시간',
    value: '12.5시간',
    trend: '+2.5',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: Music,
    label: '학습한 곡',
    value: '32곡',
    trend: '+3',
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: Book,
    label: '문법',
    value: '45개',
    trend: '+5',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: Star,
    label: '단어',
    value: '385개',
    trend: '+40',
    color: 'from-yellow-500/20 to-yellow-500/5',
  },
]

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border border-white/5`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">{stat.label}</span>
            </div>
            <div className="mt-auto">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-green-400">+{stat.trend} 증가</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
