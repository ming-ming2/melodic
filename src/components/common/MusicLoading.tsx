// components/common/MusicLoading.tsx
import React from 'react'
import { motion } from 'framer-motion'

const MusicLoading: React.FC = () => {
  const musicNotes = [
    {
      id: 1,
      delay: 0.2,
      path: 'M5 15V4.5C5 3.12 6.12 2 7.5 2H8v7h2V2h0.5C11.88 2 13 3.12 13 4.5V15',
    },
    {
      id: 2,
      delay: 0.4,
      path: 'M7 15V6.5C7 5.12 8.12 4 9.5 4H10v6h2V4h0.5C13.88 4 15 5.12 15 6.5V15',
    },
    {
      id: 3,
      delay: 0.6,
      path: 'M9 15V7.5C9 6.12 10.12 5 11.5 5H12v5h2V5h0.5C15.88 5 17 6.12 17 7.5V15',
    },
  ]

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* 背景 Wave */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-accent-700/20 opacity-30"
        initial={{ rotate: 0 }}
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.01, 0.99, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Particle Effect */}
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150,
            opacity: 0,
          }}
          animate={{
            x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
            y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
            opacity: [0, 0.3, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
          className="absolute w-1 h-1 bg-accent-500/30 rounded-full"
        />
      ))}

      {/* Music Notes */}
      <div className="relative z-10 flex space-x-4">
        {musicNotes.map((note) => (
          <motion.svg
            key={note.id}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              opacity: 0,
              scale: 0.5,
              rotate: -30,
            }}
            animate={{
              opacity: [0, 1, 0.7, 1],
              scale: [0.5, 1.2, 0.9, 1],
              rotate: [-30, 10, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: note.delay,
              ease: 'easeInOut',
            }}
            className="text-accent-500 w-8 h-8"
          >
            <path d={note.path} />
          </motion.svg>
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-[-40px] text-gray-400 text-sm"
      >
        곡을 준비하는 중...
      </motion.p>
    </div>
  )
}

export default MusicLoading
