"use client"

import type React from "react"
import { Brain, ChevronRight } from "lucide-react"

interface WeakTopicCardProps {
  topic: string
  mistakes: number
  recommendation: string
}

export const WeakTopicCard: React.FC<WeakTopicCardProps> = ({ topic, mistakes, recommendation }) => {
  return (
    <div className="group bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-red-900">{topic}</h4>
            <div className="inline-flex items-center px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
              {mistakes} {mistakes === 1 ? "ошибка" : "ошибок"}
            </div>
          </div>
          <p className="text-sm text-red-700 leading-relaxed">{recommendation}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
      </div>
    </div>
  )
}
