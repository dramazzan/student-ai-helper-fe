"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, BookOpen, TrendingUp, Play, History, Award } from "lucide-react"
import { getTestProgressByTestId } from "@/services/testService"
import { TestTabsProps } from "@/models/Test"

const NormalTestList: React.FC<TestTabsProps> = ({ normalTests }) => {
  const router = useRouter()
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      const newProgressMap: Record<string, number> = {}
      await Promise.all(
        normalTests.map(async (test) => {
          try {
            const data = await getTestProgressByTestId(test._id)
            const best = Math.max(...data.attempts.map((a: { percentage: number }) => a.percentage))
            newProgressMap[test._id] = best
          } catch {
            newProgressMap[test._id] = 0
          }
        }),
      )
      setProgressMap(newProgressMap)
      setIsLoading(false)
    }
    loadProgress()
  }, [normalTests])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "легкий":
      case "easy":
        return "text-emerald-600 bg-emerald-50"
      case "средний":
      case "medium":
        return "text-amber-600 bg-amber-50"
      case "сложный":
      case "hard":
        return "text-red-600 bg-red-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-700 bg-emerald-100 border-emerald-200"
    if (percentage >= 60) return "text-amber-700 bg-amber-100 border-amber-200"
    if (percentage >= 40) return "text-orange-700 bg-orange-100 border-orange-200"
    return "text-red-700 bg-red-100 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-7 bg-slate-200 rounded w-48 animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-4 bg-slate-200 rounded w-28" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-slate-200 rounded-lg w-24" />
                <div className="h-9 bg-slate-200 rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!normalTests.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Нет доступных тестов</h3>
        <p className="text-slate-500">Тесты появятся здесь, когда они будут добавлены</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Обычные тесты</h2>
      </div>

      <div className="grid gap-4">
        {normalTests.map((test) => {
          const bestScore = progressMap[test._id]
          const hasProgress = bestScore > 0

          return (
            <div
              key={test._id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 leading-tight">{test.title}</h3>
                      {hasProgress && (
                        <div className="flex-shrink-0">
                          <Award className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{test.questionCount} вопросов</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div
                          className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(test.difficulty)}`}
                        >
                          {test.difficulty || "не указано"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(test.createdAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>

                    {hasProgress && (
                      <div className="mt-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getScoreColor(bestScore)}`}
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>Лучший результат: {bestScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <button
                      onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Play className="w-4 h-4" />
                      Пройти тест
                    </button>

                    {hasProgress && (
                      <button
                        onClick={() => router.push(`/main/tests/history/${test._id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        <History className="w-4 h-4" />
                        История
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {hasProgress && (
                <div className="px-6 pb-6">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${bestScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NormalTestList
