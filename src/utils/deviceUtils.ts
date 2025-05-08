// utils/deviceUtils.ts
import { useEffect, useState } from 'react'

// 디바이스 타입 정의
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// 뷰포트 너비에 따른 디바이스 타입 반환
export function getDeviceType(width: number): DeviceType {
  if (width < 768) {
    return 'mobile'
  } else if (width < 1200) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

// 클라이언트 사이드에서만 실행되도록 확인하는 함수
export const isBrowser = () => typeof window !== 'undefined'

// 디바이스 타입을 감지하는 훅
export function useDeviceDetect(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  useEffect(() => {
    if (!isBrowser()) return

    // 초기 디바이스 타입 설정
    setDeviceType(getDeviceType(window.innerWidth))

    // 리사이즈 이벤트 리스너
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth))
    }

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

// 디바이스 타입에 따라 클래스 이름을 반환하는 함수
export function getDeviceClass(deviceType: DeviceType): string {
  switch (deviceType) {
    case 'mobile':
      return 'device-mobile'
    case 'tablet':
      return 'device-tablet'
    case 'desktop':
      return 'device-desktop'
    default:
      return ''
  }
}

// iPad 감지 함수 (iPad에서 Safari는 desktop 모드로 작동할 수 있음)
export function isIPad(): boolean {
  if (!isBrowser()) return false

  const userAgent = navigator.userAgent
  return (
    /iPad/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && 'ontouchend' in document)
  )
}

// iPad 또는 태블릿 감지 함수
export function isTabletDevice(): boolean {
  if (!isBrowser()) return false

  const userAgent = navigator.userAgent
  const isIPadDevice =
    /iPad/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && 'ontouchend' in document)

  // 태블릿 감지를 위한 일반적인 조건들
  const isAndroidTablet = /Android/.test(userAgent) && !/Mobile/.test(userAgent)
  const isOtherTablet = /Tablet|PlayBook|Silk|Kindle|KFAPWI/.test(userAgent)

  // 화면 크기도 고려 (태블릿은 보통 768px 이상, 1200px 미만)
  const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1200

  return isIPadDevice || isAndroidTablet || isOtherTablet || isTabletSize
}

// 디바이스 감지 기능을 제공하는 컨텍스트를 위한 초기값 (선택적)
export const initialDeviceContext = {
  deviceType: 'desktop' as DeviceType,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
}
