"use client"

import { useState } from "react"
import GenerateTestForm from "@/components/GenerateTestForm"
import GenerateTestFromUrlForm from "@/components/GenerateTestFromUrlForm"
import { FileText, Globe, Sparkles } from "lucide-react"
import Link from "next/link"

const GeneratePage = () => {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text")

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Генерация с ИИ
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Создание тестов</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Выберите способ создания теста: из текста или веб-страницы</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium transition-all ${
                activeTab === "text"
                  ? "bg-green-50 text-green-700 border-b-2 border-green-500"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5" />
              Из текста
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium transition-all ${
                activeTab === "url"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Globe className="w-5 h-5" />
              Из URL
            </button>
          </div>

          <div className="p-8">
            {activeTab === "text" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Генерация из текста</h2>
                  <p className="text-slate-600">Вставьте текст и получите готовый тест с настраиваемыми параметрами</p>
                </div>
                <GenerateTestForm />
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Генерация из URL</h2>
                  <p className="text-slate-600">
                    Укажите ссылку на веб-страницу для создания теста на основе её содержимого
                  </p>
                </div>
                <GenerateTestFromUrlForm />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Советы для лучших результатов</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Используйте структурированные тексты с четкими фактами</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Выбирайте сложность в зависимости от аудитории</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Для коротких тестов используйте 5-15 вопросов</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Проверьте качество исходного материала</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">Готовы посмотреть созданные тесты?</p>
          <Link
            href="/main/tests"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Перейти к тестам
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GeneratePage
