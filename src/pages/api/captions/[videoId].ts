// pages/api/captions/[videoId].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSubtitles } from 'youtube-caption-extractor'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS와 캐시 관련 헤더 설정
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { videoId } = req.query

    if (!videoId || Array.isArray(videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID',
      })
    }

    console.log('Starting subtitle fetch for video:', videoId)

    const options = {
      videoID: videoId,
      lang: 'ja',
      format: 'json',
      convertNumbers: false,
      translate: false,
      retries: 3,
    }

    const subtitles = await getSubtitles(options).catch(async (error) => {
      console.error('Initial fetch with ja failed:', error)

      // 자동생성된 일본어 자막 시도
      return getSubtitles({
        ...options,
        lang: 'ja-generated',
      }).catch(async (error2) => {
        console.error('Generated ja caption fetch failed:', error2)

        // 영어 자막 시도
        return getSubtitles({
          ...options,
          lang: 'en',
        }).catch(async (error3) => {
          console.error('All caption fetch attempts failed:', error3)
          return null
        })
      })
    })

    if (!subtitles || subtitles.length === 0) {
      console.warn('No subtitles found for video:', videoId)
      return res.status(404).json({
        success: false,
        message: 'No captions found for this video',
        videoId,
      })
    }

    console.log('Subtitles fetched successfully:', {
      videoId,
      length: subtitles.length,
      sample: subtitles[0],
      lang: options.lang,
    })

    return res.status(200).json({
      success: true,
      data: subtitles,
      length: subtitles.length,
      lang: options.lang,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Final error fetching captions:', {
      error,
      videoId: req.query.videoId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    })

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch captions',
      error: error instanceof Error ? error.message : 'Unknown error',
      videoId: req.query.videoId,
      timestamp: new Date().toISOString(),
    })
  }
}
