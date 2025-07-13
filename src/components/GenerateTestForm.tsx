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
} from "lucide-react"

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
}
import { useRouter } from "next/navigation"

const GenerateTestForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [questionType, setQuestionType] = useState("тест с выбором")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"normal" | "multi">("normal")
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

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
        const result = await generateTest(file, { difficulty, questionCount, questionType })
        console.log("✅ Обычный тест создан:", result)
        
      } else {
        const result = await generateMultiTest(file, { difficulty, questionCount })
        console.log("✅ Мульти тесты созданы:", result)
      }
      alert("Тест(ы) успешно созданы!")
      router.push("/main/tests")
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err?.response?.data?.message || "Ошибка при генерации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <UploadCloud className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Генерация теста из файла</h1>
          <p className="text-slate-600">Загрузите документ и создайте тест на основе его содержимого</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Test Type Tabs */}
          <div className="p-6 border-b border-slate-100">
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
          </div>

          {/* File Upload Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-slate-600" />
              <label className="text-sm font-medium text-slate-900">Файл документа</label>
            </div>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : file
                    ? "border-green-300 bg-green-50"
                    : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
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
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-green-900">{file.name}</p>
                      <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-900 font-medium mb-1">Перетащите файл или нажмите для выбора</p>
                    <p className="text-sm text-slate-500">PDF, DOCX, PPTX, TXT</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-600" />
                  <label className="text-sm font-medium text-slate-900">Сложность</label>
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="easy">Лёгкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
              </div>

              {/* Question Count */}
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
                  className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Question Type (only for normal test) */}
            {activeTab === "normal" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-600" />
                  <label className="text-sm font-medium text-slate-900">Тип вопросов</label>
                </div>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="тест с выбором">Тест с выбором</option>
                  <option value="открытые">Открытые</option>
                  <option value="с одним выбором">С одним выбором</option>
                  <option value="с несколькими">С несколькими</option>
                </select>
              </div>
            )}

            {/* Settings Badge */}
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

          {/* Error Message */}
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

          {/* Submit Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-semibold rounded-2xl focus:outline-none focus:ring-4 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                activeTab === "normal"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200 disabled:bg-blue-300"
                  : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-200 disabled:bg-purple-300"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Генерация теста...</span>
                </>
              ) : (
                <>
                  {activeTab === "normal" ? <FileText className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  <span>Сгенерировать {activeTab === "normal" ? "тест" : "мульти тест"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {activeTab === "normal"
              ? "Создает один тест с заданными параметрами"
              : "Создает несколько тестов разной сложности"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GenerateTestForm
