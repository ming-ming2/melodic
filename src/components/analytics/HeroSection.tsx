// components/analytics/HeroSection.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy } from 'lucide-react'

interface HeroSectionProps {
  level: number
  experience: number
  streakDays: number
}

export default function HeroSection({
  level,
  experience,
  streakDays,
}: HeroSectionProps) {
  const nextLevelExp = 1000
  const expPercentage = (experience / nextLevelExp) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-accent-500/20 via-accent-500/10 to-transparent rounded-3xl p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* 레벨 표시 */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-transparent rounded-full"
          />
          <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
            <div className="text-center">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-accent-400 mx-auto mb-1" />
              <span className="text-2xl md:text-3xl font-bold text-white">
                Lv.{level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          {/* 학습 스트릭 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-accent-400">
              <Flame className="w-5 h-5" />
              <span className="font-semibold">{streakDays}일 연속</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-sm"
            >
              🔥 불타는 중!
            </motion.div>
          </div>

          {/* 경험치 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">다음 레벨까지</span>
              <span className="text-accent-400 font-medium">
                {experience} / {nextLevelExp} XP
              </span>
            </div>
            <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent-400 to-accent-500 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
