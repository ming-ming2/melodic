// pages/login.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // 실제로는 여기서 소셜 로그인 API 호출
      const mockUser = {
        id: '1',
        name: '테스트 유저',
        email: 'test@example.com',
        provider: provider as 'kakao' | 'naver' | 'google',
        profileImage: '/images/default-avatar.png',
      }

      useAuthStore.getState().login(mockUser)
      router.push('/')
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.')
      console.error('로그인 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 입력 값 검증
      if (!formData.email || !formData.password) {
        throw new Error('이메일과 비밀번호를 모두 입력해주세요.')
      }

      // 실제로는 여기서 이메일 로그인 API 호출
      const mockUser = {
        id: '2',
        name: '밍밍이',
        email: formData.email,
        provider: 'email' as const,
        profileImage: '/images/default-avatar.png',
      }

      useAuthStore.getState().login(mockUser)
      router.push('/')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.'
      )
      console.error('로그인 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* 로고 및 환영 메시지 */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
              🎵 Melodic
            </span>
          </Link>
          <h2 className="text-2xl font-semibold text-white mb-2">
            멜로딕에 오신 것을 환영합니다!
          </h2>
          <p className="text-gray-400">음악으로 시작하는 새로운 학습</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading}
            className="w-full bg-[#FEE500] text-[#391B1B] py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            카카오로 시작하기
          </button>
          <button
            onClick={() => handleSocialLogin('naver')}
            disabled={isLoading}
            className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            네이버로 시작하기
          </button>
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Google로 시작하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-950 text-gray-400">또는</span>
          </div>
        </div>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일"
                disabled={isLoading}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호"
                disabled={isLoading}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-600 text-white py-3 rounded-xl font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="flex justify-center space-x-4 text-sm">
          <Link
            href="/forgot-password"
            className="text-gray-400 hover:text-white transition-colors"
          >
            비밀번호 찾기
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/signup"
            className="text-gray-400 hover:text-white transition-colors"
          >
            회원가입
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
