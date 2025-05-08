// contexts/DeviceContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { DeviceType, getDeviceType, isTabletDevice } from '@/utils/deviceUtils'

interface DeviceContextType {
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  forceLayout: 'mobile' | 'desktop' | 'auto'
  setForceLayout: (layout: 'mobile' | 'desktop' | 'auto') => void
}

// 컨텍스트 생성
const DeviceContext = createContext<DeviceContextType>({
  deviceType: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  forceLayout: 'auto',
  setForceLayout: () => {},
})

// 컨텍스트 훅
export const useDevice = () => useContext(DeviceContext)

// 컨텍스트 프로바이더
export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const [forceLayout, setForceLayout] = useState<'mobile' | 'desktop' | 'auto'>(
    'auto'
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 리사이즈 이벤트 핸들러
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 디바이스 타입 계산
  let deviceType = getDeviceType(windowWidth)

  // iPad 또는 태블릿 감지 (부가적인 감지 로직)
  const isTablet = isTabletDevice()

  // 태블릿인 경우 강제로 모바일 레이아웃 적용 (forceLayout이 auto인 경우)
  if (forceLayout === 'mobile' || (isTablet && forceLayout === 'auto')) {
    deviceType = 'mobile'
  } else if (forceLayout === 'desktop') {
    deviceType = 'desktop'
  }

  // 컨텍스트 값
  const contextValue: DeviceContextType = {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    forceLayout,
    setForceLayout,
  }

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  )
}
