"use client"

import type React from "react"
import { useEffect } from "react"
import { CheckCircle, XCircle, Sparkles } from "lucide-react"
import type { Notification } from "@/models/Notification"

interface NotificationToastProps {
  notification: Notification
  onClose: (id: string) => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [notification.id, onClose])

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-emerald-50 border-emerald-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl border shadow-lg ${getBgColor()} animate-in slide-in-from-top-2 duration-300`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm">{notification.title}</h4>
          <p className="text-slate-600 text-sm mt-1">{notification.message}</p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
