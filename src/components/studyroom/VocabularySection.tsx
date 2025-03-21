import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Repeat, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LANGUAGE_DATA } from '@/utils/languageData'
import EditableCardField from './common/EditableCardField' // 수정한 컴포넌트 import

// 타입 정의
interface VocabularyCollection {
  id: string
  language: string
  totalWords: number
  learnedWords: number
  dailyNewTarget: number
  dailyLimitTarget: number
  lastStudyDate?: string
}

interface SongVocabulary {
  id: number
  title: string
  artist: string
  language: string
  words: number
}

interface VocabularySectionProps {
  onStartStudy: (collectionId: string, type: 'vocabulary' | 'grammar') => void
}

type ViewMode = 'language' | 'song'

export default function VocabularySection(
  {
    // onStartStudy,
  }: VocabularySectionProps
) {
  const router = useRouter()
  const handleStartStudy = (collectionId: string) => {
    router.push(`/study/${collectionId}`)
  }
  const [viewMode, setViewMode] = useState<ViewMode>('language')
  const [collections, setCollections] = useState<VocabularyCollection[]>([
    {
      id: 'ja-n5',
      language: 'ja',
      totalWords: 500,
      learnedWords: 120,
      dailyNewTarget: 10,
      dailyLimitTarget: 30,
      lastStudyDate: '2024-02-14',
    },
    {
      id: 'en-beginner',
      language: 'en',
      totalWords: 800,
      learnedWords: 200,
      dailyNewTarget: 15,
      dailyLimitTarget: 30,
      lastStudyDate: '2024-02-13',
    },
  ])

  const [songVocabularies, setSongVocabularies] = useState<SongVocabulary[]>([
    {
      id: 1,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      language: 'en',
      words: 12,
    },
    {
      id: 2,
      title: 'Careless Whisper',
      artist: 'George Michael',
      language: 'en',
      words: 8,
    },
  ])

  // 목표 업데이트 함수 (언어별 단어장)
  const updateDailyTarget = (
    id: string,
    type: 'new' | 'limit',
    value: number
  ) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              ...(type === 'new'
                ? { dailyNewTarget: value }
                : { dailyLimitTarget: value }),
            }
          : collection
      )
    )
  }

  // 노래별 단어장의 학습량 업데이트 함수
  const updateSongVocabulary = (id: number, newWords: number) => {
    setSongVocabularies((prev) =>
      prev.map((song) => (song.id === id ? { ...song, words: newWords } : song))
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 뷰 모드 토글 */}
      <div className="flex bg-gray-800 rounded-xl p-1 mb-4">
        <button
          onClick={() => setViewMode('language')}
          className={`
            flex-1 flex items-center justify-center py-2 text-sm
            ${
              viewMode === 'language'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          언어별 단어장
        </button>
        <button
          onClick={() => setViewMode('song')}
          className={`
            flex-1 flex items-center justify-center py-2 text-sm
            ${
              viewMode === 'song'
                ? 'bg-accent-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }
            rounded-lg transition-colors
          `}
        >
          노래별 단어장
        </button>
      </div>

      {/* 언어별 단어장 */}
      {viewMode === 'language' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {collections.map((collection) => {
            const languageData = LANGUAGE_DATA.find(
              (l) => l.id === collection.language
            )
            const vocabularyTitle = `${languageData?.name} 단어장`

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-4 relative overflow-hidden mb-4"
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent-500 to-accent-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div
                        className="flex items-center gap-2 mb-1 cursor-pointer"
                        onClick={() =>
                          router.push(`/vocabulary/${collection.language}`)
                        }
                      >
                        <span className="text-2xl">{languageData?.flag}</span>
                        <h3 className="text-base font-bold text-white">
                          {vocabularyTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400">
                        {collection.learnedWords} / {collection.totalWords} 학습
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartStudy(collection.id)}
                        className="px-3 py-1.5 bg-accent-600 text-white rounded-lg text-xs hover:bg-accent-700 flex items-center gap-1.5"
                      >
                        <Repeat className="w-4 h-4" />
                        학습하기
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableCardField
                      label="신규 학습"
                      value={collection.dailyNewTarget}
                      onSave={(val) =>
                        updateDailyTarget(collection.id, 'new', val)
                      }
                      icon={<Target className="w-4 h-4 text-accent-400" />}
                    />
                    <EditableCardField
                      label="일일 학습 한도"
                      value={collection.dailyLimitTarget}
                      onSave={(val) =>
                        updateDailyTarget(collection.id, 'limit', val)
                      }
                      icon={<RefreshCw className="w-4 h-4 text-accent-400" />}
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
                    마지막 학습: {collection.lastStudyDate || '없음'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* 노래별 단어장 */}
      {viewMode === 'song' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {songVocabularies.map((song) => {
            const languageData = LANGUAGE_DATA.find(
              (l) => l.id === song.language
            )
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-4 relative overflow-hidden mb-4"
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent-500 to-accent-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div
                        className="flex items-center gap-2 mb-1 cursor-pointer"
                        onClick={() => router.push(`/vocabulary/jlpt-n2`)}
                      >
                        <span className="text-2xl">{languageData?.flag}</span>
                        <h3 className="text-base font-bold text-white">
                          {song.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400">
                        {song.artist} | {song.words}개 단어
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-accent-600 text-white rounded-lg text-xs hover:bg-accent-700 flex items-center gap-1.5">
                        <Repeat className="w-4 h-4" />
                        학습하기
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <EditableCardField
                      label="평균 학습량"
                      value={song.words}
                      onSave={(val) => updateSongVocabulary(song.id, val)}
                      icon={<Target className="w-4 h-4 text-accent-400" />}
                    />
                    <div className="bg-gray-700/50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-1">
                        <RefreshCw className="w-4 h-4 text-accent-400" />
                        <span className="text-xs text-gray-400">언어</span>
                      </div>
                      <div className="text-white font-bold text-base">
                        {languageData?.name}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
                    자세히 보기
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
