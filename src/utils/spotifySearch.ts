// utils/spotifySearch.ts
import {
  SpotifySearchResult,
  SpotifyApiResponse,
  SpotifyArtist,
} from '@/types/spotify'

// 환경 변수에서 API 키 불러오기
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

// 인증 토큰 캐싱
let accessToken: string | null = null
let tokenExpiration: number = 0

// 아티스트 정보 캐싱 (메모리)
const artistCache = new Map<string, { isKorean: boolean; timestamp: number }>()
const ARTIST_CACHE_DURATION = 1000 * 60 * 60 * 24 // 24시간 캐싱

/**
 * 필터링을 위한 정규식 및 키워드 정의
 */
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
  '엔시티',
  'nct',
  '세븐틴',
  'seventeen',
  'stray kids',
  'monsta x',
  'ateez',
  'txt',
]

// 반주/가라오케 음원 관련 키워드
const instrumentalKeywords = [
  'instrumental',
  'karaoke',
  'mr',
  'music only',
  'without vocals',
  'no vocals',
  'minus one',
  '반주',
  '노래방',
  '백트랙',
  'inst.',
  'inst ver',
  'instrumental version',
  'backing track',
  'accompaniment',
  'off vocal',
  'musictrack',
  'karaokeversion',
]

// 리믹스/커버 관련 키워드
const remixCoverKeywords = [
  'remix',
  'cover',
  'bootleg',
  'edit',
  'flip',
  'rework',
  'remake',
  'mix',
  'mashup',
  'live version',
  'acoustic version',
  'piano version',
  'guitar cover',
  'drum cover',
  'orchestra version',
  'lo-fi',
  'lofi',
]

/**
 * 필터링 함수
 */
// 트랙이 반주/가라오케인지 확인
function isInstrumentalTrack(title: string, albumName: string): boolean {
  const combinedText = `${title} ${albumName}`.toLowerCase().replace(/\s+/g, '')

  return instrumentalKeywords.some((keyword) =>
    combinedText.includes(keyword.toLowerCase().replace(/\s+/g, ''))
  )
}

// 트랙이 리믹스/커버인지 확인
function isRemixOrCover(title: string, albumName: string): boolean {
  const combinedText = `${title} ${albumName}`.toLowerCase().replace(/\s+/g, '')

  return remixCoverKeywords.some((keyword) =>
    combinedText.includes(keyword.toLowerCase().replace(/\s+/g, ''))
  )
}

// 트랙이 한국어 콘텐츠인지 확인 (빠른 1차 필터링)
function isKoreanContent(
  title: string,
  artistNames: string,
  albumName: string
): boolean {
  const combinedText = `${title} ${artistNames} ${albumName}`
    .toLowerCase()
    .replace(/\s+/g, '')

  // 1. 한글 포함 여부 체크
  if (koreanRegex.test(combinedText)) {
    return true
  }

  // 2. K-pop 관련 키워드 체크
  if (
    kpopKeywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase().replace(/\s+/g, ''))
    )
  ) {
    return true
  }

  return false
}

// 아티스트가 한국 아티스트인지 캐시 먼저 확인 후 API 호출
async function isKoreanArtist(
  artistId: string,
  token: string
): Promise<boolean> {
  // 1. 캐시 확인
  const now = Date.now()
  const cachedData = artistCache.get(artistId)

  if (cachedData && now - cachedData.timestamp < ARTIST_CACHE_DURATION) {
    return cachedData.isKorean
  }

  // 2. 캐시에 없으면, 아티스트 이름만으로 빠른 체크 시도 (API 호출 없이)
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
      // 429 에러(Too Many Requests)일 경우 보수적으로 판단하지 않고
      // 아티스트 정보 없이 진행
      if (response.status === 429) {
        console.warn(
          `Rate limit hit for artist ${artistId}, proceeding without artist info`
        )
        return false
      }

      throw new Error(`Failed to fetch artist info: ${response.status}`)
    }

    const artist: SpotifyArtist = await response.json()

    // 한국 아티스트 판별 로직
    let isKorean = false

    // 1. markets 체크: 만약 markets에 'KR' (대한민국)이 포함되어 있다면 한국 아티스트로 판단
    if (artist.markets && artist.markets.includes('KR')) {
      isKorean = true
    }
    // 2. 장르 체크: 장르에 "k-pop", "korean", "한국", "케이팝" 등 포함 여부
    else if (
      artist.genres.some((genre) =>
        /k[-\s]?pop|korean|한국|케이팝/i.test(genre)
      )
    ) {
      isKorean = true
    }
    // 3. 아티스트 이름에 한글 포함 여부 체크
    else if (koreanRegex.test(artist.name)) {
      isKorean = true
    }
    // 4. 아티스트 이름에 K-pop 관련 키워드 체크
    else if (
      kpopKeywords.some((keyword) =>
        artist.name.toLowerCase().includes(keyword.toLowerCase())
      )
    ) {
      isKorean = true
    }

    // 캐시에 결과 저장
    artistCache.set(artistId, { isKorean, timestamp: now })
    return isKorean
  } catch (error) {
    console.error('Error checking artist info:', error)

    // 에러 발생 시 캐시에 저장하지 않고, false 반환
    // (에러가 발생했으므로 보수적으로 필터링하지 않음)
    return false
  }
}

