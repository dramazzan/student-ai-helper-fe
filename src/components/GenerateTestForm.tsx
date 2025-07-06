"use client"

import type React from "react"
import { useState } from "react"
import {
  generateTest,
  generateMultiTest
} from "@/services/testService"
import {
  UploadCloud,
  FileText,
  Layers,
  Upload,
  Settings,
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный"
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
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile)
      } else {
        setErrorMessage("Пожалуйста, выберите файл PDF или DOCX")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
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
        const result = await generateTest(file, { difficulty, questionCount, questionType })
        console.log("✅ Обычный тест создан:", result)
      } else {
        const result = await generateMultiTest(file, { difficulty, questionCount })
        console.log("✅ Мульти тесты созданы:", result)
      }
      alert("Тест(ы) успешно созданы!")
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.response?.data?.message || "Ошибка при генерации")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-emerald-700 bg-emerald-100 border-emerald-200"
      case "medium":
        return "text-amber-700 bg-amber-100 border-amber-200"
      case "hard":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-slate-700 bg-slate-100 border-slate-200"
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Генерация теста из файла</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 mt-1 text-red-500" />
              <div>
                <p className="font-medium">Ошибка:</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="flex bg-slate-50 rounded-xl p-1">
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "normal" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("normal")}
            >
              <FileText className="w-4 h-4" />
              Обычный тест
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "multi" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("multi")}
            >
              <Layers className="w-4 h-4" />
              Мульти тест
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Файл документа</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : file
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900">{file.name}</p>
                      <p className="text-sm text-emerald-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-900 font-medium mb-1">Перетащите файл сюда или нажмите для выбора</p>
                    <p className="text-sm text-slate-500">Поддерживаются форматы PDF и DOCX</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Настройки теста</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Сложность</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="easy">Лёгкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(difficulty)}`}
                >
                  Выбрано: {difficultyLabels[difficulty]}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Количество вопросов</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    if (val >= 5 && val <= 50) setQuestionCount(val)
                    else if (val < 5) setQuestionCount(5)
                    else if (val > 50) setQuestionCount(50)
                  }}
                  min={5}
                  max={50}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-slate-500">От 5 до 50 вопросов</p>
              </div>
            </div>

            {activeTab === "normal" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Тип вопроса</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="тест с выбором">Тест с выбором</option>
                  <option value="открытые">Открытые</option>
                  <option value="с одним выбором">С одним выбором</option>
                  <option value="с несколькими">С несколькими</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              activeTab === "normal"
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400"
                : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 disabled:bg-purple-400"
            } disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Генерация...</span>
              </>
            ) : (
              <>
                {activeTab === "normal" ? <FileText className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                <span>Сгенерировать {activeTab === "normal" ? "тест" : "мульти тест"}</span>
              </>
            )}
          </button>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">Информация о генерации:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Обычный тест создает один тест с заданными параметрами</li>
                  <li>• Мульти тест создает несколько тестов разной сложности</li>
                  <li>• Поддерживаются файлы PDF и DOCX размером до 10 МБ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateTestForm
