// utils/scroll.ts
type ScrollOptions = {
  target: HTMLElement
  headerHeight: number
  bottomNavHeight: number
  offset?: number
}

export const calculateScrollPosition = ({
  target,
  headerHeight,
  bottomNavHeight,
  offset = 0,
}: ScrollOptions): number => {
  const targetRect = target.getBoundingClientRect()
  const targetHeight = targetRect.height
  const viewportHeight = window.innerHeight
  const availableHeight = viewportHeight - headerHeight - bottomNavHeight

  // 현재 요소의 절대 위치 계산
  const absoluteTop = window.scrollY + targetRect.top

  // Case 1: 섹션이 가용 화면 높이보다 작은 경우 (중앙 정렬)
  if (targetHeight <= availableHeight) {
    const middlePosition =
      absoluteTop - (availableHeight - targetHeight) / 2 - headerHeight
    return Math.max(0, middlePosition + offset)
  }

  // Case 2: 섹션이 가용 화면 높이보다 큰 경우 (상단 정렬)
  return Math.max(0, absoluteTop - headerHeight - 20 + offset)
}

export const smoothScroll = (targetY: number) => {
  const startY = window.scrollY
  const diff = targetY - startY
  const duration = 300
  let startTime: number | null = null
  let rafId: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    const easeInOutCubic =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

    window.scrollTo(0, startY + diff * easeInOutCubic)

    if (progress < 1) {
      rafId = requestAnimationFrame(animation)
    }
  }

  if (rafId) {
    cancelAnimationFrame(rafId)
  }

  rafId = requestAnimationFrame(animation)

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  }
}
