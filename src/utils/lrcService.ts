// utils/lrcService.ts
interface LrcResponse {
  syncedLyrics?: string
  plainLyrics?: string
  translations?: Record<string, string>
  transliterations?: Record<string, string>
}

export async function fetchLyricsFromLrclib(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    console.log(`LRClib에서 가사 검색: ${artist} - ${title}`)

    // 모든 언어에 대해 원문 가사를 요청하도록 &original=1 파라미터 추가
    const apiUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(
      artist
    )}&track_name=${encodeURIComponent(title)}&original=1`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.warn(`LRC API 응답 실패: ${response.status}`)
      return null
    }

    const data = (await response.json()) as LrcResponse

    // API가 빈 객체를 반환하면 결과 없음
    if (!data || Object.keys(data).length === 0) {
      console.warn('LRC API: 노래를 찾을 수 없음')
      return null
    }

    console.log('LRClib API 원본 응답:', data)

    // 1. 원문 가사 우선: plainLyrics 또는 syncedLyrics가 있으면 원문으로 판단
    if (data.plainLyrics) {
      console.log('plainLyrics 사용')
      return data.plainLyrics
    }
    if (data.syncedLyrics) {
      const originalLyrics = extractLyricsFromLRC(data.syncedLyrics)
      console.log('syncedLyrics에서 추출된 원문 가사:', originalLyrics)
      return originalLyrics
    }

    // 2. plain/synced 가사가 없으면 translations에서
    if (data.translations && Object.keys(data.translations).length > 0) {
      // 원문 문자(비로마자)가 포함되어 있는지 확인 후 사용
      for (const lang in data.translations) {
        const text = data.translations[lang]
        if (/[^A-Za-z0-9\s.,!?'"()\-]/.test(text)) {
          console.log(`${lang} 번역 사용 (원문 문자 포함)`)
          return text
        }
      }
      // 조건에 맞는 원문 문자가 없으면 첫 번째 번역 사용
      const firstTransLang = Object.keys(data.translations)[0]
      console.log(`첫 번째 번역 사용 (${firstTransLang})`)
      return data.translations[firstTransLang]
    }

    // 3. translations도 없으면 transliterations 사용 (보통 영어 발음)
    if (
      data.transliterations &&
      Object.keys(data.transliterations).length > 0
    ) {
      console.warn('원문 가사가 없어 transliterations 사용 (보통 영어 발음)')
      const firstTranslitLang = Object.keys(data.transliterations)[0]
      return data.transliterations[firstTranslitLang]
    }

    console.warn('LRC API: 가사 없음')
    return null
  } catch (error) {
    console.error('LRC API 호출 에러:', error)
    return null
  }
}

/**
 * LRC 포맷 문자열에서 타임스탬프를 제거하고 원문 가사만 추출하는 함수
 */
function extractLyricsFromLRC(lrcContent: string): string {
  const lines = lrcContent.split('\n')
  const lyrics: string[] = []

  // 타임스탬프 제거 정규식 (예: [00:12.00])
  const timeTagRegex = /\[\d{2}:\d{2}\.\d{2,3}\]/g

  lines.forEach((line) => {
    // 메타데이터 라인은 건너뛰기 (예: [ar:아티스트])
    if (line.match(/\[\w+:.+\]/)) return

    // 타임스탬프 제거 후 가사만 추출
    const lyricText = line.replace(timeTagRegex, '').trim()
    if (lyricText) {
      lyrics.push(lyricText)
    }
  })

  return lyrics.join('\n')
}
