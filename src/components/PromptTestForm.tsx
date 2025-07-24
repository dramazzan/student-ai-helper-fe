"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateTest } from "@/services/testService/generationService"
import { NotificationToast } from "./NotificationToast"
import type { Notification } from "@/models/Notification"
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, MessageSquareText, FileText, Sparkles } from "lucide-react"

const PromptTestForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [userPrompt, setUserPrompt] = useState("")
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setErrorMessage("")
    }
  }

  const handleSubmit = async () => {
    if (!file && !userPrompt.trim()) {
      setErrorMessage("Введите промпт или загрузите файл!")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)
      if (userPrompt.trim()) formData.append("userPrompt", userPrompt.trim())
      formData.append("difficulty", "medium")
      formData.append("questionCount", "5")
      formData.append("questionType", "normal")

      const result = await generateTest(file!, {
        difficulty: "medium",
        questionCount: 5,
        userPrompt,
      })

      console.log("✅ Тест создан:", result)

      addNotification({
        type: "success",
        title: "Тест успешно создан!",
        message:
          file && userPrompt
            ? "Сгенерирован тест из файла и промпта."
            : file
              ? "Сгенерирован тест из файла."
              : "Сгенерирован тест из промпта.",
      })

      setTimeout(() => {
        router.push("/main/tests")
      }, 1500)
    } catch (err: any) {
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
      {notifications.map((n) => (
        <NotificationToast key={n.id} notification={n} onClose={removeNotification} />
      ))}

      <div className="space-y-8">
        {/* Instructions */}
        <div className="text-center">
          <p className="text-[#666666] text-lg leading-relaxed">
            Вы можете ввести промпт, загрузить файл или использовать оба источника для создания персонализированного
            теста
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-black">
              <FileText className="w-4 h-4 text-[#C8102E]" />
              Файл (необязательно)
            </label>
            <div className="relative">
              <div className="border-2 border-dashed border-red-200 bg-gradient-to-br from-red-50/50 to-red-100/30 p-6 rounded-2xl transition-all duration-300 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100/50">
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                      <CheckCircle className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-black font-semibold">{file.name}</p>
                      <p className="text-sm text-[#666666]">Файл успешно загружен</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl mb-4">
                      <UploadCloud className="w-8 h-8 text-[#C8102E]" />
                    </div>
                    <p className="text-black font-medium mb-1">Нажмите или перетащите файл</p>
                    <p className="text-sm text-[#666666]">Поддерживаются PDF, DOCX, PPTX, TXT</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-black">
              <MessageSquareText className="w-4 h-4 text-[#C8102E]" />
              Промпт
            </label>
            <div className="relative">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-[#E0E0E0] focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] focus:outline-none transition-all duration-300 resize-none text-black placeholder-[#666666]"
                placeholder="Например: Создай тест с 10 вопросами на тему логарифмов, средней сложности, с объяснениями к ответам"
              />
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs text-[#666666]">
                  <Sparkles className="w-3 h-3" />
                  ИИ поможет
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-3 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 text-red-700 p-4 rounded-2xl">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-800">Ошибка</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !userPrompt.trim())}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#C8102E] to-[#B00020] hover:from-[#B00020] hover:to-[#C8102E] transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Генерация теста...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-200"></div>
                </div>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Создать тест</span>
              </>
            )}
          </button>

          {/* Helper Text */}
          <div className="text-center">
            <p className="text-sm text-[#666666]">Процесс генерации может занять до 30 секунд</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PromptTestForm
