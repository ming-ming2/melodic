// components/lyrics/YouTubePlayer/index.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Repeat, Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react'

interface YouTubePlayerProps {
  videoId: string
  currentLyric: {
    start: number
    end: number
  }
  onTimeUpdate?: (currentTime: number) => void
  isUserNavigation?: boolean
}

declare global {
  interface Window {
    YT: {
      Player: any
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export default function YouTubePlayer({
  videoId,
  currentLyric,
  onTimeUpdate,
  isUserNavigation = false,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  // guard to prevent duplicate handling via pointer event
  const overlayClickedRef = useRef(false)

  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  // 모바일이면 최초에 오버레이를 보임, 데스크톱은 자동 재생이므로 오버레이 없음
  const [overlayVisible, setOverlayVisible] = useState(isMobile())
  const [isRepeatOn, setIsRepeatOn] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)
  const [prevVolume, setPrevVolume] = useState(100)
  const timeCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const previousLyricRef = useRef(currentLyric)

  // YouTube API 초기화
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: isMobile() ? 0 : 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          playsinline: 1,
          disablekb: 0,
          origin: window.location.origin,
          wmode: 'opaque', // iframe 위에 다른 엘리먼트가 올 수 있도록 설정
        },
        events: {
          onReady: () => {
            setIsReady(true)
            playerRef.current.seekTo(currentLyric.start)
            playerRef.current.setVolume(volume)
            if (!isMobile()) {
              // 데스크톱의 경우 자동 재생 정책에 의해 음소거 상태여야 자동 재생됨
              playerRef.current.mute()
              playerRef.current.playVideo()
              setIsPlaying(true)
              // 재생 시작 시, currentLyric.start이 0.5초 미만이면 바로 unMute, 그렇지 않으면 300ms 후에 unMute
              const delay = currentLyric.start < 0.5 ? 0 : 300
              setTimeout(() => {
                playerRef.current.unMute()
                playerRef.current.setVolume(volume)
                // 혹시 unMute 후 재생이 멈추었다면 다시 재생 시도
                if (
                  playerRef.current.getPlayerState() !==
                  window.YT.PlayerState.PLAYING
                ) {
                  playerRef.current.playVideo()
                }
              }, delay)
            }
          },
          onStateChange: handlePlayerStateChange,
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId])

  // 가사 변경 처리
  useEffect(() => {
    if (!playerRef.current || !isReady) return

    const isDifferentLyric =
      previousLyricRef.current.start !== currentLyric.start ||
      previousLyricRef.current.end !== currentLyric.end

    if (isDifferentLyric) {
      console.log('🔄 가사 업데이트됨:', currentLyric)
      previousLyricRef.current = currentLyric
    }

    // 사용자가 직접 네비게이션할 때
    if (isUserNavigation) {
      playerRef.current.seekTo(currentLyric.start)
      if (isPlaying) {
        playerRef.current.playVideo()
      }
    }
  }, [currentLyric, isUserNavigation, isReady])

  const currentLyricRef = useRef(currentLyric)
  const isRepeatOnRef = useRef(isRepeatOn)

  useEffect(() => {
    isRepeatOnRef.current = isRepeatOn
  }, [isRepeatOn])

  useEffect(() => {
    currentLyricRef.current = currentLyric
  }, [currentLyric])

  const startTimeCheck = () => {
    if (timeCheckInterval.current) {
      clearInterval(timeCheckInterval.current)
    }
    timeCheckInterval.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()
      setCurrentTime(time)
      onTimeUpdate?.(time)

      if (isRepeatOnRef.current && time >= currentLyricRef.current.end - 0.2) {
        console.log('Attempting to restart - Repeat Mode ON')
        handleRestart()
      }
    }, 50)
  }

  const handlePlayerStateChange = (event: any) => {
    const playerState = event.data
    setIsPlaying(playerState === window.YT.PlayerState.PLAYING)

    if (playerState === window.YT.PlayerState.PLAYING) {
      startTimeCheck()
      // 재생 시작 시 오버레이 숨김 (모바일 전용)
      setOverlayVisible(false)
    } else {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }
    }
  }

  // 오버레이 재생 버튼 이벤트 (onPointerUp 사용)
  const handleStartClick = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (overlayClickedRef.current) return
    overlayClickedRef.current = true

    // 오버레이 즉시 숨김 (DOM에서 제거하지 않고 style로 숨김)
    if (overlayRef.current) {
      overlayRef.current.style.display = 'none'
    }
    if (playerRef.current) {
      try {
        playerRef.current.seekTo(currentLyric.start)
        playerRef.current.playVideo()
        setOverlayVisible(false)
        setIsPlaying(true)
      } catch (error) {
        console.error('Video start error:', error)
      }
    }
  }

  // 컨트롤러 재생/일시정지 버튼
  const togglePlay = () => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
      setOverlayVisible(false)
    }
  }

  const handleRestart = () => {
    if (!playerRef.current) return
    playerRef.current.seekTo(currentLyricRef.current.start)
    if (!isPlaying) {
      playerRef.current.playVideo()
    }
  }

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume)
      setVolume(0)
      playerRef.current?.setVolume(0)
    } else {
      setVolume(prevVolume)
      playerRef.current?.setVolume(prevVolume)
    }
  }

  return (
    <div className="relative group">
      {/* 오버레이가 보이는 동안 플레이어의 클릭은 막음 */}
      <div
        id="youtube-player"
        className="w-full aspect-video"
        style={{ pointerEvents: overlayVisible ? 'none' : 'auto' }}
      />

      {/* 모바일에서 최초에만 보이는 오버레이 */}
      {isMobile() && overlayVisible && (
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 pointer-events-auto"
        >
          <div className="text-center px-4">
            <button
              onPointerUp={handleStartClick}
              className="p-4 rounded-full bg-accent-600/20 mb-4 mx-auto w-fit 
                         hover:scale-110 transition-transform 
                         active:scale-95 cursor-pointer"
            >
              <Play className="w-12 h-12 text-accent-500" />
            </button>
            <p className="text-white text-lg font-medium">
              탭하여 학습 시작하기
            </p>
            <p className="text-gray-400 text-sm mt-2">
              가사와 함께 동영상이 재생됩니다
            </p>
          </div>
        </div>
      )}

      {/* 컨트롤러 UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full ${
                isRepeatOn ? 'bg-accent-600' : 'bg-white/10 hover:bg-white/20'
              } transition-colors`}
            >
              <Repeat className="w-5 h-5 text-white" />
            </button>

            {/* 데스크탑에서만 볼륨 컨트롤 표시 */}
            {!isMobile() && (
              <div className="relative group/volume">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* 볼륨 슬라이더 */}
                <div
                  className="absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 mb-2 h-24 opacity-0 invisible 
                             group-hover/volume:opacity-100 group-hover/volume:visible 
                             transition-all duration-200 bg-gray-800/95 rounded-xl p-3"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-1.5 h-[72px] rounded-full appearance-none bg-white/20 
                               accent-accent-500
                               [&::-webkit-slider-thumb]:appearance-none 
                               [&::-webkit-slider-thumb]:w-3 
                               [&::-webkit-slider-thumb]:h-3 
                               [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:bg-accent-500
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-md
                               [-webkit-appearance:slider-vertical]
                               [writing-mode:bt-lr]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-white/80">{formatTime(currentTime)}</div>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
