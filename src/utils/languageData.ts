// utils/languageData.ts
interface LanguageData {
  id: string // ISO 639-1 코드
  name: string // 한글 이름
  englishName: string // 영어 이름
  alternateNames: string[] // 대체 이름들 (예: 스파니쉬, 에스파뇰 등)
  flag: string // 국기 이모지
  featured: boolean // 메인 화면에 표시될 언어인지 여부
}

export const LANGUAGE_DATA: LanguageData[] = [
  // 메인 표시 언어
  {
    id: 'en',
    name: '영어',
    englishName: 'English',
    alternateNames: ['영국어', '잉글리시', '미국어'],
    flag: '🇺🇸',
    featured: true,
  },
  {
    id: 'ja',
    name: '일본어',
    englishName: 'Japanese',
    alternateNames: ['일어', '재패니즈'],
    flag: '🇯🇵',
    featured: true,
  },
  {
    id: 'fr',
    name: '프랑스어',
    englishName: 'French',
    alternateNames: ['불어', '프렌치'],
    flag: '🇫🇷',
    featured: true,
  },
  {
    id: 'es',
    name: '스페인어',
    englishName: 'Spanish',
    alternateNames: ['에스파냐어', '스파니시', '스파니쉬'],
    flag: '🇪🇸',
    featured: true,
  },
  {
    id: 'de',
    name: '독일어',
    englishName: 'German',
    alternateNames: ['독어', '저먼'],
    flag: '🇩🇪',
    featured: true,
  },
  // 추가 지원 언어
  {
    id: 'zh',
    name: '중국어',
    englishName: 'Chinese',
    alternateNames: ['중어', '차이니즈', '만다린'],
    flag: '🇨🇳',
    featured: false,
  },
  {
    id: 'it',
    name: '이탈리아어',
    englishName: 'Italian',
    alternateNames: ['이태리어', '이탈리안'],
    flag: '🇮🇹',
    featured: false,
  },
  {
    id: 'ru',
    name: '러시아어',
    englishName: 'Russian',
    alternateNames: ['노어', '러시안'],
    flag: '🇷🇺',
    featured: false,
  },
  // ... 더 많은 언어 추가 가능
]

// 언어 검증 및 자동 수정 함수
export function validateAndCorrectLanguage(input: string): {
  isValid: boolean
  correctedName?: string
  languageData?: LanguageData
  message?: string
} {
  // 기본 입력값 검증
  if (!input.trim() || /[\d!@#$%^&*(),.?":{}|<>]/.test(input)) {
    return {
      isValid: false,
      message: '유효한 언어를 입력해주세요! 예: 스웨덴어, 태국어 등',
    }
  }

  // 정확한 일치 검사
  const exactMatch = LANGUAGE_DATA.find(
    (lang) =>
      lang.name === input ||
      lang.englishName.toLowerCase() === input.toLowerCase()
  )
  if (exactMatch) {
    return {
      isValid: true,
      languageData: exactMatch,
    }
  }

  // 유사 언어명 검사 (대체 이름 포함)
  const similarMatch = LANGUAGE_DATA.find((lang) =>
    lang.alternateNames.some((alt) => alt.toLowerCase() === input.toLowerCase())
  )
  if (similarMatch) {
    return {
      isValid: true,
      correctedName: similarMatch.name,
      languageData: similarMatch,
      message: `'${input}'을(를) '${similarMatch.name}'(으)로 변경했어요.`,
    }
  }

  // 모든 검증 실패
  return {
    isValid: false,
    message: '지원하지 않는 언어입니다. 다른 언어를 선택해주세요.',
  }
}

// 추천 언어 목록 가져오기
export function getFeaturedLanguages(): LanguageData[] {
  return LANGUAGE_DATA.filter((lang) => lang.featured)
}
