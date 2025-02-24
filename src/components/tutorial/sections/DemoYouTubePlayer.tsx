// pages/DemoYouTubePlayer.tsx
import React, { useImperativeHandle, useRef, useState, useEffect } from 'react'
import { Repeat, Play, Pause, SkipBack, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface DemoYouTubePlayerProps {
  videoId: string
  currentLyric: { start: number; end: number }
  onTimeUpdate?: (currentTime: number) => void
  isUserNavigation?: boolean
  onPlayerReady?: () => void
  onControlAction?: (action: string) => void
  highlightControl?: string
}

export interface DemoYouTubePlayerRef {
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
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="w-12 h-12 text-accent-500" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-gray-400 text-sm font-medium"
    >
      Loading video...
    </motion.p>
  </div>
)

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default React.forwardRef<DemoYouTubePlayerRef, DemoYouTubePlayerProps>(
  function DemoYouTubePlayer(
    {
      videoId,
      currentLyric,
      onTimeUpdate,
      isUserNavigation = false,
      onPlayerReady,
      onControlAction,
      highlightControl,
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

    const startTimeCheck = useRef(() => {
      if (timeCheckInterval.current) clearInterval(timeCheckInterval.current)
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
        if (timeCheckInterval.current) clearInterval(timeCheckInterval.current)
      }
    })

    useEffect(() => {
      if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }
      const initPlayer = () => {
        playerRef.current = new window.YT.Player('demo-youtube-player', {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
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
                onPlayerReady?.()
                playerRef.current.pauseVideo()
                setOverlayVisible(true)
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
        if (timeCheckInterval.current) clearInterval(timeCheckInterval.current)
        if (playerRef.current) playerRef.current.destroy()
      }
    }, [videoId])

    useEffect(() => {
      currentLyricRef.current = currentLyric
      if (!playerRef.current || !isReady) return
      if (isUserNavigation) {
        playerRef.current.seekTo(currentLyric.start)
        if (isPlayingRef.current) playerRef.current.playVideo()
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
      if (overlayRef.current) overlayRef.current.style.display = 'none'
      try {
        playerRef.current?.seekTo(currentLyric.start)
        playerRef.current?.playVideo()
        onControlAction && onControlAction('play')
      } catch (error) {
        console.error('Video start error:', error)
      }
    }

    const handleRestart = () => {
      if (!playerRef.current) return
      playerRef.current.seekTo(currentLyricRef.current.start)
      onControlAction && onControlAction('skip')
      if (!isPlayingRef.current) playerRef.current.playVideo()
    }

    const togglePlay = () => {
      if (!playerRef.current) return
      if (isPlayingRef.current) {
        playerRef.current.pauseVideo()
        onControlAction && onControlAction('pause')
      } else {
        playerRef.current.playVideo()
        setOverlayVisible(false)
        onControlAction && onControlAction('play')
      }
    }

    const toggleRepeat = () => {
      setIsRepeatOn((prev) => !prev)
      if (highlightControl === 'repeat') {
        onControlAction && onControlAction('repeat')
      }
    }

    const getHighlightClass = (control: string) => {
      if (!highlightControl) return ''
      if (control === 'play') {
        return !isPlayingRef.current && highlightControl === 'play'
          ? ' ring-4 ring-accent-500 animate-pulse'
          : ''
      }
      if (control === 'pause') {
        return isPlayingRef.current && highlightControl === 'pause'
          ? ' ring-4 ring-accent-500 animate-pulse'
          : ''
      }
      if (control === 'skip') {
        return highlightControl === 'skip'
          ? ' ring-4 ring-accent-500 animate-pulse'
          : ''
      }
      if (control === 'repeat') {
        return highlightControl === 'repeat'
          ? ' ring-4 ring-accent-500 animate-pulse'
          : ''
      }
      return ''
    }

    return (
      <div className="relative group">
        <div
          id="demo-youtube-player"
          className="w-full aspect-video"
          style={{ pointerEvents: overlayVisible ? 'none' : 'auto' }}
        />
        {isLoading && <LoadingSpinner />}
        {overlayVisible && !isLoading && (
          <div
            ref={overlayRef}
            className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 pointer-events-auto"
          >
            <div className="text-center px-4">
              <button
                onPointerUp={handleStartClick}
                className="p-4 rounded-full bg-accent-600/20 mb-4 mx-auto w-fit hover:scale-110 transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-12 h-12 text-accent-500" />
              </button>
              <p className="text-white text-lg font-medium">터치해서 시작</p>
              <p className="text-gray-400 text-sm mt-2">
                영상과 함께 학습 시작
              </p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className={`p-2 rounded-full transition-colors ${getHighlightClass('play') + getHighlightClass('pause')}`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleRestart}
                className={`p-2 rounded-full transition-colors ${getHighlightClass('skip')}`}
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors ${
                  isRepeatOn ? 'bg-accent-600' : 'bg-white/10 hover:bg-white/20'
                } ${getHighlightClass('repeat')}`}
              >
                <Repeat className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="text-sm text-white/80">{/* 재생 시간 표시 */}</div>
          </div>
        </div>
      </div>
    )
  }
)
