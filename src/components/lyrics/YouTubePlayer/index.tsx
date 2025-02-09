import React, { useEffect, useRef, useState } from 'react'
import { Repeat, Play, Pause, SkipBack } from 'lucide-react'

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

export default function YouTubePlayer({
  videoId,
  currentLyric,
  onTimeUpdate,
  isUserNavigation = false,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRepeatOn, setIsRepeatOn] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
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
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setIsReady(true)
            playerRef.current.seekTo(currentLyric.start)
            playerRef.current.pauseVideo()
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

  // 현재 가사 변경 시 동작
  useEffect(() => {
    if (!playerRef.current || !isReady) return

    const isDifferentLyric =
      previousLyricRef.current.start !== currentLyric.start ||
      previousLyricRef.current.end !== currentLyric.end

    if (isDifferentLyric) {
      console.log('🔄 가사 업데이트됨:', currentLyric)

      // 🚀 최신 가사 값으로 업데이트
      previousLyricRef.current = currentLyric
    }

    // 사용자 네비게이션일 때만 seekTo와 playVideo 실행
    if (isUserNavigation) {
      playerRef.current.seekTo(currentLyric.start)

      // 재생 중이었다면 계속 재생
      if (isPlaying) {
        playerRef.current.playVideo()
      }
    }
  }, [currentLyric, isUserNavigation, isReady])

  const currentLyricRef = useRef(currentLyric)
  const isRepeatOnRef = useRef(isRepeatOn)

  // useEffect를 사용해 isRepeatOn이 변경될 때마다 ref 업데이트
  useEffect(() => {
    isRepeatOnRef.current = isRepeatOn
  }, [isRepeatOn])
  // useEffect를 사용해 currentLyric이 변경될 때마다 ref 업데이트
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

      // 로그 추가
      // console.log('Current Time:', time)
      // console.log('Lyric End Time:', currentLyricRef.current.end)
      // console.log('Is Repeat On:', isRepeatOnRef.current) // isRepeatOn 대신 isRepeatOnRef.current 사용

      // 현재 가사 구간 끝나기 0.1초 전에 되감기
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
    } else {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
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
    // console.log('Repeat button clicked')
    // console.log('Current isRepeatOn:', !isRepeatOn)
    setIsRepeatOn(!isRepeatOn)
  }

  return (
    <div className="relative group">
      <div id="youtube-player" className="w-full aspect-video" />

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
