import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit } from 'lucide-react'

interface EditableCardFieldProps {
  label: string
  value: number
  onSave: (newValue: number) => void
  icon?: React.ReactNode
  suffix?: string
}

const EditableCardField: React.FC<EditableCardFieldProps> = ({
  label,
  value,
  onSave,
  icon,
  suffix = '개',
}) => {
  // tempValue를 문자열로 관리하여 빈 문자열 입력이 가능하게 함
  const [editing, setEditing] = useState(false)
  const [tempValue, setTempValue] = useState(String(value))

  useEffect(() => {
    setTempValue(String(value))
  }, [value])

  return (
    <motion.div
      layout
      className="rounded-lg"
      onClick={() => {
        if (!editing) setEditing(true)
      }}
    >
      {editing ? (
        <div className="bg-gray-700/50 p-2.5 rounded-lg border border-accent-500 shadow-sm">
          <div className="flex items-center gap-1.5">
            {icon && <div>{icon}</div>}
            <span className="text-xs text-gray-400">{label}</span>
          </div>
          <div className="mt-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={tempValue}
              onChange={(e) => {
                // 숫자만 남기고 제거
                let newVal = e.target.value.replace(/[^0-9]/g, '')
                // 만약 newVal가 비어있거나, 오직 '0' 또는 여러 0로만 이루어진 경우 업데이트하지 않음
                if (newVal !== '' && /^0+$/.test(newVal)) return
                setTempValue(newVal)
              }}
              className="w-full bg-gray-800 text-white px-2 py-1 rounded text-base font-bold text-center appearance-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 빈 문자열이거나 0이면 취소 (0 업데이트 금지)
                  if (tempValue === '' || Number(tempValue) === 0) {
                    setTempValue(String(value))
                    setEditing(false)
                    return
                  }
                  onSave(Number(tempValue))
                  setEditing(false)
                }
              }}
            />
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditing(false)
                setTempValue(String(value))
              }}
              className="px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (tempValue === '' || Number(tempValue) === 0) {
                  setTempValue(String(value))
                  setEditing(false)
                  return
                }
                onSave(Number(tempValue))
                setEditing(false)
              }}
              className="px-2 py-1 text-xs bg-accent-600 text-white rounded hover:bg-accent-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700/50 p-2.5 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-1.5">
            {icon && <div>{icon}</div>}
            <span className="text-xs text-gray-400">{label}</span>
            <div className="ml-auto">
              <Edit className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-white font-bold text-base block">
              {value}
              {suffix}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default EditableCardField
