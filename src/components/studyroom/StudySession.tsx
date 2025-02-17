// components/studyroom/StudySession.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStudySessionStore from '@/stores/studySessionStore'
import { Rating } from '@/utils/fsrs'

export default function StudySession({
  collectionId,
  onComplete,
  onExit,
}: {
  collectionId: string
  onComplete: () => void
  onExit: () => void
}) {
  const { currentCard, todayStats, startSession, rateCard } =
    useStudySessionStore()

  const [isRevealed, setIsRevealed] = React.useState(false)

  React.useEffect(() => {
    startSession(collectionId)
  }, [collectionId])

  const handleRate = (rating: Rating) => {
    rateCard(rating)
    setIsRevealed(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* 학습 진행 상태 */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">
            학습 진행률: {todayStats.reviewCount} /{' '}
            {todayStats.newCount + todayStats.reviewCount}
          </span>
          <span className="text-gray-400">
            정답률:{' '}
            {Math.round(
              (todayStats.correctCount / todayStats.reviewCount) * 100 || 0
            )}
            %
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{
              width: `${(todayStats.reviewCount / (todayStats.newCount + todayStats.reviewCount)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 학습 카드 */}
      <AnimatePresence mode="wait">
        {currentCard ? (
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              {/* 컨텍스트 정보 */}
              <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-700">
                <div className="text-sm text-gray-400">
                  From: {currentCard.content.context.songTitle} -{' '}
                  {currentCard.content.context.artist}
                </div>
                <div className="text-gray-300 mt-2">
                  {currentCard.content.context.lyricLine}
                </div>
              </div>

              {/* 학습 내용 */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentCard.content.word || currentCard.content.grammar}
                </h2>

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-gray-700/50 rounded-lg">
                        <h3 className="text-accent-400 font-medium mb-2">
                          의미
                        </h3>
                        <p className="text-white">
                          {currentCard.content.meaning}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-700/50 rounded-lg">
                        <h3 className="text-accent-400 font-medium mb-2">
                          예문
                        </h3>
                        <p className="text-white">
                          {currentCard.content.example}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 평가 버튼 */}
              <div className="px-6 py-4 bg-gray-700/50 border-t border-gray-700">
                {!isRevealed ? (
                  <button
                    onClick={() => setIsRevealed(true)}
                    className="w-full py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
                  >
                    정답 확인하기
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRate(1)}
                      className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      다시 볼래요 😅
                    </button>
                    <button
                      onClick={() => handleRate(3)}
                      className="flex-1 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
                    >
                      기억해요! 😊
                    </button>
                    <button
                      onClick={() => handleRate(4)}
                      className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      완전 쉬워요! 😎
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-white mb-4">
              오늘의 학습을 모두 완료했어요!
            </h3>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
            >
              학습 종료하기
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
