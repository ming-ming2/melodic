// utils/youtubeSearch.ts
import {
  YouTubeSearchResult,
  YouTubeSearchResponse,
  YouTubeChannelResponse,
} from '@/types/youtube'

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

// 공식 채널/영상을 나타내는 키워드
const officialKeywords = [
  'official music video',
  'official video',
  'official mv',
  'm/v',
  'official audio',
  'official lyric video',
]

// 제외할 키워드
const excludeKeywords = [
  'cover',
  'reaction',
  'dance practice',
  'live',
  'concert',
  'remix',
]

const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
const foreignVersionKeywords = [
  'english ver',
  'japanese ver',
  'chinese ver',
  'spanish ver',
  'french ver',
  'eng ver',
  'jpn ver',
  'jp ver',
  'cn ver',
  'esp ver',
  'fr ver',
]

function isOfficialMusicVideo(
  title: string,
  channelTitle: string,
  description: string = ''
): boolean {
  const lowerTitle = title.toLowerCase()
  const lowerChannelTitle = channelTitle.toLowerCase()
  const lowerDescription = description.toLowerCase()

  // 제외 키워드 체크
  if (
    excludeKeywords.some(
      (keyword) =>
        lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
    )
  ) {
    return false
  }

  // "Topic" 채널은 공식 오디오
  if (lowerChannelTitle.includes('- topic')) {
    return true
  }

  // VEVO 채널은 공식 영상
  if (lowerChannelTitle.includes('vevo')) {
    return true
  }

  // 공식 키워드 체크
  return officialKeywords.some(
    (keyword) =>
      lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
  )
}

function isForeignLanguageVersion(
  title: string,
  description: string = ''
): boolean {
  const lowerTitle = title.toLowerCase()
  const lowerDescription = description.toLowerCase()

  const hasForeignVersionKeyword = foreignVersionKeywords.some(
    (keyword) =>
      lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
  )

  return !koreanRegex.test(title) || hasForeignVersionKeyword
}

export async function searchOfficialMusicVideos(
  query: string
): Promise<YouTubeSearchResult[]> {
  if (!query || query.length < 2) return []

  try {
    // 여러 검색 키워드 시도
    const searchQueries = [
      `${query} official music video`,
      `${query} official video`,
      `${query} official mv`,
    ]

    // 모든 검색 결과를 담을 배열
    let allResults: YouTubeSearchResult[] = []

    // 각 검색 쿼리에 대해 병렬로 요청
    const searchPromises = searchQueries.map(async (searchQuery) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          new URLSearchParams({
            part: 'snippet',
            type: 'video',
            videoCategoryId: '10', // Music category
            videoLicense: 'youtube',
            maxResults: '10',
            q: searchQuery,
            key: YOUTUBE_API_KEY || '',
            relevanceLanguage: 'en',
          })
      )

      if (!response.ok) return []

      const data: YouTubeSearchResponse = await response.json()
      return data.items || []
    })

    const searchResults = await Promise.all(searchPromises)
    const allItems = searchResults.flat()

    // 중복 제거
    const uniqueItems = Array.from(
      new Map(allItems.map((item) => [item.id.videoId, item])).values()
    )

    // 채널 정보 조회
    const channelIds = [
      ...new Set(uniqueItems.map((item) => item.snippet.channelId)),
    ]
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
        new URLSearchParams({
          part: 'status,snippet',
          id: channelIds.join(','),
          key: YOUTUBE_API_KEY || '',
        })
    )

    const channelData: YouTubeChannelResponse = await channelResponse.json()
    const channelCountryMap = new Map(
      channelData.items?.map((channel) => [
        channel.id,
        channel.snippet?.country,
      ])
    )

    // 결과 필터링 및 변환
    return uniqueItems
      .filter((item) => {
        const isVerifiedChannel = channelData.items?.find(
          (channel) => channel.id === item.snippet.channelId
        )?.status?.isLinked

        if (!isVerifiedChannel) return false

        const channelCountry = channelCountryMap.get(item.snippet.channelId)
        const isOfficial = isOfficialMusicVideo(
          item.snippet.title,
          item.snippet.channelTitle,
          item.snippet.description
        )

        if (!isOfficial) return false

        if (channelCountry === 'KR') {
          return isForeignLanguageVersion(
            item.snippet.title,
            item.snippet.description
          )
        }

        return true
      })
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        isOfficial: true,
      }))
      .slice(0, 5) // 최대 5개 결과만 반환
  } catch (error) {
    console.error('YouTube 검색 중 오류 발생:', error)
    return []
  }
}
