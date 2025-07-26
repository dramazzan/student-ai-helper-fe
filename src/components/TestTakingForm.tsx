"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Clock, Send, Loader2, AlertCircle, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { useTest } from "@/hooks/useTest"
import { submitTestAnswers } from "@/services/testService/passingService"
import { NotificationToast } from "@/components/NotificationToast" // Import your NotificationToast
import type { Notification } from "@/models/Notification" // Import the Notification type

const TestTakingForm = () => {
  const { testId } = useParams() as { testId: string }
  const { test, loading, error } = useTest(testId)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [submitting, setSubmitting] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [startTime] = useState(Date.now())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [notification, setNotification] = useState<Notification | null>(null) // State for notification

  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const handleAnswerChange = (questionId: string, selected: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }))
  }

  const handleCloseNotification = (id: string) => {
    setNotification(null) // Clear the notification
  }

  const handleSubmit = async () => {
    if (!test) return
    const isAllAnswered = test.questions.every((q: { _id: string | number }) => answers[q._id] !== undefined)
    if (!isAllAnswered) {
      setNotification({
        id: Date.now().toString(),
        title: "Внимание!",
        message: "Пожалуйста, ответьте на все вопросы.",
        type: "info", // Using 'info' for a warning
      })
      return
    }

    const payload = {
      testId: test._id,
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })),
    }

    try {
      setSubmitting(true)
      const response = await submitTestAnswers(payload)
      setNotification({
        id: Date.now().toString(),
        title: "Успех!",
        message: "Тест успешно сдан!",
        type: "success",
      })
      router.push(`/main/tests/passed/${response.resultId || ""}`)
    } catch (error) {
      console.error("Ошибка при отправке теста:", error)
      setNotification({
        id: Date.now().toString(),
        title: "Ошибка!",
        message: "Произошла ошибка при отправке теста.",
        type: "error",
      })
    } finally {
      setSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    if (!test?.questions) return 0
    const answeredCount = test.questions.filter((q: any) => answers[q._id] !== undefined).length
    return (answeredCount / test.questions.length) * 100
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  const nextQuestion = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8">
          <div className="flex items-center justify-center gap-3 text-[#C8102E]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Загрузка теста...</span>
          </div>
          <div className="mt-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !test) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Ошибка загрузки теста</h3>
          <p className="text-red-700">Не удалось загрузить тест. Попробуйте обновить страницу.</p>
        </div>
      </div>
    )
  }

  const currentQ = test.questions[currentQuestion]
  const answeredCount = test.questions.filter((q: any) => answers[q._id] !== undefined).length
  const isCurrentAnswered = answers[currentQ._id] !== undefined

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[#E0E0E0]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#C8102E] to-[#B00020] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-black">{test.title}</h1>
                <p className="text-sm text-[#666666]">
                  Вопрос {currentQuestion + 1} из {test.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#666666]">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-[#666666] mb-2">
              <span>Прогресс выполнения</span>
              <span>
                {answeredCount}/{test.questions.length} отвечено
              </span>
            </div>
            <div className="w-full bg-[#E0E0E0] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#C8102E] to-[#B00020] h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
        {/* Question Navigation */}
        <div className="p-4 bg-gray-50 border-b border-[#E0E0E0]">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {test.questions.map((q: any, index: number) => (
              <button
                key={q._id}
                onClick={() => goToQuestion(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === currentQuestion
                    ? "bg-[#C8102E] text-white shadow-md"
                    : answers[q._id] !== undefined
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-white text-[#666666] border border-[#E0E0E0] hover:border-[#666666]"
                }`}
              >
                {answers[q._id] !== undefined && index !== currentQuestion && (
                  <CheckCircle className="w-4 h-4 mx-auto" />
                )}
                {(answers[q._id] === undefined || index === currentQuestion) && index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Current Question */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 text-[#C8102E] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {currentQuestion + 1}
            </div>
            <h2 className="text-lg font-semibold text-black leading-relaxed">{currentQ.question}</h2>
          </div>
        </div>
        <div className="space-y-3">
          {currentQ.options.map((opt: string, idx: number) => (
            <label
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                answers[currentQ._id] === idx
                  ? "border-red-300 bg-red-50"
                  : "border-[#E0E0E0] hover:border-[#666666] hover:bg-gray-50"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="radio"
                  name={currentQ._id}
                  value={idx}
                  checked={answers[currentQ._id] === idx}
                  onChange={() => handleAnswerChange(currentQ._id, idx)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    answers[currentQ._id] === idx
                      ? "border-[#C8102E] bg-[#C8102E]"
                      : "border-[#E0E0E0] bg-white hover:border-[#666666]"
                  }`}
                >
                  {answers[currentQ._id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
              <span className="text-[#666666] leading-relaxed">{opt}</span>
            </label>
          ))}
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E0E0E0]">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[#666666] hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Предыдущий
          </button>
          <div className="flex gap-3">
            {currentQuestion === test.questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={answeredCount !== test.questions.length}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Завершить тест
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8102E] hover:bg-[#B00020] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
              >
                Следующий
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Завершить тест?</h3>
              <p className="text-[#666666] mb-6">
                Вы ответили на {answeredCount} из {test.questions.length} вопросов. После отправки изменить ответы будет
                невозможно.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2.5 text-[#666666] hover:text-black border border-[#E0E0E0] rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Отправить
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {notification && <NotificationToast notification={notification} onClose={handleCloseNotification} />}
    </div>
  )
}

export default TestTakingForm
