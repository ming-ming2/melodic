// components/lyrics/YouTubePlayer/index.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Repeat, Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react'

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (currentTime: number) => void
  initialStartTime?: number
  initialEndTime?: number
  isRepeatMode?: boolean
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
  onTimeUpdate,
  initialStartTime = 0,
  initialEndTime,
  isRepeatMode = false,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const timeCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // 반복 재생 구간
  const [repeatSection, setRepeatSection] = useState({
    start: initialStartTime,
    end: initialEndTime || 0,
  })

  useEffect(() => {
    // 새로운 시작/종료 시간이 주어지면 repeatSection 업데이트
    setRepeatSection({
      start: initialStartTime,
      end: initialEndTime || 0,
    })
  }, [initialStartTime, initialEndTime])

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0, // 커스텀 컨트롤을 사용하기 위해 기본 컨트롤 비활성화
          modestbranding: 1,
          rel: 0,
          start: repeatSection.start,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true)
            setDuration(event.target.getDuration())
          },
          onStateChange: handlePlayerStateChange,
        },
      })
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

  const handlePlayerStateChange = (event: any) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING)

    if (event.data === window.YT.PlayerState.PLAYING) {
      startTimeCheck()
    } else {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }
    }
  }

  const startTimeCheck = () => {
    if (timeCheckInterval.current) {
      clearInterval(timeCheckInterval.current)
    }

    timeCheckInterval.current = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime()
        setCurrentTime(time)
        onTimeUpdate?.(time)

        // 반복 재생 체크
        if (
          isRepeatMode &&
          repeatSection.end > 0 &&
          time >= repeatSection.end
        ) {
          playerRef.current.seekTo(repeatSection.start)
          playerRef.current.playVideo()
        }
      }
    }, 100)
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const restartSection = () => {
    if (!playerRef.current) return
    playerRef.current.seekTo(repeatSection.start)
    playerRef.current.playVideo()
  }

  const toggleMute = () => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }

  return (
    <div className="relative group">
      {/* YouTube Player */}
      <div id="youtube-player" className="w-full aspect-video" />

      {/* Controls Overlay - hover시에만 표시 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="absolute bottom-12 left-0 right-0 px-4">
          <div className="h-1 bg-gray-600 rounded-full">
            <div
              className="h-full bg-accent-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
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
              onClick={restartSection}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-full ${
                isRepeatMode ? 'bg-accent-600' : 'bg-white/10 hover:bg-white/20'
              } transition-colors`}
            >
              <Repeat className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Time Display */}
          <div className="text-sm text-white/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
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
