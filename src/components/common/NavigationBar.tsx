// components/common/NavigationBar.tsx
import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import useAuthStore from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const router = useRouter()

  const { user, isAuthenticated, logout } = useAuthStore()

  const height = useTransform(scrollY, [0, 100], [80, 60])
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    router.push('/')
  }

  return (
    <motion.header
      style={{ height, opacity }}
      className="sticky top-0 z-50 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">🎵 Melodic</span>
        </Link>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center">
                <Image
                  src={user?.profileImage || '/images/default-avatar.png'}
                  alt="프로필"
                  width={32} // Tailwind CSS의 w-8은 보통 32px입니다.
                  height={32} // h-8 역시 32px에 해당합니다.
                  className="rounded-full"
                />
                <span className="ml-2 text-white">{user?.name}</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  )
}
