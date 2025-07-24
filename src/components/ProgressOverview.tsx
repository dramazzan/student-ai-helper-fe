"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LineChart, AlertTriangle, FolderDown, BookOpen, Target, TrendingUp } from "lucide-react"
import type { ProgressData } from "@/models/Progress"
import { NotificationToast } from "./NotificationToast"
import { StatCard } from "./progress/StatCard"
import { WeakTopicCard } from "./progress/WeakTopicCard"
import { LowScoreTestCard } from "./progress/LowScoreTestCard"
import { MotivationCard } from "./progress/MativationCard"
import { TestGenerationForm } from "./progress/TestGenerationForm"
import { LoadingSkeleton } from "./progress/LoadingSkeleton"
import type { Notification } from "@/models/Notification"

interface ProgressOverviewProps {
  data?: ProgressData
  isLoading?: boolean
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ data, isLoading = false }) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalTests: 0,
    averageScore: 0,
    progress: 0,
  })
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  useEffect(() => {
    if (data && !isLoading) {
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        setAnimatedValues({
          totalTests: Math.round(data.totalTestsTaken * progress),
          averageScore: Math.round(data.averageScore * progress),
          progress: Math.round(data.progressPercent * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedValues({
            totalTests: data.totalTestsTaken,
            averageScore: data.averageScore,
            progress: data.progressPercent,
          })
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [data, isLoading])

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-900"
    if (score >= 60) return "text-amber-900"
    if (score >= 40) return "text-orange-900"
    return "text-red-900"
  }

  if (isLoading || !data) {
    return <LoadingSkeleton />
  }

  return (
    <>
      {/* Уведомления */}
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onClose={removeNotification} />
      ))}

      <div className="space-y-6">
        {/* Основная статистика */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
          <div className="p-6 border-b border-[#E0E0E0]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#C8102E] to-[#B00020] rounded-lg flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-black">Учебный прогресс</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard
                title="Всего тестов пройдено"
                value={animatedValues.totalTests}
                subtitle="ТЕСТОВ"
                icon={BookOpen}
                bgColor="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                iconColor="bg-[#C8102E]"
                textColor="text-[#B00020]"
                type="number"
              />
              <StatCard
                title="Средний балл"
                value={animatedValues.averageScore}
                subtitle="СРЕДНИЙ"
                icon={Target}
                bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                iconColor="bg-emerald-500"
                textColor={getScoreTextColor(animatedValues.averageScore)}
                type="percentage"
              />
              <StatCard
                title="Общий прогресс"
                value={animatedValues.progress}
                subtitle=""
                icon={TrendingUp}
                bgColor="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                iconColor="bg-[#B00020]"
                textColor="text-[#C8102E]"
                type="progress"
              />
            </div>
          </div>
        </div>

        {/* Слабые темы */}
        {Array.isArray(data.weakTopics) && data.weakTopics.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black">Слабые темы</h3>
                <div className="ml-auto text-sm text-[#666666] bg-gray-100 px-3 py-1 rounded-full">
                  {data.weakTopics.length} {data.weakTopics.length === 1 ? "тема" : "тем"}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {data.weakTopics.map((topic, i) => (
                <WeakTopicCard
                  key={i}
                  topic={topic.topic}
                  mistakes={topic.mistakes}
                  recommendation={topic.recommendation}
                />
              ))}
            </div>
            {/* Форма генерации тестов */}
            <div className="p-6 border-t border-[#E0E0E0]">
              <TestGenerationForm weakTopicsCount={data.weakTopics.length} onNotification={addNotification} />
            </div>
          </div>
        )}

        {/* Тесты с низкими баллами */}
        {Array.isArray(data.lowScoreTests) && data.lowScoreTests.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <FolderDown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black">Тесты с низкими баллами</h3>
                <div className="ml-auto text-sm text-[#666666] bg-gray-100 px-3 py-1 rounded-full">
                  {data.lowScoreTests.length} {data.lowScoreTests.length === 1 ? "тест" : "тестов"}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {data.lowScoreTests.map((test, i) => (
                <LowScoreTestCard key={i} title={test.title} date={test.date} score={test.score} total={test.total} />
              ))}
            </div>
          </div>
        )}

        {/* Мотивация */}
        {data.motivation && <MotivationCard motivation={data.motivation} />}
      </div>
    </>
  )
}

export default ProgressOverview
