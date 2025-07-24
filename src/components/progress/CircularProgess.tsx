"use client"

import type React from "react"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "narxoz" // Добавляем вариант с фирменными цветами
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  variant = "default",
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  const getScoreTextColor = (score: number) => {
    if (variant === "narxoz") {
      // Используем фирменные цвета Narxoz для специальных случаев
      if (score >= 80) return "text-[#C8102E]"
      if (score >= 60) return "text-[#B00020]"
      return "text-[#666666]"
    }

    // Стандартная цветовая логика для оценок
    if (score >= 80) return "text-emerald-700"
    if (score >= 60) return "text-amber-700"
    if (score >= 40) return "text-orange-700"
    return "text-red-700"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-[#E0E0E0]"
        />
        {/* Прогресс круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className={`transition-all duration-1000 ease-out ${getScoreTextColor(percentage)}`}
          strokeLinecap="round"
        />
      </svg>
      {/* Центральный текст */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${getScoreTextColor(percentage)}`}>{percentage}%</span>
      </div>
    </div>
  )
}
