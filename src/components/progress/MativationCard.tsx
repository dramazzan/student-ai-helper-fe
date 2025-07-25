"use client"

import type React from "react"
import { Lightbulb } from "lucide-react"

interface MotivationCardProps {
  motivation: string
}

export const MotivationCard: React.FC<MotivationCardProps> = ({ motivation }) => {
  return (
    <div className="bg-gradient-to-r from-[#C8102E] to-[#B00020] rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Мотивация</h3>
          <p className="text-red-100 leading-relaxed italic">{motivation}</p>
        </div>
      </div>
    </div>
  )
}
