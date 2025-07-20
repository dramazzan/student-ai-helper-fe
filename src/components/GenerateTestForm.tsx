"use client"

import type React from "react"
import { useState } from "react"
import { generateTest, generateMultiTest } from "@/services/testService/generationService"
import {
  UploadCloud,
  FileText,
  Layers,
  Upload,
  Target,
  Hash,
  Type,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationToast } from "./NotificationToast"
import type { Notification } from "@/models/Notification"

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
}

const difficultyColors: Record<string, string> = {
  easy: "from-emerald-500 to-green-600",
  medium: "from-amber-500 to-orange-600",
  hard: "from-red-500 to-pink-600",
}

const GenerateTestForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [questionType, setQuestionType] = useState("тест с выбором")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"normal" | "multi">("normal")
  const [dragActive, setDragActive] = useState(false)
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.name.endsWith(".docx") ||
        droppedFile.name.endsWith(".pptx") ||
        droppedFile.type === "text/plain" ||
        droppedFile.name.endsWith(".txt")
      ) {
        setFile(droppedFile)
        setErrorMessage("")
      } else {
        setErrorMessage("Пожалуйста, выберите файл PDF, DOCX, PPTX или TXT")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0]
      if (
        selected.type === "application/pdf" ||
        selected.name.endsWith(".docx") ||
        selected.name.endsWith(".pptx") ||
        selected.type === "text/plain" ||
        selected.name.endsWith(".txt")
      ) {
        setFile(selected)
        setErrorMessage("")
      } else {
        setErrorMessage("Пожалуйста, выберите файл PDF, DOCX, PPTX или TXT")
      }
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage("Выберите файл!")
      return
    }
    if (questionCount < 5 || questionCount > 50) {
      setErrorMessage("Количество вопросов должно быть от 5 до 50")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      if (activeTab === "normal") {
        const result = await generateTest(file, { difficulty, questionCount })
        console.log("✅ Обычный тест создан:", result)
        addNotification({
          type: "success",
          title: "Тест успешно создан!",
          message: `Обычный тест на ${questionCount} вопросов создан и готов к прохождению.`,
        })
      } else {
        const result = await generateMultiTest(file, { difficulty, questionCount })
        console.log("✅ Мульти тесты созданы:", result)
        addNotification({
          type: "success",
          title: "Мульти тесты созданы!",
          message: `Созданы тесты разной сложности на основе загруженного документа.`,
        })
      }

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
        {/* Enhanced Tab Navigation */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 overflow-hidden mb-8">
          <div className="flex border-b border-white/30 bg-gradient-to-r from-slate-50/80 to-slate-100/50">
            <button
              className={`flex-1 flex items-center justify-center gap-4 px-8 py-6 font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
                activeTab === "normal"
                  ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
              onClick={() => setActiveTab("normal")}
            >
              {activeTab === "normal" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 animate-pulse" />
              )}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  activeTab === "normal"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <span className="relative z-10">Обычный тест</span>
              {activeTab === "normal" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
              )}
            </button>

            <button
              className={`flex-1 flex items-center justify-center gap-4 px-8 py-6 font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
                activeTab === "multi"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
              onClick={() => setActiveTab("multi")}
            >
              {activeTab === "multi" && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
              )}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  activeTab === "multi"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                    : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <span className="relative z-10">Мульти тест</span>
              {activeTab === "multi" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
              )}
            </button>
          </div>

          {/* Enhanced Description */}
          <div className="p-6 bg-gradient-to-r from-slate-50/50 to-white/50">
            <p className="text-center text-slate-600 text-lg">
              {activeTab === "normal"
                ? "Создает один персонализированный тест с заданными параметрами"
                : "Создает несколько тестов разной сложности для комплексной проверки знаний"}
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* File Upload Section */}
          <div className="p-8 border-b border-white/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Загрузка документа</h3>
                <p className="text-slate-600">Выберите файл для создания теста</p>
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group ${
                dragActive
                  ? "border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-105"
                  : file
                    ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg"
                    : "border-slate-300 hover:border-slate-400 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:shadow-lg hover:scale-105"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-emerald-900 text-lg">{file.name}</p>
                      <p className="text-emerald-600 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl mx-auto mb-4 group-hover:from-blue-200 group-hover:to-indigo-300 transition-all duration-300">
                      <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-2">Перетащите файл или нажмите для выбора</p>
                    <p className="text-slate-500 font-medium">Поддерживаются форматы: PDF, DOCX, PPTX, TXT</p>
                  </div>
                )}
              </div>
            </div>
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

            {/* Question Type (only for normal test) */}
            {activeTab === "normal" && (
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
            )}

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
              disabled={loading || !file}
              className={`w-full flex items-center justify-center gap-4 px-8 py-6 text-white font-bold text-lg rounded-2xl focus:outline-none focus:ring-4 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl ${
                activeTab === "normal"
                  ? "bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 focus:ring-emerald-200 disabled:from-emerald-300 disabled:to-green-400"
                  : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 focus:ring-purple-200 disabled:from-purple-300 disabled:to-pink-400"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Генерация теста...</span>
                </>
              ) : (
                <>
                  {activeTab === "normal" ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-xl">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                  <span>Сгенерировать {activeTab === "normal" ? "тест" : "мульти тест"}</span>
                  <Zap className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GenerateTestForm
