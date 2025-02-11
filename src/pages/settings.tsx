// pages/settings.tsx
import React from 'react'
import { motion } from 'framer-motion'
import AppLayout from '@/components/common/AppLayout'
import useAuthStore from '@/stores/authStore'
import LanguageSection from '@/components/settings/LanguageSection'
import SubscriptionSection from '@/components/settings/SubscriptionSection'
import NotificationSection from '@/components/settings/NotificationSection'
import AccountSection from '@/components/settings/AccountSection'

export default function SettingsPage() {
  const { user } = useAuthStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const sectionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-6">설정</h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 선호 언어 설정: 스크롤 없음 */}
          <motion.section variants={sectionVariants}>
            <LanguageSection scrollOnClick={false} />
          </motion.section>

          {/* 나머지 섹션: 스크롤 있음 */}
          <motion.section variants={sectionVariants}>
            <SubscriptionSection scrollOnClick={true} />
          </motion.section>

          <motion.section variants={sectionVariants}>
            <NotificationSection scrollOnClick={true} />
          </motion.section>

          <motion.section variants={sectionVariants}>
            <AccountSection scrollOnClick={true} />
          </motion.section>
        </motion.div>
      </div>
    </AppLayout>
  )
}
