// components/favorites/FavoriteSearchBar.tsx
import React from 'react'
import { Search, X } from 'lucide-react'

interface FavoriteSearchBarProps {
  value: string
  onChange: (query: string) => void
  placeholder?: string
  className?: string
}

export default function FavoriteSearchBar({
  value,
  onChange,
  placeholder = '노래 또는 아티스트 검색',
  className = '',
}: FavoriteSearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-gray-800 text-white rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-accent-500 
        placeholder-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  )
}
