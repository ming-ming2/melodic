// pages/vocabulary/[id].tsx
import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import AppLayout from '@/components/common/AppLayout'
import VocabularyDetailHeader from '@/components/vocabulary/VocabularyDetailHeader'
import ItemList from '@/components/vocabulary/ItemList'
import ItemDetailModal from '@/components/vocabulary/ItemDetailModal'

interface VocabularyItem {
  id: string
  word: string
  meaning: string
  example: string
  songExample: {
    text: string
    songTitle: string
  }
  tags: string[]
  pronunciation?: string
  dateAdded: string
  hidden: boolean
}

export default function VocabularyDetailPage() {
  const params = useParams()
  const vocabularyId = params?.id as string

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  )
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent')
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: API 연동 후 실제 데이터로 교체
  const mockVocabulary = {
    id: vocabularyId,
    title: '일본어 단어장',
    totalItems: 150,
    todayTarget: 20,
    todayLearned: 5,
    items: [
      {
        id: '1',
        word: '手を貸す',
        meaning: '도움을 주다',
        example: '困っている友達に手を貸す',
        songExample: {
          text: '私に手を貸してくれませんか',
          songTitle: 'Example Song',
        },
        tags: ['동사', 'N3'],
        pronunciation: 'てをかす',
        dateAdded: '2024-02-14',
        hidden: false,
      },
      {
        id: '2',
        word: '雨が降る',
        meaning: '비가 내리다',
        example: '外は雨が降っています',
        songExample: {
          text: '雨が降る日には君を思い出す',
          songTitle: 'Rain Song',
        },
        tags: ['동사', 'N5'],
        pronunciation: 'あめがふる',
        dateAdded: '2024-02-13',
        hidden: false,
      },
      // ... 더 많은 아이템들
    ],
  }

  // 검색과 정렬이 적용된 아이템 목록
  const filteredAndSortedItems = useMemo(() => {
    let result = [...mockVocabulary.items]

    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.word.toLowerCase().includes(query) ||
          item.meaning.toLowerCase().includes(query)
      )
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      } else {
        return a.word.localeCompare(b.word)
      }
    })

    return result
  }, [mockVocabulary.items, sortBy, searchQuery])

  const handleItemClick = (item: VocabularyItem) => {
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
        <title>{mockVocabulary.title} - Melodic</title>
      </Head>

      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <VocabularyDetailHeader
            title={mockVocabulary.title}
            totalItems={mockVocabulary.totalItems}
            todayTarget={mockVocabulary.todayTarget}
            todayLearned={mockVocabulary.todayLearned}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
          />

          <div className="mt-6">
            <ItemList
              items={filteredAndSortedItems}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onItemClick={handleItemClick}
            />
          </div>

          {selectedItemIndex !== null && (
            <ItemDetailModal
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