/**
 * Spotify API 토큰 가져오기
 */
async function getAccessToken(): Promise<string> {
  // 기존 토큰이 유효하면 재사용
  if (accessToken && tokenExpiration > Date.now()) {
    return accessToken
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials are not configured')
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

    // 토큰 캐싱
    accessToken = data.access_token
    tokenExpiration = Date.now() + data.expires_in * 1000 - 60000 // 1분 일찍 만료되도록 설정

    return data.access_token
  } catch (error) {
    console.error('Failed to get Spotify access token:', error)
    throw error
  }
}

/**
 * 중복된 트랙을 제거하고 최적의 결과를 선택
 */
function deduplicateResults(
  results: SpotifySearchResult[],
  query: string
): SpotifySearchResult[] {
  const dedupedMap = new Map<string, SpotifySearchResult>()
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, '')

  results.forEach((result) => {
    // key 생성: 아티스트명 + 트랙명 (정규화)
    const key = `${result.artist.toLowerCase().trim().replace(/\s+/g, '')}::${result.title.toLowerCase().trim().replace(/\s+/g, '')}`

    if (!dedupedMap.has(key)) {
      dedupedMap.set(key, result)
    } else {
      // 이미 key가 존재하는 경우, 우선순위 체크
      const existing = dedupedMap.get(key)!

      // 1. 쿼리와 정확히 일치하는 트랙명을 우선 선택
      const existingTitleNormalized = existing.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')
      const currentTitleNormalized = result.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')
      const existingExact = existingTitleNormalized === normalizedQuery
      const currentExact = currentTitleNormalized === normalizedQuery

      if (currentExact && !existingExact) {
        dedupedMap.set(key, result)
        return
      }

      // 2. 앨범 이미지가 있는지 확인
      if (!existing.albumImageUrl && result.albumImageUrl) {
        dedupedMap.set(key, result)
        return
      }

      // 3. 미리듣기 URL이 있는지 확인
      if (!existing.previewUrl && result.previewUrl) {
        dedupedMap.set(key, result)
      }
    }
  })

  return Array.from(dedupedMap.values())
}

/**
 * 검색 결과 정렬
 */
function rankSearchResults(
  results: SpotifySearchResult[],
  query: string
): SpotifySearchResult[] {
  const normalizedQuery = query.toLowerCase().trim()

  return results.sort((a, b) => {
    // 1. 제목이 쿼리와 정확히 일치하는 항목 우선
    const aExactTitle = a.title.toLowerCase().trim() === normalizedQuery
    const bExactTitle = b.title.toLowerCase().trim() === normalizedQuery
    if (aExactTitle && !bExactTitle) return -1
    if (!aExactTitle && bExactTitle) return 1

    // 2. 아티스트가 쿼리와 일치하는 항목 우선
    const aExactArtist = a.artist.toLowerCase().trim() === normalizedQuery
    const bExactArtist = b.artist.toLowerCase().trim() === normalizedQuery
    if (aExactArtist && !bExactArtist) return -1
    if (!aExactArtist && bExactArtist) return 1

    // 3. 제목에 쿼리가 포함된 항목 우선
    const aTitleIncludes = a.title.toLowerCase().includes(normalizedQuery)
    const bTitleIncludes = b.title.toLowerCase().includes(normalizedQuery)
    if (aTitleIncludes && !bTitleIncludes) return -1
    if (!aTitleIncludes && bTitleIncludes) return 1

    // 4. 기본적으로 원래 순서 유지
    return 0
  })
}

