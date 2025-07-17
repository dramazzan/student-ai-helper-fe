"use client"

import type React from "react"
import { useState } from "react"
import { Zap, Settings, Hash, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { generateTestsFromWeakTopics } from "@/services/testService/generationService"
import type {  TestGenerationOptions } from "@/models/Test"
import type { Notification } from "@/models/Notification"

interface TestGenerationFormProps {
  weakTopicsCount: number
  onNotification: (notification: Omit<Notification, "id">) => void
}

export const TestGenerationForm: React.FC<TestGenerationFormProps> = ({ weakTopicsCount, onNotification }) => {
  const [options, setOptions] = useState<TestGenerationOptions>({
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
