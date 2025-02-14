// utils/youtubeMatching.ts
import { SpotifySearchResult } from '@/types/spotify'
import { YouTubeSearchResult } from '@/types/youtube'

interface YouTubeSearchResponse {
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

interface ScoredVideo {
  video: YouTubeSearchResult
  score: number
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // 괄호와 그 안의 내용 제거
    .replace(/\[[^\]]*\]/g, '') // 대괄호와 그 안의 내용 제거
    .replace(/feat\.|ft\./g, '') // feat, ft 제거
    .replace(/[^\w\s]/g, '') // 특수문자 제거
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .trim()
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1)
  const s2 = normalizeString(str2)

  // 정확히 일치하는 경우
  if (s1 === s2) return 1

  // 한 문자열이 다른 문자열에 포함되는 경우
  if (s1.includes(s2) || s2.includes(s1)) return 0.9

  // 단어 단위로 비교
  const words1 = new Set(s1.split(' '))
  const words2 = new Set(s2.split(' '))

  // 공통 단어 수 계산
  const commonWords = [...words1].filter((word) => words2.has(word))
  const similarity = (2.0 * commonWords.length) / (words1.size + words2.size)

  return similarity
}

// 공식 영상 관련 상수들
const OFFICIAL_TITLE_PATTERNS = [
  'official music video',
  'official video',
  'official mv',
  'm/v',
  'official audio',
  'official lyric video',
] as const

const UNOFFICIAL_PATTERNS = [
  'cover',
  'live',
  'remix',
  'concert',
  'reaction',
  'dance practice',
  'guitar cover',
  'drum cover',
  'piano cover',
  'vocal cover',
  'lyrics',
  'karaoke',
] as const

export async function findBestMatchingVideo(
  track: SpotifySearchResult
): Promise<YouTubeSearchResult | null> {
  try {
    // 검색 쿼리 (모든 쿼리의 결과를 모음)
    const searchQueries = [
      `${track.title} ${track.artist} official music video`,
      `${track.title} ${track.artist} official video`,
      `${track.title} ${track.artist} official mv`,
      `${track.title} ${track.artist} mv`,
      `${track.title} ${track.artist} official`,
    ]

    let allResults: ScoredVideo[] = []

    for (const query of searchQueries) {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10',
          maxResults: '10',
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
        })}`
      )

      if (!response.ok) continue

      const data: YouTubeSearchResponse = await response.json()
      if (!data.items?.length) continue

      const scoredResults: ScoredVideo[] = data.items.map((item) => {
        const videoTitle = item.snippet.title
        const normalizedVideoTitle = normalizeString(videoTitle)
        const normalizedTrackTitle = normalizeString(track.title)
        const normalizedTrackArtist = normalizeString(track.artist)

        // 비공식 패턴이 포함된 영상은 제외
        if (
          UNOFFICIAL_PATTERNS.some((pattern) =>
            normalizedVideoTitle.includes(pattern)
          )
        ) {
          return { video: createVideoResult(item), score: -1 }
        }

        // 기본 제목 유사도 (트랙 제목과 아티스트명을 함께 비교)
        const titleSimilarity = calculateSimilarity(
          videoTitle,
          `${track.title} ${track.artist}`
        )

        let officialScore = 0

        // 공식 패턴 체크 (비교시 모두 소문자로)
        if (
          OFFICIAL_TITLE_PATTERNS.some((pattern) =>
            normalizedVideoTitle.includes(pattern)
          )
        ) {
          officialScore += 0.3
        }

        // 보너스: 영상 제목에 트랙 제목이 포함된 경우
        if (normalizedVideoTitle.includes(normalizedTrackTitle)) {
          officialScore += 0.2
        }

        // 채널명 정규화 후 아티스트 포함 여부 체크
        const normalizedChannelTitle = normalizeString(
          item.snippet.channelTitle
        )
        if (normalizedChannelTitle.includes(normalizedTrackArtist)) {
          officialScore += 0.5
        }

        // 채널명에 VEVO나 official 키워드가 있는 경우 추가 보너스
        if (normalizedChannelTitle.includes('vevo')) {
          officialScore += 0.3
        } else if (normalizedChannelTitle.includes('official')) {
          officialScore += 0.2
        }

        const totalScore = titleSimilarity + officialScore

        return {
          video: createVideoResult(item),
          score: totalScore,
        }
      })

      // 0.75 이상의 점수인 영상만 취합
      const validResults = scoredResults.filter(
        (result) => result.score >= 0.75
      )
      allResults = allResults.concat(validResults)
    }

    if (allResults.length === 0) return null

    // 점수 순으로 정렬하여 최고 점수를 가진 영상 선택
    allResults.sort((a, b) => b.score - a.score)

    // 로깅 추가
    console.log('Found YouTube video:', {
      title: allResults[0].video.title,
      channel: allResults[0].video.channelTitle,
      searchedFor: `${track.title} - ${track.artist}`,
      score: allResults[0].score,
    })

    return allResults[0].video
  } catch (error) {
    console.error('Error finding matching video:', error)
    return null
  }
}

// 헬퍼 함수
function createVideoResult(
  item: YouTubeSearchResponse['items'][0]
): YouTubeSearchResult {
  return {
    id: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnailUrl: item.snippet.thumbnails.default.url,
  }
}
