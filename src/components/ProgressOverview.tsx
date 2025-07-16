"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  LineChart,
  AlertTriangle,
  FolderDown,
  Lightbulb,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  ChevronRight,
  Zap,
  Brain,
  Settings,
  Hash,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import type { ProgressData } from "@/models/Progress"
import { generateTestsFromWeakTopics } from "@/services/testService/generationService"

// Типы для уведомлений
interface Notification {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}

// Компонент уведомления
const NotificationToast: React.FC<{
  notification: Notification
  onClose: (id: string) => void
}> = ({ notification, onClose }) => {
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

// Компонент формы генерации тестов
const TestGenerationForm: React.FC<{
  weakTopicsCount: number
  onNotification: (notification: Omit<Notification, "id">) => void
}> = ({ weakTopicsCount, onNotification }) => {
  const [options, setOptions] = useState({
    difficulty: "medium",
    questionCount: 5,
    questionType: "тест с выбором",
    testType: "normal",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (options.questionCount < 1 || options.questionCount > 20) {
      newErrors.questionCount = "Количество вопросов должно быть от 1 до 20"
    }

    if (weakTopicsCount === 0) {
      newErrors.general = "Нет слабых тем для генерации тестов"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    try {
      const res = await generateTestsFromWeakTopics(options)
      console.log("Сгенерировано тестов:", res)

      onNotification({
        type: "success",
        title: "Тесты успешно созданы!",
        message: `Создано ${res.testsCount || 1} тест${res.testsCount === 1 ? "" : "ов"} по вашим слабым темам. Вы можете найти их в разделе "Обычные тесты".`,
      })
    } catch (err: any) {
      console.error("Ошибка генерации:", err)
      onNotification({
        type: "error",
        title: "Ошибка при создании тестов",
        message: err.message || "Произошла ошибка при генерации тестов. Попробуйте еще раз или обратитесь в поддержку.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const difficultyOptions = [
    { value: "easy", label: "Лёгкий", description: "Базовые вопросы", color: "text-emerald-600" },
    { value: "medium", label: "Средний", description: "Стандартная сложность", color: "text-amber-600" },
    { value: "hard", label: "Сложный", description: "Продвинутые вопросы", color: "text-red-600" },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Создать персональный тест</h3>
          <p className="text-sm text-slate-600">Автоматическая генерация на основе ваших слабых тем</p>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Сложность */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <Settings className="w-4 h-4 inline mr-2" />
            Уровень сложности
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setOptions({ ...options, difficulty: option.value })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  options.difficulty === option.value
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className={`font-semibold ${option.color}`}>{option.label}</div>
                <div className="text-xs text-slate-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Количество вопросов */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <Hash className="w-4 h-4 inline mr-2" />
            Количество вопросов
          </label>
          <div className="relative">
            <input
              type="number"
              value={options.questionCount}
              onChange={(e) =>
                setOptions({
                  ...options,
                  questionCount: Number.parseInt(e.target.value) || 1,
                })
              }
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.questionCount ? "border-red-300" : "border-slate-200"
              }`}
              min={1}
              max={20}
              placeholder="Введите количество вопросов"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <span className="text-sm">1-20</span>
            </div>
          </div>
          {errors.questionCount && <p className="text-sm text-red-600 mt-2">{errors.questionCount}</p>}
          <p className="text-xs text-slate-500 mt-2">Рекомендуем 5-10 вопросов для эффективного изучения</p>
        </div>

        {/* Статистика */}
        <div className="bg-white/60 rounded-xl p-4 border border-white/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Слабых тем найдено:</span>
            <span className="font-semibold text-slate-900">{weakTopicsCount}</span>
          </div>
        </div>

        {/* Кнопка генерации */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || weakTopicsCount === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Создаём тесты...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Создать персональный тест
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const ProgressOverview = ({
  data,
  isLoading = false,
}: {
  data?: ProgressData
  isLoading?: boolean
}) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-600"
    if (score >= 60) return "from-amber-500 to-amber-600"
    if (score >= 40) return "from-orange-500 to-orange-600"
    return "from-red-500 to-red-600"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-700"
    if (score >= 60) return "text-amber-700"
    if (score >= 40) return "text-orange-700"
    return "text-red-700"
  }

  const CircularProgress = ({ percentage, size = 80, strokeWidth = 8 }: any) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={`transition-all duration-1000 ease-out ${getScoreTextColor(percentage)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getScoreTextColor(percentage)}`}>{percentage}%</span>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-7 bg-slate-200 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                    <div className="w-16 h-8 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Уведомления */}
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onClose={removeNotification} />
      ))}

      <div className="space-y-6">
        {/* Основная статистика */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Учебный прогресс</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">{animatedValues.totalTests}</div>
                    <div className="text-xs text-blue-600 font-medium">ТЕСТОВ</div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 font-medium">Всего тестов пройдено</p>
              </div>

              <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreTextColor(animatedValues.averageScore)}`}>
                      {animatedValues.averageScore}%
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">СРЕДНИЙ</div>
                  </div>
                </div>
                <p className="text-sm text-emerald-700 font-medium">Средний балл</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CircularProgress percentage={animatedValues.progress} size={60} strokeWidth={6} />
                </div>
                <p className="text-sm text-purple-700 font-medium">Общий прогресс</p>
              </div>
            </div>
          </div>
        </div>

        {/* Слабые темы */}
        {Array.isArray(data.weakTopics) && data.weakTopics.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Слабые темы</h3>
                <div className="ml-auto text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {data.weakTopics.length} {data.weakTopics.length === 1 ? "тема" : "тем"}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {data.weakTopics.map((topic, i) => (
                <div
                  key={i}
                  className="group bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-red-900">{topic.topic}</h4>
                        <div className="inline-flex items-center px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                          {topic.mistakes} {topic.mistakes === 1 ? "ошибка" : "ошибок"}
                        </div>
                      </div>
                      <p className="text-sm text-red-700 leading-relaxed">{topic.recommendation}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Форма генерации тестов */}
            <div className="p-6 border-t border-slate-100">
              <TestGenerationForm weakTopicsCount={data.weakTopics.length} onNotification={addNotification} />
            </div>
          </div>
        )}

        {/* Тесты с низкими баллами */}
        {Array.isArray(data.lowScoreTests) && data.lowScoreTests.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <FolderDown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Тесты с низкими баллами</h3>
                <div className="ml-auto text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {data.lowScoreTests.length} {data.lowScoreTests.length === 1 ? "тест" : "тестов"}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {data.lowScoreTests.map((test, i) => (
                <div
                  key={i}
                  className="group bg-orange-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-900">{test.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.date).toLocaleDateString("ru-RU")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-orange-900">
                        {Number.isFinite(test.score) && Number.isFinite(test.total)
                          ? `${test.score}/${test.total}`
                          : "—"}
                      </div>
                      <div className="text-xs text-orange-600">
                        {Number.isFinite(test.score) && Number.isFinite(test.total) && test.total > 0
                          ? `${Math.round((test.score / test.total) * 100)}%`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Мотивация */}
        {data.motivation && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Мотивация</h3>
                <p className="text-purple-100 leading-relaxed italic">{data.motivation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProgressOverview
