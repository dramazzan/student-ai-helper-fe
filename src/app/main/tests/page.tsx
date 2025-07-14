"use client"
import { useEffect, useState } from "react"
import { fetchNormalTests, fetchTestModule } from "@/services/testService/fetchService"
import ModuleList from "@/components/ModuleList"
import NormalTestList from "@/components/NormalTestList"
import { BookOpen, Layers, Search, Filter, FileText, TrendingUp, Target, BarChart3 } from "lucide-react"

interface Test {
  _id: string
  title: string
  questionCount: number
  difficulty: string
  createdAt: string
}

interface Module {
  _id: string
  originalFileName: string
  createdAt: string
}

const TestPage = () => {
  const [normalTests, setNormalTests] = useState<Test[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"normal" | "multi">("normal")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [normal, fetchedModules] = await Promise.all([fetchNormalTests(), fetchTestModule()])
        setNormalTests(normal)
        setModules(fetchedModules)
      } catch (err) {
        console.error("Ошибка загрузки данных:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Фильтрация тестов
  const filteredNormalTests = normalTests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || test.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  // Статистика
  const getStats = () => {
    const totalNormal = normalTests.length
    const totalModules = modules.length
    const totalQuestions = normalTests.reduce((sum, test) => sum + test.questionCount, 0)
    const avgQuestions = totalNormal > 0 ? Math.round(totalQuestions / totalNormal) : 0

    return {
      totalNormal,
      totalModules,
      totalQuestions,
      avgQuestions,
    }
  }

  const stats = getStats()
  const difficulties = ["all", "easy", "medium", "hard"]

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 rounded w-32 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-16 mb-2" />
                <div className="h-6 bg-slate-200 rounded w-8" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex gap-4 mb-6">
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse" />
            <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Мои тесты</h1>
              <p className="text-slate-600">Управляйте тестами и отслеживайте прогресс</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Обычные</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.totalNormal}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Мульти</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.totalModules}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Вопросов</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.totalQuestions}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Среднее</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{stats.avgQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "normal"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("normal")}
            >
              <BookOpen className="w-4 h-4" />
              <span>Обычные тесты</span>
              <span className="ml-1 px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full">
                {stats.totalNormal}
              </span>
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "multi"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("multi")}
            >
              <Layers className="w-4 h-4" />
              <span>Мульти-тесты</span>
              <span className="ml-1 px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full">
                {stats.totalModules}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "normal" && (
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск тестов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-500 bg-white"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white min-w-[140px]"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "all" ? "Все уровни" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {activeTab === "normal" ? (
            filteredNormalTests.length > 0 ? (
              <NormalTestList normalTests={filteredNormalTests} />
            ) : searchQuery || selectedDifficulty !== "all" ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ничего не найдено</h3>
                <p className="text-slate-600 mb-4">Попробуйте изменить параметры поиска</p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDifficulty("all")
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Нет обычных тестов</h3>
                <p className="text-slate-600">Создайте свой первый тест для начала работы</p>
              </div>
            )
          ) : modules.length > 0 ? (
            <ModuleList modules={modules} />
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Нет мульти-тестов</h3>
              <p className="text-slate-600">Загрузите документы для создания мульти-тестов</p>
            </div>
          )}
        </div>
      </div>

      {(normalTests.length > 0 || modules.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-3">💡 Советы по использованию</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
            <div>• Регулярно проходите тесты для закрепления знаний</div>
            <div>• Анализируйте результаты в разделе "История"</div>
            <div>• Создавайте тесты разной сложности</div>
            <div>• Используйте мульти-тесты для комплексной подготовки</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage
