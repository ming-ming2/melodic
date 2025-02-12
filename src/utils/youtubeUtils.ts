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

export interface TimestampData {
  start: number
  end: number
  confidence: number
}

// YouTube 자막 가져오기
// utils/youtubeUtils.ts
const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:4000'

export async function getVideoCaption(videoId: string): Promise<Caption[]> {
  try {
    const response = await fetch(`${PROXY_URL}/api/captions/${videoId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // 🚀 Ngrok 경고 페이지 우회
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch captions')
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch captions')
    }

    return result.data
  } catch (error) {
    console.error('Error in getVideoCaption:', error)
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
  console.log(
    'Matching lyrics:',
    lyrics.length,
    'with captions:',
    captions.length
  ) // 디버깅 로그
  const timedLyrics: TimedLyric[] = []
  let captionIndex = 0
  let lastEndTime = 0

  lyrics.forEach((lyric) => {
    let combinedText = ''
    let startTime = 0
    let endTime = 0
    const initialCaptionIndex = captionIndex
    let matched = false

    while (captionIndex < captions.length) {
      const currentCaption = captions[captionIndex]

      if (combinedText === '') {
        startTime = Number(currentCaption.start)
      }

      combinedText += combinedText
        ? ' ' + currentCaption.text
        : currentCaption.text
      endTime = Number(currentCaption.start) + Number(currentCaption.dur)

      const similarity = calculateSimilarity(lyric.original, combinedText)

      if (similarity >= 0.9) {
        timedLyrics.push({
          ...lyric,
          timestamp: {
            start: startTime,
            end: endTime,
          },
          similarity: similarity,
        })

        captionIndex++
        matched = true
        break
      }

      captionIndex++

      if (captionIndex - initialCaptionIndex > 5) {
        break
      }
    }

    if (!matched) {
      timedLyrics.push({
        ...lyric,
        timestamp: {
          start: lastEndTime,
          end: lastEndTime + 3,
        },
        similarity: 0,
      })
      lastEndTime += 3
    } else {
      lastEndTime = endTime
    }
  })

  return timedLyrics
}
