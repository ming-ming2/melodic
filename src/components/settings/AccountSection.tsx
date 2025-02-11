// components/settings/AccountSection.tsx
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCircle,
  Camera,
  Mail,
  Lock,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import Image from 'next/image'
import useAuthStore from '@/stores/authStore'
import SectionHeader from './common/SectionHeader'

interface AccountSectionProps {
  scrollOnClick: boolean
}

export default function AccountSection({ scrollOnClick }: AccountSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState(user?.name || '')
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleProfileUpdate = () => {
    // TODO: 프로필 업데이트 API 호출
    setIsEditing(false)
  }

  return (
    <div
      ref={sectionRef}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 hover:border-accent-500/20 transition-colors"
    >
      <SectionHeader
        title="계정 관리"
        description="프로필 수정 및 계정 설정"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        icon={UserCircle}
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
            <div className="px-6 pb-6 border-t border-gray-700/50">
              {/* 프로필 섹션 */}
              <div className="pt-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700">
                      <Image
                        src={user?.profileImage || '/images/default-avatar.png'}
                        alt="프로필"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 pt-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                          placeholder="닉네임을 입력하세요"
                        />
                        <button
                          onClick={handleProfileUpdate}
                          className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg text-white font-medium">
                          {user?.name}
                        </span>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          수정
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* 계정 관리 메뉴 */}
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors group">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                  <span>이메일 변경</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors group">
                  <Lock className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                  <span>비밀번호 변경</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors group">
                  <LogOut className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
                  <span>로그아웃</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors group">
                  <AlertTriangle className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                  <span>회원 탈퇴</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
