// src/types/youtube.ts
export interface YouTubeSearchResult {
  id: string
  title: string
  channelTitle: string
  thumbnailUrl: string
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string
    }
    snippet: {
      title: string
      channelTitle: string
      thumbnails: {
        default: {
          url: string
        }
      }
    }
  }>
}
