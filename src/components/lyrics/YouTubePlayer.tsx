// components/lyrics/YouTubePlayer.tsx
import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: {
      Player: any
      PlayerState: {
        PLAYING: number
      }
    }
  }
}

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (currentTime: number) => void
}

export default function YouTubePlayer({
  videoId,
  onTimeUpdate,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // YouTube API 로드
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // 플레이어 초기화
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeUpdate()
            }
          },
        },
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId])

  const startTimeUpdate = () => {
    setInterval(() => {
      if (playerRef.current && onTimeUpdate) {
        const currentTime = playerRef.current.getCurrentTime()
        onTimeUpdate(currentTime)
      }
    }, 100)
  }

  return (
    <div className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden">
      <div id="youtube-player" />
    </div>
  )
}
