// utils/dummyData.ts
import { Song } from '@/types/song'
import { SongLyrics } from '@/types/lyrics' // 이 부분 추가
const albumCovers = [
  '/images/albums/album1.jpg',
  '/images/albums/album2.jpg',
  '/images/albums/album3.jpg',
  '/images/albums/album4.jpg',
  '/images/albums/album5.jpg',
]

export const SAMPLE_LYRICS: SongLyrics = {
  song_id: 'betelgeuse_yuuri',
  title: 'ベテルギウス',
  artist: 'Yuuri',
  youtube_id: 'cbqvxDTLMps',
  lyrics_analysis: [
    // 여기에 제공하신 JSON 데이터 넣기
    {
      line_id: 1,
      original: '空にある何かを見つめてたら',
      translated: '하늘에 있는 무언가를 바라보고 있으면',
      words: [
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '空を見上げる (하늘을 올려다보다)',
        },
        {
          word: '見つめる (みつめる)',
          meaning: '응시하다, 바라보다',
          example: '未来を見つめる (미래를 바라보다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てたら',
          explanation: '가정형 (~하면)',
          example: '空を見つめてたら (하늘을 바라보고 있으면)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 2,
      original: 'それは星だって君がおしえてくれた',
      translated: '그건 별이라고 네가 가르쳐 주었어',
      words: [
        {
          word: '星 (ほし)',
          meaning: '별',
          example: '星が輝く (별이 빛나다)',
        },
        {
          word: '教える (おしえる)',
          meaning: '가르치다, 알려주다',
          example: '先生が日本語を教える (선생님이 일본어를 가르치다)',
        },
      ],
      grammar: [
        {
          pattern: '〜だって',
          explanation: '직접 인용 (~라고)',
          example: 'それは星だって (그건 별이라고)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 3,
      original: 'まるでそれは僕らみたいに寄り添ってる',
      translated: '마치 그건 우리처럼 서로 가까이 있어',
      words: [
        {
          word: 'まるで',
          meaning: '마치, 꼭',
          example: 'まるで夢のようだ (마치 꿈 같다)',
        },
        {
          word: '寄り添う (よりそう)',
          meaning: '다가서다, 밀착하다',
          example: '家族と寄り添う (가족과 가까이 있다)',
        },
      ],
      grammar: [
        {
          pattern: '〜みたいに',
          explanation: '비유 (~처럼)',
          example: '僕らみたいに (우리처럼)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 4,
      original: 'それを泣いたり笑ったり繋いでいく',
      translated: '그걸 울기도 하고 웃기도 하며 이어가',
      words: [
        {
          word: '泣く (なく)',
          meaning: '울다',
          example: '赤ちゃんが泣く (아기가 운다)',
        },
        {
          word: '笑う (わらう)',
          meaning: '웃다',
          example: '友達と笑う (친구와 웃다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
      ],
      grammar: [
        {
          pattern: '〜たり〜たり',
          explanation: '동작의 나열 (~하기도 하고 ~하기도 하다)',
          example: '泣いたり笑ったり (울기도 하고 웃기도 하고)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 5,
      original: '何十回 何百回 ぶつかりあって',
      translated: '수십 번, 수백 번 부딪히며',
      words: [
        {
          word: '何十回 (なんじゅっかい)',
          meaning: '수십 번',
          example: '何十回も挑戦する (수십 번 도전하다)',
        },
        {
          word: 'ぶつかる',
          meaning: '부딪히다, 충돌하다',
          example: '壁にぶつかる (벽에 부딪히다)',
        },
      ],
      grammar: [
        {
          pattern: '〜あって',
          explanation: '서로 ~하다',
          example: 'ぶつかりあって (서로 부딪히며)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 6,
      original: '遥か遠く終わらないベテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 멀리',
          example: '遥か遠くの山 (아득히 먼 산)',
        },
        {
          word: '終わらない (おわらない)',
          meaning: '끝나지 않는',
          example: '終わらない夜 (끝나지 않는 밤)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~지 않다)',
          example: '終わらない (끝나지 않는다)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 7,
      original: '誰かに繋ぐ魔法',
      translated: '누군가에게 이어주는 마법',
      words: [
        {
          word: '誰か (だれか)',
          meaning: '누군가',
          example: '誰かのために (누군가를 위해)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
      ],
      grammar: [],
      premium_only: false,
    },
    {
      line_id: 8,
      original: '僕ら肩並べ 手取り合って 進んでく',
      translated: '우리는 나란히 서서, 손을 맞잡고 나아가',
      words: [
        {
          word: '肩並べ (かたならべ)',
          meaning: '어깨를 나란히 함',
          example: '友達と肩を並べる (친구와 어깨를 나란히 하다)',
        },
        {
          word: '進む (すすむ)',
          meaning: '나아가다',
          example: '未来へ進む (미래로 나아가다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てく',
          explanation: '진행형 (~해 나가다)',
          example: '進んでく (나아가다)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 9,
      original: '辛い時だって 泣かないって 誓っただろう',
      translated: '힘들 때라도 울지 않겠다고 맹세했잖아',
      words: [
        {
          word: '辛い (つらい)',
          meaning: '괴로운, 힘든',
          example: '辛い思い出 (괴로운 추억)',
        },
        {
          word: '誓う (ちかう)',
          meaning: '맹세하다',
          example: '永遠を誓う (영원을 맹세하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜だって',
          explanation: '강조 (~라도)',
          example: '辛い時だって (힘들 때라도)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 10,
      original: '遥か遠く終わらないベテルギウス 君にも見えるだろう 祈りが',
      translated: '아득히 멀리 끝나지 않는 베텔기우스, 너도 보이겠지 기도가',
      words: [
        {
          word: '祈り (いのり)',
          meaning: '기도',
          example: '平和を祈る (평화를 기도하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜だろう',
          explanation: '추측 (~겠지)',
          example: '見えるだろう (보이겠지)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 11,
      original: '空にある何かを見つめてたら',
      translated: '하늘에 있는 무언가를 바라보고 있으면',
      words: [
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '空を見上げる (하늘을 올려다보다)',
        },
        {
          word: '見つめる (みつめる)',
          meaning: '응시하다, 바라보다',
          example: '未来を見つめる (미래를 바라보다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てたら',
          explanation: '가정형 (~하면)',
          example: '空を見つめてたら (하늘을 바라보고 있으면)',
        },
      ],
      premium_only: false,
    },
    {
      line_id: 12,
      original: 'それは星だって君がおしえてくれた',
      translated: '그건 별이라고 네가 가르쳐 주었어',
      words: [
        {
          word: '星 (ほし)',
          meaning: '별',
          example: '星が輝く (별이 빛나다)',
        },
        {
          word: '教える (おしえる)',
          meaning: '가르치다, 알려주다',
          example: '先生が日本語を教える (선생님이 일본어를 가르치다)',
        },
      ],
      grammar: [
        {
          pattern: '〜だって',
          explanation: '직접 인용 (~라고)',
          example: 'それは星だって (그건 별이라고)',
        },
      ],
      premium_only: false,
    },
  ],
}

// 노래 ID로 가사 데이터 가져오는 유틸리티 함수
export const getLyricsBySongId = (songId: string): SongLyrics | undefined => {
  // 실제로는 여러 곡의 데이터가 있을 것이므로, songId로 찾는 로직 구현
  if (songId === 'betelgeuse_yuuri') {
    return SAMPLE_LYRICS
  }
  return undefined
}

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
