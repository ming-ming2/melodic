import { SpotifySearchResult } from '@/types/spotify'
import { YouTubeSearchResult } from '@/types/youtube'
import { isOfficialMusicVideo } from '@/utils/youtubeSearch'

// YouTube API 응답 인터페이스 정의
interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string
    }
    snippet: {
      title: string
      channelTitle: string
      channelId: string
      description?: string
      thumbnails: {
        default: {
          url: string
        }
      }
    }
  }>
}

interface YouTubeChannelSearchResponse {
  items: Array<{
    id: {
      channelId: string
    }
    snippet: {
      title: string
      description: string
    }
  }>
}

interface ScoredVideo {
  video: YouTubeSearchResult
  score: number
}

/**
 * normalizeString 함수: 제목 유사도 계산을 위해서만 사용 (부가 정보 제거)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/gu, '') // 괄호와 그 안 내용 제거
    .replace(/\[[^\]]*\]/gu, '') // 대괄호와 그 안 내용 제거
    .replace(/feat\.|ft\./gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
}

/**
 * 원본 제목(raw title)을 사용하여 비공식 영상 판별 함수
 * 'official' 키워드가 있으면 예외 처리
 */
function isUnofficialVideo(rawTitle: string): boolean {
  const lowerTitle = rawTitle.toLowerCase()
  if (lowerTitle.includes('official')) return false

  const unofficialPatterns = [
    'cover',
    'live',
    'remix',
    'concert',
    'reaction',
    'dance',
    'karaoke',
    'lyrics',
    'vietsub',
    'romanji',
  ]
  return unofficialPatterns.some((pattern) => lowerTitle.includes(pattern))
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1)
  const s2 = normalizeString(str2)

  if (s1 === s2) return 1
  if (s1.includes(s2) || s2.includes(s1)) return 0.9

  const words1 = new Set(s1.split(' '))
  const words2 = new Set(s2.split(' '))
  const commonWords = [...words1].filter((word) => words2.has(word))
  return (2.0 * commonWords.length) / (words1.size + words2.size)
}

