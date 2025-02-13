// components/tutorial/TutorialNavigation.tsx
import { Home, Book, Star, FileText, HelpCircle } from 'lucide-react'

interface TutorialNavigationProps {
  currentStep: number
  onStepChange: (step: number) => void
  className?: string
}

const TUTORIAL_STEPS = [
  {
    icon: Home,
    title: '시작하기',
    description: '멜로딕 소개',
  },
  {
    icon: Book,
    title: '핵심 기능',
    description: '주요 기능 알아보기',
  },
  {
    icon: Star,
    title: '프리미엄',
    description: '무료 vs 프리미엄',
  },
  {
    icon: FileText,
    title: '실습',
    description: '직접 체험하기',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: '자주 묻는 질문',
  },
]

export default function TutorialNavigation({
  currentStep,
  onStepChange,
  className = '',
}: TutorialNavigationProps) {
  return (
    <>
      {/* 데스크톱 사이드바 */}
      <div
        className={`w-64 bg-gray-900 border-r border-gray-800 p-6 hidden md:block ${className}`}
      >
        <h2 className="text-xl font-bold text-white mb-8">튜토리얼</h2>

        <div className="space-y-4">
          {TUTORIAL_STEPS.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepChange(index)}
              className={`
                w-full 
                flex 
                items-center 
                gap-4 
                p-3 
                rounded-xl 
                transition-all 
                duration-300
                ${
                  currentStep === index
                    ? 'bg-accent-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <step.icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">{step.title}</div>
                <div className="text-xs text-gray-300">{step.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
