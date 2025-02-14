// pages/default.tsx
import React from 'react'
import AppLayout from '@/components/common/AppLayout'
import Link from 'next/link'

export default function DefaultPage() {
  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col items-center justify-center h-full py-16">
        <h1 className="text-4xl font-bold text-white mb-4">
          페이지 준비 중입니다!
        </h1>
        <p className="text-lg text-gray-400 mb-8 text-center max-w-lg">
          죄송합니다. 현재 이 페이지는 개발 중에 있으며, 곧 멋진 모습으로
          찾아뵙겠습니다. 잠시만 기다려 주세요.
        </p>
        <Link
          href="/"
          className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
        >
          홈으로 이동
        </Link>
      </div>
    </AppLayout>
  )
}
