// components/lyrics/GrammarPopup.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface GrammarPopupProps {
  pattern: string
  explanation: string
  example: string
  rect: DOMRect
  onClose: () => void
}

export default function GrammarPopup({
  pattern,
  explanation,
  example,
  rect,
  onClose,
}: GrammarPopupProps) {
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
        <h3 className="text-lg font-medium text-accent-400">{pattern}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-gray-300 mb-2">{explanation}</p>
      <p className="text-sm text-gray-400 italic">{example}</p>
    </motion.div>
  )
}
