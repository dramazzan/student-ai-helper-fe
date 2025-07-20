"use client"

import type React from "react"

import { useState } from "react"
import { generateTestFromUrl } from "@/services/testService/generationService"
import {
  Link,
  Loader2,
  AlertTriangle,
  Globe,
  Hash,
  Target,
  Type,
  Sparkles,
  Zap,
  ExternalLink,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationToast } from "./NotificationToast"
import type { Notification } from "@/models/Notification"

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
}

const GenerateTestFromUrlForm = () => {
  const [url, setUrl] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [questionType, setQuestionType] = useState("тест с выбором")
  const [testType, setTestType] = useState("normal")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [urlValid, setUrlValid] = useState(false)

  const router = useRouter()

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl)
      return inputUrl.startsWith("http://") || inputUrl.startsWith("https://")
    } catch {
      return false
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    setUrlValid(validateUrl(newUrl))
    if (errorMessage) setErrorMessage("")
  }

  const handleSubmit = async () => {
    if (!url) {
      setErrorMessage("Введите ссылку на сайт!")
      return
    }
    if (!urlValid) {
      setErrorMessage("Введите корректную ссылку (должна начинаться с http:// или https://)")
      return
    }
    if (questionCount < 5 || questionCount > 50) {
      setErrorMessage("Количество вопросов должно быть от 5 до 50")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const result = await generateTestFromUrl(url, {
        difficulty,
        questionCount,
        questionType,
        testType,
      })
      console.log("✅ Тест создан из URL:", result)
      console.log("📊 Параметры:", { difficulty, questionCount, questionType, testType })

      addNotification({
        type: "success",
        title: "Тест успешно создан!",
        message: `Тест на ${questionCount} вопросов создан на основе содержимого веб-страницы.`,
      })

      setTimeout(() => {
        router.push("/main/tests")
      }, 1500)
    } catch (err: any) {
      console.error(err)
      const errorMsg = err?.response?.data?.message || "Ошибка при генерации теста"
      setErrorMessage(errorMsg)
      addNotification({
        type: "error",
        title: "Ошибка генерации",
        message: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Уведомления */}
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onClose={removeNotification} />
      ))}

      <div className="w-full max-w-4xl mx-auto">
        {/* Main Form */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* URL Input Section */}
          <div className="p-8 border-b border-white/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Веб-страница</h3>
                <p className="text-slate-600">Введите ссылку на статью или образовательный материал</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Link className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={handleUrlChange}
                className={`w-full pl-12 pr-12 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-0 rounded-2xl text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-4 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                  url && urlValid
                    ? "focus:ring-emerald-200 ring-2 ring-emerald-300"
                    : url && !urlValid
                      ? "focus:ring-red-200 ring-2 ring-red-300"
                      : "focus:ring-blue-200"
                }`}
              />
              {url && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {urlValid ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {url && urlValid && (
              <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-xl border border-emerald-200">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Ссылка корректна и готова к обработке</span>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Difficulty Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-200 rounded-xl">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <label className="text-lg font-bold text-slate-900">Уровень сложности</label>
                    <p className="text-sm text-slate-600">Выберите подходящий уровень</p>
                  </div>
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-0 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-purple-200 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <option value="easy">🟢 Лёгкий уровень</option>
                  <option value="medium">🟡 Средний уровень</option>
                  <option value="hard">🔴 Сложный уровень</option>
                </select>
              </div>

              {/* Question Count */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-xl">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-lg font-bold text-slate-900">Количество вопросов</label>
                    <p className="text-sm text-slate-600">От 5 до 50 вопросов</p>
                  </div>
                </div>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    if (val >= 5 && val <= 50) setQuestionCount(val)
                  }}
                  min={5}
                  max={50}
                  className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-0 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-100 to-green-200 rounded-xl">
                  <Type className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <label className="text-lg font-bold text-slate-900">Тип вопросов</label>
                  <p className="text-sm text-slate-600">Выберите формат вопросов</p>
                </div>
              </div>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-0 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <option value="тест с выбором">📝 Тест с выбором ответа</option>
                <option value="открытые">✍️ Открытые вопросы</option>
                <option value="с одним выбором">☑️ С одним правильным ответом</option>
                <option value="с несколькими">☑️ С несколькими правильными ответами</option>
              </select>
            </div>

            {/* Summary Badge */}
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg bg-gradient-to-r ${
                  difficulty === "easy"
                    ? "from-emerald-100 to-green-200 text-emerald-800"
                    : difficulty === "medium"
                      ? "from-amber-100 to-orange-200 text-amber-800"
                      : "from-red-100 to-pink-200 text-red-800"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {difficultyLabels[difficulty]} • {questionCount} вопросов
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-8 mb-8">
              <div className="flex items-start gap-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 p-6 rounded-2xl border border-red-200 shadow-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Ошибка</p>
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="p-8 pt-0">
            <button
              onClick={handleSubmit}
              disabled={loading || !url || !urlValid}
              className="w-full flex items-center justify-center gap-4 px-8 py-6 text-white font-bold text-lg rounded-2xl focus:outline-none focus:ring-4 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 focus:ring-blue-200 disabled:from-blue-300 disabled:to-indigo-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Анализ страницы...</span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span>Сгенерировать тест из URL</span>
                  <Zap className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex-shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Поддерживаемые типы контента</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Статьи и блоги</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Образовательные материалы</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Документация</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Новостные материалы</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GenerateTestFromUrlForm
