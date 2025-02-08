// utils/youtubeUtils.ts
export interface Caption {
  start: number
  end: number
  text: string
  language: string
}

export interface TimestampData {
  start: number
  end: number
  confidence: number // 매칭 신뢰도
}

// 문자열 유사도를 계산하는 함수 (Levenshtein Distance 기반)
function calculateSimilarity(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
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

  const maxLength = Math.max(str1.length, str2.length)
  return 1 - matrix[str1.length][str2.length] / maxLength
}

export async function getVideoCaption(videoId: string): Promise<Caption[]> {
  try {
    // YouTube Data API v3를 사용하여 자막 트랙 목록 가져오기
    const listResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?` +
        `part=snippet&videoId=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )

    if (!listResponse.ok) {
      throw new Error('Failed to fetch caption list')
    }

    const listData = await listResponse.json()

    // 일본어 자막 찾기 (자동 생성된 자막도 포함)
    const japaneseCaption = listData.items.find(
      (item: any) =>
        item.snippet.language === 'ja' || item.snippet.language === 'ja-JP'
    )

    if (!japaneseCaption) {
      throw new Error('No Japanese captions found')
    }

    // 자막 내용 가져오기
    const captionResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${japaneseCaption.id}?` +
        `key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!captionResponse.ok) {
      throw new Error('Failed to fetch caption content')
    }

    const captionData = await captionResponse.json()
    return captionData.items.map((item: any) => ({
      start: item.start,
      end: item.end,
      text: item.text,
      language: japaneseCaption.snippet.language,
    }))
  } catch (error) {
    console.error('Error fetching captions:', error)
    throw error
  }
}

export function matchLyricsWithCaptions(
  lyrics: string[],
  captions: Caption[]
): TimestampData[] {
  const timestamps: TimestampData[] = []
  const usedCaptions = new Set<number>() // 이미 매칭된 자막 추적

  lyrics.forEach((lyric) => {
    let bestMatch = {
      index: -1,
      similarity: 0,
      start: 0,
      end: 0,
    }

    // 각 가사와 가장 잘 매칭되는 자막 찾기
    captions.forEach((caption, index) => {
      if (usedCaptions.has(index)) return // 이미 매칭된 자막은 건너뛰기

      const similarity = calculateSimilarity(
        lyric.toLowerCase().trim(),
        caption.text.toLowerCase().trim()
      )

      if (similarity > bestMatch.similarity && similarity > 0.6) {
        // 임계값 설정
        bestMatch = {
          index,
          similarity,
          start: caption.start,
          end: caption.end,
        }
      }
    })

    if (bestMatch.index !== -1) {
      usedCaptions.add(bestMatch.index)
      timestamps.push({
        start: bestMatch.start,
        end: bestMatch.end,
        confidence: bestMatch.similarity,
      })
    } else {
      // 매칭되는 자막이 없는 경우
      const lastTimestamp = timestamps[timestamps.length - 1]
      timestamps.push({
        start: lastTimestamp ? lastTimestamp.end : 0,
        end: lastTimestamp ? lastTimestamp.end + 3 : 3,
        confidence: 0,
      })
    }
  })

  return timestamps
}

// 자막이 없는 경우를 위한 폴백 함수
export function generateDefaultTimestamps(
  lyricsCount: number
): TimestampData[] {
  const timestamps: TimestampData[] = []
  const defaultDuration = 3 // 각 가사당 기본 3초

  for (let i = 0; i < lyricsCount; i++) {
    timestamps.push({
      start: i * defaultDuration,
      end: (i + 1) * defaultDuration,
      confidence: 0,
    })
  }

  return timestamps
}
