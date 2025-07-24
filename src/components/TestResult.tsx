"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Trophy,
  CheckCircle,
  XCircle,
  Target,
  RotateCcw,
  History,
  Share2,
  Award,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { getTestResult } from "@/services/testService/passingService"
import type { TestResultData } from "@/models/Test"

const TestResult = () => {
  const { resultId } = useParams() as { resultId: string }
  const router = useRouter()
  const [result, setResult] = useState<TestResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getTestResult(resultId)
        setResult(data)
        // Показать конфетти для отличных результатов
        if (data.percentage >= 80) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } catch (err: any) {
        setError("Ошибка при загрузке результата")
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [resultId])

  // Анимация счетчиков
  useEffect(() => {
    if (result && !loading) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        // Easing function
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
        const easedProgress = easeOutCubic(progress)

        setAnimatedScore(Math.round(result.score * easedProgress))
        setAnimatedPercentage(Math.round(result.percentage * easedProgress))

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedScore(result.score)
          setAnimatedPercentage(result.percentage)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [result, loading])

  const getResultConfig = (percentage: number) => {
    if (percentage >= 80) {
      return {
        color: "emerald",
        gradient: "from-emerald-500 to-emerald-600",
        bg: "from-emerald-50 to-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: Trophy,
        title: "Отличный результат!",
        message: "Поздравляем! Вы показали превосходные знания.",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      }
    } else if (percentage >= 60) {
      return {
        color: "amber",
        gradient: "from-amber-500 to-amber-600",
        bg: "from-amber-50 to-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Target,
        title: "Хороший результат",
        message: "Неплохо! Есть небольшие области для улучшения.",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
      }
    } else if (percentage >= 40) {
      return {
        color: "orange",
        gradient: "from-orange-500 to-orange-600",
        bg: "from-orange-50 to-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: TrendingUp,
        title: "Есть над чем работать",
        message: "Продолжайте изучать материал и практиковаться.",
        badge: "bg-orange-100 text-orange-700 border-orange-200",
      }
    } else {
      return {
        color: "red",
        gradient: "from-red-500 to-red-600",
        bg: "from-red-50 to-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: RotateCcw,
        title: "Нужно больше практики",
        message: "Рекомендуем повторить материал и попробовать снова.",
        badge: "bg-red-100 text-red-700 border-red-200",
      }
    }
  }

  const CircularProgress = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
    const config = getResultConfig(percentage)

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-[#E0E0E0]" // Narxoz border color
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={`transition-all duration-2000 ease-out ${config.text}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${config.text}`}>{percentage}%</div>
            <div className="text-xs text-[#666666]">результат</div> {/* Narxoz secondary text color */}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg p-8">
          {" "}
          {/* Narxoz border color */}
          <div className="flex items-center justify-center gap-3 text-[#C8102E] mb-6">
            {" "}
            {/* Narxoz primary color */}
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Загрузка результата...</span>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Ошибка загрузки</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/main/tests")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8102E] hover:bg-[#B00020] text-white rounded-lg transition-colors"
          >
            {" "}
            {/* Narxoz primary/accent colors */}
            <RotateCcw className="w-4 h-4" />
            Вернуться к тестам
          </button>
        </div>
      </div>
    )
  }

  const config = getResultConfig(animatedPercentage)
  const ResultIcon = config.icon
  const correctAnswers = result.details.filter((d) => d.isCorrect).length
  const incorrectAnswers = result.details.filter((d) => !d.isCorrect).length

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
        {" "}
        {/* Narxoz border color */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <ResultIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{result.testTitle}</h1>
                <p className="text-white text-opacity-90">{config.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {animatedScore}/{result.total}
              </div>
              <div className="text-white text-opacity-90">правильных ответов</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Circle */}
            <div className="flex flex-col items-center justify-center">
              <CircularProgress percentage={animatedPercentage} />
              <p className="text-[#666666] text-center mt-4 max-w-xs">{config.message}</p>{" "}
              {/* Narxoz secondary text color */}
            </div>
            {/* Stats */}
            <div className="space-y-4">
              <div className={`bg-gradient-to-br ${config.bg} rounded-xl p-4 border ${config.border}`}>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{correctAnswers}</div>
                    <div className="text-sm text-emerald-600">Правильных ответов</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-700">{incorrectAnswers}</div>
                    <div className="text-sm text-red-600">Неправильных ответов</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-[#E0E0E0]">
                {" "}
                {/* Narxoz neutral colors */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-[#666666]" /> {/* Narxoz secondary text color */}
                  <div>
                    <div className="text-sm font-medium text-black">
                      {new Date(result.completedAt).toLocaleDateString("ru-RU")}
                    </div>{" "}
                    {/* Narxoz primary text color */}
                    <div className="text-sm text-[#666666]">
                      {new Date(result.completedAt).toLocaleTimeString("ru-RU")}
                    </div>{" "}
                    {/* Narxoz secondary text color */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
        {" "}
        {/* Narxoz border color */}
        <div className="p-6 border-b border-[#E0E0E0]">
          {" "}
          {/* Narxoz border color */}
          <h2 className="text-lg font-semibold text-black">Детальный разбор ответов</h2>{" "}
          {/* Narxoz primary text color */}
        </div>
        <div className="p-6 space-y-4">
          {result.details.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                item.isCorrect
                  ? "border-emerald-200 bg-emerald-50 hover:shadow-md"
                  : "border-red-200 bg-red-50 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.isCorrect ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  {item.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-2">
                    {index + 1}. {item.question}
                  </h3>{" "}
                  {/* Narxoz primary text color */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      item.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isCorrect ? "Правильно" : "Неправильно"}
                  </div>
                  {!item.isCorrect && (
                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700">Ваш ответ: Вариант {item.selected + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700">Правильный ответ: Вариант {item.correct + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg p-6">
        {" "}
        {/* Narxoz border color */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => router.push(`/main/tests/passing/${result.testId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#B00020] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
          >
            {" "}
            {/* Narxoz primary/accent colors */}
            <RotateCcw className="w-5 h-5" />
            Пройти снова
          </button>
          <button
            onClick={() => router.push(`/main/tests/history/${result.testId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#666666] font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {" "}
            {/* Narxoz neutral colors */}
            <History className="w-5 h-5" />
            История тестов
          </button>
          {animatedPercentage >= 80 && (
            <button
              onClick={() => {
                // Логика для шеринга или скачивания сертификата
                alert("Поздравляем с отличным результатом!")
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {" "}
              {/* Kept emerald for success action */}
              <Award className="w-5 h-5" />
              Получить сертификат
            </button>
          )}
          <button
            onClick={() => {
              // Логика для шеринга результата
              if (navigator.share) {
                navigator.share({
                  title: `Результат теста: ${result.testTitle}`,
                  text: `Я набрал ${result.percentage}% в тесте "${result.testTitle}"!`,
                })
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#B00020] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
          >
            {" "}
            {/* Narxoz primary/accent colors */}
            <Share2 className="w-5 h-5" />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestResult
