// components/lyrics/LyricsLine.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface LyricsLineProps {
  line: string
  timestamp: number
  isActive: boolean
  onWordClick: (word: string, rect: DOMRect) => void
}

export default function LyricsLine({
  line,
  timestamp,
  isActive,
  onWordClick,
}: LyricsLineProps) {
  const words = line.split(' ')

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    onWordClick(word, rect)
  }

  return (
    <motion.div
      animate={{
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
      className="p-3 rounded-lg transition-colors"
    >
      <p className="text-white">
        {words.map((word, index) => (
          <span
            key={index}
            onClick={(e) => handleWordClick(word, e)}
            className={`cursor-pointer hover:text-accent-400 transition-colors ${
              isActive ? 'text-blue-400' : ''
            }`}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </motion.div>
  )
}
