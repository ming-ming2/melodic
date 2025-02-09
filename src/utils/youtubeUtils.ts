// utils/youtubeUtils.ts
import { LyricLine } from '@/types/lyrics'

interface Caption {
  start: string
  dur: string
  text: string
}

interface TimedLyric extends LyricLine {
  timestamp: {
    start: number
    end: number
  }
  similarity: number
}

// YouTube 자막 가져오기
export async function getVideoCaption(videoId: string): Promise<Caption[]> {
  try {
    const response = await fetch(`/api/captions/${videoId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch captions')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching captions:', error)
    throw error
  }
}

// Levenshtein Distance 계산 함수
function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[a.length][b.length]
}

// 텍스트 정규화 함수
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\u3000-\u303f\uff00-\uff9f]/g, '')
    .trim()
}

// 문자열 유사도 계산
function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeText(str1)
  const normalized2 = normalizeText(str2)
  const maxLength = Math.max(normalized1.length, normalized2.length)
  const distance = calculateLevenshteinDistance(normalized1, normalized2)
  return 1 - distance / maxLength
}

// 가사와 자막 매칭
export function matchLyricsWithCaptions(
  lyrics: LyricLine[],
  captions: Caption[]
): TimedLyric[] {
  const timedLyrics: TimedLyric[] = []
  let lastEndTime = 0
  let lastMatchedLyricIndex = -1

  lyrics.forEach((lyric, lyricIndex) => {
    // 이미 이전에 매칭된 가사가 없는 경우 건너뛰지 않도록
    if (lastMatchedLyricIndex !== -1 && lyricIndex <= lastMatchedLyricIndex) {
      return
    }

    let bestMatch = {
      caption: null as Caption | null,
      similarity: 0,
      start: 0,
      end: 0,
    }

    // 이전 매칭된 시간 이후의 자막들만 검사
    const relevantCaptions = captions.filter(
      (cap) => Number(cap.start) >= lastEndTime
    )

    relevantCaptions.forEach((caption) => {
      const similarity = calculateSimilarity(lyric.original, caption.text)

      // 개선된 매칭 로직: 부분 매칭도 고려
      if (similarity >= 0.5 && similarity > bestMatch.similarity) {
        // 현재 가사와 다음 가사의 부분 매칭 확인
        const nextLyric = lyrics[lyricIndex + 1]
        let nextLyricSimilarity = 0
        if (nextLyric) {
          nextLyricSimilarity = calculateSimilarity(
            nextLyric.original,
            caption.text
          )
        }

        // 현재 가사가 더 잘 매칭되는 경우에만 선택
        if (similarity > nextLyricSimilarity) {
          bestMatch = {
            caption,
            similarity,
            start: Number(caption.start),
            end: Number(caption.start) + Number(caption.dur),
          }
        }
      }
    })

    if (bestMatch.caption) {
      const startTime = Number(bestMatch.caption.start)
      const duration = Number(bestMatch.caption.dur)
      const endTime = startTime + duration

      lastEndTime = endTime
      lastMatchedLyricIndex = lyricIndex
      timedLyrics.push({
        ...lyric,
        timestamp: {
          start: startTime,
          end: endTime,
        },
        similarity: bestMatch.similarity,
      })
    } else {
      // 매칭되는 자막이 없는 경우 이전 타임스탬프 유지
      const lastTimedLyric = timedLyrics[timedLyrics.length - 1]
      timedLyrics.push({
        ...lyric,
        timestamp: lastTimedLyric
          ? lastTimedLyric.timestamp
          : {
              start: lastEndTime,
              end: lastEndTime + 3, // 기본 3초 유지
            },
        similarity: 0,
      })
      lastEndTime += 3 // 기본 지속 시간 추가
    }
  })

  return timedLyrics
}
