"use client"

import { useState } from "react"
import { generateTestFromUrl } from "@/services/testService/generationService"
import { Link, FileText, Loader2, AlertTriangle, Globe, Hash, Target, Type } from "lucide-react"
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

  const router = useRouter()

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleSubmit = async () => {
    if (!url) {
      setErrorMessage("Введите ссылку на сайт!")
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

      // Небольшая задержка перед переходом, чтобы пользователь увидел уведомление
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

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Генерация теста из URL</h1>
            <p className="text-slate-600">Создайте тест на основе содержимого веб-страницы</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Link className="w-5 h-5 text-green-600" />
                <label className="text-sm font-medium text-slate-900">Ссылка на веб-страницу</label>
              </div>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-600" />
                    <label className="text-sm font-medium text-slate-900">Сложность</label>
                  </div>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  >
                    <option value="easy">Лёгкий</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Сложный</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-600" />
                    <label className="text-sm font-medium text-slate-900">Вопросов</label>
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
                    className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-600" />
                  <label className="text-sm font-medium text-slate-900">Тип вопросов</label>
                </div>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                >
                  <option value="тест с выбором">Тест с выбором</option>
                  <option value="открытые">Открытые</option>
                  <option value="с одним выбором">С одним выбором</option>
                  <option value="с несколькими">С несколькими</option>
                </select>
              </div>

              <div className="flex justify-center">
                <div
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    difficulty === "easy"
                      ? "text-green-700 bg-green-100"
                      : difficulty === "medium"
                        ? "text-amber-700 bg-amber-100"
                        : "text-red-700 bg-red-100"
                  }`}
                >
                  {difficultyLabels[difficulty]} • {questionCount} вопросов
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mx-6 mb-6">
                <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Ошибка</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                disabled={loading || !url}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold rounded-2xl bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Генерация теста...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Сгенерировать тест</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">Поддерживаются статьи, блоги и образовательные материалы</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default GenerateTestFromUrlForm
