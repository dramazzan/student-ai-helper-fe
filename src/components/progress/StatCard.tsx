"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"
import { CircularProgress } from "./CircularProgess" // Corrected import path

interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: LucideIcon
  bgColor: string
  iconColor: string
  textColor: string
  type?: "number" | "percentage" | "progress"
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor,
  iconColor,
  textColor,
  type = "number",
}) => {
  const renderValue = () => {
    if (type === "progress") {
      return <CircularProgress percentage={Number(value)} size={60} strokeWidth={6} variant="narxoz" />
    }
    return (
      <div className="text-right">
        <div className={`text-2xl font-bold ${textColor}`}>
          {value}
          {type === "percentage" ? "%" : ""}
        </div>
        <div className={`text-xs font-medium ${iconColor.replace("bg-", "text-")}`}>{subtitle.toUpperCase()}</div>
      </div>
    )
  }
  return (
    <div className={`group ${bgColor} rounded-xl p-6 hover:shadow-md transition-all duration-200 border`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {renderValue()}
      </div>
      <p className={`text-sm font-medium ${textColor}`}>{title}</p>
    </div>
  )
}
