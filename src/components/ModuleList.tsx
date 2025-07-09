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
  ChevronUp,
} from "lucide-react"
import { fetchTestsByModule, fetchModuleProgress, getTestProgressByTestId } from "@/services/testService"
import type { ModuleListProps, TestProgressInfo } from "@/models/Test"

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [progressLoading, setProgressLoading] = useState<Record<string, boolean>>({})
  const [testProgressMap, setTestProgressMap] = useState<Record<string, TestProgressInfo>>({})
  const [openSummaries, setOpenSummaries] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const toggleSummary = (testId: string) => {
    setOpenSummaries((prev) => ({ ...prev, [testId]: !prev[testId] }))
  }

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
          } catch (e) {}
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
      modules.forEach((mod) => (loadingMap[mod._id] = true))
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
        modules.forEach((mod) => (doneMap[mod._id] = false))
        setProgressLoading(doneMap)
      }
    }
    loadProgress()
  }, [modules])

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600"
    if (percentage >= 60) return "text-amber-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500"
    if (percentage >= 60) return "bg-amber-500"
    if (percentage >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Нет модулей</h3>
        <p className="text-slate-500">Модули появятся здесь после загрузки</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Модули</h2>
        <p className="text-slate-600">Коллекции тестов по темам</p>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((module) => {
          const isExpanded = selectedModuleId === module._id
          const progress = progressMap[module._id] || 0
          const isProgressLoading = progressLoading[module._id]

          return (
            <div key={module._id} className="group">
              {/* Module Header */}
              <div
                className="flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50 rounded-lg px-4 -mx-4 transition-colors"
                onClick={() => handleModuleClick(module._id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {decodeURIComponent(module.originalFileName)}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(module.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-shrink-0 w-24">
                  {isProgressLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs">...</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{progress}%</div>
                      <div className="w-full h-1 bg-slate-200 rounded-full mt-1">
                        <div
                          className={`h-full ${getProgressColor(progress)} rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tests */}
              {isExpanded && (
                <div className="ml-9 mt-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center gap-2 text-slate-500 py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Загрузка тестов...</span>
                    </div>
                  ) : tests.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">Нет тестов в этом модуле</p>
                    </div>
                  ) : (
                    tests.map((test) => {
                      const testProgress = testProgressMap[test._id]
                      const isOpen = openSummaries[test._id]

                      return (
                        <div key={test._id} className="group/test">
                          {/* Test Header */}
                          <div className="flex items-start justify-between gap-4 py-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-slate-900">{test.title}</h4>
                                {testProgress && <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  {test.questionCount}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                  {test.difficulty}
                                </span>
                                <span>{new Date(test.createdAt).toLocaleDateString("ru-RU")}</span>
                              </div>

                              {testProgress && (
                                <div className="mt-2">
                                  <span
                                    className={`inline-flex items-center gap-1 text-sm font-medium ${getScoreColor(testProgress.percentage)}`}
                                  >
                                    <TrendingUp className="w-3 h-3" />
                                    {testProgress.percentage}%
                                  </span>
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

                              {testProgress && (
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
                            <div className="mt-3">
                              <button
                                onClick={() => toggleSummary(test._id)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <FileText className="w-3 h-3" />
                                {isOpen ? "Скрыть конспект" : "Показать конспект"}
                                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>

                              {isOpen && (
                                <div className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                  {test.summary}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Divider */}
                          {tests.indexOf(test) < tests.length - 1 && <div className="border-b border-slate-100 mt-4" />}
                        </div>
                      )
                    })
                  )}
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
