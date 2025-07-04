"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Play,
  History,
  Award,
  FileText,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { fetchTestsByModule, fetchModuleProgress, getTestProgressByTestId } from "@/services/testService"
import { Module, Test, ModuleListProps, TestProgressInfo } from "@/models/Test"


const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [progressLoading, setProgressLoading] = useState<Record<string, boolean>>({})
  const [testProgressMap, setTestProgressMap] = useState<Record<string, TestProgressInfo>>({})
  const router = useRouter()

  const handleModuleClick = async (moduleId: string) => {
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null)
      setTests([])
      return
    }

    setSelectedModuleId(moduleId)
    setLoading(true)

    try {
      const response = await fetchTestsByModule(moduleId)
      const fetchedTests = Array.isArray(response) ? response : []
      setTests(fetchedTests)

      const testProgresses: Record<string, TestProgressInfo> = {}
      await Promise.all(
        fetchedTests.map(async (test) => {
          try {
            const data = await getTestProgressByTestId(test._id)
            if (data.attempts && data.attempts.length > 0) {
              const best = data.attempts.reduce((max: any, attempt: any) =>
                attempt.percentage > max.percentage ? attempt : max,
              )
              testProgresses[test._id] = {
                score: best.score,
                percentage: best.percentage,
              }
            }
          } catch (e) {
            // игнорируем, если нет результатов
          }
        }),
      )
      setTestProgressMap(testProgresses)
    } catch (err) {
      console.error("Ошибка загрузки тестов:", err)
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadProgress = async () => {
      const loadingMap: Record<string, boolean> = {}
      modules.forEach((mod) => {
        loadingMap[mod._id] = true
      })
      setProgressLoading(loadingMap)

      try {
        const progressResults = await Promise.all(
          modules.map(async (mod) => {
            try {
              const progress = await fetchModuleProgress(mod._id)
              return { id: mod._id, progress }
            } catch (e) {
              return { id: mod._id, progress: 0 }
            }
          }),
        )

        const map: Record<string, number> = {}
        progressResults.forEach(({ id, progress }) => {
          map[id] = progress
        })
        setProgressMap(map)
      } finally {
        const doneMap: Record<string, boolean> = {}
        modules.forEach((mod) => {
          doneMap[mod._id] = false
        })
        setProgressLoading(doneMap)
      }
    }

    loadProgress()
  }, [modules])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "легкий":
      case "easy":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "средний":
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "сложный":
      case "hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-700 bg-emerald-100 border-emerald-200"
    if (percentage >= 60) return "text-amber-700 bg-amber-100 border-amber-200"
    if (percentage >= 40) return "text-orange-700 bg-orange-100 border-orange-200"
    return "text-red-700 bg-red-100 border-red-200"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-500 to-emerald-600"
    if (percentage >= 60) return "from-amber-500 to-amber-600"
    if (percentage >= 40) return "from-orange-500 to-orange-600"
    return "from-red-500 to-red-600"
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Нет доступных модулей</h3>
        <p className="text-slate-500">Модули появятся здесь, когда они будут добавлены</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Модули</h2>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const isExpanded = selectedModuleId === module._id
          const progress = progressMap[module._id] || 0
          const isProgressLoading = progressLoading[module._id]

          return (
            <div
              key={module._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300"
            >
              <div className="p-6 cursor-pointer select-none" onClick={() => handleModuleClick(module._id)}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 break-words">
                        {decodeURIComponent(module.originalFileName)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(module.createdAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 min-w-[140px]">
                    {isProgressLoading ? (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Загрузка...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Прогресс</span>
                          <span className="font-medium text-slate-900">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500 ease-out`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-6">
                    {loading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Загрузка тестов...</span>
                        </div>
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="h-5 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                              </div>
                              <div className="flex gap-2">
                                <div className="h-8 bg-slate-200 rounded w-20" />
                                <div className="h-8 bg-slate-200 rounded w-16" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : Array.isArray(tests) && tests.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Нет тестов для этого модуля</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tests.map((test) => {
                          const progress = testProgressMap[test._id]
                          const hasProgress = !!progress

                          return (
                            <div
                              key={test._id}
                              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 mb-2">
                                    <h4 className="text-base font-semibold text-slate-900 leading-tight">
                                      {test.title}
                                    </h4>
                                    {hasProgress && <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-4 h-4" />
                                      <span>{test.questionCount} вопросов</span>
                                    </div>

                                    <div
                                      className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(test.difficulty)}`}
                                    >
                                      {test.difficulty}
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{new Date(test.createdAt).toLocaleDateString("ru-RU")}</span>
                                    </div>
                                  </div>

                                  {hasProgress && (
                                    <div
                                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getScoreColor(progress.percentage)}`}
                                    >
                                      <TrendingUp className="w-4 h-4" />
                                      <span>
                                        Лучший результат: {progress.score} ({progress.percentage}%)
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                                  >
                                    <Play className="w-4 h-4" />
                                    Пройти
                                  </button>

                                  {hasProgress && (
                                    <button
                                      onClick={() => router.push(`/main/tests/history/${test._id}`)}
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                                    >
                                      <History className="w-4 h-4" />
                                      История
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
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

export default ModuleList
