// components/favorites/FavoriteControls.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Grid, List } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface ControlButtonProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

// 필터 버튼
export function FilterButton({ value, onChange, options }: ControlButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-white hover:bg-gray-700 transition-colors"
      >
        <span>
          {options.find((opt) => opt.value === value)?.label || '필터'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg py-2 z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left transition-colors ${
                  value === option.value
                    ? 'text-accent-400 bg-gray-700'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 정렬 버튼
export function SortButton({ value, onChange, options }: ControlButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl text-white hover:bg-gray-700 transition-colors"
      >
        <span>
          {options.find((opt) => opt.value === value)?.label || '정렬'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg py-2 z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left transition-colors ${
                  value === option.value
                    ? 'text-accent-400 bg-gray-700'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 뷰 토글 버튼
interface ViewToggleProps {
  currentView: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-lg transition-colors ${
          currentView === 'grid'
            ? 'bg-accent-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        <Grid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-lg transition-colors ${
          currentView === 'list'
            ? 'bg-accent-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  )
}
