// components/lyrics/WordPopup.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { X, BookmarkPlus } from 'lucide-react'

interface WordPopupProps {
  word: string
  meaning: string
  example: string
  rect: DOMRect
  onClose: () => void
}

export default function WordPopup({
  word,
  meaning,
  example,
  rect,
  onClose,
}: WordPopupProps) {
  const handleSaveWord = () => {
    // TODO: 단어장 저장 로직 구현
    console.log('Save word:', word)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 8,
        zIndex: 50,
      }}
      className="bg-gray-800 rounded-xl shadow-lg p-4 min-w-[200px] max-w-[300px]"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-white">{word}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-gray-300 mb-2">{meaning}</p>
      <p className="text-sm text-gray-400 italic mb-3">{example}</p>

      <button
        onClick={handleSaveWord}
        className="flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
      >
        <BookmarkPlus className="w-4 h-4" />
        단어장에 저장
      </button>
    </motion.div>
  )
}
