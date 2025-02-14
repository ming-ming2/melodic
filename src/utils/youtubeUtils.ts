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

const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:4000'

// 언어 감지 함수 추가
export function detectLanguage(text: string): string {
  // 일본어 (히라가나, 카타카나, 한자) 감지
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return 'JA'
  // 한국어 감지
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text)) return 'KO'
  // 기본값은 영어
  return 'EN'
}

export async function getVideoCaption(videoId: string): Promise<Caption[]> {
  try {
    const response = await fetch(`${PROXY_URL}/api/captions/${videoId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
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

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\u3000-\u303f\uff00-\uff9f]/g, '')
    .trim()
}

function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeText(str1)
  const normalized2 = normalizeText(str2)
  const maxLength = Math.max(normalized1.length, normalized2.length)
  const distance = calculateLevenshteinDistance(normalized1, normalized2)
  return 1 - distance / maxLength
}

export function matchLyricsWithCaptions(
  lyrics: LyricLine[],
  captions: Caption[]
): TimedLyric[] {
  console.log(
    'Matching lyrics:',
    lyrics.length,
    'with captions:',
    captions.length
  )
  const timedLyrics: TimedLyric[] = []
  let captionIndex = 0
  let lastEndTime = 0

  // 첫 번째 캡션으로 언어 감지

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
