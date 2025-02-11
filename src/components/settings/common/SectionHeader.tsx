// components/settings/common/SectionHeader.tsx
import React, { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  description: string
  isExpanded: boolean
  onToggle: () => void
  icon: LucideIcon
  scrollOnClick?: boolean
  containerRef?: React.RefObject<HTMLDivElement | null>
}

const HEADER_HEIGHT = 64
const BOTTOM_NAV_HEIGHT = 64
const ANIMATION_DURATION = 300 // ms
const SAFETY_MARGIN = 16

export default function SectionHeader({
  title,
  description,
  isExpanded,
  onToggle,
  icon: Icon,
  scrollOnClick = false,
  containerRef,
}: SectionHeaderProps) {
  const headerRef = useRef<HTMLButtonElement>(null)

  const scrollToContainer = useCallback(() => {
    if (!containerRef?.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const totalHeight = rect.height
    const windowHeight = window.innerHeight
    const viewableHeight = windowHeight - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT
    const currentScrollY = window.scrollY
    const containerTop = currentScrollY + rect.top

    // 가용 화면 공간과 컨텐츠 높이 비교
    if (totalHeight <= viewableHeight) {
      // 화면에 다 들어가는 경우: 중앙 정렬
      const centerY =
        containerTop - (viewableHeight - totalHeight) / 2 - HEADER_HEIGHT
      window.scrollTo({
        top: Math.max(0, centerY),
        behavior: 'smooth',
      })
    } else {
      // 화면보다 큰 경우: 최대한 많은 컨텐츠가 보이도록 상단 정렬
      const targetY = containerTop - HEADER_HEIGHT - SAFETY_MARGIN
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      })
    }
  }, [containerRef])

  const handleClick = useCallback(() => {
    onToggle()

    if (!isExpanded && scrollOnClick) {
      // 애니메이션이 완전히 끝난 후에 스크롤 실행
      setTimeout(scrollToContainer, ANIMATION_DURATION)
    }
  }, [isExpanded, scrollOnClick, onToggle, scrollToContainer])

  return (
    <button
      ref={headerRef}
      onClick={handleClick}
      className="w-full px-6 py-5 flex items-start justify-between hover:bg-gray-700/30 transition-colors group"
    >
      <div className="flex gap-4">
        <div className="mt-1">
          <Icon className="w-5 h-5 text-accent-400" />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-medium text-white group-hover:text-accent-400 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="mt-1.5"
      >
        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-accent-400 transition-colors" />
      </motion.div>
    </button>
  )
}
