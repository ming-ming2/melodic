// pages/study/[id].tsx
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ChevronLeft, Music } from 'lucide-react'

const DUMMY_VOCABULARY = [
  {
    id: 1,
    word: '開く',
    pronunciation: 'ひらく',
    meaning: '열다',
    partOfSpeech: '동사',
    example: {
      original: '本を開く',
      pronunciation: 'ほんをひらく',
      translation: '책을 열다',
    },
    songReference: {
      title: '前前前世',
      artist: 'RADWIMPS',
      lyrics: '扉を開くとそこに君が',
    },
    intervals: {
      again: '1m',
      good: '4d',
      easy: '7d',
    },
  },
  {
    id: 2,
    word: '始める',
    pronunciation: 'はじめる',
    meaning: '시작하다',
    partOfSpeech: '동사',
    example: {
      original: '仕事を始める',
      pronunciation: 'しごとをはじめる',
      translation: '일을 시작하다',
    },
    songReference: {
      title: '夜に駆ける',
      artist: 'YOASOBI',
      lyrics: '物語を始めよう',
    },
    intervals: {
      again: '1m',
      good: '4d',
      easy: '7d',
    },
  },
  {
    id: 3,
    word: '待つ',
    pronunciation: 'まつ',
    meaning: '기다리다',
    partOfSpeech: '동사',
    example: {
      original: 'バスを待つ',
      pronunciation: 'ばすをまつ',
      translation: '버스를 기다리다',
    },
    songReference: {
      title: 'チェリー',
      artist: 'スピッツ',
      lyrics: '君を待つ間',
    },
    intervals: {
      again: '1m',
      good: '4d',
      easy: '7d',
    },
  },
]

export default function StudyPage() {
  const router = useRouter()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const controls = useAnimation()
  const currentCard = DUMMY_VOCABULARY[currentCardIndex]

  // 카드 탭 시 앞면과 뒷면 전환
  const handleCardClick = async () => {
    if (!showAnswer) {
      // 난이도 버튼을 즉시 표시한 후에 카드 플립 애니메이션 시작
      setShowAnswer(true)
      await controls.start({
        rotateY: 180,
        transition: {
          duration: 0.4,
          type: 'spring',
          damping: 25,
          stiffness: 130,
        },
      })
    } else {
      // 카드가 뒤집히는 동시에 난이도 버튼도 사라지게 처리
      setShowAnswer(false)
      await controls.start({
        rotateY: 0,
        transition: {
          duration: 0.4,
          type: 'spring',
          damping: 25,
          stiffness: 130,
        },
      })
    }
  }

  // 난이도 버튼 클릭 시 카드 전환 애니메이션 처리
  // _rating 매개변수는 현재 평가값이지만, 아직 사용되지 않아 _rating으로 처리합니다.
  const handleRate = async (_rating: number) => {
    if (currentCardIndex < DUMMY_VOCABULARY.length - 1) {
      await controls.start({ rotateY: 90, transition: { duration: 0.2 } })
      setCurrentCardIndex((prev) => prev + 1)
      // 새로운 카드의 경우 난이도 버튼은 바로 숨김 상태에서 시작
      setShowAnswer(false)
      await controls.start({ rotateY: 0, transition: { duration: 0.2 } })
    } else {
      router.push('/studyroom')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-medium text-white">JLPT N2 단어장</h1>
            <p className="text-xs text-gray-400">
              {currentCardIndex + 1} / {DUMMY_VOCABULARY.length}
            </p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-1 bg-gray-800">
        <motion.div
          className="h-full bg-accent-500"
          initial={{
            width: `${(currentCardIndex / DUMMY_VOCABULARY.length) * 100}%`,
          }}
          animate={{
            width: `${((currentCardIndex + 1) / DUMMY_VOCABULARY.length) * 100}%`,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* 카드 영역 */}
      <div className="max-w-md mx-auto px-4 py-6 perspective-1000">
        <motion.div
          className="w-full relative preserve-3d"
          animate={controls}
          initial={{ rotateY: 0 }}
          onClick={handleCardClick}
        >
          {/* 앞면 (질문) */}
          <div
            className="absolute w-full backface-hidden bg-gray-800 rounded-2xl min-h-[70vh]"
            style={{ transform: 'rotateY(0deg)' }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-4xl font-bold mb-3">{currentCard.word}</h2>
              <p className="text-sm text-gray-500 mt-8">터치하여 확인하기</p>
            </div>
          </div>

          {/* 뒷면 (답변) */}
          <div
            className="absolute w-full backface-hidden bg-gray-800 rounded-2xl min-h-[70vh]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="p-6 space-y-6">
              <div className="text-center pb-4 border-b border-gray-700">
                <h2 className="text-3xl font-bold mb-2">{currentCard.word}</h2>
                <p className="text-xl text-gray-400 mb-1">
                  {currentCard.pronunciation}
                </p>
                <p className="text-2xl text-accent-400">
                  {currentCard.meaning}
                </p>
                <span className="inline-block px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300 mt-2">
                  {currentCard.partOfSpeech}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">예문</h3>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-lg mb-1">{currentCard.example.original}</p>
                  <p className="text-sm text-gray-400 mb-2">
                    {currentCard.example.pronunciation}
                  </p>
                  <p className="text-gray-300">
                    {currentCard.example.translation}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  예문이 사용된 노래
                </h3>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-sm text-accent-400 mb-1">
                    {currentCard.songReference.title} -{' '}
                    {currentCard.songReference.artist}
                  </p>
                  <p className="text-gray-300">
                    {currentCard.songReference.lyrics}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 평가 버튼 */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800"
          >
            <div className="max-w-md mx-auto flex gap-3">
              <button
                className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium"
                onClick={() => handleRate(1)}
              >
                뇌정지
                <span className="block text-xs opacity-80 mt-1">
                  ({currentCard.intervals.again})
                </span>
              </button>
              <button
                className="flex-1 py-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-sm font-medium"
                onClick={() => handleRate(3)}
              >
                긴가민가
                <span className="block text-xs opacity-80 mt-1">
                  ({currentCard.intervals.good})
                </span>
              </button>
              <button
                className="flex-1 py-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm font-medium"
                onClick={() => handleRate(4)}
              >
                쉬워요
                <span className="block text-xs opacity-80 mt-1">
                  ({currentCard.intervals.easy})
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
