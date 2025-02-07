// utils/dummyData.ts
import { Song } from '@/types/song'

export const DUMMY_POPULAR_SONGS: Song[] = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: '/api/placeholder/400/400',
    difficulty: 'medium',
    genre: 'Pop',
  },
  {
    id: 2,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: '/api/placeholder/400/400',
    difficulty: 'easy',
    genre: 'Pop',
  },
  {
    id: 3,
    title: 'Hello',
    artist: 'Adele',
    albumCover: '/api/placeholder/400/400',
    difficulty: 'hard',
    genre: 'Ballad',
  },
]

export const DUMMY_RECENT_LEARNINGS: Song[] = [
  {
    id: 4,
    title: 'Someone Like You',
    artist: 'Adele',
    albumCover: '/api/placeholder/400/400',
    difficulty: 'medium',
    learnedDate: '2024-02-07',
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    albumCover: '/api/placeholder/400/400',
    difficulty: 'easy',
    learnedDate: '2024-02-06',
    isFavorite: true,
  },
]
