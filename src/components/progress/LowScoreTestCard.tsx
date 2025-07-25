"use client"

import type React from "react"
import { BookOpen, Calendar } from "lucide-react"

interface LowScoreTestCardProps {
  title: string
  date: string
  score: number
  total: number
}

export const LowScoreTestCard: React.FC<LowScoreTestCardProps> = ({ title, date, score, total }) => {
  return (
    <div className="group bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#C8102E]" />
          </div>
          <div>
            <h4 className="font-medium text-black">{title}</h4>
            <div className="flex items-center gap-2 text-sm text-[#666666]">
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-black">
            {Number.isFinite(score) && Number.isFinite(total) ? `${score}/${total}` : "—"}
          </div>
          <div className="text-xs text-[#666666]">
            {Number.isFinite(score) && Number.isFinite(total) && total > 0
              ? `${Math.round((score / total) * 100)}%`
              : "—"}
          </div>
        </div>
      </div>
    </div>
  )
}
