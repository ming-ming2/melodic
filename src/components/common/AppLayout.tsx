// components/common/AppLayout.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import { Home, Book, Settings, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import SearchBar from '../home/SearchBar'
import useAuthStore from '@/stores/authStore'

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  headerTitle?: string
  onBack?: () => void
}

export default function AppLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  onBack,
}: AppLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  // 드롭다운 메뉴 상태: 프로필 클릭 시 토글됨
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {showHeader && (
        <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md border-b border-gray-800 rounded-b-xl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* 로고 영역 */}
              {onBack ? (
                <button onClick={onBack} className="text-white">
                  ←
                </button>
              ) : (
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Melodic 로고"
                    width={80}
                    height={40}
                    priority
                    className="mr-2 w-8 md:w-16"
                  />
                </Link>
              )}

              {/* 검색창 */}
              <div className="flex-1 max-w-2xl mx-auto px-2 md:px-4">
                <SearchBar className="w-full" />
              </div>

              {/* 데스크톱 버튼들 */}
              <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Image
                          src={
                            user?.profileImage || '/images/default-avatar.png'
                          }
                          alt="프로필"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-300 transition-colors">
                          {user?.name}
                        </span>
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-2 z-50">
                          <Link
                            href="/default"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            학습 설정
                          </Link>
                          <Link
                            href="/default"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            즐겨찾기
                          </Link>
                          <Link
                            href="/default"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            학습 기록
                          </Link>
                          <Link
                            href="/onboarding"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            도움말
                          </Link>
                          <button
                            onClick={() => useAuthStore.getState().logout()}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                          >
                            로그아웃
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      가입하기
                    </Link>
                    <Link
                      href="/login"
                      className="bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors"
                    >
                      로그인
                    </Link>
                  </>
                )}
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-400 hover:text-white flex-shrink-0"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 모바일 메뉴 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 메인 콘텐츠 */}
      <main className={`flex-1 w-full ${showBottomNav ? 'mb-16' : ''}`}>
        {children}
      </main>

      {/* 하단 네비게이션 */}
      {showBottomNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 
               pointer-events-none z-50" // pointer-events-none 추가
        >
          <div className="h-full max-w-xl mx-auto px-6 flex items-center justify-around pointer-events-auto">
            <Link
              href="/"
              className={`flex flex-col items-center ${
                pathname === '/' ? 'text-accent-500' : 'text-gray-400'
              }`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">홈</span>
            </Link>

            <Link
              href="/studyroom"
              className={`flex flex-col items-center ${
                pathname === '/studyroom' ? 'text-accent-500' : 'text-gray-400'
              }`}
            >
              <Book size={24} />
              <span className="text-xs mt-1">공부방</span>
            </Link>
            <Link
              href="/settings"
              className={`flex flex-col items-center ${
                pathname === '/settings' ? 'text-accent-500' : 'text-gray-400'
              }`}
            >
              <Settings size={24} />
              <span className="text-xs mt-1">설정</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
