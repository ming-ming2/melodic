// utils/spotifySearch.ts
import {
  SpotifySearchResult,
  SpotifyApiResponse,
  SpotifyArtist,
} from '@/types/spotify'

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiration: number = 0

// 한글 감지 정규식 (모든 한글 자모, 완성형 한글 포함)
const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/

// K-pop 및 한국 관련 키워드 (소문자로 비교)
const kpopKeywords = [
  'k-pop',
  'kpop',
  '케이팝',
  'korean',
  'korea',
  '한국',
  'jyp',
  'sm',
  'yg',
  'hybe',
  'blackpink',
  'bts',
  'twice',
  'ive',
  'aespa',
]

// isKoreanContent: 트랙 제목, 아티스트명, 앨범명을 모두 검사
function isKoreanContent(
  title: string,
  artistNames: string,
  albumName: string
): boolean {
  const combinedText = `${title} ${artistNames} ${albumName}`.toLowerCase()

  // 1. 한글 포함 여부 체크
  if (koreanRegex.test(combinedText)) {
    return true
  }

  // 2. K-pop 관련 키워드 체크
  if (
    kpopKeywords.some((keyword) => combinedText.includes(keyword.toLowerCase()))
  ) {
    return true
  }

  return false
}

// isKoreanArtist: 아티스트의 markets, 장르, 이름(한글 포함, 키워드) 모두를 엄격하게 체크
async function isKoreanArtist(
  artistId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch artist info: ${response.status}`)
    }

    const artist: SpotifyArtist = await response.json()
    console.log('Artist info:', {
      name: artist.name,
      genres: artist.genres,
      markets: artist.markets,
    })

    // 1. markets 체크: 만약 markets에 'KR' (대한민국)이 포함되어 있다면 한국 아티스트로 판단
    if (artist.markets && artist.markets.includes('KR')) {
      console.log('Filtered by market (KR):', artist.name)
      return true
    }

    // 2. 장르 체크: 장르에 "k-pop", "korean", "한국", "케이팝" 등 포함 여부 (정규식을 사용하여 엄격하게)
    const koreanGenreRegex = /k[-\s]?pop|korean|한국|케이팝/i
    if (artist.genres.some((genre) => koreanGenreRegex.test(genre))) {
      console.log('Filtered by genre:', artist.name)
      return true
    }

    // 3. 아티스트 이름에 한글 포함 여부 체크
    if (koreanRegex.test(artist.name)) {
      console.log('Filtered by artist name (hangul):', artist.name)
      return true
    }

    // 4. 아티스트 이름에 K-pop 관련 키워드 체크
    if (
      kpopKeywords.some((keyword) =>
        artist.name.toLowerCase().includes(keyword)
      )
    ) {
      console.log('Filtered by artist name (keyword):', artist.name)
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking artist info:', error)
    // 에러 발생 시 보수적으로 한국 아티스트로 판단하여 필터링
    return true
  }
}

async function getAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials are not configured')
  }

  if (accessToken && tokenExpiration > Date.now()) {
    return accessToken
  }

  try {
    const authString = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Spotify auth error:', errorData)
      throw new Error(
        `Failed to get access token: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    if (!data.access_token) {
      throw new Error('No access token received')
    }

    accessToken = data.access_token
    tokenExpiration = Date.now() + data.expires_in * 1000

    return data.access_token
  } catch (error) {
    console.error('Failed to get Spotify access token:', error)
    throw error
  }
}

/**
 * 중복된 트랙을 제거합니다.
 * key: 아티스트명 + 트랙명 (소문자, 트림 처리)
 * 만약 동일 키가 존재하면, query와 정확히 일치하는 트랙이 있다면 그걸 우선 선택합니다.
 */
function deduplicateResults(
  results: SpotifySearchResult[],
  query: string
): SpotifySearchResult[] {
  const dedupedMap = new Map<string, SpotifySearchResult>()
  const normalizedQuery = query.toLowerCase().trim()

  results.forEach((result) => {
    // key 생성: 모든 아티스트명을 포함 (콤마 구분)
    const key =
      result.artist.toLowerCase().trim() +
      '::' +
      result.title.toLowerCase().trim()
    if (!dedupedMap.has(key)) {
      dedupedMap.set(key, result)
    } else {
      // 이미 key가 존재하는 경우, query와 정확히 일치하는 트랙명을 우선 선택합니다.
      const existing = dedupedMap.get(key)!
      const existingExact =
        existing.title.toLowerCase().trim() === normalizedQuery
      const currentExact = result.title.toLowerCase().trim() === normalizedQuery

      if (currentExact && !existingExact) {
        dedupedMap.set(key, result)
      }
      // 둘 다 exact 혹은 둘 다 non-exact이면, 기존 값을 유지 (순서 보존)
    }
  })

  return Array.from(dedupedMap.values())
}

export async function searchSpotifyTracks(
  query: string
): Promise<SpotifySearchResult[]> {
  if (!query || query.length < 2) return []

  try {
    const token = await getAccessToken()

    const response = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: query,
        type: 'track',
        limit: '30',
        market: 'US',
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Search failed: ${response.status} ${response.statusText}`
      )
    }

    const data: SpotifyApiResponse = await response.json()

    // 1차 필터링: 트랙 제목, 모든 아티스트명, 앨범명에 한국어 또는 관련 키워드가 전혀 없는지 체크
    const initialFiltered = data.tracks.items.filter(
      (track) =>
        !isKoreanContent(
          track.name,
          track.artists.map((artist) => artist.name).join(' '),
          track.album.name
        )
    )

    // 2차 필터링: 각 트랙의 모든 아티스트 정보를 조회하여 한 명이라도 한국 아티스트라면 필터링
    const tracksWithArtistInfo = await Promise.all(
      initialFiltered.map(async (track) => {
        const artistsKoreanChecks = await Promise.all(
          track.artists.map((artist) => isKoreanArtist(artist.id, token))
        )
        const isAnyArtistKorean = artistsKoreanChecks.some((result) => result)
        return { track, isKorean: isAnyArtistKorean }
      })
    )

    const filteredTracks = tracksWithArtistInfo
      .filter(({ isKorean }) => !isKorean)
      .map(({ track }) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(', '),
        albumName: track.album.name,
        albumImageUrl: track.album.images[0]?.url || '',
        previewUrl: track.preview_url || undefined,
      }))

    // 중복된 동일 아티스트의 동일 노래 제거 (query와 정확히 일치하는게 있다면 우선)
    const uniqueResults = deduplicateResults(filteredTracks, query)

    return uniqueResults
  } catch (error) {
    console.error('Spotify search error:', error)
    return []
  }
}
