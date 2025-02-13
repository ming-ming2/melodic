// types/youtube.ts
export interface YouTubeSearchResult {
  id: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  isOfficial?: boolean
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string
    }
    snippet: {
      title: string
      channelTitle: string
      channelId: string
      description: string
      thumbnails: {
        default: {
          url: string
        }
        medium?: {
          url: string
        }
        high?: {
          url: string
        }
      }
    }
  }>
}

export interface YouTubeChannelResponse {
  items: Array<{
    id: string
    snippet: {
      title: string
      description: string
      country?: string
      thumbnails: {
        default: {
          url: string
        }
      }
    }
    status: {
      privacyStatus: string
      isLinked: boolean
      longUploadsStatus: string
    }
  }>
}
