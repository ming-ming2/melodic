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
    genre: 'Pop',
  },
  {
    id: 2,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[1],
    genre: 'Pop',
  },
  {
    id: 3,
    title: 'Hello',
    artist: 'Adele',
    albumCover: albumCovers[2],
    genre: 'Ballad',
  },
  {
    id: 4,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: albumCovers[3],
    genre: 'Ballad',
  },
  {
    id: 5,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[4],
    genre: 'Pop',
  },
]

export const DUMMY_RECENT_LEARNINGS: Song[] = [
  {
    id: 4,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: albumCovers[3],
    learnedDate: '2024-02-07',
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[4],
    learnedDate: '2024-02-06',
    isFavorite: true,
  },
]

// utils/dummyData.ts에 추가
export const DUMMY_FAVORITE_SONGS: Song[] = [
  {
    id: 6,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: albumCovers[3],
    learnedDate: '2024-02-07',
    isFavorite: true,
    genre: 'Ballad',
  },
  {
    id: 7,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: albumCovers[4],
    learnedDate: '2024-02-06',
    isFavorite: true,
    genre: 'Pop',
  },
  {
    id: 8,
    title: 'Skyfall',
    artist: 'Adele',
    albumCover: albumCovers[2],
    learnedDate: '2024-02-05',
    isFavorite: true,
    genre: 'Soundtrack',
  },
  {
    id: 9,
    title: 'Rolling in the Deep',
    artist: 'Adele',
    albumCover: albumCovers[1],
    learnedDate: '2024-02-04',
    isFavorite: true,
    genre: 'Pop/Rock',
  },
]
// 랜덤하게 앨범 커버 선택하는 유틸리티 함수
export const getRandomAlbumCover = () => {
  return albumCovers[Math.floor(Math.random() * albumCovers.length)]
}
