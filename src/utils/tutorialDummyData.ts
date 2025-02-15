// utils/tutorialDummyData.ts
import type { SongLyrics } from '@/types/lyrics'

export const TUTORIAL_VIDEO_ID = '' // TODO: 실제 videoId 입력

export const TUTORIAL_SONG_DATA: SongLyrics = {
  song_id: 'betelgeuse_yuuri',
  title: 'ベテルギウス',
  artist: 'Yuuri',
  language: 'JP-KR',
  youtube_id: 'cbqvxDTLMps',
  lyrics_analysis: [
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
          word: 'ある',
          meaning: '있다, 존재하다 (무생물)',
          example: '机の上に本がある (책상이 위에 책이 있다)',
        },
        {
          word: '何か (なにか)',
          meaning: '무언가',
          example: '何か食べたい (뭔가 먹고 싶다)',
        },
        {
          word: '見つめる (みつめる)',
          meaning: '응시하다, 바라보다',
          example: '未来を見つめる (미래를 바라보다)',
        },
      ],
      grammar: [
        {
          pattern: '〜にある',
          explanation: '어떤 장소에 존재함을 나타냄',
          example: '空にある星 (하늘에 있는 별)',
        },
        {
          pattern: '〜を見つめる',
          explanation: '직접 목적어를 응시하는 동작',
          example: '何かを見つめる (무언가를 바라보다)',
        },
        {
          pattern: '〜てたら',
          explanation: '가정형(~하면)',
          example: '空を見つめてたら (하늘을 바라보고 있으면)',
        },
      ],
      expressions: [
        {
          expression: '何かを見つめる',
          meaning: '무언가를 응시하다',
          example:
            '彼は遠くの何かを見つめていた (그는 멀리 있는 무언가를 응시하고 있었다)',
        },
      ],
    },
    {
      line_id: 2,
      original: 'それは星だって君がおしえてくれた',
      translated: '그건 별이라고 네가 가르쳐 줬어.',
      words: [
        {
          word: 'それ',
          meaning: '그것',
          example: 'それは何？ (그건 뭐야?)',
        },
        {
          word: '星 (ほし)',
          meaning: '별',
          example: '夜空の星 (밤하늘의 별)',
        },
        {
          word: '教える (おしえる)',
          meaning: '가르치다, 알려주다',
          example: '先生が数学を教える (선생님이 수학을 가르친다)',
        },
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君の名前は？ (너의 이름은 뭐야?)',
        },
      ],
      grammar: [
        {
          pattern: '〜だって',
          explanation: '직접 인용 (~라고)',
          example: '星だって (별이라고)',
        },
        {
          pattern: '〜てくれる',
          explanation: '상대방이 나를 위해 어떤 행동을 해주는 표현',
          example: '教えてくれた (가르쳐 줬다)',
        },
      ],
      expressions: [
        {
          expression: '星だって',
          meaning: '별이라고 (꿈, 희망의 상징)',
          example: '君は星だって信じてる (너는 별이라고 믿고 있어)',
        },
        {
          expression: '教えてくれる',
          meaning: '가르쳐 주다, 알려주다 (배려의 의미)',
          example: '先生が優しく教えてくれる (선생님이 친절하게 가르쳐 준다)',
        },
      ],
    },
    {
      line_id: 3,
      original: 'まるでそれは僕らみたいに 寄り添ってる',
      translated: '마치 그건 우리처럼 가까이 있어.',
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
        {
          word: '僕ら (ぼくら)',
          meaning: '우리',
          example: '僕らの未来 (우리의 미래)',
        },
      ],
      grammar: [
        {
          pattern: '〜みたいに',
          explanation: '비유 (~처럼)',
          example: '僕らみたいに (우리처럼)',
        },
        {
          pattern: '〜ている',
          explanation: '진행형 (~하고 있다)',
          example: '寄り添っている (가까이 있다)',
        },
      ],
      expressions: [
        {
          expression: '寄り添う',
          meaning: '서로 가까이 지내다',
          example: '恋人同士が寄り添って歩く (연인들이 서로 가까이 걸어간다)',
        },
      ],
    },
    {
      line_id: 4,
      original: 'それを泣いたり笑ったり繋いでいく',
      translated: '그걸 울거나 웃으며 이어가.',
      words: [
        {
          word: '泣く (なく)',
          meaning: '울다',
          example: '子供が泣く (아이가 운다)',
        },
        {
          word: '笑う (わらう)',
          meaning: '웃다',
          example: '冗談を聞いて笑う (농담을 듣고 웃다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
      ],
      grammar: [
        {
          pattern: '〜たり〜たりする',
          explanation: '서로 다른 동작을 나열할 때 사용',
          example: '泣いたり笑ったりする (울거나 웃거나 한다)',
        },
        {
          pattern: '〜ていく',
          explanation: '앞으로 진행되는 동작이나 변화',
          example: '繋いでいく (이어가다)',
        },
      ],
      expressions: [
        {
          expression: '泣いたり笑ったり',
          meaning: '울거나 웃거나 (감정의 변화)',
          example:
            '人生は泣いたり笑ったりするものだ (인생은 울기도 하고 웃기도 하는 것이다)',
        },
      ],
    },
    {
      line_id: 5,
      original: '何十回 何百回 ぶつかりあって',
      translated: '수십 번, 수백 번 부딪히고',
      words: [
        {
          word: '何十回 (なんじゅっかい)',
          meaning: '수십 번',
          example: '何十回も挑戦する (수십 번이나 도전하다)',
        },
        {
          word: '何百回 (なんびゃっかい)',
          meaning: '수백 번',
          example: '何百回も繰り返す (수백 번이나 반복하다)',
        },
        {
          word: 'ぶつかる',
          meaning: '부딪히다, 충돌하다',
          example: '壁にぶつかる (벽에 부딪히다)',
        },
      ],
      grammar: [
        {
          pattern: '何十〜 / 何百〜',
          explanation: '수십, 수백을 나타내는 표현',
          example: '何十回も (수십 번이나)',
        },
        {
          pattern: '〜あって',
          explanation: '서로 영향을 주며 동작이 발생함을 나타냄',
          example: 'ぶつかりあって (서로 부딪히고)',
        },
      ],
      expressions: [
        {
          expression: 'ぶつかりあう',
          meaning: '서로 충돌하다, 대립하다',
          example: '意見がぶつかりあう (의견이 충돌하다)',
        },
      ],
    },
    {
      line_id: 6,
      original: '何十年 何百年 昔の光が',
      translated: '수십 년, 수백 년 전의 빛이',
      words: [
        {
          word: '何十年 (なんじゅうねん)',
          meaning: '수십 년',
          example: '何十年も前の話 (수십 년 전의 이야기)',
        },
        {
          word: '何百年 (なんびゃくねん)',
          meaning: '수백 년',
          example: '何百年も続く伝統 (수백 년 이어진 전통)',
        },
        {
          word: '昔 (むかし)',
          meaning: '옛날, 과거',
          example: '昔の友達 (옛 친구)',
        },
        {
          word: '光 (ひかり)',
          meaning: '빛',
          example: '太陽の光 (태양빛)',
        },
      ],
      grammar: [
        {
          pattern: '何十〜 / 何百〜',
          explanation: '수십, 수백을 나타내는 표현',
          example: '何十年も (수십 년이나)',
        },
      ],
      expressions: [
        {
          expression: '昔の光',
          meaning: '옛날의 빛, 과거의 흔적',
          example: '何百年昔の光が届く (수백 년 전의 빛이 닿는다)',
        },
      ],
    },
    {
      line_id: 7,
      original: '星自身も忘れたころに',
      translated: '별 자신도 잊어버린 무렵에',
      words: [
        {
          word: '星 (ほし)',
          meaning: '별',
          example: '夜空の星 (밤하늘의 별)',
        },
        {
          word: '自身 (じしん)',
          meaning: '자신',
          example: '彼自身の問題 (그 자신만의 문제)',
        },
        {
          word: '忘れる (わすれる)',
          meaning: '잊다',
          example: '約束を忘れる (약속을 잊다)',
        },
        {
          word: 'ころ',
          meaning: '무렵, 때',
          example: '子供のころ (어릴 때)',
        },
      ],
      grammar: [
        {
          pattern: '〜も',
          explanation: '‘~도’의 의미를 가지며 추가적인 내용을 강조함',
          example: '星自身も (별 자신도)',
        },
        {
          pattern: '〜たころ',
          explanation: '과거 시점의 무렵을 나타냄',
          example: '忘れたころ (잊어버린 무렵)',
        },
      ],
      expressions: [
        {
          expression: '忘れたころに',
          meaning: '완전히 잊어버린 무렵에',
          example:
            '突然の連絡が忘れたころに来る (완전히 잊어버린 무렵에 갑자기 연락이 온다)',
        },
      ],
    },
    {
      line_id: 8,
      original: '僕らに届いてる',
      translated: '우리에게 닿고 있어',
      words: [
        {
          word: '僕ら (ぼくら)',
          meaning: '우리',
          example: '僕らの未来 (우리의 미래)',
        },
        {
          word: '届く (とどく)',
          meaning: '닿다, 도착하다',
          example: '手紙が届く (편지가 도착하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜に届く',
          explanation: '어떤 대상에게 도달함을 나타냄',
          example: '僕らに届く (우리에게 닿다)',
        },
        {
          pattern: '〜ている',
          explanation: '현재 진행형을 나타냄',
          example: '届いてる (닿고 있다)',
        },
      ],
      expressions: [
        {
          expression: '届いてる',
          meaning: '전달되다, 도착하다',
          example: '遠い星の光が今届いてる (먼 별의 빛이 지금 닿고 있다)',
        },
      ],
    },
    {
      line_id: 9,
      original: '僕ら見つけあって 手繰りあって 同じ空',
      translated: '우린 서로 찾아 헤매며 같은 하늘 아래 있어',
      words: [
        {
          word: '見つける (みつける)',
          meaning: '찾다, 발견하다',
          example: '新しい道を見つける (새로운 길을 찾다)',
        },
        {
          word: '手繰る (たぐる)',
          meaning: '손으로 당기다, 더듬다',
          example: '糸を手繰る (실을 손으로 감다)',
        },
        {
          word: '同じ (おなじ)',
          meaning: '같은',
          example: '同じ時間 (같은 시간)',
        },
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '青い空 (푸른 하늘)',
        },
      ],
      grammar: [
        {
          pattern: '〜あって',
          explanation: '서로 상호 작용함을 나타냄',
          example: '見つけあって (서로 찾아서)',
        },
      ],
      expressions: [
        {
          expression: '同じ空',
          meaning: '같은 하늘 아래',
          example:
            'どこにいても僕らは同じ空の下にいる (어디에 있어도 우리는 같은 하늘 아래 있어)',
        },
      ],
    },
    {
      line_id: 10,
      original: '輝くのだって 二人だって 約束した',
      translated: '빛나는 것도, 둘이 함께라는 것도 약속했어',
      words: [
        {
          word: '輝く (かがやく)',
          meaning: '빛나다',
          example: '星が輝く (별이 빛나다)',
        },
        {
          word: '二人 (ふたり)',
          meaning: '두 사람',
          example: '二人で歩く (두 사람이 걷다)',
        },
        {
          word: '約束 (やくそく)',
          meaning: '약속',
          example: '友達と約束する (친구와 약속하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜のだって',
          explanation: '강조형 (~인 것도)',
          example: '輝くのだって (빛나는 것도)',
        },
        {
          pattern: '〜だって',
          explanation: '강조 및 열거 (~도 역시)',
          example: '二人だって (둘도 역시)',
        },
      ],
      expressions: [
        {
          expression: '約束する',
          meaning: '약속하다',
          example: '未来を約束する (미래를 약속하다)',
        },
      ],
    },
    {
      line_id: 11,
      original: '遥か遠く終わらないべテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 훨씬',
          example: '遥か昔の話 (아득히 옛날 이야기)',
        },
        {
          word: '遠く (とおく)',
          meaning: '멀리',
          example: '遠くへ行く (멀리 가다)',
        },
        {
          word: '終わる (おわる)',
          meaning: '끝나다',
          example: '試合が終わる (경기가 끝나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~하지 않다)',
          example: '終わらない (끝나지 않다)',
        },
      ],
      expressions: [
        {
          expression: '遥か遠く',
          meaning: '아득히 먼 곳',
          example: '遥か遠くに星が見える (아득히 먼 곳에 별이 보인다)',
        },
      ],
    },
    {
      line_id: 12,
      original: '誰かに繋ぐ魔法',
      translated: '누군가에게 이어주는 마법',
      words: [
        {
          word: '誰か (だれか)',
          meaning: '누군가',
          example: '誰かが来た (누군가가 왔다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
        {
          word: '魔法 (まほう)',
          meaning: '마법',
          example: '魔法のような出来事 (마법 같은 일)',
        },
      ],
      grammar: [
        {
          pattern: '〜に繋ぐ',
          explanation: '어떤 대상에게 연결하는 행위를 나타냄',
          example: '誰かに繋ぐ (누군가에게 연결하다)',
        },
      ],
      expressions: [
        {
          expression: '魔法のように',
          meaning: '마법처럼',
          example: '彼の言葉は魔法のようだった (그의 말은 마법 같았다)',
        },
      ],
    },
    {
      line_id: 13,
      original: '僕ら 肩並べ 手取り合って 進んでく',
      translated: '우리는 어깨를 나란히 하고 손을 맞잡고 나아가',
      words: [
        {
          word: '肩 (かた)',
          meaning: '어깨',
          example: '肩を並べる (어깨를 나란히 하다)',
        },
        {
          word: '並べる (ならべる)',
          meaning: '늘어놓다, 나란히 하다',
          example: '本を並べる (책을 정렬하다)',
        },
        {
          word: '手 (て)',
          meaning: '손',
          example: '手を繋ぐ (손을 잡다)',
        },
        {
          word: '進む (すすむ)',
          meaning: '나아가다, 진행되다',
          example: '前に進む (앞으로 나아가다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てく',
          explanation: '구어체 표현으로 ‘~해 나가다’의 의미',
          example: '進んでく (나아가다)',
        },
      ],
      expressions: [
        {
          expression: '肩を並べる',
          meaning: '어깨를 나란히 하다 (동등한 입장에서 함께하다)',
          example: '彼と肩を並べて戦う (그와 어깨를 나란히 하고 싸우다)',
        },
        {
          expression: '手を取り合う',
          meaning: '서로 손을 잡다, 협력하다',
          example:
            '困難を乗り越えるために手を取り合う (어려움을 극복하기 위해 손을 맞잡다)',
        },
      ],
    },
    {
      line_id: 14,
      original: '辛い時だって 泣かないって 誓っただろう',
      translated: '힘든 때도 울지 않겠다고 맹세했잖아',
      words: [
        {
          word: '辛い (つらい)',
          meaning: '괴롭다, 힘들다',
          example: '辛い経験 (괴로운 경험)',
        },
        {
          word: '時 (とき)',
          meaning: '때, 시기',
          example: '雨の時は傘をさす (비가 올 때는 우산을 쓴다)',
        },
        {
          word: '泣く (なく)',
          meaning: '울다',
          example: '子供が泣く (아이가 운다)',
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
          explanation: '강조 및 열거 (~도 역시)',
          example: '辛い時だって (힘든 때도)',
        },
        {
          pattern: '〜って',
          explanation: '구어체로 ‘~라고’의 의미',
          example: '泣かないって (울지 않겠다고)',
        },
        {
          pattern: '〜だろう',
          explanation: '추측이나 확인을 요구하는 표현 (~겠지, ~잖아)',
          example: '誓っただろう (맹세했잖아)',
        },
      ],
      expressions: [
        {
          expression: '誓っただろう',
          meaning: '맹세했잖아, 약속했잖아',
          example: '一緒にいると誓っただろう (함께 있겠다고 맹세했잖아)',
        },
      ],
    },
    {
      line_id: 15,
      original: '遥か遠く終わらないべテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 훨씬',
          example: '遥か昔の話 (아득히 옛날 이야기)',
        },
        {
          word: '遠く (とおく)',
          meaning: '멀리',
          example: '遠くへ行く (멀리 가다)',
        },
        {
          word: '終わる (おわる)',
          meaning: '끝나다',
          example: '試合が終わる (경기가 끝나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~하지 않다)',
          example: '終わらない (끝나지 않다)',
        },
      ],
      expressions: [
        {
          expression: '遥か遠く',
          meaning: '아득히 먼 곳',
          example: '遥か遠くに星が見える (아득히 먼 곳에 별이 보인다)',
        },
      ],
    },
    {
      line_id: 16,
      original: '君にも見えるだろう 祈りが',
      translated: '너도 보일 거야, 기도가',
      words: [
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君の名前は？ (너의 이름은 뭐야?)',
        },
        {
          word: '見る (みる)',
          meaning: '보다',
          example: '映画を見る (영화를 보다)',
        },
        {
          word: '祈り (いのり)',
          meaning: '기도',
          example: '平和を祈る (평화를 기원하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜にも',
          explanation: '‘~도 역시’의 의미를 강조',
          example: '君にも (너도 역시)',
        },
        {
          pattern: '〜だろう',
          explanation: '추측을 나타냄 (~일 거야)',
          example: '見えるだろう (보일 거야)',
        },
      ],
      expressions: [
        {
          expression: '祈りが見える',
          meaning: '기도가 보이다 (희망을 의미)',
          example:
            '夜空を見上げれば祈りが見える (밤하늘을 올려다보면 기도가 보인다)',
        },
      ],
    },
    {
      line_id: 17,
      original: '記憶を辿るたび 蘇るよ',
      translated: '기억을 더듬을 때마다 되살아나',
      words: [
        {
          word: '記憶 (きおく)',
          meaning: '기억',
          example: '記憶をなくす (기억을 잃다)',
        },
        {
          word: '辿る (たどる)',
          meaning: '더듬다, 따라가다',
          example: '歴史を辿る (역사를 더듬다)',
        },
        {
          word: '蘇る (よみがえる)',
          meaning: '되살아나다',
          example: '思い出が蘇る (추억이 되살아나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜たび',
          explanation: '‘~할 때마다’의 의미',
          example: '辿るたび (더듬을 때마다)',
        },
      ],
      expressions: [
        {
          expression: '記憶を辿る',
          meaning: '기억을 되짚다',
          example: '昔の記憶を辿る (옛 기억을 더듬다)',
        },
      ],
    },
    {
      line_id: 18,
      original: '君がいつだってそこに居てくれること',
      translated: '네가 언제나 그곳에 있어 주는 것',
      words: [
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君のことが好き (너를 좋아해)',
        },
        {
          word: 'いつだって',
          meaning: '언제라도, 언제나',
          example: '彼はいつだって優しい (그는 언제나 다정하다)',
        },
        {
          word: '居る (いる)',
          meaning: '있다 (사람, 동물)',
          example: '家にいる (집에 있다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てくれる',
          explanation: '‘~해 주다’의 의미',
          example: '居てくれる (있어 주다)',
        },
      ],
      expressions: [
        {
          expression: 'いつだってそこにいる',
          meaning: '언제나 그곳에 있다',
          example: '君はいつだってそこにいる (너는 언제나 그곳에 있어)',
        },
      ],
    },
    {
      line_id: 19,
      original: 'まるでそれは星の光と 同じように',
      translated: '마치 그것은 별빛과 같아',
      words: [
        {
          word: 'まるで',
          meaning: '마치',
          example: 'まるで夢のようだ (마치 꿈 같다)',
        },
        {
          word: '光 (ひかり)',
          meaning: '빛',
          example: '太陽の光 (태양의 빛)',
        },
        {
          word: '同じ (おなじ)',
          meaning: '같은',
          example: '同じ気持ち (같은 기분)',
        },
      ],
      grammar: [
        {
          pattern: '〜ように',
          explanation: '비유 (~처럼)',
          example: '同じように (같은 것처럼)',
        },
      ],
      expressions: [
        {
          expression: '星の光のように',
          meaning: '별빛처럼',
          example:
            '彼女の笑顔は星の光のように輝いていた (그녀의 미소는 별빛처럼 빛나고 있었다)',
        },
      ],
    },
    {
      line_id: 20,
      original: '今日に泣いたり笑ったり繋いでいく',
      translated: '오늘을 울거나 웃으며 이어가',
      words: [
        {
          word: '今日 (きょう)',
          meaning: '오늘',
          example: '今日は天気がいい (오늘은 날씨가 좋다)',
        },
        {
          word: '泣く (なく)',
          meaning: '울다',
          example: '映画を見て泣く (영화를 보고 울다)',
        },
        {
          word: '笑う (わらう)',
          meaning: '웃다',
          example: '冗談を聞いて笑う (농담을 듣고 웃다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
      ],
      grammar: [
        {
          pattern: '〜たり〜たりする',
          explanation: '서로 다른 동작을 나열할 때 사용',
          example: '泣いたり笑ったりする (울거나 웃거나 한다)',
        },
        {
          pattern: '〜ていく',
          explanation: '앞으로 진행되는 동작이나 변화',
          example: '繋いでいく (이어가다)',
        },
      ],
      expressions: [
        {
          expression: '泣いたり笑ったり',
          meaning: '울거나 웃거나 (감정의 변화)',
          example:
            '人生は泣いたり笑ったりするものだ (인생은 울기도 하고 웃기도 하는 것이다)',
        },
      ],
    },
    {
      line_id: 21,
      original: '何十回 何百回 ぶつかりあって',
      translated: '수십 번, 수백 번 부딪히고',
      words: [
        {
          word: '何十回 (なんじゅっかい)',
          meaning: '수십 번',
          example: '何十回も挑戦する (수십 번이나 도전하다)',
        },
        {
          word: '何百回 (なんびゃっかい)',
          meaning: '수백 번',
          example: '何百回も繰り返す (수백 번이나 반복하다)',
        },
        {
          word: 'ぶつかる',
          meaning: '부딪히다, 충돌하다',
          example: '壁にぶつかる (벽에 부딪히다)',
        },
      ],
      grammar: [
        {
          pattern: '何十〜 / 何百〜',
          explanation: '수십, 수백을 나타내는 표현',
          example: '何十回も (수십 번이나)',
        },
        {
          pattern: '〜あって',
          explanation: '서로 영향을 주며 동작이 발생함을 나타냄',
          example: 'ぶつかりあって (서로 부딪히고)',
        },
      ],
      expressions: [
        {
          expression: 'ぶつかりあう',
          meaning: '서로 충돌하다, 대립하다',
          example: '意見がぶつかりあう (의견이 충돌하다)',
        },
      ],
    },
    {
      line_id: 22,
      original: '何十年 何百年 昔の光が',
      translated: '수십 년, 수백 년 전의 빛이',
      words: [
        {
          word: '何十年 (なんじゅうねん)',
          meaning: '수십 년',
          example: '何十年も前の話 (수십 년 전의 이야기)',
        },
        {
          word: '何百年 (なんびゃくねん)',
          meaning: '수백 년',
          example: '何百年も続く伝統 (수백 년 이어진 전통)',
        },
        {
          word: '昔 (むかし)',
          meaning: '옛날, 과거',
          example: '昔の友達 (옛 친구)',
        },
        {
          word: '光 (ひかり)',
          meaning: '빛',
          example: '太陽の光 (태양빛)',
        },
      ],
      grammar: [
        {
          pattern: '何十〜 / 何百〜',
          explanation: '수십, 수백을 나타내는 표현',
          example: '何十年も (수십 년이나)',
        },
      ],
      expressions: [
        {
          expression: '昔の光',
          meaning: '옛날의 빛, 과거의 흔적',
          example: '何百年昔の光が届く (수백 년 전의 빛이 닿는다)',
        },
      ],
    },
    {
      line_id: 23,
      original: '僕自身も忘れたころに',
      translated: '나 자신도 잊어버린 무렵에',
      words: [
        {
          word: '僕 (ぼく)',
          meaning: '나',
          example: '僕の名前は (내 이름은)',
        },
        {
          word: '自身 (じしん)',
          meaning: '자신',
          example: '彼自身の問題 (그 자신만의 문제)',
        },
        {
          word: '忘れる (わすれる)',
          meaning: '잊다',
          example: '約束を忘れる (약속을 잊다)',
        },
        {
          word: 'ころ',
          meaning: '무렵, 때',
          example: '子供のころ (어릴 때)',
        },
      ],
      grammar: [
        {
          pattern: '〜も',
          explanation: '‘~도’의 의미를 가지며 추가적인 내용을 강조함',
          example: '僕自身も (나 자신도)',
        },
        {
          pattern: '〜たころ',
          explanation: '과거 시점의 무렵을 나타냄',
          example: '忘れたころ (잊어버린 무렵)',
        },
      ],
      expressions: [
        {
          expression: '忘れたころに',
          meaning: '완전히 잊어버린 무렵에',
          example:
            '突然の連絡が忘れたころに来る (완전히 잊어버린 무렵에 갑자기 연락이 온다)',
        },
      ],
    },
    {
      line_id: 24,
      original: '僕らを照らしてる',
      translated: '우리를 비추고 있어',
      words: [
        {
          word: '僕ら (ぼくら)',
          meaning: '우리',
          example: '僕らの未来 (우리의 미래)',
        },
        {
          word: '照らす (てらす)',
          meaning: '비추다',
          example: '月が道を照らす (달이 길을 비추다)',
        },
      ],
      grammar: [
        {
          pattern: '〜を照らす',
          explanation: '대상을 비추는 동작을 나타냄',
          example: '僕らを照らす (우리를 비추다)',
        },
        {
          pattern: '〜ている',
          explanation: '현재 진행형을 나타냄',
          example: '照らしてる (비추고 있다)',
        },
      ],
      expressions: [
        {
          expression: '照らしてる',
          meaning: '비추고 있다',
          example:
            '遠くの光が僕らを照らしてる (먼 곳의 빛이 우리를 비추고 있다)',
        },
      ],
    },
    {
      line_id: 25,
      original: '僕ら見つけあって 手繰りあって 同じ空',
      translated: '우린 서로 찾아 헤매며 같은 하늘 아래 있어',
      words: [
        {
          word: '見つける (みつける)',
          meaning: '찾다, 발견하다',
          example: '新しい道を見つける (새로운 길을 찾다)',
        },
        {
          word: '手繰る (たぐる)',
          meaning: '손으로 당기다, 더듬다',
          example: '糸を手繰る (실을 손으로 감다)',
        },
        {
          word: '同じ (おなじ)',
          meaning: '같은',
          example: '同じ時間 (같은 시간)',
        },
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '青い空 (푸른 하늘)',
        },
      ],
      grammar: [
        {
          pattern: '〜あって',
          explanation: '서로 상호 작용함을 나타냄',
          example: '見つけあって (서로 찾아서)',
        },
      ],
      expressions: [
        {
          expression: '同じ空',
          meaning: '같은 하늘 아래',
          example:
            'どこにいても僕らは同じ空の下にいる (어디에 있어도 우리는 같은 하늘 아래 있어)',
        },
      ],
    },
    {
      line_id: 26,
      original: '輝くのだって 二人だって 約束した',
      translated: '빛나는 것도, 둘이 함께라는 것도 약속했어',
      words: [
        {
          word: '輝く (かがやく)',
          meaning: '빛나다',
          example: '星が輝く (별이 빛나다)',
        },
        {
          word: '二人 (ふたり)',
          meaning: '두 사람',
          example: '二人で歩く (두 사람이 걷다)',
        },
        {
          word: '約束 (やくそく)',
          meaning: '약속',
          example: '友達と約束する (친구와 약속하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜のだって',
          explanation: '강조형 (~인 것도)',
          example: '輝くのだって (빛나는 것도)',
        },
        {
          pattern: '〜だって',
          explanation: '강조 및 열거 (~도 역시)',
          example: '二人だって (둘도 역시)',
        },
      ],
      expressions: [
        {
          expression: '約束する',
          meaning: '약속하다',
          example: '未来を約束する (미래를 약속하다)',
        },
      ],
    },
    {
      line_id: 27,
      original: '遥か遠く終わらないべテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 훨씬',
          example: '遥か昔の話 (아득히 옛날 이야기)',
        },
        {
          word: '遠く (とおく)',
          meaning: '멀리',
          example: '遠くへ行く (멀리 가다)',
        },
        {
          word: '終わる (おわる)',
          meaning: '끝나다',
          example: '試合が終わる (경기가 끝나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~하지 않다)',
          example: '終わらない (끝나지 않다)',
        },
      ],
      expressions: [
        {
          expression: '遥か遠く',
          meaning: '아득히 먼 곳',
          example: '遥か遠くに星が見える (아득히 먼 곳에 별이 보인다)',
        },
      ],
    },
    {
      line_id: 28,
      original: '誰かに繋ぐ魔法',
      translated: '누군가에게 이어주는 마법',
      words: [
        {
          word: '誰か (だれか)',
          meaning: '누군가',
          example: '誰かが来た (누군가가 왔다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
        {
          word: '魔法 (まほう)',
          meaning: '마법',
          example: '魔法のような出来事 (마법 같은 일)',
        },
      ],
      grammar: [
        {
          pattern: '〜に繋ぐ',
          explanation: '어떤 대상에게 연결하는 행위를 나타냄',
          example: '誰かに繋ぐ (누군가에게 연결하다)',
        },
      ],
      expressions: [
        {
          expression: '魔法のように',
          meaning: '마법처럼',
          example: '彼の言葉は魔法のようだった (그의 말은 마법 같았다)',
        },
      ],
    },
    {
      line_id: 29,
      original: 'どこまで いつまで 生きられるか',
      translated: '어디까지, 언제까지 살아갈 수 있을까',
      words: [
        {
          word: 'どこまで',
          meaning: '어디까지',
          example: 'どこまで行くの？ (어디까지 가?)',
        },
        {
          word: 'いつまで',
          meaning: '언제까지',
          example: 'いつまで待てばいいの？ (언제까지 기다리면 돼?)',
        },
        {
          word: '生きる (いきる)',
          meaning: '살다',
          example: '長く生きる (오래 살다)',
        },
      ],
      grammar: [
        {
          pattern: '〜られる',
          explanation: '가능형 (~할 수 있다)',
          example: '生きられる (살 수 있다)',
        },
      ],
      expressions: [
        {
          expression: 'どこまで生きられるか',
          meaning: '어디까지 살아갈 수 있을까',
          example:
            '人生はどこまで生きられるか分からない (인생이 어디까지 지속될지 모른다)',
        },
      ],
    },
    {
      line_id: 30,
      original: '君が不安になるたびに強がるんだ',
      translated: '네가 불안해질 때마다 강한 척을 해',
      words: [
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君の名前は？ (너의 이름은 뭐야?)',
        },
        {
          word: '不安 (ふあん)',
          meaning: '불안',
          example: '将来が不安だ (미래가 불안하다)',
        },
        {
          word: '強がる (つよがる)',
          meaning: '강한 척하다',
          example: '彼は強がっている (그는 강한 척하고 있다)',
        },
      ],
      grammar: [
        {
          pattern: '〜たびに',
          explanation: '‘~할 때마다’의 의미',
          example: '不安になるたびに (불안해질 때마다)',
        },
      ],
      expressions: [
        {
          expression: '強がる',
          meaning: '강한 척하다',
          example: '彼は寂しい時ほど強がる (그는 외로울수록 강한 척한다)',
        },
      ],
    },
    {
      line_id: 31,
      original: '大丈夫 僕が横にいるよ',
      translated: '괜찮아, 내가 곁에 있을게',
      words: [
        {
          word: '大丈夫 (だいじょうぶ)',
          meaning: '괜찮다',
          example: '心配しないで、大丈夫 (걱정하지 마, 괜찮아)',
        },
        {
          word: '横 (よこ)',
          meaning: '옆, 곁',
          example: '彼の横に座る (그의 옆에 앉다)',
        },
        {
          word: 'いる',
          meaning: '있다 (사람, 동물)',
          example: '部屋にいる (방에 있다)',
        },
      ],
      grammar: [
        {
          pattern: '〜にいる',
          explanation: '장소에 사람이 존재함을 나타냄',
          example: '横にいる (옆에 있다)',
        },
      ],
      expressions: [
        {
          expression: '大丈夫',
          meaning: '괜찮다',
          example: '何があっても大丈夫 (무슨 일이 있어도 괜찮아)',
        },
      ],
    },
    {
      line_id: 32,
      original: '見えない線を繋ごう',
      translated: '보이지 않는 선을 이어가자',
      words: [
        {
          word: '見えない (みえない)',
          meaning: '보이지 않다',
          example: '暗くて見えない (어두워서 보이지 않는다)',
        },
        {
          word: '線 (せん)',
          meaning: '선',
          example: '一本の線 (한 줄의 선)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
      ],
      grammar: [
        {
          pattern: '〜を繋ぐ',
          explanation: '무언가를 연결하는 동작을 나타냄',
          example: '線を繋ぐ (선을 잇다)',
        },
      ],
      expressions: [
        {
          expression: '見えない線',
          meaning: '보이지 않는 연결, 인연',
          example:
            '僕らは見えない線で繋がっている (우리는 보이지 않는 선으로 연결되어 있다)',
        },
      ],
    },
    {
      line_id: 33,
      original: '僕ら見つけあって 手繰りあって 同じ空',
      translated: '우린 서로 찾아 헤매며 같은 하늘 아래 있어',
      words: [
        {
          word: '見つける (みつける)',
          meaning: '찾다, 발견하다',
          example: '新しい道を見つける (새로운 길을 찾다)',
        },
        {
          word: '手繰る (たぐる)',
          meaning: '손으로 당기다, 더듬다',
          example: '糸を手繰る (실을 손으로 감다)',
        },
        {
          word: '同じ (おなじ)',
          meaning: '같은',
          example: '同じ時間 (같은 시간)',
        },
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '青い空 (푸른 하늘)',
        },
      ],
      grammar: [
        {
          pattern: '〜あって',
          explanation: '서로 상호 작용함을 나타냄',
          example: '見つけあって (서로 찾아서)',
        },
      ],
      expressions: [
        {
          expression: '同じ空',
          meaning: '같은 하늘 아래',
          example:
            'どこにいても僕らは同じ空の下にいる (어디에 있어도 우리는 같은 하늘 아래 있어)',
        },
      ],
    },
    {
      line_id: 34,
      original: '輝くのだって 二人だって 約束した',
      translated: '빛나는 것도, 둘이 함께라는 것도 약속했어',
      words: [
        {
          word: '輝く (かがやく)',
          meaning: '빛나다',
          example: '星が輝く (별이 빛나다)',
        },
        {
          word: '二人 (ふたり)',
          meaning: '두 사람',
          example: '二人で歩く (두 사람이 걷다)',
        },
        {
          word: '約束 (やくそく)',
          meaning: '약속',
          example: '友達と約束する (친구와 약속하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜のだって',
          explanation: '강조형 (~인 것도)',
          example: '輝くのだって (빛나는 것도)',
        },
        {
          pattern: '〜だって',
          explanation: '강조 및 열거 (~도 역시)',
          example: '二人だって (둘도 역시)',
        },
      ],
      expressions: [
        {
          expression: '約束する',
          meaning: '약속하다',
          example: '未来を約束する (미래를 약속하다)',
        },
      ],
    },
    {
      line_id: 35,
      original: '遥か遠く終わらないべテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 훨씬',
          example: '遥か昔の話 (아득히 옛날 이야기)',
        },
        {
          word: '遠く (とおく)',
          meaning: '멀리',
          example: '遠くへ行く (멀리 가다)',
        },
        {
          word: '終わる (おわる)',
          meaning: '끝나다',
          example: '試合が終わる (경기가 끝나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~하지 않다)',
          example: '終わらない (끝나지 않다)',
        },
      ],
      expressions: [
        {
          expression: '遥か遠く',
          meaning: '아득히 먼 곳',
          example: '遥か遠くに星が見える (아득히 먼 곳에 별이 보인다)',
        },
      ],
    },
    {
      line_id: 36,
      original: '誰かに繋ぐ魔法',
      translated: '누군가에게 이어주는 마법',
      words: [
        {
          word: '誰か (だれか)',
          meaning: '누군가',
          example: '誰かが来た (누군가가 왔다)',
        },
        {
          word: '繋ぐ (つなぐ)',
          meaning: '잇다, 연결하다',
          example: '手を繋ぐ (손을 잡다)',
        },
        {
          word: '魔法 (まほう)',
          meaning: '마법',
          example: '魔法のような出来事 (마법 같은 일)',
        },
      ],
      grammar: [
        {
          pattern: '〜に繋ぐ',
          explanation: '어떤 대상에게 연결하는 행위를 나타냄',
          example: '誰かに繋ぐ (누군가에게 연결하다)',
        },
      ],
      expressions: [
        {
          expression: '魔法のように',
          meaning: '마법처럼',
          example: '彼の言葉は魔法のようだった (그의 말은 마법 같았다)',
        },
      ],
    },
    {
      line_id: 37,
      original: '僕ら 肩並べ 手取り合って 進んでく',
      translated: '우리는 어깨를 나란히 하고 손을 맞잡고 나아가',
      words: [
        {
          word: '肩 (かた)',
          meaning: '어깨',
          example: '肩を並べる (어깨를 나란히 하다)',
        },
        {
          word: '並べる (ならべる)',
          meaning: '늘어놓다, 나란히 하다',
          example: '本を並べる (책을 정렬하다)',
        },
        {
          word: '手 (て)',
          meaning: '손',
          example: '手を繋ぐ (손을 잡다)',
        },
        {
          word: '進む (すすむ)',
          meaning: '나아가다, 진행되다',
          example: '前に進む (앞으로 나아가다)',
        },
      ],
      grammar: [
        {
          pattern: '〜てく',
          explanation: '구어체 표현으로 ‘~해 나가다’의 의미',
          example: '進んでく (나아가다)',
        },
      ],
      expressions: [
        {
          expression: '肩を並べる',
          meaning: '어깨를 나란히 하다 (동등한 입장에서 함께하다)',
          example: '彼と肩を並べて戦う (그와 어깨를 나란히 하고 싸우다)',
        },
        {
          expression: '手を取り合う',
          meaning: '서로 손을 잡다, 협력하다',
          example:
            '困難を乗り越えるために手を取り合う (어려움을 극복하기 위해 손을 맞잡다)',
        },
      ],
    },
    {
      line_id: 38,
      original: '辛い時だって 二人だって 誓っただろう',
      translated: '힘든 때도, 둘도 함께라고 맹세했잖아',
      words: [
        {
          word: '辛い (つらい)',
          meaning: '괴롭다, 힘들다',
          example: '辛い経験 (괴로운 경험)',
        },
        {
          word: '時 (とき)',
          meaning: '때, 시기',
          example: '雨の時は傘をさす (비가 올 때는 우산을 쓴다)',
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
          explanation: '강조 및 열거 (~도 역시)',
          example: '辛い時だって (힘든 때도)',
        },
        {
          pattern: '〜だろう',
          explanation: '추측이나 확인을 요구하는 표현 (~겠지, ~잖아)',
          example: '誓っただろう (맹세했잖아)',
        },
      ],
      expressions: [
        {
          expression: '誓っただろう',
          meaning: '맹세했잖아, 약속했잖아',
          example: '一緒にいると誓っただろう (함께 있겠다고 맹세했잖아)',
        },
      ],
    },
    {
      line_id: 39,
      original: '遥か遠く終わらないべテルギウス',
      translated: '아득히 멀리 끝나지 않는 베텔기우스',
      words: [
        {
          word: '遥か (はるか)',
          meaning: '아득히, 훨씬',
          example: '遥か昔の話 (아득히 옛날 이야기)',
        },
        {
          word: '遠く (とおく)',
          meaning: '멀리',
          example: '遠くへ行く (멀리 가다)',
        },
        {
          word: '終わる (おわる)',
          meaning: '끝나다',
          example: '試合が終わる (경기가 끝나다)',
        },
      ],
      grammar: [
        {
          pattern: '〜ない',
          explanation: '부정형 (~하지 않다)',
          example: '終わらない (끝나지 않다)',
        },
      ],
      expressions: [
        {
          expression: '遥か遠く',
          meaning: '아득히 먼 곳',
          example: '遥か遠くに星が見える (아득히 먼 곳에 별이 보인다)',
        },
      ],
    },
    {
      line_id: 40,
      original: '君にも見えるだろう 祈りが',
      translated: '너도 보일 거야, 기도가',
      words: [
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君の名前は？ (너의 이름은 뭐야?)',
        },
        {
          word: '見る (みる)',
          meaning: '보다',
          example: '映画を見る (영화를 보다)',
        },
        {
          word: '祈り (いのり)',
          meaning: '기도',
          example: '平和を祈る (평화를 기원하다)',
        },
      ],
      grammar: [
        {
          pattern: '〜にも',
          explanation: '‘~도 역시’의 의미를 강조',
          example: '君にも (너도 역시)',
        },
        {
          pattern: '〜だろう',
          explanation: '추측을 나타냄 (~일 거야)',
          example: '見えるだろう (보일 거야)',
        },
      ],
      expressions: [
        {
          expression: '祈りが見える',
          meaning: '기도가 보이다 (희망을 의미)',
          example:
            '夜空を見上げれば祈りが見える (밤하늘을 올려다보면 기도가 보인다)',
        },
      ],
    },
    {
      line_id: 41,
      original: '空にある何かを見つめてたら',
      translated: '하늘에 있는 무언가를 바라보고 있으면',
      words: [
        {
          word: '空 (そら)',
          meaning: '하늘',
          example: '空を見上げる (하늘을 올려다보다)',
        },
        {
          word: 'ある',
          meaning: '있다, 존재하다 (무생물)',
          example: '机の上に本がある (책상이 위에 책이 있다)',
        },
        {
          word: '何か (なにか)',
          meaning: '무언가',
          example: '何か食べたい (뭔가 먹고 싶다)',
        },
        {
          word: '見つめる (みつめる)',
          meaning: '응시하다, 바라보다',
          example: '未来を見つめる (미래를 바라보다)',
        },
      ],
      grammar: [
        {
          pattern: '〜にある',
          explanation: '어떤 장소에 존재함을 나타냄',
          example: '空にある星 (하늘에 있는 별)',
        },
        {
          pattern: '〜を見つめる',
          explanation: '직접 목적어를 응시하는 동작',
          example: '何かを見つめる (무언가를 바라보다)',
        },
        {
          pattern: '〜てたら',
          explanation: '가정형(~하면)',
          example: '空を見つめてたら (하늘을 바라보고 있으면)',
        },
      ],
      expressions: [
        {
          expression: '何かを見つめる',
          meaning: '무언가를 응시하다',
          example:
            '彼は遠くの何かを見つめていた (그는 멀리 있는 무언가를 응시하고 있었다)',
        },
      ],
    },
    {
      line_id: 42,
      original: 'それは星だって君がおしえてくれた',
      translated: '그건 별이라고 네가 가르쳐 줬어.',
      words: [
        {
          word: 'それ',
          meaning: '그것',
          example: 'それは何？ (그건 뭐야?)',
        },
        {
          word: '星 (ほし)',
          meaning: '별',
          example: '夜空の星 (밤하늘의 별)',
        },
        {
          word: '教える (おしえる)',
          meaning: '가르치다, 알려주다',
          example: '先生が数学を教える (선생님이 수학을 가르친다)',
        },
        {
          word: '君 (きみ)',
          meaning: '너',
          example: '君の名前は？ (너의 이름은 뭐야?)',
        },
      ],
      grammar: [
        {
          pattern: '〜だって',
          explanation: '직접 인용 (~라고)',
          example: '星だって (별이라고)',
        },
        {
          pattern: '〜てくれる',
          explanation: '상대방이 나를 위해 어떤 행동을 해주는 표현',
          example: '教えてくれた (가르쳐 줬다)',
        },
      ],
      expressions: [
        {
          expression: '星だって',
          meaning: '별이라고 (꿈, 희망의 상징)',
          example: '君は星だって信じてる (너는 별이라고 믿고 있어)',
        },
        {
          expression: '教えてくれる',
          meaning: '가르쳐 주다, 알려주다 (배려의 의미)',
          example: '先生が優しく教えてくれる (선생님이 친절하게 가르쳐 준다)',
        },
      ],
    },
  ],
}