// 아티스트 공식 채널 찾기 함수
async function findOfficialArtistChannel(
  artistName: string
): Promise<string | null> {
  try {
    const normalizedArtistName = normalizeString(artistName)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
        part: 'snippet',
        q: `${artistName} official channel`,
        type: 'channel',
        maxResults: '5',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
      })}`
    )

    if (!response.ok) {
      console.error('findOfficialArtistChannel: Response not OK')
      return null
    }

    const data: YouTubeChannelSearchResponse = await response.json()
    if (!data.items?.length) return null

    const officialChannel = data.items.find((channel) => {
      const normalizedChannelTitle = normalizeString(channel.snippet.title)
      return (
        normalizedChannelTitle.includes(normalizedArtistName) &&
        (normalizedChannelTitle.includes('official') ||
          normalizedChannelTitle.includes('channel'))
      )
    })

    return officialChannel ? officialChannel.id.channelId : null
  } catch (error) {
    console.error('Error finding official channel:', error)
    return null
  }
}

export async function findBestMatchingVideo(
  track: SpotifySearchResult
): Promise<YouTubeSearchResult | null> {
  const debugLogs: string[] = []
  try {
    // 1. 아티스트 공식 채널 찾기
    const officialChannelId = await findOfficialArtistChannel(track.artist)
    if (!officialChannelId) {
      debugLogs.push(`공식 채널을 찾지 못함: ${track.artist}`)
    } else {
      debugLogs.push(`공식 채널 ID 발견: ${officialChannelId}`)
    }

    // ---------------------------
    // 2. 공식 뮤직비디오 검색 (우선 단계)
    // ---------------------------
    const musicVideoQueries = [
      `${track.title} ${track.artist} official music video`,
      `${track.title} ${track.artist} official video`,
      `${track.title} ${track.artist} mv`,
    ]

    let musicVideoResults: ScoredVideo[] = []
    for (const query of musicVideoQueries) {
      debugLogs.push(`뮤직비디오 검색 쿼리 시도: "${query}"`)
      const params: Record<string, string> = {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10',
        maxResults: '15',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
      }
      if (officialChannelId) {
        params.channelId = officialChannelId
      }

      let response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams(
          params
        )}`
      )
      if (!response.ok) {
        debugLogs.push(`뮤직비디오 쿼리 "${query}" 실패: Response not OK.`)
        continue
      }

      let data: YouTubeSearchResponse = await response.json()
      if ((!data.items || data.items.length === 0) && officialChannelId) {
        debugLogs.push(
          `뮤직비디오 쿼리 "${query}" - 공식 채널 필터 결과 없음, 채널 필터 없이 재시도`
        )
        const fallbackParams = { ...params }
        delete fallbackParams.channelId
        response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams(
            fallbackParams
          )}`
        )
        if (response.ok) {
          data = await response.json()
        }
      }
      if (!data.items || data.items.length === 0) {
        debugLogs.push(`뮤직비디오 쿼리 "${query}" 결과 0건.`)
        continue
      }

      const scoredResults: ScoredVideo[] = data.items.map((item) => {
        if (isUnofficialVideo(item.snippet.title)) {
          return { video: createVideoResult(item), score: -1 }
        }

        const videoTitle = item.snippet.title
        const channelTitle = item.snippet.channelTitle
        const description = item.snippet.description || ''

        const normalizedVideoTitle = normalizeString(videoTitle)
        const normalizedChannelTitle = normalizeString(channelTitle)
        const normalizedTrackArtist = normalizeString(track.artist)

        let officialScore = 0
        if (officialChannelId && item.snippet.channelId === officialChannelId) {
          officialScore += 1.0
        }

        const musicVideoPatterns = [
          'official music video',
          'official video',
          'official mv',
          'music video',
          'music clip',
        ]
        if (
          musicVideoPatterns.some((pattern) =>
            normalizedVideoTitle.includes(pattern)
          )
        ) {
          officialScore += 0.5
        }

        // 추가: 영상 자체에 공식 키워드가 포함되면 보너스
        if (isOfficialMusicVideo(videoTitle, channelTitle, description)) {
          officialScore += 0.3
        }

        if (normalizedChannelTitle.includes(normalizedTrackArtist)) {
          officialScore += 0.3
        }

        if (normalizedVideoTitle.includes('audio')) {
          officialScore -= 0.2
        }

        const titleSimilarity = calculateSimilarity(
          videoTitle,
          `${track.title} ${track.artist}`
        )
        const totalScore = titleSimilarity + officialScore

        return { video: createVideoResult(item), score: totalScore }
      })

      const validResults = scoredResults
        .filter((result) => result.score > 0.7)
        .sort((a, b) => b.score - a.score)
      if (validResults.length === 0) {
        debugLogs.push(
          `뮤직비디오 쿼리 "${query}"에서 필터링 후 유효한 결과가 없음.`
        )
      } else {
        debugLogs.push(
          `뮤직비디오 쿼리 "${query}"에서 유효한 결과 ${validResults.length}건 발견.`
        )
      }
      musicVideoResults = musicVideoResults.concat(validResults)
    }

    if (musicVideoResults.length > 0) {
      const bestMatch = musicVideoResults.sort((a, b) => b.score - a.score)[0]
      console.log('Found Official Music Video:', {
        title: bestMatch.video.title,
        channel: bestMatch.video.channelTitle,
        searchedFor: `${track.title} - ${track.artist}`,
        score: bestMatch.score,
      })
      return bestMatch.video
    } else {
      debugLogs.push(
        `공식 뮤직비디오를 찾지 못함: ${track.title} - ${track.artist} (쿼리: ${musicVideoQueries.join(
          ', '
        )})`
      )
    }

    // ---------------------------
    // 3. 공식 음원(오디오) 검색 (뮤직비디오가 없을 경우)
    // ---------------------------
    const audioQueries = [
      `${track.title} ${track.artist} official audio`,
      `${track.title} ${track.artist} audio`,
    ]
    let audioResults: ScoredVideo[] = []
    for (const query of audioQueries) {
      debugLogs.push(`오디오 검색 쿼리 시도: "${query}"`)
      const params: Record<string, string> = {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10',
        maxResults: '15',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
      }
      if (officialChannelId) {
        params.channelId = officialChannelId
      }

      let response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams(
          params
        )}`
      )
      if (!response.ok) {
        debugLogs.push(`오디오 쿼리 "${query}" 실패: Response not OK.`)
        continue
      }

      let data: YouTubeSearchResponse = await response.json()
      if ((!data.items || data.items.length === 0) && officialChannelId) {
        debugLogs.push(
          `오디오 쿼리 "${query}" - 공식 채널 필터 결과 없음, 채널 필터 없이 재시도`
        )
        const fallbackParams = { ...params }
        delete fallbackParams.channelId
        response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams(
            fallbackParams
          )}`
        )
        if (response.ok) {
          data = await response.json()
        }
      }
      if (!data.items || data.items.length === 0) {
        debugLogs.push(`오디오 쿼리 "${query}" 결과 0건.`)
        continue
      }

      const scoredResults: ScoredVideo[] = data.items.map((item) => {
        if (isUnofficialVideo(item.snippet.title)) {
          return { video: createVideoResult(item), score: -1 }
        }

        const videoTitle = item.snippet.title
        const channelTitle = item.snippet.channelTitle
        const description = item.snippet.description || ''

        const normalizedVideoTitle = normalizeString(videoTitle)
        const normalizedChannelTitle = normalizeString(channelTitle)
        const normalizedTrackArtist = normalizeString(track.artist)

        let officialScore = 0
        if (officialChannelId && item.snippet.channelId === officialChannelId) {
          officialScore += 1.0
        }

        const audioPatterns = ['official audio', 'audio']
        if (
          audioPatterns.some((pattern) =>
            normalizedVideoTitle.includes(pattern)
          )
        ) {
          officialScore += 0.5
        }

        if (isOfficialMusicVideo(videoTitle, channelTitle, description)) {
          officialScore += 0.3
        }

        if (normalizedChannelTitle.includes(normalizedTrackArtist)) {
          officialScore += 0.3
        }

        const titleSimilarity = calculateSimilarity(
          videoTitle,
          `${track.title} ${track.artist}`
        )
        const totalScore = titleSimilarity + officialScore

        return { video: createVideoResult(item), score: totalScore }
      })

      const validResults = scoredResults
        .filter((result) => result.score > 0.7)
        .sort((a, b) => b.score - a.score)
      if (validResults.length === 0) {
        debugLogs.push(
          `오디오 쿼리 "${query}"에서 필터링 후 유효한 결과가 없음.`
        )
      } else {
        debugLogs.push(
          `오디오 쿼리 "${query}"에서 유효한 결과 ${validResults.length}건 발견.`
        )
      }
      audioResults = audioResults.concat(validResults)
    }

    if (audioResults.length > 0) {
      const bestAudioMatch = audioResults.sort((a, b) => b.score - a.score)[0]
      console.log('Found Official Audio:', {
        title: bestAudioMatch.video.title,
        channel: bestAudioMatch.video.channelTitle,
        searchedFor: `${track.title} - ${track.artist}`,
        score: bestAudioMatch.score,
      })
      return bestAudioMatch.video
    } else {
      debugLogs.push(
        `공식 오디오를 찾지 못함: ${track.title} - ${track.artist} (쿼리: ${audioQueries.join(
          ', '
        )})`
      )
    }

    console.error('No matching video found. Debug logs:', debugLogs)
    return null
  } catch (error) {
    console.error('Error finding matching video:', error)
    return null
  }
}

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
