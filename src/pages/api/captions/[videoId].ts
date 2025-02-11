// pages/api/captions/[videoId].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSubtitles } from 'youtube-caption-extractor'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { videoId } = req.query

  if (!videoId || Array.isArray(videoId)) {
    return res.status(400).json({ message: 'Invalid video ID' })
  }
  console.log('Fetching subtitles for video:', videoId) // 디버깅 로그
  try {
    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: 'ja', // 일본어 자막
    })
    console.log('Subtitles fetched:', subtitles) // 디버깅 로그
    res.status(200).json(subtitles)
  } catch (error) {
    console.error('Error fetching captions:', error)
    res.status(500).json({
      message: 'Failed to fetch captions',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
