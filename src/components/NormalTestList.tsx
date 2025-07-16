"use client"

import React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  BookOpen,
  TrendingUp,
  Play,
  History,
  Award,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import { getTestProgressByTestId } from "@/services/testService/passingService"
import type { TestTabsProps } from "@/models/Test"

// Типы для лучшей типизации
interface TestProgress {
  [testId: string]: number
}

interface TestSummaryState {
  [testId: string]: boolean
}

interface TestProgressData {
  attempts: Array<{ percentage: number }>
}

// Компонент прогресс-бара
const ProgressBar: React.FC<{ percentage: number }> = React.memo(({ percentage }) => (
  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
    <div
      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out"
      style={{ width: `${percentage}%` }}
    />
  </div>
))

ProgressBar.displayName = "ProgressBar"

// Компонент для отображения счета
const ScoreDisplay: React.FC<{ score: number }> = React.memo(({ score }) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600 bg-emerald-50"
    if (percentage >= 60) return "text-amber-600 bg-amber-50"
    if (percentage >= 40) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md ${getScoreColor(score)}`}
    >
      <TrendingUp className="w-3.5 h-3.5" />
      {score}%
    </span>
  )
})

ScoreDisplay.displayName = "ScoreDisplay"

// Компонент действий с тестом
const TestActions: React.FC<{
  testId: string
  hasProgress: boolean
  onStartTest: (testId: string) => void
  onViewHistory: (testId: string) => void
}> = React.memo(({ testId, hasProgress, onStartTest, onViewHistory }) => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <button
      onClick={() => onStartTest(testId)}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Play className="w-3.5 h-3.5" />
      Пройти
    </button>
    {hasProgress && (
      <button
        onClick={() => onViewHistory(testId)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        <History className="w-3.5 h-3.5" />
        История
      </button>
    )}
  </div>
))

TestActions.displayName = "TestActions"

// Компонент метаданных теста
const TestMetadata: React.FC<{
  questionCount: number
  difficulty?: string
  createdAt: string
  sourceType?: string
}> = React.memo(({ questionCount, difficulty, createdAt, sourceType }) => {
  const formatDate = useMemo(() => new Date(createdAt).toLocaleDateString("ru-RU"), [createdAt])

  const getSourceTypeLabel = (type?: string) => {
    switch (type) {
      case "file":
        return "из файла"
      case "url":
        return "из URL"
      case "weak-topic":
        return "по слабым темам"  
      default:
        return "другое"
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm text-slate-500">
      <span className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" />
        {questionCount} вопросов
      </span>
      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
        {difficulty || "средний"}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        {formatDate}
      </span>
      {sourceType && (
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {getSourceTypeLabel(sourceType)}
        </span>
      )}
    </div>
  )
})

TestMetadata.displayName = "TestMetadata"

// Компонент карточки теста
const TestCard: React.FC<{
  test: any
  progress: number
  isLastItem: boolean
  isSummaryOpen: boolean
  onToggleSummary: (testId: string) => void
  onStartTest: (testId: string) => void
  onViewHistory: (testId: string) => void
}> = React.memo(({ test, progress, isLastItem, isSummaryOpen, onToggleSummary, onStartTest, onViewHistory }) => {
  const hasProgress = progress > 0

  return (
    <div className="group">
      <div className="flex items-start justify-between gap-6 py-6 hover:bg-slate-50/80 rounded-xl px-6 -mx-6 transition-all duration-200">
        <div className="flex-1 min-w-0 space-y-4">
          {/* Заголовок и бейдж достижения */}
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900 leading-tight text-lg group-hover:text-blue-700 transition-colors">
              {test.title}
            </h3>
            {hasProgress && <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />}
          </div>

          {/* Метаданные */}
          <TestMetadata
            questionCount={test.questionCount}
            difficulty={test.difficulty}
            createdAt={test.createdAt}
            sourceType={test.sourceType}
          />

          {/* Прогресс */}
          {hasProgress && (
            <div className="space-y-2">
              <ScoreDisplay score={progress} />
              <ProgressBar percentage={progress} />
            </div>
          )}
        </div>

        {/* Действия */}
        <TestActions
          testId={test._id}
          hasProgress={hasProgress}
          onStartTest={onStartTest}
          onViewHistory={onViewHistory}
        />
      </div>

      {/* Конспект */}
      {test.summary && (
        <div className="ml-6 mt-2">
          <button
            onClick={() => onToggleSummary(test._id)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-expanded={isSummaryOpen}
          >
            <FileText className="w-3.5 h-3.5" />
            {isSummaryOpen ? "Скрыть конспект" : "Показать конспект"}
            {isSummaryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {isSummaryOpen && (
            <div className="mt-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-200 animate-in slide-in-from-top-2 duration-200">
              {test.summary}
            </div>
          )}
        </div>
      )}

      {/* Разделитель */}
      {!isLastItem && <div className="border-b border-slate-100 mt-8" />}
    </div>
  )
})

TestCard.displayName = "TestCard"

// Компонент скелетона загрузки
const TestSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
      <div className="h-5 bg-slate-200 rounded w-64 animate-pulse" />
    </div>
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="py-6 animate-pulse">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
              <div className="flex gap-4">
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-4 bg-slate-200 rounded w-28" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-2 bg-slate-200 rounded w-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 bg-slate-200 rounded-lg w-20" />
              <div className="h-9 bg-slate-200 rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Компонент пустого состояния
const EmptyState: React.FC = () => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <BookOpen className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-3">Нет тестов</h3>
    <p className="text-slate-500 max-w-sm mx-auto">
      Тесты появятся здесь после создания. Создайте свой первый тест, чтобы начать обучение.
    </p>
  </div>
)

// Компонент ошибки
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-3">Ошибка загрузки</h3>
    <p className="text-slate-500 max-w-sm mx-auto mb-6">Не удалось загрузить прогресс тестов. Попробуйте еще раз.</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      Попробовать снова
    </button>
  </div>
)

// Основной компонент
const NormalTestList: React.FC<TestTabsProps> = ({ normalTests }) => {
  const router = useRouter()
  const [progressMap, setProgressMap] = useState<TestProgress>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSummaries, setOpenSummaries] = useState<TestSummaryState>({})

  // Мемоизированные обработчики
  const handleStartTest = useCallback(
    (testId: string) => {
      router.push(`/main/tests/passing/${testId}`)
    },
    [router],
  )

  const handleViewHistory = useCallback(
    (testId: string) => {
      router.push(`/main/tests/history/${testId}`)
    },
    [router],
  )

  const handleToggleSummary = useCallback((testId: string) => {
    setOpenSummaries((prev) => ({ ...prev, [testId]: !prev[testId] }))
  }, [])

  const loadProgress = useCallback(async () => {
    if (!normalTests.length) return

    setIsLoading(true)
    setError(null)

    try {
      const progressPromises = normalTests.map(async (test) => {
        try {
          const data: TestProgressData = await getTestProgressByTestId(test._id)
          const bestScore = data.attempts.length > 0 ? Math.max(...data.attempts.map((a) => a.percentage)) : 0
          return { testId: test._id, score: bestScore }
        } catch {
          return { testId: test._id, score: 0 }
        }
      })

      const results = await Promise.all(progressPromises)
      const newProgressMap = results.reduce((acc, { testId, score }) => {
        acc[testId] = score
        return acc
      }, {} as TestProgress)

      setProgressMap(newProgressMap)
    } catch (err) {
      setError("Не удалось загрузить прогресс тестов")
      console.error("Error loading test progress:", err)
    } finally {
      setIsLoading(false)
    }
  }, [normalTests])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  // Мемоизированные вычисления
  const sortedTests = useMemo(() => {
    return [...normalTests].sort((a, b) => {
      const aProgress = progressMap[a._id] || 0
      const bProgress = progressMap[b._id] || 0
      // Сначала тесты с прогрессом, потом по дате создания
      if (aProgress > 0 && bProgress === 0) return -1
      if (aProgress === 0 && bProgress > 0) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [normalTests, progressMap])

  if (error) {
    return <ErrorState onRetry={loadProgress} />
  }

  if (isLoading) {
    return <TestSkeleton />
  }

  if (!normalTests.length) {
    return <EmptyState />
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Обычные тесты</h2>
        <p className="text-slate-600 text-lg">Индивидуальные тесты по темам для углубленного изучения</p>
      </div>

      {/* Список тестов */}
      <div className="space-y-6">
        {sortedTests.map((test, index) => (
          <TestCard
            key={test._id}
            test={test}
            progress={progressMap[test._id] || 0}
            isLastItem={index === sortedTests.length - 1}
            isSummaryOpen={openSummaries[test._id] || false}
            onToggleSummary={handleToggleSummary}
            onStartTest={handleStartTest}
            onViewHistory={handleViewHistory}
          />
        ))}
      </div>
    </div>
  )
}

export default NormalTestList
