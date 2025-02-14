// utils/lyricsProcessor.ts
import {
  LyricLine,
  ProcessedLyrics,
  Expression,
  AdvancedStudy,
} from '@/types/lyrics'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

interface Caption {
  text: string
  start: number
  end: number
}

export async function processVideoLyrics(
  videoId: string,
  title: string,
  artist: string,
  captions: Caption[]
): Promise<ProcessedLyrics> {
  try {
    // 각 자막 라인에 대해 분석 수행
    const lyricsPromises = captions.map(async (caption, index) => {
      const analysis = await analyzeLyricLine(caption.text)

      const lyricLine: LyricLine = {
        line_id: index + 1,
        original: caption.text,
        translated: analysis.translation,
        words: analysis.words,
        grammar: analysis.grammar,
        expressions: analysis.expressions,
        advanced_study: analysis.advanced_study,
        timestamp: {
          start: caption.start,
          end: caption.end,
        },
      }

      return lyricLine
    })

    const lyrics = await Promise.all(lyricsPromises)

    return {
      lyrics,
      videoId,
      title,
      artist,
      language: 'EN-KR', // 임시로 하드코딩, 나중에 언어 감지 로직 추가 필요
    }
  } catch (error) {
    console.error('Error processing lyrics:', error)
    throw error
  }
}

interface LyricAnalysis {
  translation: string
  words: Array<{
    word: string
    meaning: string
    example: string
  }>
  grammar: Array<{
    pattern: string
    explanation: string
    example: string
  }>
  expressions: Expression[]
  advanced_study: AdvancedStudy
}

async function analyzeLyricLine(line: string): Promise<LyricAnalysis> {
  try {
    const prompt = `
  # 역할 설정
  너는 다국어 학습을 위한 전문가이며, 노래 가사를 분석하여 학습 데이터를 제공하는 역할을 한다. 분석된 데이터를 JSON 형식으로 출력하며, 사용자가 노래를 통해 단어, 문법, 표현(숙어), 심화 학습(비유적 표현, 실전 활용법 등)을 효과적으로 학습할 수 있도록 한다.
  
  # 지원 언어
  - 영어(EN), 일본어(JP), 스페인어(ES), 프랑스어(FR) 등 다양한 언어를 지원해야 한다.
  - 각 언어별 문법, 표현 방식을 반영하여 분석해야 한다.
  - 분석된 단어 및 문법 설명은 한국어(KR)로 제공한다.
  
  # JSON 출력 규칙
  ✅ 모든 JSON 데이터는 다음과 같은 구조를 유지해야 한다.
  ✅ "단어(Words)", "문법(Grammar)", "표현(Expressions)", "심화(Advanced Study)"는 각기 다른 학습 목적을 가지므로 중복 없이 분리하여 제공.
  ✅ "단어(Words)" → 기본적인 조사(は, が, の, the, a 등)도 포함하되, 사용자가 직접 숨김 가능.
  ✅ "문법(Grammar)" → 해당 문장에서 사용된 문법 패턴을 설명 (일반적인 문법 규칙).
  ✅ "표현(Expressions)" → 숙어(관용적 표현)만 제공 (비유적 표현 제외).
  ✅ "심화(Advanced Study)" → 비유적 표현, 확장 문법, 실전 활용법 등 고급 학습 자료 제공 (프리미엄 전용).
  ✅ "심화(Advanced Study)" 내 모든 데이터는 복수형 배열을 사용하여 여러 개의 분석을 제공할 수 있도록 한다.
  
  분석할 가사 문장: "${line}"
  
  위 규칙을 준수하여 아래와 같은 형식의 JSON 데이터로 상세하게 분석해주세요.
  
  {
    "translation": "한국어 번역",
    "words": [
      {
        "word": "단어",
        "meaning": "의미",
        "example": "예문"
      }
    ],
    "grammar": [
      {
        "pattern": "문법 패턴",
        "explanation": "설명",
        "example": "예문"
      }
    ],
    "expressions": [
      {
        "expression": "숙어/관용구 표현",
        "meaning": "의미",
        "example": "예문",
        "explanation": "설명"
      }
    ],
    "advanced_study": {
      "metaphorical_expressions": [
        {
          "phrase": "비유적 표현",
          "explanation": "설명",
          "example": "예문"
        }
      ],
      "pronunciation_tips": [
        {
          "phrase": "발음 팁 대상 구절",
          "tip": "발음 팁"
        }
      ],
      "similar_expressions": [
        {
          "original_expression": "원본 표현",
          "similar_expressions": [
            "유사 표현 1",
            "유사 표현 2"
          ]
        }
      ],
      "real_life_usages": [
        {
          "phrase": "표현",
          "usage": "실생활 사용 예"
        }
      ],
      "advanced_grammar_explanations": [
        {
          "pattern": "문법 패턴",
          "advanced_explanation": "심화 문법 설명"
        }
      ],
      "premium_only": true
    }
  }
  `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            '너는 다국어 학습을 위한 전문가이며, 노래 가사를 분석하여 학습 데이터를 제공하는 역할을 한다. 분석된 데이터를 JSON 형식으로 출력하며, 사용자가 노래를 통해 단어, 문법, 표현(숙어), 심화 학습(비유적 표현, 실전 활용법 등)을 효과적으로 학습할 수 있도록 한다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No content in response')
    }

    const result = JSON.parse(content)

    // 분석 결과를 LyricAnalysis 형식에 맞게 변환
    return {
      translation: result.translation,
      words: result.words || [],
      grammar: result.grammar || [],
      expressions: result.expressions || [],
      advanced_study: {
        metaphorical_expressions:
          result.advanced_study?.metaphorical_expressions || [],
        pronunciation_tips: result.advanced_study?.pronunciation_tips || [],
        similar_expressions: result.advanced_study?.similar_expressions || [],
        real_life_usages: result.advanced_study?.real_life_usages || [],
        advanced_grammar_explanations:
          result.advanced_study?.advanced_grammar_explanations || [],
        premium_only: true,
      },
    }
  } catch (error) {
    console.error('Error analyzing lyric line:', error)
    throw error
  }
}
