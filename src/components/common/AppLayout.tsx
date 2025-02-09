// components/common/AppLayout.tsx
import React from 'react'
import Link from 'next/link'
import { Home, Book, Search, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

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
  headerTitle,
  onBack,
}: AppLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* 앱 헤더 */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-900 bg-opacity-80 backdrop-blur-md">
          <div className="h-full w-full flex items-center px-4">
            {onBack ? (
              <button onClick={onBack} className="text-white">
                ←
              </button>
            ) : (
              <Link href="/" className="text-2xl text-white font-bold">
                🎵
              </Link>
            )}
            <h1 className="ml-4 text-lg font-semibold text-white">
              {headerTitle || 'Melodic'}
            </h1>
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main
        className={`flex-1 w-full ${showHeader ? 'mt-14' : ''} ${showBottomNav ? 'mb-16' : ''}`}
      >
        {children}
      </main>

      {/* 하단 네비게이션 바 */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800">
          <div className="h-full max-w-xl mx-auto px-6 flex items-center justify-around">
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
              href="/search"
              className={`flex flex-col items-center ${
                pathname === '/search' ? 'text-accent-500' : 'text-gray-400'
              }`}
            >
              <Search size={24} />
              <span className="text-xs mt-1">검색</span>
            </Link>
            <Link
              href="/vocabulary"
              className={`flex flex-col items-center ${
                pathname === '/vocabulary' ? 'text-accent-500' : 'text-gray-400'
              }`}
            >
              <Book size={24} />
              <span className="text-xs mt-1">단어장</span>
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