// 최대 동시 요청 수 제한
const MAX_CONCURRENT_REQUESTS = 5

// 아티스트 정보를 배치로 처리하는 함수
async function processArtistBatches(
  artists: { id: string; trackIndex: number }[],
  token: string
): Promise<boolean[]> {
  const results = new Array(artists.length).fill(false)

  // 배치 처리를 위해 아티스트 ID 배열을 청크(chunk)로 분할
  const chunks = []
  for (let i = 0; i < artists.length; i += MAX_CONCURRENT_REQUESTS) {
    chunks.push(artists.slice(i, i + MAX_CONCURRENT_REQUESTS))
  }

  // 각 청크를 순차적으로 처리
  for (const chunk of chunks) {
    const chunkPromises = chunk.map(async (artist) => {
      const isKorean = await isKoreanArtist(artist.id, token)
      results[artist.trackIndex] = isKorean
      return isKorean
    })

    // 현재 청크의 모든 요청을 병렬로 처리
    await Promise.all(chunkPromises)

    // API 제한을 피하기 위한 지연 (필요 시)
    if (chunks.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return results
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

    // 1차 필터링: 트랙 제목, 모든 아티스트명, 앨범명에 한국어 또는 관련 키워드가 있는지 체크
    const nonKoreanTracks = data.tracks.items.filter(
      (track) =>
        !isKoreanContent(
          track.name,
          track.artists.map((artist) => artist.name).join(' '),
          track.album.name
        )
    )

    // 2차 필터링을 위한 아티스트 ID 준비 (중복 제거)
    const artistsToCheck: { id: string; trackIndex: number }[] = []
    const processedArtistIds = new Set<string>()

    nonKoreanTracks.forEach((track, trackIndex) => {
      // 각 트랙에서 첫 번째 아티스트만 체크 (성능 최적화)
      const mainArtist = track.artists[0]
      if (mainArtist && !processedArtistIds.has(mainArtist.id)) {
        artistsToCheck.push({ id: mainArtist.id, trackIndex })
        processedArtistIds.add(mainArtist.id)
      }
    })

    // 아티스트 정보 배치 처리
    let artistResults: boolean[] = []
    try {
      // API 요청이 많지 않다면 배치 처리 실행
      if (artistsToCheck.length <= MAX_CONCURRENT_REQUESTS * 2) {
        artistResults = await processArtistBatches(artistsToCheck, token)
      } else {
        // 아티스트가 너무 많으면 아티스트 확인 단계 건너뛰기
        console.log(
          `Skipping artist check for ${artistsToCheck.length} artists (too many)`
        )
        artistResults = new Array(artistsToCheck.length).fill(false)
      }
    } catch (error) {
      console.error('Artist batch processing error:', error)
      // 오류 시 모든 아티스트를 비한국 아티스트로 간주 (필터링 단순화)
      artistResults = new Array(artistsToCheck.length).fill(false)
    }

    // 아티스트 결과를 매핑하여 다시 트랙에 연결
    const artistIsKoreanMap = new Map<string, boolean>()
    artistsToCheck.forEach((artist, index) => {
      artistIsKoreanMap.set(artist.id, artistResults[index])
    })

    // 최종 필터링 및 변환
    const filteredTracks = nonKoreanTracks
      .filter((track) => {
        // 반주 음원인지 체크
        const isInstrumental = isInstrumentalTrack(track.name, track.album.name)
        if (isInstrumental) return false

        // 리믹스나 커버곡인지 체크
        const isRemixCover = isRemixOrCover(track.name, track.album.name)
        if (isRemixCover) return false

        // 주 아티스트가 한국 아티스트인지 체크
        const mainArtistId = track.artists[0]?.id
        if (mainArtistId && artistIsKoreanMap.has(mainArtistId)) {
          return !artistIsKoreanMap.get(mainArtistId)
        }

        // 아티스트 정보를 확인할 수 없는 경우는 포함
        return true
      })
      .map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(', '),
        albumName: track.album.name,
        albumImageUrl: track.album.images[0]?.url || '',
        previewUrl: track.preview_url || undefined,
      }))

    // 중복 제거 및 검색어 관련성에 따라 정렬
    const uniqueResults = deduplicateResults(filteredTracks, query)
    return rankSearchResults(uniqueResults, query)
  } catch (error) {
    console.error('Spotify search error:', error)
    return []
  }
}
