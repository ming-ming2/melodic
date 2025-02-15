// components/analytics/WeeklyProgress.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface WeeklyProgressProps {
  data: Array<{
    day: string
    minutes: number
  }>
}

export default function WeeklyProgress({ data }: WeeklyProgressProps) {
  console.log('WeeklyProgress received data:', data)
  const maxValue = Math.max(...data.map((item) => item.minutes))
  console.log('Calculated maxValue:', maxValue)

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-6">주간 학습 시간</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20, // 왼쪽 여백을 줄여서 그래프를 더 왼쪽으로
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              horizontal={true}
              vertical={false} // 수직 그리드는 제거
            />
            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              axisLine={false} // x축 라인 제거
              tickLine={false} // x축 틱 라인 제거
              dy={10} // x축 라벨 위치 조정
            />
            <YAxis
              stroke="#9CA3AF"
              axisLine={false} // y축 라인 제거
              tickLine={false} // y축 틱 라인 제거
              dx={-10} // y축 라벨 위치 조정
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value) => [`${value}분`, '학습 시간']}
              labelFormatter={(label) => `${label}요일`}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} // 점 크기 조정
              activeDot={{ r: 6, strokeWidth: 2 }} // 활성 점 크기 조정
              fill="url(#colorGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
