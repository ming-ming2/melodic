// components/settings/NotificationSection.tsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, Sparkles } from 'lucide-react'
import SectionHeader from './common/SectionHeader'

interface NotificationSectionProps {
  scrollOnClick: boolean
}

export default function NotificationSection({
  scrollOnClick,
}: NotificationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    newSongs: true,
    premiumEvents: false,
  })
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div
      ref={sectionRef}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 transition-colors"
    >
      <SectionHeader
        title="알림 설정"
        description="학습 알림 및 업데이트 소식 받기"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        icon={Bell}
        scrollOnClick={scrollOnClick}
        containerRef={sectionRef}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-700/50 space-y-5">
              <div className="group pt-5 flex items-start justify-between hover:bg-gray-700/20 -mx-3 px-3 py-2 rounded-lg transition-colors">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium group-hover:text-accent-400 transition-colors">
                      학습 리마인더
                    </h3>
                    <p className="text-sm text-gray-400">하루 1곡 학습 알림</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('dailyReminder')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.dailyReminder
                        ? 'bg-accent-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        translateX: notifications.dailyReminder
                          ? '1.25rem'
                          : '0.25rem',
                      }}
                      className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                    />
                  </button>
                </div>
              </div>

              <div className="group flex items-start justify-between hover:bg-gray-700/20 -mx-3 px-3 py-2 rounded-lg transition-colors">
                <div className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium group-hover:text-accent-400 transition-colors">
                      추천 노래 알림
                    </h3>
                    <p className="text-sm text-gray-400">
                      새로운 추천곡 업데이트
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('newSongs')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.newSongs ? 'bg-accent-600' : 'bg-gray-600'
                    }`}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        translateX: notifications.newSongs
                          ? '1.25rem'
                          : '0.25rem',
                      }}
                      className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                    />
                  </button>
                </div>
              </div>

              <div className="group flex items-start justify-between hover:bg-gray-700/20 -mx-3 px-3 py-2 rounded-lg transition-colors">
                <div className="flex gap-3">
                  <Bell className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium group-hover:text-accent-400 transition-colors">
                      프리미엄 혜택
                    </h3>
                    <p className="text-sm text-gray-400">
                      프리미엄 이벤트 및 할인 소식
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle('premiumEvents')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.premiumEvents
                        ? 'bg-accent-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        translateX: notifications.premiumEvents
                          ? '1.25rem'
                          : '0.25rem',
                      }}
                      className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
