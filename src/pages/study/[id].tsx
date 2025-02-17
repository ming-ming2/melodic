// pages/study/[id].tsx
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppLayout from '@/components/common/AppLayout'
import { motion } from 'framer-motion'

const DUMMY_CARDS = [
  {
    id: 1,
    word: '開く',
    meaning: '열다',
    example: '本を開く (책을 열다)',
    intervals: {
      again: '1m',
      good: '4d',
      easy: '7d',
    },
  },
  {
    id: 2,
    word: '始める',
    meaning: '시작하다',
    example: '仕事を始める (일을 시작하다)',
    intervals: {
      again: '1m',
      good: '3d',
      easy: '6d',
    },
  },
]

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const currentCard = DUMMY_CARDS[currentCardIndex]

  const handleSpace = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      setShowAnswer((prev) => !prev)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleSpace)
    return () => window.removeEventListener('keydown', handleSpace)
  }, [])

  const handleRate = (rating: number) => {
    if (currentCardIndex < DUMMY_CARDS.length - 1) {
      setCurrentCardIndex((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      // 학습 완료
      router.push('/studyroom')
    }
  }

  return (
    <AppLayout showHeader showBottomNav={false}>
      <div className="min-h-screen bg-gray-950 text-white pt-16">
        {/* 프로그레스 바 */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
          <motion.div
            className="h-full bg-accent-500"
            style={{
              width: `${((currentCardIndex + 1) / DUMMY_CARDS.length) * 100}%`,
            }}
          />
        </div>

        {/* 카드 컨텐츠 */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-800 rounded-2xl p-8 mb-6">
            {!showAnswer ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-4">{currentCard.word}</h2>
                <p className="text-gray-400">스페이스바를 눌러 뜻 확인하기</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    {currentCard.word}
                  </h2>
                  <p className="text-xl text-accent-400">
                    {currentCard.meaning}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-300">{currentCard.example}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* 평가 버튼 */}
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl"
                onClick={() => handleRate(1)}
              >
                이게뭐고{' '}
                <span className="text-sm opacity-80">
                  ({currentCard.intervals.again})
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl"
                onClick={() => handleRate(3)}
              >
                긴가민가{' '}
                <span className="text-sm opacity-80">
                  ({currentCard.intervals.good})
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl"
                onClick={() => handleRate(4)}
              >
                ez해요{' '}
                <span className="text-sm opacity-80">
                  ({currentCard.intervals.easy})
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
