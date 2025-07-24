"use client"

import React from "react"
import { useEffect, useState, useMemo, useCallback } from "react"
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
  AlertCircle,
  FolderOpen,
} from "lucide-react"
import { fetchTestsByModule } from "@/services/testService/fetchService"
import { fetchModuleProgress, getTestProgressByTestId } from "@/services/testService/passingService"
import type { ModuleListProps, TestProgressInfo } from "@/models/Test"

// Улучшенные типы
interface ModuleProgress {
  [moduleId: string]: number
}

interface TestProgressMap {
  [testId: string]: TestProgressInfo
}

interface LoadingState {
  [moduleId: string]: boolean
}

interface SummaryState {
  [testId: string]: boolean
}

interface ModuleTestCount {
  [moduleId: string]: number
}

interface ModuleTest {
  _id: string
  title: string
  questionCount: number
  difficulty: string
  createdAt: string
  sourceType?: string
  summary?: string
}

// Компонент индикатора прогресса
const ProgressIndicator: React.FC<{
  progress: number
  isLoading: boolean
  size?: "sm" | "md"
}> = React.memo(({ progress, isLoading, size = "md" }) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-gradient-to-r from-emerald-500 to-emerald-600"
    if (percentage >= 60) return "bg-gradient-to-r from-amber-500 to-amber-600"
    if (percentage >= 40) return "bg-gradient-to-r from-orange-500 to-orange-600"
    return "bg-gradient-to-r from-red-500 to-red-600"
  }

  const sizeClasses = {
    sm: "w-16 h-1",
    md: "w-24 h-1.5",
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[#666666]">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="text-xs">Загрузка...</span>
      </div>
    )
  }

  return (
    <div className="text-right">
      <div className="text-sm font-semibold text-black mb-1">{progress}%</div>
      <div className={`bg-[#E0E0E0] rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full ${getProgressColor(progress)} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
})
ProgressIndicator.displayName = "ProgressIndicator"

// Компонент действий с тестом
const TestActions: React.FC<{
  testId: string
  hasProgress: boolean
  onStartTest: (testId: string) => void
  onViewHistory: (testId: string) => void
}> = React.memo(({ testId, hasProgress, onStartTest, onViewHistory }) => (
  <div className="flex items-center gap-2 flex-shrink-0">
    <button
      onClick={(e) => {
        e.stopPropagation()
        onStartTest(testId)
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8102E] hover:bg-[#B00020] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
    >
      <Play className="w-3.5 h-3.5" />
      Пройти
    </button>

    {hasProgress && (
      <button
        onClick={(e) => {
          e.stopPropagation()
          onViewHistory(testId)
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#666666] text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
  difficulty: string
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
      default:
        return "другое"
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm text-[#666666]">
      <span className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" />
        {questionCount} вопросов
      </span>
      <span className="px-2 py-1 bg-gray-100 text-[#666666] rounded-md text-xs font-medium">
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

// Компонент отображения счета
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

// Компонент элемента теста
const TestItem: React.FC<{
  test: ModuleTest
  progress?: TestProgressInfo
  isLastItem: boolean
  isSummaryOpen: boolean
  onToggleSummary: (testId: string) => void
  onStartTest: (testId: string) => void
  onViewHistory: (testId: string) => void
}> = React.memo(({ test, progress, isLastItem, isSummaryOpen, onToggleSummary, onStartTest, onViewHistory }) => {
  const hasProgress = Boolean(progress)

  return (
    <div className="group/test">
      <div className="flex items-start justify-between gap-4 py-4 hover:bg-gray-50/50 rounded-lg px-4 -mx-4 transition-all duration-200">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Заголовок и бейдж достижения */}
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-black leading-tight group-hover/test:text-[#C8102E] transition-colors">
              {test.title}
            </h4>
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
          {hasProgress && progress && (
            <div className="mt-2">
              <ScoreDisplay score={progress.percentage} />
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
        <div className="ml-4 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSummary(test._id)
            }}
            className="flex items-center gap-2 text-sm text-[#C8102E] hover:text-[#B00020] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2 rounded-md px-2 py-1"
            aria-expanded={isSummaryOpen}
          >
            <FileText className="w-3.5 h-3.5" />
            {isSummaryOpen ? "Скрыть конспект" : "Показать конспект"}
            {isSummaryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {isSummaryOpen && (
            <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-sm text-[#666666] leading-relaxed whitespace-pre-line border border-[#E0E0E0] animate-in slide-in-from-top-2 duration-200">
              {test.summary}
            </div>
          )}
        </div>
      )}

      {/* Разделитель */}
      {!isLastItem && <div className="border-b border-[#E0E0E0] mt-4" />}
    </div>
  )
})
TestItem.displayName = "TestItem"

// Компонент состояния загрузки тестов
const TestsLoadingState: React.FC = () => (
  <div className="flex items-center gap-3 text-[#666666] py-6">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span className="text-sm font-medium">Загрузка тестов...</span>
  </div>
)

// Компонент пустого состояния тестов
const TestsEmptyState: React.FC = () => (
  <div className="text-center py-12 text-[#666666]">
    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
    <p className="text-sm font-medium">Нет тестов в этом модуле</p>
    <p className="text-xs text-[#666666] mt-1">Тесты появятся после добавления</p>
  </div>
)

// Компонент карточки модуля
const ModuleCard: React.FC<{
  module: any
  isExpanded: boolean
  progress: number
  isProgressLoading: boolean
  tests: ModuleTest[]
  testsLoading: boolean
  testProgressMap: TestProgressMap
  openSummaries: SummaryState
  testCount: number
  testCountLoading: boolean
  onModuleClick: (moduleId: string) => void
  onToggleSummary: (testId: string) => void
  onStartTest: (testId: string) => void
  onViewHistory: (testId: string) => void
}> = React.memo(
  ({
    module,
    isExpanded,
    progress,
    isProgressLoading,
    tests,
    testsLoading,
    testProgressMap,
    openSummaries,
    testCount,
    testCountLoading,
    onModuleClick,
    onToggleSummary,
    onStartTest,
    onViewHistory,
  }) => {
    const formatDate = useMemo(() => new Date(module.createdAt).toLocaleDateString("ru-RU"), [module.createdAt])

    return (
      <div className="group border border-[#E0E0E0] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Заголовок модуля */}
        <div
          className="flex items-center justify-between py-5 px-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onModuleClick(module._id)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onModuleClick(module._id)
            }
          }}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Иконка раскрытия */}
            <div className="flex-shrink-0 transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-[#666666]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#666666] group-hover:text-black" />
              )}
            </div>

            {/* Информация о модуле */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black truncate text-lg group-hover:text-[#C8102E] transition-colors">
                {decodeURIComponent(module.originalFileName)}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#666666]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  {testCountLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>загрузка...</span>
                    </>
                  ) : (
                    `${testCount} тестов`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Индикатор прогресса */}
          <div className="flex-shrink-0">
            <ProgressIndicator progress={progress} isLoading={isProgressLoading} />
          </div>
        </div>

        {/* Содержимое модуля */}
        {isExpanded && (
          <div className="border-t border-[#E0E0E0] bg-gray-50/30">
            <div className="px-6 py-4">
              {testsLoading ? (
                <TestsLoadingState />
              ) : tests.length === 0 ? (
                <TestsEmptyState />
              ) : (
                <div className="space-y-2">
                  {tests.map((test, index) => (
                    <TestItem
                      key={test._id}
                      test={test}
                      progress={testProgressMap[test._id]}
                      isLastItem={index === tests.length - 1}
                      isSummaryOpen={openSummaries[test._id] || false}
                      onToggleSummary={onToggleSummary}
                      onStartTest={onStartTest}
                      onViewHistory={onViewHistory}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  },
)
ModuleCard.displayName = "ModuleCard"

// Компонент скелетона загрузки
const ModuleSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded w-64 animate-pulse" />
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-[#E0E0E0] rounded-xl p-6 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="w-24 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-1.5 bg-gray-200 rounded w-full" />
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
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <FileText className="w-8 h-8 text-[#666666]" />
    </div>
    <h3 className="text-xl font-semibold text-black mb-3">Нет модулей</h3>
    <p className="text-[#666666] max-w-sm mx-auto">
      Модули появятся здесь после загрузки. Создайте свой первый модуль, чтобы начать организацию тестов.
    </p>
  </div>
)

// Компонент ошибки
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-black mb-3">Ошибка загрузки</h3>
    <p className="text-[#666666] max-w-sm mx-auto mb-6">Не удалось загрузить модули. Попробуйте еще раз.</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#C8102E] hover:bg-[#B00020] text-white rounded-lg transition-colors"
    >
      Попробовать снова
    </button>
  </div>
)

// Основной компонент
const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const router = useRouter()
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [tests, setTests] = useState<ModuleTest[]>([])
  const [testsLoading, setTestsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progressMap, setProgressMap] = useState<ModuleProgress>({})
  const [progressLoading, setProgressLoading] = useState<LoadingState>({})
  const [testProgressMap, setTestProgressMap] = useState<TestProgressMap>({})
  const [openSummaries, setOpenSummaries] = useState<SummaryState>({})
  const [testCounts, setTestCounts] = useState<ModuleTestCount>({})
  const [testCountsLoading, setTestCountsLoading] = useState<LoadingState>({})

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

  // Загрузка количества тестов для всех модулей
  const loadTestCounts = useCallback(async () => {
    if (!modules.length) return

    const loadingMap: LoadingState = {}
    modules.forEach((mod) => (loadingMap[mod._id] = true))
    setTestCountsLoading(loadingMap)

    try {
      const countResults = await Promise.all(
        modules.map(async (mod) => {
          try {
            const response = await fetchTestsByModule(mod._id)
            const testsArray = Array.isArray(response) ? response : []
            return { id: mod._id, count: testsArray.length }
          } catch (e) {
            return { id: mod._id, count: 0 }
          }
        }),
      )

      const countMap: ModuleTestCount = {}
      countResults.forEach(({ id, count }) => {
        countMap[id] = count
      })
      setTestCounts(countMap)
    } catch (err) {
      console.error("Ошибка загрузки количества тестов:", err)
    } finally {
      const doneMap: LoadingState = {}
      modules.forEach((mod) => (doneMap[mod._id] = false))
      setTestCountsLoading(doneMap)
    }
  }, [modules])

  // Обработчик клика по модулю
  const handleModuleClick = useCallback(
    async (moduleId: string) => {
      if (selectedModuleId === moduleId) {
        setSelectedModuleId(null)
        setTests([])
        return
      }

      setSelectedModuleId(moduleId)
      setTestsLoading(true)
      setError(null)

      try {
        const response = await fetchTestsByModule(moduleId)
        const fetchedTests = Array.isArray(response) ? response : []
        setTests(fetchedTests)

        // Загрузка прогресса тестов
        const testProgresses: TestProgressMap = {}
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
              // Игнорируем ошибки для отдельных тестов
            }
          }),
        )
        setTestProgressMap(testProgresses)
      } catch (err) {
        console.error("Ошибка загрузки тестов:", err)
        setError("Не удалось загрузить тесты модуля")
        setTests([])
      } finally {
        setTestsLoading(false)
      }
    },
    [selectedModuleId],
  )

  // Загрузка прогресса модулей
  const loadModuleProgress = useCallback(async () => {
    if (!modules.length) return

    const loadingMap: LoadingState = {}
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

      const map: ModuleProgress = {}
      progressResults.forEach(({ id, progress }) => {
        map[id] = progress
      })
      setProgressMap(map)
    } catch (err) {
      console.error("Ошибка загрузки прогресса модулей:", err)
    } finally {
      const doneMap: LoadingState = {}
      modules.forEach((mod) => (doneMap[mod._id] = false))
      setProgressLoading(doneMap)
    }
  }, [modules])

  useEffect(() => {
    loadModuleProgress()
    loadTestCounts()
  }, [loadModuleProgress, loadTestCounts])

  // Мемоизированная сортировка модулей
  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => {
      const aProgress = progressMap[a._id] || 0
      const bProgress = progressMap[b._id] || 0

      // Сначала модули с прогрессом, потом по дате создания
      if (aProgress > 0 && bProgress === 0) return -1
      if (aProgress === 0 && bProgress > 0) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [modules, progressMap])

  if (error && !modules.length) {
    return (
      <ErrorState
        onRetry={() => {
          loadModuleProgress()
          loadTestCounts()
        }}
      />
    )
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h2 className="text-3xl font-bold text-black mb-3">Модули</h2>
        <p className="text-[#666666] text-lg">Коллекции тестов, организованные по темам и материалам</p>
      </div>

      {/* Список модулей */}
      <div className="space-y-4">
        {sortedModules.map((module) => (
          <ModuleCard
            key={module._id}
            module={module}
            isExpanded={selectedModuleId === module._id}
            progress={progressMap[module._id] || 0}
            isProgressLoading={progressLoading[module._id] || false}
            tests={selectedModuleId === module._id ? tests : []}
            testsLoading={testsLoading}
            testProgressMap={testProgressMap}
            openSummaries={openSummaries}
            testCount={testCounts[module._id] || 0}
            testCountLoading={testCountsLoading[module._id] || false}
            onModuleClick={handleModuleClick}
            onToggleSummary={handleToggleSummary}
            onStartTest={handleStartTest}
            onViewHistory={handleViewHistory}
          />
        ))}
      </div>
    </div>
  )
}

export default ModuleList
