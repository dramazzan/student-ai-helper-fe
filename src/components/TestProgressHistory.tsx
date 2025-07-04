"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  History,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  Target,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { getTestProgressByTestId } from "@/services/testService"

interface AnswerDetail {
  question: string
  options: string[]
  selectedAnswerIndex: number
  selectedAnswerText: string
  correctAnswerIndex: number
  correctAnswerText: string
  isCorrect: boolean
}

interface Attempt {
  resultId: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  details: AnswerDetail[]
}

interface TestProgress {
  testTitle: string
  attempts: Attempt[]
  testId: string
}

const TestProgressHistory = () => {
  const { testId } = useParams() as { testId: string }
  const router = useRouter()
  const [progress, setProgress] = useState<TestProgress | null>(null)
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getTestProgressByTestId(testId)
        setProgress(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки")
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [testId])

  const toggleQuestionExpansion = (index: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQuestions(newExpanded)
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

  const getBestAttempt = () => {
    if (!progress?.attempts.length) return null
    return progress.attempts.reduce((best, current) => (current.percentage > best.percentage ? current : best))
  }

  const getAverageScore = () => {
    if (!progress?.attempts.length) return 0
    const sum = progress.attempts.reduce((acc, attempt) => acc + attempt.percentage, 0)
    return Math.round(sum / progress.attempts.length)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-center justify-center gap-3 text-blue-600 mb-6">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Загрузка истории...</span>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl">
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-32" />
                    <div className="h-4 bg-slate-200 rounded w-48" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-5 bg-slate-200 rounded w-20" />
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !progress) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Результаты не найдены</h2>
          <p className="text-amber-700 mb-6">
            Возможно, вы ещё не проходили этот тест или произошла ошибка при загрузке данных.
          </p>
          <button
            onClick={() => router.push("/main/tests")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Вернуться к тестам
          </button>
        </div>
      </div>
    )
  }

  const reversedAttempts = [...progress.attempts].reverse()
  const bestAttempt = getBestAttempt()
  const averageScore = getAverageScore()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{progress.testTitle}</h1>
              <p className="text-slate-600">История прохождения теста</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Всего попыток</p>
                  <p className="text-xl font-semibold text-slate-900">{progress.attempts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Лучший результат</p>
                  <p className="text-xl font-semibold text-slate-900">{bestAttempt?.percentage || 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Средний балл</p>
                  <p className="text-xl font-semibold text-slate-900">{averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attempts List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Все попытки</h2>
        </div>

        <div className="p-6 space-y-4">
          {reversedAttempts.map((attempt, index) => {
            const isActive = selectedAttempt?.resultId === attempt.resultId
            const attemptNumber = reversedAttempts.length - index
            const isBest = bestAttempt?.resultId === attempt.resultId

            return (
              <div
                key={attempt.resultId}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "border-purple-300 bg-purple-50 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedAttempt(isActive ? null : attempt)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                        isBest ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      #{attemptNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">Попытка #{attemptNumber}</p>
                        {isBest && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            <Award className="w-3 h-3" />
                            Лучшая
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(attempt.completedAt).toLocaleString("ru-RU")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {attempt.score}/{attempt.totalQuestions}
                      </p>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${getScoreColor(attempt.percentage)}`}
                      >
                        {attempt.percentage}%
                      </div>
                    </div>
                    <div className="w-5 h-5 text-slate-400">{isActive ? <ChevronDown /> : <ChevronRight />}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getProgressColor(attempt.percentage)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${attempt.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Results */}
      {selectedAttempt && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Детальные результаты</h3>
              <button
                onClick={() => router.push(`/main/tests/passing/${progress.testId || testId}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RotateCcw className="w-4 h-4" />
                Пройти снова
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {selectedAttempt.details.map((detail, idx) => {
              const isExpanded = expandedQuestions.has(idx)

              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleQuestionExpansion(idx)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                            detail.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {detail.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 leading-relaxed">{detail.question}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                detail.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {detail.isCorrect ? "Правильно" : "Неправильно"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-5 h-5 text-slate-400 flex-shrink-0">
                        {isExpanded ? <ChevronDown /> : <ChevronRight />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50">
                      <div className="space-y-3">
                        {detail.options.map((opt, i) => {
                          const isSelected = i === detail.selectedAnswerIndex
                          const isCorrect = i === detail.correctAnswerIndex

                          return (
                            <div
                              key={i}
                              className={`flex items-start gap-3 p-3 rounded-lg ${
                                isCorrect
                                  ? "bg-emerald-100 border border-emerald-200"
                                  : isSelected && !isCorrect
                                    ? "bg-red-100 border border-red-200"
                                    : "bg-white border border-slate-200"
                              }`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {isCorrect ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                ) : isSelected ? (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                                )}
                              </div>
                              <div className="flex-1">
                                <span
                                  className={`${
                                    isCorrect
                                      ? "text-emerald-900 font-medium"
                                      : isSelected && !isCorrect
                                        ? "text-red-900"
                                        : "text-slate-700"
                                  }`}
                                >
                                  {opt}
                                </span>
                                {isCorrect && (
                                  <span className="ml-2 text-xs text-emerald-600 font-medium">(Правильный ответ)</span>
                                )}
                                {isSelected && !isCorrect && (
                                  <span className="ml-2 text-xs text-red-600 font-medium">(Ваш ответ)</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TestProgressHistory
