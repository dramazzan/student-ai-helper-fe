"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, BookOpen, TrendingUp, Play, History, Award, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { getTestProgressByTestId } from "@/services/testService"
import type { TestTabsProps } from "@/models/Test"

const NormalTestList: React.FC<TestTabsProps> = ({ normalTests }) => {
  const router = useRouter()
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [openSummaries, setOpenSummaries] = useState<Record<string, boolean>>({})

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

  const toggleSummary = (testId: string) => {
    setOpenSummaries((prev) => ({ ...prev, [testId]: !prev[testId] }))
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600"
    if (percentage >= 60) return "text-amber-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-6 bg-slate-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="py-6 animate-pulse">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                    <div className="h-4 bg-slate-200 rounded w-16" />
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 rounded w-20" />
                  <div className="h-8 bg-slate-200 rounded w-16" />
                </div>
              </div>
              <div className="h-1 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!normalTests.length) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Нет тестов</h3>
        <p className="text-slate-500">Тесты появятся здесь после создания</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Обычные тесты</h2>
        <p className="text-slate-600">Индивидуальные тесты по темам</p>
      </div>

      {/* Tests */}
      <div className="space-y-6">
        {normalTests.map((test, index) => {
          const bestScore = progressMap[test._id]
          const hasProgress = bestScore > 0
          const isSummaryOpen = openSummaries[test._id] || false

          return (
            <div key={test._id} className="group">
              {/* Test Header */}
              <div className="flex items-start justify-between gap-6 py-4 hover:bg-slate-50 rounded-lg px-4 -mx-4 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-slate-900 leading-tight">{test.title}</h3>
                    {hasProgress && <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {test.questionCount}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      {test.difficulty || "средний"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(test.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>

                  {hasProgress && (
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${getScoreColor(bestScore)}`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {bestScore}%
                      </span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {hasProgress && (
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${bestScore}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Пройти
                  </button>

                  {hasProgress && (
                    <button
                      onClick={() => router.push(`/main/tests/history/${test._id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                    >
                      <History className="w-3 h-3" />
                      История
                    </button>
                  )}
                </div>
              </div>

              {/* Summary */}
              {test.summary && (
                <div className="ml-4 mt-2">
                  <button
                    onClick={() => toggleSummary(test._id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    {isSummaryOpen ? "Скрыть конспект" : "Показать конспект"}
                    {isSummaryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isSummaryOpen && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {test.summary}
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              {index < normalTests.length - 1 && <div className="border-b border-slate-100 mt-6" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NormalTestList
