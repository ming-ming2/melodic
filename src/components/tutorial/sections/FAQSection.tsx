// components/tutorial/sections/FAQSection.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  isPremium?: boolean
}

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const FAQs: FAQItem[] = [
    {
      question: '멜로딕은 어떤 서비스인가요?',
      answer:
        '멜로딕은 음악을 통해 언어를 재미있고 효과적으로 학습할 수 있는 플랫폼입니다. 좋아하는 노래의 가사를 분석하여 언어를 자연스럽게 배울 수 있어요.',
    },
    {
      question: '어떤 언어를 배울 수 있나요?',
      answer:
        '현재 영어, 일본어, 프랑스어 등 다양한 언어의 노래를 제공하고 있으며, 지속적으로 언어와 곡을 추가하고 있습니다.',
    },
    {
      question: '프리미엄 멤버십의 장점은 무엇인가요?',
      answer:
        '프리미엄 멤버십은 무제한 노래 학습, 심화 문법 분석, 표현 학습, 오프라인 모드 등 다양한 추가 기능을 제공합니다.',
      isPremium: true,
    },
    {
      question: '매일 얼마나 학습해야 하나요?',
      answer:
        '멜로딕은 유연한 학습 시스템으로, 원하는 만큼 자유롭게 학습할 수 있습니다. 하지만 효과적인 언어 학습을 위해 매일 15-30분 정도의 학습을 추천드립니다.',
    },
    {
      question: '노래 추천은 어떻게 이루어지나요?',
      answer:
        '사용자의 언어 레벨, 음악 취향, 학습 이력을 종합적으로 분석하여 맞춤형 노래를 추천합니다.',
      isPremium: true,
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">자주 묻는 질문</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          멜로딕에 대해 궁금한 점을 여기서 해결해보세요.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {FAQs.map((faq, index) => (
          <div
            key={index}
            className={`
              bg-gray-800 rounded-xl overflow-hidden
              ${faq.isPremium ? 'border border-yellow-500/30' : ''}
            `}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left"
            >
              <span
                className={`
                font-medium 
                ${faq.isPremium ? 'text-yellow-500' : 'text-white'}
              `}
              >
                {faq.question}
                {faq.isPremium && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                    프리미엄
                  </span>
                )}
              </span>
              <ChevronDown
                className={`
                  w-5 h-5 transition-transform 
                  ${openFAQ === index ? 'rotate-180' : ''}
                `}
              />
            </button>

            <AnimatePresence>
              {openFAQ === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 text-gray-400">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
