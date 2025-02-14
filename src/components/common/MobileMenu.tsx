// components/common/MobileMenu.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  LogIn,
  UserPlus,
  Book,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import useAuthStore from '@/stores/authStore'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* 메뉴 패널 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-gray-900 z-50"
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">메뉴</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* 메뉴 아이템들 */}
            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <>
                  {/* 프로필 섹션 */}
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-xl">
                    <Image
                      src={user?.profileImage || '/images/default-avatar.png'}
                      alt="프로필"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-white">{user?.name}</div>
                      <div className="text-sm text-gray-400">{user?.email}</div>
                    </div>
                  </div>

                  {/* 학습 관련 메뉴 */}
                  <div className="space-y-1">
                    <Link
                      href="/studyroom"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <Book size={20} />
                      <span>공부방</span>
                    </Link>
                    <Link
                      href="/default"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <Star size={20} />
                      <span>즐겨찾기</span>
                    </Link>
                    <Link
                      href="/analytics"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <FileText size={20} />
                      <span>학습 분석</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-800 my-4" />

                  {/* 설정 관련 메뉴 */}
                  <div className="space-y-1">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <User size={20} />
                      <span>설정</span>
                    </Link>
                    <Link
                      href="/default"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <Settings size={20} />
                      <span>학습 설정</span>
                    </Link>
                    <Link
                      href="/onboarding"
                      className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <HelpCircle size={20} />
                      <span>도움말</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-800 my-4" />

                  {/* 로그아웃 */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                /* 비로그인 상태 메뉴 */
                <div className="flex flex-col gap-2 mb-6">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                    onClick={onClose}
                  >
                    <LogIn size={20} />
                    <span>로그인</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <UserPlus size={20} />
                    <span>회원가입</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
