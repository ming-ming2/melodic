import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Target, Repeat, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LANGUAGE_DATA } from '@/utils/languageData'
import EditableCardField from './common/EditableCardField'

// 타입 정의
interface GrammarCollection {
  id: string
  language: string
  totalGrammars: number
  learnedGrammars: number
  dailyNewTarget: number
  dailyReviewTarget: number
  lastStudyDate?: string
}

interface SongGrammar {
  id: number
  title: string
  artist: string
  language: string
  grammars: number
}

type ViewMode = 'language' | 'song'

export default function GrammarSection() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('language')
  const [collections, setCollections] = useState<GrammarCollection[]>([
    {
      id: 'ja-n5',
      language: 'ja',
      totalGrammars: 50,
      learnedGrammars: 15,
      dailyNewTarget: 3,
      dailyReviewTarget: 10,
      lastStudyDate: '2024-02-14',
    },
    {
      id: 'en-beginner',
      language: 'en',
      totalGrammars: 70,
      learnedGrammars: 25,
      dailyNewTarget: 5,
      dailyReviewTarget: 15,
      lastStudyDate: '2024-02-13',
    },
  ])

  const [songGrammars, setSongGrammars] = useState<SongGrammar[]>([
    {
      id: 1,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      language: 'en',
      grammars: 7,
    },
    {
      id: 2,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      language: 'en',
      grammars: 5,
    },
  ])

  // 목표 업데이트 함수 (언어별 문법노트)
  const updateDailyTarget = (
    id: string,
    type: 'new' | 'review',
    value: number
  ) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id
          ? {
              ...collection,
              ...(type === 'new'
                ? { dailyNewTarget: value }
                : { dailyReviewTarget: value }),
            }
          : collection
      )
    )
  }

  // 노래별 문법노트 업데이트 함수
  const updateSongGrammar = (id: number, newValue: number) => {
    setSongGrammars((prev) =>
      prev.map((song) =>
        song.id === id ? { ...song, grammars: newValue } : song
      )
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
          언어별 문법노트
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
          노래별 문법노트
        </button>
      </div>

      {/* 언어별 문법노트 */}
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
            const grammarTitle = `${languageData?.name} 문법노트`

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
                        onClick={() => router.push('/grammar/jlpt-n2')}
                      >
                        <span className="text-2xl">{languageData?.flag}</span>
                        <h3 className="text-base font-bold text-white">
                          {grammarTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400">
                        {collection.learnedGrammars} /{' '}
                        {collection.totalGrammars} 학습
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
                      label="신규 학습"
                      value={collection.dailyNewTarget}
                      onSave={(val) =>
                        updateDailyTarget(collection.id, 'new', val)
                      }
                      icon={<Target className="w-4 h-4 text-accent-400" />}
                    />
                    <EditableCardField
                      label="복습"
                      value={collection.dailyReviewTarget}
                      onSave={(val) =>
                        updateDailyTarget(collection.id, 'review', val)
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

      {/* 노래별 문법노트 */}
      {viewMode === 'song' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {songGrammars.map((song) => {
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
                        onClick={() => router.push(`/grammar/jlpt-n2`)}
                      >
                        <span className="text-2xl">{languageData?.flag}</span>
                        <h3 className="text-base font-bold text-white">
                          {song.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400">
                        {song.artist} | {song.grammars}개 문법
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
                      value={song.grammars}
                      onSave={(val) => updateSongGrammar(song.id, val)}
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
