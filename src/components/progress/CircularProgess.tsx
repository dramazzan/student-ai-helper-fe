"use client"

import type React from "react"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-700"
    if (score >= 60) return "text-amber-700"
    if (score >= 40) return "text-orange-700"
    return "text-red-700"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200"
        />
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${getScoreTextColor(percentage)}`}>{percentage}%</span>
      </div>
    </div>
  )
}
