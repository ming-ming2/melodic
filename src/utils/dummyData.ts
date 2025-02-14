// utils/dummyData.ts
import { Song } from '@/types/song'
const albumCovers = [
  '/images/albums/album1.jpg',
  '/images/albums/album2.jpg',
  '/images/albums/album3.jpg',
  '/images/albums/album4.jpg',
  '/images/albums/album5.jpg',
]

// // 노래 ID로 가사 데이터 가져오는 유틸리티 함수
// export const getLyricsBySongId = (songId: string): SongLyrics | undefined => {
//   // 실제로는 여러 곡의 데이터가 있을 것이므로, songId로 찾는 로직 구현
//   // if (songId === 'betelgeuse_yuuri') {
//   //   return SAMPLE_LYRICS
//   // }
//   return undefined
// }

export const DUMMY_POPULAR_SONGS: Song[] = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: albumCovers[0],
    difficulty: 'medium',
    genre: 'Pop',
  },
  {
    id: 2,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[1],
    difficulty: 'easy',
    genre: 'Pop',
  },
  {
    id: 3,
    title: 'Hello',
    artist: 'Adele',
    albumCover: albumCovers[2],
    difficulty: 'hard',
    genre: 'Ballad',
  },
  {
    id: 4,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: albumCovers[3],
    difficulty: 'medium',
    genre: 'Ballad',
  },
  {
    id: 5,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[4],
    difficulty: 'easy',
    genre: 'Pop',
  },
]

export const DUMMY_RECENT_LEARNINGS: Song[] = [
  {
    id: 4,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: albumCovers[3],
    difficulty: 'medium',
    learnedDate: '2024-02-07',
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[4],
    difficulty: 'easy',
    learnedDate: '2024-02-06',
    isFavorite: true,
  },
]

// 랜덤하게 앨범 커버 선택하는 유틸리티 함수
export const getRandomAlbumCover = () => {
  return albumCovers[Math.floor(Math.random() * albumCovers.length)]
}
