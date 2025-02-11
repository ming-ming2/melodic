// components/signup/BasicInfoStep.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'
import { SignUpData } from '@/pages/signup'

interface BasicInfoStepProps {
  data: SignUpData
  onUpdate: (data: SignUpData) => void
  onNext: () => void
}

export default function BasicInfoStep({
  data,
  onUpdate,
  onNext,
}: BasicInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdate({ ...data, [name]: value })
  }

  const isValid = data.email && data.password && data.nickname

  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold text-white mb-2">기본 정보 입력</h2>
      <p className="text-gray-400 mb-8">
        Melodic에서 사용할 기본 정보를 입력해주세요
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="이메일"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="nickname"
              value={data.nickname}
              onChange={handleChange}
              placeholder="닉네임"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent-500 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-medium transition-colors 
            ${
              isValid
                ? 'bg-accent-600 text-white hover:bg-accent-700'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          다음
        </motion.button>
      </form>
    </div>
  )
}
