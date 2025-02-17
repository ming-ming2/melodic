// components/lyrics/YouTubePlayer/index.tsx
import React, { useImperativeHandle, useRef, useState, useEffect } from 'react'
import {
  Repeat,
  Play,
  Pause,
  SkipBack,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface YouTubePlayerProps {
  videoId: string
  currentLyric: {
    start: number
    end: number
  }
  onTimeUpdate?: (currentTime: number) => void
  isUserNavigation?: boolean
  onPlayerReady?: () => void
}

interface YouTubePlayerRef {
  pauseVideo: () => void
  playVideo: () => void
  seekTo: (seconds: number) => void
}

interface YouTubePlayer {
  destroy: () => void
  seekTo: (seconds: number) => void
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  getPlayerState: () => number
  getCurrentTime: () => number
  setVolume: (volume: number) => void
  getVolume: () => number
}

interface YouTubeEvent {
  data: number
  target: YouTubePlayer
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          width: string
          height: string
          playerVars: Record<string, unknown>
          events: {
            onReady: () => void
            onStateChange: (event: YouTubeEvent) => void
          }
        }
      ) => YouTubePlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Loader2 className="w-12 h-12 text-accent-500" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-gray-400 text-sm font-medium"
    >
      동영상 로딩 중...
    </motion.p>
  </div>
)

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
export default React.forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  function YouTubePlayer(
    {
      videoId,
      currentLyric,
      onTimeUpdate,
      isUserNavigation = false,
      onPlayerReady,
    },
    ref
  ) {
    const playerRef = useRef<YouTubePlayer | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const overlayClickedRef = useRef(false)
    const timeCheckInterval = useRef<NodeJS.Timeout | null>(null)
    const currentLyricRef = useRef(currentLyric)
    const isPlayingRef = useRef(false)
    const isRepeatOnRef = useRef(false)

    const [isReady, setIsReady] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [overlayVisible, setOverlayVisible] = useState(false)
    const [isRepeatOn, setIsRepeatOn] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(100)
    const [prevVolume, setPrevVolume] = useState(100)
    function formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    useImperativeHandle(ref, () => ({
      pauseVideo: () => {
        if (playerRef.current) {
          playerRef.current.pauseVideo()
          setIsPlaying(false)
          isPlayingRef.current = false
        }
      },
      playVideo: () => {
        if (playerRef.current) {
          playerRef.current.playVideo()
          setIsPlaying(true)
          isPlayingRef.current = true
          setOverlayVisible(false)
        }
      },
      seekTo: (seconds: number) => {
        if (playerRef.current) {
          playerRef.current.seekTo(seconds)
        }
      },
    }))

    // 함수들을 ref로 관리하여 의존성 체인 제거
    const startTimeCheck = useRef(() => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }

      timeCheckInterval.current = setInterval(() => {
        if (!playerRef.current) return

        const time = playerRef.current.getCurrentTime()
        setCurrentTime(time)
        onTimeUpdate?.(time)

        if (
          isRepeatOnRef.current &&
          time >= currentLyricRef.current.end - 0.2
        ) {
          if (playerRef.current) {
            playerRef.current.seekTo(currentLyricRef.current.start)
            if (!isPlayingRef.current) {
              playerRef.current.playVideo()
            }
          }
        }
      }, 50)
    })

    const handlePlayerStateChange = useRef((event: YouTubeEvent) => {
      const playerState = event.data
      const isNowPlaying = playerState === window.YT.PlayerState.PLAYING
      isPlayingRef.current = isNowPlaying
      setIsPlaying(isNowPlaying)

      if (isNowPlaying) {
        startTimeCheck.current()
        setOverlayVisible(false)
        setIsLoading(false)
      } else {
        if (timeCheckInterval.current) {
          clearInterval(timeCheckInterval.current)
        }
      }
    })

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
            wmode: 'opaque',
          },
          events: {
            onReady: () => {
              setIsReady(true)
              setIsLoading(false)
              if (playerRef.current) {
                playerRef.current.seekTo(currentLyric.start)
                playerRef.current.setVolume(volume)
                onPlayerReady?.()
                // 모바일일 경우 오버레이 표시
                if (isMobile()) {
                  setOverlayVisible(true)
                }

                if (!isMobile()) {
                  playerRef.current.mute()
                  playerRef.current.playVideo()
                  setIsPlaying(true)
                  isPlayingRef.current = true
                  const delay = currentLyric.start < 0.5 ? 0 : 300
                  setTimeout(() => {
                    if (playerRef.current) {
                      playerRef.current.unMute()
                      playerRef.current.setVolume(volume)
                      if (
                        playerRef.current.getPlayerState() !==
                        window.YT.PlayerState.PLAYING
                      ) {
                        playerRef.current.playVideo()
                      }
                    }
                  }, delay)
                }
              }
            },
            onStateChange: (event) => handlePlayerStateChange.current(event),
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
      currentLyricRef.current = currentLyric

      if (!playerRef.current || !isReady) return

      if (isUserNavigation) {
        playerRef.current.seekTo(currentLyric.start)
        if (isPlayingRef.current) {
          playerRef.current.playVideo()
        }
      }
    }, [currentLyric, isUserNavigation, isReady])

    useEffect(() => {
      isRepeatOnRef.current = isRepeatOn
    }, [isRepeatOn])

    const handleStartClick = (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (overlayClickedRef.current || isLoading) return
      overlayClickedRef.current = true

      if (overlayRef.current) {
        overlayRef.current.style.display = 'none'
      }
      if (playerRef.current) {
        try {
          playerRef.current.seekTo(currentLyric.start)
          playerRef.current.playVideo()
          setOverlayVisible(false)
          setIsPlaying(true)
          isPlayingRef.current = true
        } catch (error) {
          console.error('Video start error:', error)
        }
      }
    }

    const handleRestart = () => {
      if (!playerRef.current) return
      playerRef.current.seekTo(currentLyricRef.current.start)
      if (!isPlayingRef.current) {
        playerRef.current.playVideo()
      }
    }

    const togglePlay = () => {
      if (!playerRef.current) return
      if (isPlayingRef.current) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
        setOverlayVisible(false)
      }
    }

    const toggleRepeat = () => {
      setIsRepeatOn((prev) => !prev)
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
        <div
          id="youtube-player"
          className="w-full aspect-video"
          style={{ pointerEvents: overlayVisible ? 'none' : 'auto' }}
        />

        {isLoading && <LoadingSpinner />}

        {isMobile() && overlayVisible && !isLoading && (
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

            <div className="text-sm text-white/80">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
