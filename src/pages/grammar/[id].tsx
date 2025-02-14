// pages/grammar/[id].tsx
import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import GrammarDetailHeader from '@/components/grammar/GrammarDetailHeader'
import GrammarList from '@/components/grammar/GrammarList'
import GrammarDetailModal from '@/components/grammar/GrammarDetailModal'

interface GrammarItem {
  id: string
  pattern: string
  meaning: string
  explanation: string
  example: string
  songExample: {
    text: string
    songTitle: string
  }
  tags: string[]
  level: string
  dateAdded: string
  hidden: boolean
}

export default function GrammarDetailPage() {
  const params = useParams()
  const grammarId = params?.id as string

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  )
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent')
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: API 연동 후 실제 데이터로 교체
  const mockGrammar = {
    id: grammarId,
    title: 'JLPT N2 문법',
    totalItems: 100,
    todayTarget: 15,
    todayLearned: 8,
    items: [
      {
        id: '1',
        pattern: '〜てたまらない',
        meaning: '참을 수 없이 ~하다',
        explanation: '감정이나 기분의 정도가 매우 심함을 나타내는 표현',
        example: '嬉しくてたまらない',
        songExample: {
          text: '会いたくてたまらない毎日だよ',
          songTitle: 'Example Song',
        },
        tags: ['감정 표현', 'N3'],
        level: 'N3',
        dateAdded: '2024-02-14',
        hidden: false,
      },
      {
        id: '2',
        pattern: '〜に違いない',
        meaning: '~임이 틀림없다',
        explanation: '강한 추측을 나타내는 표현',
        example: '彼は来るに違いない',
        songExample: {
          text: '君は幸せになるに違いない',
          songTitle: 'Happy Song',
        },
        tags: ['추측', 'N3'],
        level: 'N3',
        dateAdded: '2024-02-13',
        hidden: false,
      },
    ],
  }

  // 검색과 정렬이 적용된 아이템 목록
  const filteredAndSortedItems = useMemo(() => {
    let result = [...mockGrammar.items]

    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.pattern.toLowerCase().includes(query) ||
          item.meaning.toLowerCase().includes(query)
      )
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      } else {
        return a.pattern.localeCompare(b.pattern)
      }
    })

    return result
  }, [mockGrammar.items, sortBy, searchQuery])

  const handleItemClick = (item: GrammarItem) => {
    const index = filteredAndSortedItems.findIndex((i) => i.id === item.id)
    setSelectedItemIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedItemIndex(null)
  }

  const handlePrevItem = () => {
    if (selectedItemIndex === null) return
    const prevIndex =
      selectedItemIndex > 0
        ? selectedItemIndex - 1
        : filteredAndSortedItems.length - 1
    setSelectedItemIndex(prevIndex)
  }

  const handleNextItem = () => {
    if (selectedItemIndex === null) return
    const nextIndex =
      selectedItemIndex < filteredAndSortedItems.length - 1
        ? selectedItemIndex + 1
        : 0
    setSelectedItemIndex(nextIndex)
  }

  return (
    <>
      <Head>
        <title>{mockGrammar.title} - Melodic</title>
      </Head>

      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <GrammarDetailHeader
            title={mockGrammar.title}
            totalItems={mockGrammar.totalItems}
            todayTarget={mockGrammar.todayTarget}
            todayLearned={mockGrammar.todayLearned}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
          />

          <div className="mt-6">
            <GrammarList
              items={filteredAndSortedItems}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onItemClick={handleItemClick}
            />
          </div>

          {selectedItemIndex !== null && (
            <GrammarDetailModal
              item={filteredAndSortedItems[selectedItemIndex]}
              onClose={handleCloseModal}
              onPrev={handlePrevItem}
              onNext={handleNextItem}
              hasPrev={filteredAndSortedItems.length > 1}
              hasNext={filteredAndSortedItems.length > 1}
            />
          )}
        </div>
      </AppLayout>
    </>
  )
}
