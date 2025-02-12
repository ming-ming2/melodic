// src/utils/youtubeSearch.ts
import { YouTubeSearchResult, YouTubeSearchResponse } from '@/types/youtube'

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

export async function searchYouTubeVideos(
  query: string
): Promise<YouTubeSearchResult[]> {
  // 최소 2글자 이상일 때만 검색
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        query
      )}&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('YouTube API 검색 요청 실패')
    }

    const data: YouTubeSearchResponse = await response.json()

    // API 응답을 우리 앱의 검색 결과 형식으로 변환
    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.default.url,
    }))
  } catch (error) {
    console.error('YouTube 검색 중 오류 발생:', error)
    return []
  }
}
